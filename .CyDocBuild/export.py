"""Archive the generated offline reader, without its private build workspace."""

import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
DOCUMENTATION = ROOT / "Documentation"
manifest = json.loads((DOCUMENTATION / "DocData/manifest.json").read_text(encoding="utf-8"))
report = json.loads((DOCUMENTATION / "DocData/translation-report.json").read_text(encoding="utf-8"))
if report["missing"] or report["outdated"]:
    raise ValueError("Build a complete bilingual manual before exporting")
for required in ("Documentation.html", "DocAI.md", "DocData/viewer.js", "DocData/viewer.css",
                 "DocData/THIRD-PARTY-NOTICES.txt", "DocData/APPLICATION-LICENSE.txt"):
    if not (DOCUMENTATION / required).is_file():
        raise FileNotFoundError(required)
destination = ROOT / "dist" / f"VidzExtractor-Documentation-{manifest['version']}.zip"
destination.parent.mkdir(exist_ok=True)
files = sorted(path for path in DOCUMENTATION.rglob("*") if path.is_file())
with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, path.relative_to(ROOT).as_posix())
with ZipFile(destination) as archive:
    if archive.testzip() is not None:
        raise ValueError("Corrupt documentation archive")
    for path in files:
        if archive.read(path.relative_to(ROOT).as_posix()) != path.read_bytes():
            raise ValueError(f"Archive mismatch: {path.name}")
print(f"Verified {len(files)} offline reader files: {destination}")
