# Documentation toolchain / Génération de la documentation

This workspace owns the source of the English and French manual. The application remains version 1.2.0; its reader uses **CyDoc 0.2.0**, built from upstream `main` at **9837f815cdaa67e3206f68e15d04f4700f040dbf**. `vendor/cydoc-origin.json` records the local package's origin and SHA-256. The original archive is retained because CyDoc is not published on npm.

Ce dossier contient les sources du manuel anglais et français. L’application reste en version 1.2.0 ; le lecteur utilise **CyDoc 0.2.0**, compilé depuis `main` au commit **9837f815cdaa67e3206f68e15d04f4700f040dbf**. L’origine et l’empreinte de l’archive locale sont consignées dans `vendor/cydoc-origin.json`.

With Node.js 22 or later, from this directory / Avec Node.js 22 ou ultérieur, depuis ce dossier :

```sh
npm ci
npm run build
npm run check
npm run export
npm run verify
```

`build` and `check` both write `../Documentation/`. Edit `manual/en/`, translate the change in `manual/fr/`, update matching revision metadata and rebuild. The wrapper preserves CyDoc's reader and classic-script bootstrap, adapts its HTML metadata and favicon, and supplies the separate AI sidecar and license notices. Never repair generated bundles or manifests by hand. Only image and graph modules are enabled; static diagrams need no module. The application screenshot and logo are reused unchanged.

`build` et `check` écrivent tous deux dans `../Documentation/`. Modifie `manual/en/`, traduis dans `manual/fr/`, actualise les révisions correspondantes et régénère. Le script conserve le lecteur CyDoc et son chargement par scripts classiques, adapte les métadonnées HTML et l’icône, puis ajoute les instructions IA séparées et les notices. Ne modifie pas directement les fichiers générés. Seuls les modules image et graphe sont activés ; les schémas statiques n’exigent pas de module. La capture et le logo existants sont repris sans modification.

`verify` uses headless Chromium via an installed Chrome/Edge executable (or `CYDOC_BROWSER`), opens the real export through `file://`, and checks navigation, search, both languages, media, keyboard and narrow/touch layouts with network requests blocked. It saves evidence under ignored `internal/`. It does not control the desktop or start a server. Install a Playwright Chromium build with `npx playwright install chromium` if no local browser is available.

`verify` utilise Chromium sans fenêtre via Chrome/Edge installé (ou `CYDOC_BROWSER`), ouvre le véritable export en `file://` et contrôle navigation, recherche, langues, médias, clavier et présentation étroite/tactile en bloquant le réseau. Les preuves restent dans `internal/`, ignoré par Git. Il ne prend pas le contrôle du bureau et ne lance pas de serveur. Sans navigateur local, installe Chromium pour Playwright avec `npx playwright install chromium`.

Distribute the complete `Documentation/` folder. `npm run export` archives and verifies it in `dist/VidzExtractor-Documentation-1.2.0.zip` (Python 3 required). `python scripts/package.py` from the repository root includes it in newly built extension packages; it does not alter old release downloads. `Documentation/DocAI.md` is separate from the human manual. Keep private working records outside the content roots.

Distribue tout le dossier `Documentation/`. `npm run export` l’archive et le vérifie dans `dist/VidzExtractor-Documentation-1.2.0.zip` (Python 3 nécessaire). `python scripts/package.py`, lancé à la racine du dépôt, l’inclut dans les nouveaux paquets ; les anciennes releases ne sont pas modifiées. `Documentation/DocAI.md` reste séparé du manuel humain. Les notes de travail restent hors des racines de contenu.

Upstream guides / Guides amont : [index](https://github.com/MrMybal/CyDoc/blob/9837f81/ai/README.md), [update](https://github.com/MrMybal/CyDoc/blob/9837f81/ai/UPDATE.md), [integration](https://github.com/MrMybal/CyDoc/blob/9837f81/ai/INTEGRATION.md), [authoring](https://github.com/MrMybal/CyDoc/blob/9837f81/ai/AUTHORING.md). They are also included under `node_modules/cydoc/ai/` after installation.
