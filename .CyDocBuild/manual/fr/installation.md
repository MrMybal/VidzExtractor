---
id: installation
title: Installer ou mettre à jour
description: Charger le ZIP Chrome ou le XPI Firefox non signé et actualiser les pages vidéo déjà ouvertes.
section: Pour commencer
parent: overview
order: 10
previous: overview
next: quickstart
sourceRevision: 1
---
Choisis l’édition correspondant à ton navigateur de bureau. Aucun logiciel compagnon ni bibliothèque tierce à l’exécution n’est nécessaire. Les téléchargements ci-dessous concernent Vidz Extracteur **1.2.0**.

## Chrome {#chrome}

```steps
{"items":[{"title":"Extraire le téléchargement","body":"[Télécharge le ZIP Chrome](https://github.com/MrMybal/VidzExtractor/releases/download/v1.2.0/VidzExtractor-Chrome-1.2.0.zip) et extrais-le dans un dossier que tu conserveras.","result":"Le dossier extrait contient manifest.json."},{"title":"Charger l’extension","body":"Ouvre `chrome://extensions` dans la barre d’adresse. Active **Mode développeur**, choisis **Charger l’extension non empaquetée**, puis sélectionne le dossier contenant manifest.json.","result":"La fiche Vidz Extracteur apparaît dans la liste des extensions.","troubleshooting":"Sélectionne le dossier extrait lui-même, et non le ZIP ou son dossier parent."},{"title":"Épingler et actualiser","body":"Épingle **Vidz Extracteur** depuis le menu des extensions de Chrome. Recharge toute page vidéo déjà ouverte pendant l’installation, puis lance la lecture.","result":"L’extension s’ouvre depuis la barre d’outils et peut examiner l’onglet vidéo."}]}
```

Pour mettre à jour une installation non empaquetée, remplace ses fichiers par ceux de la nouvelle édition extraite, clique sur l’icône de rechargement de sa fiche dans `chrome://extensions`, puis recharge la page vidéo. Garde le dossier d’installation en place pendant l’utilisation de l’extension.

## Firefox 140 ou version ultérieure {#firefox}

```steps
{"items":[{"title":"Obtenir l’édition Firefox","body":"[Télécharge le XPI Firefox](https://github.com/MrMybal/VidzExtractor/releases/download/v1.2.0/VidzExtractor-Firefox-1.2.0.xpi).","result":"Le XPI est enregistré localement."},{"title":"Le charger temporairement","body":"Ouvre `about:debugging#/runtime/this-firefox`. Choisis **Charger un module complémentaire temporaire…** et sélectionne le XPI.","result":"Vidz Extracteur apparaît parmi les extensions temporaires.","troubleshooting":"Si la fenêtre demande un manifeste, extrais le XPI comme un ZIP et sélectionne manifest.json dans le dossier extrait."},{"title":"Ouvrir un onglet vidéo","body":"Recharge une page vidéo existante, lance la lecture, puis ouvre Vidz Extracteur depuis le menu des extensions.","result":"Les vidéos détectées dans l’onglet courant apparaissent dans la fenêtre de l’extension."}]}
```

```callout
{"type":"note","title":"Installation temporaire","body":"Le XPI est non signé. Firefox retire un module temporaire au redémarrage ; charge-le à nouveau pour la session suivante. Une installation permanente sur Firefox Release nécessite une signature Mozilla."}
```

Pour actualiser l’édition temporaire, retire-la dans `about:debugging`, charge le nouveau XPI, puis recharge la page vidéo. Firefox suit ses préférences habituelles d’emplacement de téléchargement ; le HLS exige aussi du stockage temporaire dans le navigateur.

## Ouvrir le manuel {#help}

Dans les sources ou un paquet nouvellement généré contenant ce manuel, **Aide** ouvre la rubrique correspondante depuis la fenêtre de l’extension ou l’onglet d’export HLS. Tu peux aussi ouvrir directement **Documentation/Documentation.html** depuis le dossier extrait. Conserve tout le dossier **Documentation** pour garder les images, les schémas, la recherche et les deux langues hors ligne.

Les téléchargements 1.2.0 déjà publiés précèdent cette intégration du manuel. Dans ces paquets, utilise le README pour l’installation et ouvre le manuel depuis des sources actualisées ou l’export de documentation.
