# Generator-Env-Posture-98561433256
Generation Idea



---


````md
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
````

## 🚀 Déployer sur GitHub Pages (Deploy from a branch)

1. Repo → **Settings**
2. Menu gauche → **Pages**
3. **Build and deployment**

   * Source : `Deploy from a branch`
   * Branch : `main` (ou `master` selon ton repo)
   * Folder : `/(root)`
4. Save

Ton site sera servi à une URL du type :

* `https://<username>.github.io/<repo>/`

## 🔧 Personnaliser

* Ajoute / modifie les items dans `data.js`

  * `KIRBY_ENVIRONMENTS`
  * `HUMAN_POSES`

## 🧩 Notes

* L’app ne fait aucun appel réseau : tout reste côté navigateur.
* L’anti-répétition est stockée en local (si tu veux reset, efface les données du site dans le navigateur).

```

---

## 2) Déploiement GitHub Pages — guide “clic par clic” (production)

### A. Pré-requis non négociables
- Tes fichiers (`index.html`, `styles.css`, `data.js`, `app.js`) doivent être **à la racine** du repo (pas dans un sous-dossier), car on va publier `/(root)`. :contentReference[oaicite:1]{index=1}  
- Ton plan GitHub doit permettre Pages : sur GitHub Free, Pages est dispo sur les repos publics (et selon les plans, aussi sur privés). :contentReference[oaicite:2]{index=2}  

### B. Activer Pages
1. Va sur ton repo
2. Clique l’onglet **Settings**
   - Si tu ne vois pas “Settings”, clique le menu “…” (selon l’affichage) puis “Settings”. :contentReference[oaicite:3]{index=3}  
3. Dans la sidebar, section **Code and automation** → clique **Pages** :contentReference[oaicite:4]{index=4}  
4. Section **Build and deployment** :
   - **Source** : sélectionne **Deploy from a branch** :contentReference[oaicite:5]{index=5}  
   - **Branch** : sélectionne `main` (ou `master` si c’est ta branche par défaut)
   - **Folder** : sélectionne `/(root)` :contentReference[oaicite:6]{index=6}  
5. Clique **Save**

Résultat : GitHub lance un déploiement et affichera l’URL de ton site dans la page Pages (après le build). :contentReference[oaicite:7]{index=7}  

---

## 3) Checklist “ça marche du premier coup”
Après activation :
- Ouvre l’URL Pages (celle affichée dans Settings → Pages)
- Clique **Générer**
- Vérifie :
  - preview “Posture” + “Environnement Kirby”
  - JSON qui s’affiche
  - **Copier le JSON** fonctionne (coller dans un éditeur)
  - **Télécharger .json** télécharge bien un fichier

---

## 4) Troubleshooting sans filtre (les 5 causes #1 de 404 / page blanche)
1) **Source Pages mal configurée** : tu as choisi `/docs` au lieu de `/(root)` ou la mauvaise branche. :contentReference[oaicite:8]{index=8}  
2) **Fichiers pas à la racine** : ton `index.html` est dans un sous-dossier → Pages ne le sert pas si folder = root. :contentReference[oaicite:9]{index=9}  
3) **Nom de branche différent** : repo en `master` et Pages pointe sur `main` (ou l’inverse).  
4) **Cache navigateur** : hard refresh (`Ctrl+F5`) ou ouvre en navigation privée.  
5) **Chemins relatifs** : on utilise `./styles.css` et `./app.js`, donc c’est OK tant que tout est à la racine (ce qu’on fait).

---

✅ Si `README.md` est committé et Pages activé : dis **next** et je te donne le “pack premium” final :
- un fichier optionnel `.nojekyll` (si tu veux zéro surprise),
- une mini check-list “release” (tag version, changelog light),
- et une version “brand-ready” (titre, favicon, micro-copy) pour que ça fasse vitrine pro.
::contentReference[oaicite:10]{index=10}
```
