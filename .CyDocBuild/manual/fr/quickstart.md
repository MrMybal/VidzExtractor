---
id: quickstart
title: Enregistrer sa première vidéo
description: Suivre la lecture, la détection et l’enregistrement, avec un résultat visible à chaque étape.
section: Pour commencer
parent: overview
order: 20
previous: installation
next: downloads
sourceRevision: 1
---
**Objectif :** enregistrer une vidéo détectée et retrouver le fichier terminé. Il te faut [l’extension installée](doc:installation) et une page HTTP ou HTTPS ordinaire proposant un fichier vidéo direct ou un [flux HLS compatible](doc:reference#formats).

## De la lecture au fichier {#first-video}

```steps
{"items":[{"title":"Lancer la lecture","body":"Ouvre la page vidéo et lance sa lecture. Garde cet onglet actif, puis ouvre Vidz Extracteur depuis la barre d’outils ou le menu des extensions.","result":"La fenêtre affiche les fiches vidéo de cet onglet.","troubleshooting":"Si la liste est vide, recharge la page, relance la vidéo et clique sur **Actualiser**. Consulte [aucune vidéo détectée](doc:troubleshooting#no-video)."},{"title":"Choisir la vidéo","body":"Lis l’aperçu, la durée et les informations disponibles. **Renommer** modifie le nom de fichier proposé ; confirme avec **OK**. Si une fiche HLS propose **Qualité**, sélectionne une option compatible.","result":"La fiche affiche le nom et, lorsqu’elle est proposée, la qualité souhaités.","troubleshooting":"L’absence d’aperçu ou une taille inconnue ne bloque pas à elle seule l’enregistrement. Consulte [la lecture d’une fiche](doc:downloads#read-card)."},{"title":"Démarrer l’enregistrement","body":"Clique sur **Télécharger**. Un fichier direct passe dans les téléchargements du navigateur. Pour le HLS, attends que l’onglet d’export soit prêt, clique sur **Enregistrer la vidéo** et garde cet onglet ouvert.","result":"Le navigateur lance un téléchargement direct, ou l’onglet HLS affiche la progression des segments.","troubleshooting":"Si l’enregistrement est bloqué ou échoue, retrouve le message dans le [dépannage](doc:troubleshooting#export-errors)."},{"title":"Confirmer la fin","body":"Pour un fichier direct, consulte la liste des téléchargements du navigateur. Pour le HLS, attends **Vidéo enregistrée sous…**, puis vérifie le fichier enregistré.","result":"Un fichier vidéo terminé est disponible à l’emplacement choisi ou dans le dossier de téléchargements du navigateur.","troubleshooting":"La barre de progression peut arriver au bout avant l’enregistrement final du navigateur. Attends le message de fin. Consulte [la lecture du fichier](doc:troubleshooting#playback) s’il ne s’ouvre pas."}]}
```

## Choisir la suite {#next-task}

Les [commandes de téléchargement](doc:downloads) expliquent les noms, les aperçus et les estimations. Le [tutoriel HLS](doc:hls-export) détaille le choix de qualité, le stockage, l’annulation et les formats de sortie.
