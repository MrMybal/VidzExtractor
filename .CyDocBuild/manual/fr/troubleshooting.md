---
id: troubleshooting
title: Résoudre un problème
description: Partir d’une liste vide, d’un message d’export ou d’un fichier illisible pour trouver la vérification utile.
section: Aide et référence
order: 50
previous: hls-export
next: reference
sourceRevision: 1
---
## Aucune vidéo détectée {#no-video}

**Symptôme :** la liste est vide ou la détection échoue. Vérifie que l’onglet actif est une page vidéo HTTP ou HTTPS ordinaire ; les pages de paramètres du navigateur et les fichiers locaux sortent du périmètre de détection. Lance la lecture, rouvre l’extension et clique sur **Actualiser**. Si la page était ouverte à l’installation ou au rechargement de l’extension, recharge cette page et relance la vidéo.

**Réussite :** une fiche vidéo apparaît. Une navigation complète ou la fermeture de l’onglet d’origine efface sa liste de détections. Certains lecteurs n’exposent pas de source exploitable ; un lecteur visible ne garantit pas une vidéo téléchargeable.

## Aperçu, durée ou taille absents {#missing-details}

Vérifie si une fiche et **Télécharger** restent disponibles. Le lecteur et le serveur déterminent les informations accessibles. **Aperçu indisponible** et **Taille inconnue** signalent des métadonnées absentes ; `≈` indique une estimation. Essaie d’enregistrer un flux compatible et confirme le résultat dans le navigateur ou l’onglet d’export. Consulte les [informations d’une fiche](doc:downloads#read-card).

## Retrouver un message d’export {#export-errors}

| Message dans l’extension | Vérification et action | Réussite ou limite |
| --- | --- | --- |
| **Rouvre le flux depuis le menu de Vidz Extracteur.** | Ouvre un nouvel export depuis la fiche vidéo ; évite de recharger ou de mettre en favori l’ancien onglet d’export. | Le nouvel onglet lit la liste et devient prêt. |
| **Ce flux HLS est chiffré.** | Le flux utilise un chiffrement. | L’export du HLS chiffré n’est pas pris en charge. |
| **L’export HLS est réservé aux vidéos à la demande.** | Vérifie si le flux est en direct ou si sa liste n’est pas terminée. | Seule une vidéo à la demande terminée et compatible peut être exportée. |
| **Piste audio séparée**, **Piste vidéo séparée** ou absence de pistes intégrées | Essaie une autre qualité disponible avec les pistes regroupées. | Sans variante compatible, le flux n’est pas pris en charge. |
| **Cette structure de flux HLS n’est pas prise en charge.** | Consulte les [limites HLS](doc:reference#hls-limits). | Renommer le fichier ou multiplier les essais ne change pas une structure incompatible. |
| Délai serveur dépassé, erreur HTTP, réponse incomplète ou serveur inaccessible | Confirme que la lecture fonctionne encore sur la page d’origine. Recharge-la si nécessaire, relance la détection et ouvre un nouvel export. | Un nouvel export devient prêt et ses segments progressent. Le serveur peut toutefois continuer à refuser l’accès. |
| **L’espace de stockage temporaire est insuffisant.** | Libère de l’espace et réessaie, ou choisis une qualité disponible moins volumineuse. Firefox exige du stockage temporaire en plus de la destination finale. | L’assemblage se termine, puis le navigateur enregistre le fichier. |
| **Le navigateur a refusé l’accès au stockage vidéo.** | Examine les restrictions de stockage du navigateur et utilise l’édition prévue pour celui-ci. | Le navigateur autorise l’écriture temporaire. |
| **Ce navigateur ne permet pas d’enregistrer un export HLS.** | Utilise l’édition documentée du navigateur ; consulte [l’installation](doc:installation). | La commande d’enregistrement devient disponible dans un navigateur pris en charge. |
| **Enregistrement annulé.** ou téléchargement interrompu | Relance volontairement depuis la fiche après avoir vérifié la destination et les téléchargements du navigateur. | Le nouvel enregistrement atteint son message de fin. |

## Trouver la bonne vérification {#diagnostic-map}

Sélectionne un nœud pour lire son rôle et accéder à la rubrique utile. Le graphe démarre en mode lecture pour laisser défiler la page normalement. **Explorer le graphe** active déplacement et zoom ; Échap quitte l’exploration. Sa vue textuelle présente les mêmes vérifications et connexions sans navigation sur le canevas.

```graph
{"id":"diagnostic-map","title":"Du symptôme à l’action utile","controls":"minimal","nodes":[{"id":"symptom","title":"Où se situe l’échec ?","description":"Choisis la détection, l’export ou la lecture du fichier pour cibler la vérification.","x":0,"y":150,"outputs":[{"id":"detect","label":"Aucune fiche","type":"exec"},{"id":"export","label":"Échec de l’export","type":"exec"},{"id":"file","label":"Fichier présent","type":"exec"}]},{"id":"detect","title":"Vérifier l’onglet vidéo","description":"Utilise une page HTTP/HTTPS, lance la lecture et actualise la détection.","x":340,"y":0,"inputs":[{"id":"in","label":"Liste vide","type":"exec"}],"outputs":[{"id":"next","label":"Puis réessayer","type":"exec"}],"link":"doc:troubleshooting#no-video"},{"id":"export","title":"Lire le message d’export","description":"Distingue les flux incompatibles des erreurs de serveur ou de stockage.","x":340,"y":200,"inputs":[{"id":"in","label":"Erreur d’export","type":"exec"}],"outputs":[{"id":"next","label":"Vérifier le format","type":"exec"}],"link":"doc:troubleshooting#export-errors"},{"id":"file","title":"Vérifier format et lecture","description":"Confirme la fin de l’enregistrement et utilise un lecteur compatible avec les codecs source.","x":340,"y":400,"inputs":[{"id":"in","label":"Fichier enregistré","type":"exec"}],"link":"doc:troubleshooting#playback"},{"id":"support","title":"Confirmer la compatibilité","description":"Les fichiers directs et les vidéos HLS à la demande non chiffrées compatibles sont pris en charge.","x":680,"y":100,"inputs":[{"id":"retry","label":"Nouvelle détection","type":"exec"},{"id":"format","label":"Structure du flux","type":"exec"}],"link":"doc:reference#formats"}],"links":[{"from":["symptom","detect"],"to":["detect","in"]},{"from":["symptom","export"],"to":["export","in"]},{"from":["symptom","file"],"to":["file","in"]},{"from":["detect","next"],"to":["support","retry"]},{"from":["export","next"],"to":["support","format"]}]}
```

## Le fichier ne se lit pas {#playback}

Confirme d’abord la fin du téléchargement dans le navigateur ou le message **Vidéo enregistrée sous…** de l’onglet HLS. Vérifie ensuite le format réel : une sortie HLS peut être en MPEG-TS ou en MP4 fragmenté. Utilise un lecteur compatible avec ce conteneur et les codecs d’origine. Modifier l’extension du nom ne convertit pas la vidéo et ne regroupe pas des pistes audio séparées. Si le fichier est incomplet, réessaie depuis une nouvelle détection et attends la fin de l’enregistrement.

## Firefox a retiré l’extension {#firefox-restart}

Un module temporaire non signé est retiré au redémarrage de Firefox. [Charge-le à nouveau](doc:installation#firefox), puis recharge la page vidéo. C’est le mode d’installation décrit pour cette version.

## Signaler un problème reproductible {#report}

[Ouvre un signalement](https://github.com/MrMybal/VidzExtractor/issues) avec le navigateur et sa version, la version de l’extension, les étapes suivies, le message exact et le type de source : fichier direct ou HLS. Partage une page publique reproductible lorsque c’est possible ; omets les liens vidéo privés et les informations de session.
