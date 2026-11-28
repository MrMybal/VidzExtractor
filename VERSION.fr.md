# Notes de version de Vidz Extracteur

[Retour au README](README.fr.md) · [English](VERSION.md)

[Manuel utilisateur](Documentation/Documentation.html#/fr/release-notes) · [Dépannage](Documentation/Documentation.html#/fr/troubleshooting)

## Version 1.2.0

- Ajout d’une édition Firefox aux côtés de l’extension Chrome.
- Enregistrement HLS par le gestionnaire de téléchargements de Firefox après assemblage temporaire des segments d’origine.
- Génération du ZIP Chrome et du XPI Firefox depuis les sources partagées.

[Notes de release et téléchargements](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.2.0)

## Version 1.1.0

- Regroupement des listes HLS et de leurs variantes sur une seule fiche vidéo.
- Affichage de l’aperçu, de la durée, de la résolution et de la taille quand ces informations sont disponibles. Le symbole `≈` indique une taille estimée.
- Sélection d’une qualité proposée par le flux HLS et export de la variante choisie.
- Modification du nom de fichier proposé avant le téléchargement.

[Notes de release et téléchargement](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.1.0)

## Limites connues

- L’export HLS prend en charge les flux à la demande non chiffrés dont les pistes sont regroupées et les segments accessibles sous forme de fichiers entiers.
- Le format de sortie suit la source. Les exports HLS sont en MPEG-TS ou en MP4 fragmenté.
- La disponibilité de l’aperçu, de la durée et de la taille dépend du lecteur et du serveur. Certains serveurs fournissent seulement de quoi estimer la taille du fichier.
- L’extension peut détecter des manifestes DASH. L’export vidéo est disponible pour les fichiers directs et les flux HLS compatibles.
- Firefox a besoin d’espace temporaire dans le navigateur pour assembler la vidéo HLS. Le XPI Firefox non signé se charge comme module temporaire.

[Signalements et suivi des problèmes](https://github.com/MrMybal/VidzExtractor/issues)
