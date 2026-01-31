# Generator-Env-Posture-98561433256
Generation Idea


# Brand Pose & Kirby Theme — JSON Generator (GitHub Pages)

Mini-app statique (HTML/CSS/JS) : un end user clique sur **Générer** pour obtenir un JSON combinant :
- un **personnage de branding** (fixe, décrit par toi),
- une **posture humaine**,
- un **environnement Kirby** (variabilité décor).

Le JSON est conçu pour être directement exploitable dans un pipeline de génération d’image par IA.

## ✅ Fonctionnalités
- Génération aléatoire (option seed reproductible)
- Anti-répétition des combinaisons (jusqu’à épuisement)
- Bouton **Copier le JSON**
- Bouton **Télécharger .json**
- Historique local (localStorage)
- 100% front — compatible GitHub Pages

## 📦 Fichiers
- `index.html` — interface
- `styles.css` — design
- `data.js` — pools (50 environnements Kirby + 50 postures)
- `app.js` — logique de génération / JSON / copy / download / historique

## 🧠 Schéma JSON (sortie)
```json
{
  "meta": {
    "id": "string",
    "generatedAt": "ISO-8601",
    "seed": "string|number",
    "version": "string"
  },
  "brandCharacter": {
    "name": "string",
    "description": "string"
  },
  "selection": {
    "pose": "string",
    "kirbyEnvironment": "string"
  }
}
