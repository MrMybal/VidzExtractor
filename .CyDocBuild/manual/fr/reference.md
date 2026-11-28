---
id: reference
title: Formats, autorisations et limites
description: Vérifier les médias pris en charge, les formats de sortie, les données de session et la licence de l’application.
section: Aide et référence
order: 60
previous: troubleshooting
next: release-notes
sourceRevision: 1
---
## Formats pris en charge {#formats}

| Source | Détection et enregistrement en 1.2.0 | Sortie |
| --- | --- | --- |
| Vidéo directe, par exemple MP4 ou WebM | Téléchargement par le navigateur si la source est accessible. | Format du fichier d’origine. |
| Vidéo HLS à la demande compatible | Choix d’une qualité proposée, puis passage par l’onglet d’export. | MPEG-TS (`.ts`) ou MP4 fragmenté (`.mp4`), selon les segments. |
| Manifeste DASH | Détection possible ; export vidéo DASH indisponible. | Aucun export DASH. |
| HLS en direct ou chiffré ; pistes séparées | Export non pris en charge. | Aucun parcours d’export compatible. |

L’extension ne convertit pas les conteneurs, ne transcode pas les codecs et ne fusionne pas les pistes audio et vidéo séparées. La lecture dépend de la source enregistrée et de ton lecteur.

## Limites de structure HLS {#hls-limits}

La liste doit se terminer par `#EXT-X-ENDLIST`, être non chiffrée, utiliser des pistes regroupées et exposer des segments entiers. Les plages d’octets, discontinuités, trous, listes d’images clés seules et structures avec segments sautés sont refusés. Les initialisations répétées ou utilisant des plages d’octets ne sont pas prises en charge. La profondeur d’imbrication des variantes est limitée. Le serveur doit renvoyer des réponses complètes et accessibles pour les listes et les segments ; détecter une URL ne suffit pas.

## Autorisations et données {#privacy}

| Accès | Utilité |
| --- | --- |
| Sites HTTP/HTTPS et requêtes média | Détecter les adresses vidéo candidates de l’onglet courant et accéder aux médias à enregistrer. |
| Scripts dans la page | Examiner les lecteurs vidéo de l’onglet et de ses cadres accessibles. |
| Navigation et stockage de session | Conserver les détections par onglet et les effacer à la navigation complète ou à la fermeture ; transmettre les informations de lancement d’un export HLS. |
| Téléchargements | Lancer les téléchargements directs et enregistrer les fichiers HLS assemblés par le navigateur si nécessaire. |

L’extension n’envoie aucune télémétrie. Elle contacte les serveurs média nécessaires pour examiner et enregistrer la vidéo choisie. L’assemblage HLS dans Firefox utilise du stockage temporaire ; le fichier temporaire est supprimé après l’enregistrement ou l’annulation. Des restes d’une interruption peuvent être nettoyés par un export ultérieur. Le téléchargement terminé reste à l’emplacement choisi.

## Termes utilisés dans ce manuel {#glossary}

- **Fichier direct :** une adresse média unique téléchargée par le navigateur.
- **Liste HLS :** une liste de segments média, parfois avec plusieurs variantes de qualité.
- **Variante :** une qualité disponible d’un flux HLS.
- **Pistes regroupées :** audio et vidéo transportés ensemble, sans flux séparés à fusionner.
- **Conteneur et codec :** l’organisation du fichier et l’encodage audio/vidéo. Modifier le nom ne change ni l’un ni l’autre.

## Licence et liens du projet {#license}

Vidz Extracteur est distribué sous **GPL-3.0-only**. Le dépôt contient la [licence complète de l’application](https://github.com/MrMybal/VidzExtractor/blob/main/LICENSE). Le lecteur hors ligne utilise CyDoc, sous licence MIT ; les notices de ses dépendances sont distribuées avec la documentation. La licence de CyDoc ne remplace pas celle de l’application.

[Dépôt](https://github.com/MrMybal/VidzExtractor) · [Releases](https://github.com/MrMybal/VidzExtractor/releases) · [Suivi des problèmes](https://github.com/MrMybal/VidzExtractor/issues)
