# Vidz Extracteur

Extension Chrome en français pour télécharger les vidéos détectées dans l’onglet courant. Elle s’installe depuis ce dossier, sans compilation ni logiciel compagnon.

## Installation

1. Ouvre `chrome://extensions` dans Chrome.
2. Active **Mode développeur**, puis clique sur **Charger l’extension non empaquetée**.
3. Sélectionne le dossier qui contient `manifest.json`. Si tu as téléchargé le ZIP, extrais-le d’abord.
4. Épingle **Vidz Extracteur** depuis le menu des extensions.

## Utilisation

Lance une vidéo, puis ouvre **Vidz Extracteur** et clique sur **Télécharger**. Chrome gère l’enregistrement des fichiers directs. Si la page était déjà ouverte lors de l’installation, recharge-la au besoin.

La fiche vidéo affiche l’image du lecteur ou son affiche quand Chrome y donne accès, ainsi que la durée, la résolution et la taille disponibles. Pour un flux HLS, `≈` indique une estimation à partir du débit annoncé ou d’un échantillon de segments.

Pour un flux HLS, choisis une **Qualité** dans la liste quand le flux propose plusieurs variantes, puis clique sur **Télécharger**. Dans l’onglet qui s’ouvre, **Enregistrer la vidéo** permet de choisir l’emplacement. Le format dépend des segments du flux, en MPEG-TS ou en MP4 fragmenté. **Renommer** modifie le nom proposé pour l’enregistrement.

Après une mise à jour des fichiers, clique sur l’icône de rechargement de **Vidz Extracteur** dans `chrome://extensions`, puis recharge la page de la vidéo.

## Compatibilité

- Fichiers directs sur le Web, dont MP4 et WebM, y compris quand l’adresse n’a pas d’extension et que le serveur annonce le bon type MIME.
- Flux HLS à la demande non chiffrés, avec pistes regroupées dans un même flux et segments accessibles par URL entière.
- L’export de flux DASH, des directs, des pistes séparées et des flux chiffrés n’est pas pris en charge. La détection dépend aussi de ce que Chrome expose sur chaque site.

L’accès HTTP et HTTPS permet de détecter les vidéos servies par le site ou par son CDN. La liste reste dans la session locale de Chrome et s’efface lors d’une navigation complète ou à la fermeture de l’onglet. L’extension n’envoie aucune télémétrie.
