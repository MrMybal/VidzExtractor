---
id: downloads
title: Lire une fiche et télécharger
description: Comprendre les aperçus et estimations de taille, renommer une vidéo et enregistrer un fichier direct.
section: Utiliser Vidz Extracteur
order: 30
previous: quickstart
next: hls-export
sourceRevision: 1
---
## Lire la fiche vidéo {#read-card}

```image
{"id":"video-card","src":"assets/vidz-extracteur-hls.png","alt":"Fenêtre de Vidz Extracteur avec une fiche HLS, un aperçu de huit secondes, une taille estimée et la qualité 360p sélectionnée.","title":"Exemple de fiche vidéo HLS","controls":"minimal"}
```

Cette capture réelle montre une fiche HLS. **Actualiser** relance la détection. **Qualité** sélectionne une variante du flux ; **Renommer** modifie le nom ; **Télécharger** lance le parcours d’enregistrement adapté. Les fichiers directs ne nécessitent pas de sélecteur de qualité HLS. Le titre, la durée et la taille de la capture décrivent cet exemple, pas un réglage obligatoire.

| Information | Signification |
| --- | --- |
| Aperçu ou affiche | Disponible lorsque le navigateur accède à une image du lecteur ; **Aperçu indisponible** indique qu’aucun aperçu n’a pu être obtenu. |
| Durée et résolution | Affichées lorsqu’elles sont connues ; une valeur absente ne prouve pas que la vidéo est invalide. |
| Taille avec `≈` | Estimation à partir du débit annoncé ou d’un échantillon de segments. La taille finale peut différer. |
| Taille inconnue | Le serveur ou le lecteur n’a pas fourni assez d’informations ; l’enregistrement peut rester possible. |
| Une seule fiche HLS | Regroupe une liste de lecture et ses variantes au lieu de montrer une vidéo par qualité. |

## Renommer avant d’enregistrer {#rename}

Choisis **Renommer**, saisis un nom explicite et confirme avec **OK**. L’extension adapte le nom à un fichier ; l’extension du fichier suit le format source. Si ce nom existe déjà, le navigateur peut choisir un nom distinct. Remplacer manuellement `.ts` par `.mp4` ne convertit pas son contenu.

## Télécharger un fichier direct {#direct-file}

1. Lance la vidéo sur sa page et ouvre l’extension.
2. Choisis la fiche du fichier direct, renomme-la si nécessaire, puis clique sur **Télécharger**.
3. Consulte la liste des téléchargements du navigateur et attends la fin.

**Résultat attendu :** un fichier enregistré par le gestionnaire de téléchargements habituel. Son emplacement suit les préférences du navigateur. Le message de lancement dans l’extension confirme le démarrage ; l’état terminé dans le navigateur confirme l’enregistrement final.

Si la fiche est HLS, **Télécharger** ouvre un onglet d’export. Poursuis avec [l’export d’une vidéo HLS](doc:hls-export#save). Si un serveur ne répond plus, reviens à la page d’origine, vérifie que la lecture fonctionne encore et [réessaie depuis une nouvelle détection](doc:troubleshooting#export-errors).
