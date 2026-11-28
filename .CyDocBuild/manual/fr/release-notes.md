---
id: release-notes
title: Notes de version
description: Changements de Vidz Extracteur 1.2.0 et 1.1.0, avec liens vers les releases et signalements.
section: Aide et référence
parent: reference
order: 70
previous: reference
next:
sourceRevision: 1
---
## Version 1.2.0 {#version-120}

- Ajout d’une édition Firefox aux côtés de l’extension Chrome.
- Enregistrement HLS dans Firefox par son gestionnaire de téléchargements après assemblage des segments d’origine dans le stockage temporaire du navigateur.
- Génération du ZIP Chrome et du XPI Firefox depuis les sources partagées.

[Notes de release et téléchargements](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.2.0)

## Version 1.1.0 {#version-110}

- Regroupement des listes HLS et de leurs variantes sur une seule fiche vidéo.
- Affichage de l’aperçu, de la durée, de la résolution et de la taille lorsqu’ils sont disponibles. Le symbole `≈` indique une estimation.
- Sélection d’une qualité HLS proposée et export de cette variante.
- Modification du nom de fichier proposé avant le téléchargement.

[Notes de release et téléchargement](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.1.0)

## Limites connues {#known-limitations}

Consulte les [médias pris en charge et les limites HLS](doc:reference#formats) avant l’export. Le XPI Firefox non signé s’installe temporairement et son export HLS exige du stockage temporaire. La disponibilité de l’aperçu, de la durée et de la taille dépend du lecteur et du serveur.

Pour un échec, consulte le [dépannage](doc:troubleshooting). Les notes du dépôt ne fournissent pas de liste distincte bogue par bogue ; consulte les [signalements actuels](https://github.com/MrMybal/VidzExtractor/issues).
