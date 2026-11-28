---
id: overview
title: Vidz Extracteur
description: Enregistrer une vidéo de l’onglet Chrome ou Firefox courant et choisir le bon parcours.
section: Pour commencer
order: 0
previous:
next: installation
sourceRevision: 1
---
Vidz Extracteur 1.2.0 est une extension Chrome et Firefox qui enregistre les vidéos détectées dans l’onglet courant. Elle prend en charge les fichiers vidéo directs et les vidéos HLS à la demande compatibles. Les boutons de l’extension sont en français ; les deux éditions de ce manuel conservent leurs libellés exacts.

## Partir de son objectif {#getting-started}

- **Première utilisation :** [installer l’extension](doc:installation), puis [enregistrer sa première vidéo](doc:quickstart).
- **Une fiche vidéo est visible :** [lire la fiche et télécharger un fichier](doc:downloads), ou [exporter une vidéo HLS](doc:hls-export).
- **Un élément manque ou une opération échoue :** [retrouver le symptôme](doc:troubleshooting).
- **Vérifier la compatibilité ou la confidentialité :** consulter les [formats, autorisations et limites](doc:reference).

## Comment se déroule l’enregistrement ? {#how-it-works}

Lance la lecture sur la page d’origine avant d’ouvrir l’extension. La détection utilise les requêtes vidéo et les lecteurs de l’onglet. Un fichier direct passe par le gestionnaire de téléchargements du navigateur. Un flux HLS ouvre un onglet d’export distinct qui assemble les segments d’origine.

```diagram
{"type":"flow","title":"Choisir un parcours d’enregistrement","description":"Après avoir lancé la lecture, ouvre l’extension. Un fichier direct se télécharge dans le navigateur. Un flux HLS demande une action supplémentaire dans son onglet d’export.","nodes":[{"id":"detect","label":"Lire la vidéo → ouvrir l’extension","x":20,"y":100},{"id":"direct","label":"Fichier direct : Télécharger","x":330,"y":20,"link":"doc:downloads#direct-file"},{"id":"hls","label":"HLS : choisir la Qualité","x":330,"y":180,"link":"doc:hls-export#choose-quality"},{"id":"save","label":"Export : Enregistrer la vidéo","x":640,"y":180,"link":"doc:hls-export#save"}],"edges":[{"from":"detect","to":"direct"},{"from":"detect","to":"hls"},{"from":"hls","to":"save"}]}
```

La liste des détections appartient à la session du navigateur. Une navigation complète ou la fermeture de l’onglet efface ses détections. L’extension n’envoie aucune télémétrie. La rubrique [autorisations et données](doc:reference#privacy) explique les accès utilisés.

## Quelles vidéos peut-on enregistrer ? {#supported-media}

Les fichiers directs comprennent MP4 et WebM. L’export HLS exige une vidéo à la demande non chiffrée, avec les pistes audio et vidéo regroupées et des segments entiers. Les flux en direct, le HLS chiffré, les pistes séparées et l’export DASH sortent du parcours pris en charge dans cette version. Une détection ne suffit pas à garantir l’enregistrement.

Le fichier conserve le format et les codecs de la source ; le renommer ne le convertit pas. Consulte le [tableau de compatibilité](doc:reference#formats) et les [notes de version](doc:release-notes).
