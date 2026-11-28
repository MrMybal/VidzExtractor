---
id: hls-export
title: Exporter une vidéo HLS
description: Choisir une qualité compatible, assembler les segments et attendre l’enregistrement final.
section: Utiliser Vidz Extracteur
parent: downloads
order: 40
previous: downloads
next: troubleshooting
sourceRevision: 1
---
**Objectif :** enregistrer une vidéo HLS à la demande complète. Vérifie d’abord que la vidéo se lit sur sa page d’origine, que le flux est [compatible](doc:reference#formats) et que tu disposes d’assez d’espace pour le fichier. Firefox assemble aussi la vidéo dans le stockage temporaire du navigateur avant de la télécharger.

## Choisir la qualité {#choose-quality}

Ouvre le sélecteur **Qualité** de la fiche HLS lorsqu’il est proposé. Choisis une variante compatible avant de cliquer sur **Télécharger**. Les pistes audio ou vidéo séparées peuvent apparaître comme options indisponibles. Si toutes les variantes exigent des pistes séparées, cette version ne peut pas exporter le flux.

Un débit annoncé plus élevé implique généralement davantage de données à télécharger ; la taille marquée `≈` reste une estimation. L’extension sélectionne une variante disponible lorsqu’aucun choix n’a été fait. L’ouverture de l’onglet d’export lui transmet la qualité choisie.

## Enregistrer et vérifier {#save}

```steps
{"items":[{"title":"Ouvrir l’onglet d’export","body":"Clique sur **Télécharger** dans la fiche HLS. Attends que le nouvel onglet **Export HLS** lise la liste de lecture.","result":"**Prêt à enregistrer…** apparaît avec le format de sortie et la qualité lorsqu’elle est connue.","troubleshooting":"Si **Rouvre le flux depuis le menu de Vidz Extracteur** apparaît, ferme cet onglet d’export et ouvre-en un nouveau depuis la fiche. Ses informations de lancement sont consommées à la première ouverture."},{"title":"Enregistrer les segments d’origine","body":"Clique sur **Enregistrer la vidéo**. Dans Chrome, choisis l’emplacement si le navigateur ouvre une fenêtre d’enregistrement. Garde l’onglet d’export ouvert pendant le téléchargement des segments.","result":"L’onglet affiche **Téléchargement des segments…** et le nombre de segments.","troubleshooting":"Pour une erreur d’accès, de délai ou de stockage, consulte les [erreurs d’export](doc:troubleshooting#export-errors)."},{"title":"Attendre l’enregistrement final","body":"Dans Firefox, attends aussi la phase **Enregistrement de la vidéo par le navigateur…** après l’assemblage. Dans les deux éditions, attends **Vidéo enregistrée sous…** avant de fermer l’onglet.","result":"Le fichier terminé est enregistré. Firefox suit tes préférences d’emplacement de téléchargement.","troubleshooting":"Le dernier segment ne marque pas nécessairement la fin : le navigateur peut encore enregistrer le fichier assemblé."}]}
```

## Pourquoi deux phases d’enregistrement ? {#saving-stages}

```diagram
{"type":"sequence","title":"Export HLS dans Firefox","description":"Firefox assemble les segments dans le stockage temporaire du navigateur, puis son gestionnaire de téléchargements enregistre le fichier obtenu. Garde l’onglet d’export ouvert pendant les deux phases.","actors":[{"id":"you","label":"Toi"},{"id":"export","label":"Onglet d’export"},{"id":"browser","label":"Navigateur"}],"messages":[{"from":"you","to":"export","label":"Enregistrer la vidéo"},{"from":"export","to":"browser","label":"Assembler les segments en stockage temporaire"},{"from":"browser","to":"export","label":"Fichier assemblé prêt","reply":true},{"from":"export","to":"browser","label":"Enregistrer via les téléchargements"},{"from":"browser","to":"export","label":"Enregistrement terminé","reply":true},{"from":"export","to":"you","label":"Vidéo enregistrée sous…","reply":true}]}
```

Chrome peut écrire directement à l’emplacement sélectionné dans sa fenêtre d’enregistrement. L’extension ne transcode pas : des segments MPEG-TS produisent un `.ts` ; un flux MP4 fragmenté compatible produit un `.mp4`. La compatibilité des codecs dépend toujours de ton logiciel de lecture.

## Annuler ou recommencer {#cancel}

**Annuler** interrompt un enregistrement actif. Attends **Enregistrement annulé.** avant de réessayer. Fermer l’onglet d’export interrompt son travail. Recharger un onglet d’export déjà ouvert ne restaure pas ses informations de lancement : reviens à la fiche vidéo et ouvre un nouvel export.

Si la page vidéo a changé, relance la lecture et actualise la détection avant de réessayer. Consulte les [structures HLS prises en charge](doc:reference#hls-limits) si le même flux est systématiquement refusé.
