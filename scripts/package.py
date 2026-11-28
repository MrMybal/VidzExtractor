"""Build the Chrome ZIP and Firefox XPI from the shared extension source."""

import argparse
import json
from pathlib import Path
import re
from tempfile import NamedTemporaryFile
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parent.parent
FILES = (
    "api.js",
    "background.js",
    "export.html",
    "export.js",
    "hls.js",
    "media.js",
    "output.js",
    "players.js",
    "popup.html",
    "popup.js",
    "style.css",
    "icons/16.png",
    "icons/32.png",
    "icons/48.png",
    "icons/128.png",
    "LICENSE",
    "README.md",
    "README.fr.md",
    "VERSION.md",
    "VERSION.fr.md",
    "assets/screenshots/vidz-extracteur-hls.png",
)


def documentation_files():
    """Include the complete generated reader, never the private build workspace."""
    directory = ROOT / "Documentation"
    required = ("Documentation.html", "DocAI.md", "DocData/data.js", "DocData/viewer.js",
                "DocData/viewer.css", "DocData/manifest.json", "DocData/translation-report.json",
                "DocData/media-image.js", "DocData/media-graph.js",
                "DocData/THIRD-PARTY-NOTICES.txt", "DocData/APPLICATION-LICENSE.txt")
    for path in required:
        if not (directory / path).is_file():
            raise FileNotFoundError(f"Missing generated documentation: {path}. Build .CyDocBuild first.")
    return tuple(path.relative_to(ROOT).as_posix() for path in sorted(directory.rglob("*")) if path.is_file())


def write_entry(archive, path, contents):
    entry = ZipInfo(path)
    entry.create_system = 3
    entry.external_attr = 0o100644 << 16
    entry.compress_type = ZIP_DEFLATED
    archive.writestr(entry, contents)


def package(browser, base_manifest, version):
    manifest = base_manifest
    if browser == "firefox":
        overrides = json.loads((ROOT / "firefox/manifest.overrides.json").read_text(encoding="utf-8"))
        manifest = {**base_manifest, **overrides}
    suffix = "xpi" if browser == "firefox" else "zip"
    out = ROOT / "dist"
    out.mkdir(exist_ok=True)
    target = out / f"VidzExtractor-{browser.title()}-{version}.{suffix}"

    with NamedTemporaryFile(dir=out, prefix=".vidz-", delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with ZipFile(temporary_path, "w") as archive:
            write_entry(archive, "manifest.json", (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
            for path in (*FILES, *documentation_files()):
                write_entry(archive, path, (ROOT / path).read_bytes())
        temporary_path.replace(target)
    finally:
        temporary_path.unlink(missing_ok=True)
    print(target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("browser", choices=("all", "chrome", "firefox"), nargs="?", default="all")
    args = parser.parse_args()
    base_manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    version = base_manifest["version"]
    if not re.fullmatch(r"[0-9]+(?:\.[0-9]+){1,3}", version):
        raise ValueError("Invalid manifest version")
    browsers = ("chrome", "firefox") if args.browser == "all" else (args.browser,)
    for browser in browsers:
        package(browser, base_manifest, version)


if __name__ == "__main__":
    main()
