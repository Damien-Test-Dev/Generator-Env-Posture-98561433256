// data.js
// Pools de données (50 + 50) — importés par app.js
// Objectif: générer un JSON "IA-ready" = personnage fixe + posture + environnement Kirby.

export const APP_DATA_VERSION = "0.1.0";

/**
 * 50 environnements Kirby (niveaux / mondes / zones) — noms officiels
 * Mix multi-jeux pour maximiser la variété de décors.
 */
export const KIRBY_ENVIRONMENTS = [
  // Kirby's Dream Land (5)
  "Green Greens",
  "Castle Lololo",
  "Float Islands",
  "Bubbly Clouds",
  "Mt. Dedede",

  // Kirby's Adventure / Nightmare in Dream Land (8)
  "Vegetable Valley",
  "Ice Cream Island",
  "Butter Building",
  "Grape Garden",
  "Yogurt Yard",
  "Orange Ocean",
  "Rainbow Resort",
  "Fountain of Dreams",

  // Kirby 64: The Crystal Shards (7)
  "Planet Popstar",
  "Rock Star",
  "Aqua Star",
  "Neo Star",
  "Ripple Star",
  "Shiver Star",
  "Dark Star",

  // Kirby: Planet Robobot (7)
  "Patched Plains",
  "Resolution Road",
  "Overload Ocean",
  "Gigabyte Grounds",
  "Rhythm Route",
  "Access Ark",
  "Mind in the Program",

  // Kirby's Return to Dream Land (8)
  "Cookie Country",
  "Raisin Ruins",
  "Onion Ocean",
  "White Wafers",
  "Nutty Noon",
  "Egg Engines",
  "Dangerous Dinner",
  "Another Dimension",

  // Kirby: Triple Deluxe (7)
  "Fine Fields",
  "Lollipop Land",
  "Old Odyssey",
  "Endless Explosions",
  "Royal Road",
  "Wild World",
  "Dreamstalk",

  // Kirby and the Forgotten Land (8)
  "Point of Arrival",
  "Natural Plains",
  "Everbay Coast",
  "Wondaria Remains",
  "Winter Horns",
  "Originull Wasteland",
  "Redgar Forbidden Lands",
  "Lab Discovera"
];

/**
 * 50 postures / positions humaines (génériques, “prompt-friendly”)
 * Le but: donner à l’IA une consigne de pose claire, variée et exploitable.
 */
export const HUMAN_POSES = [
  "Debout, posture neutre",
  "Debout, poids sur une jambe",
  "Debout, bras croisés",
  "Debout, mains sur les hanches",
  "Debout, mains dans les poches",
  "Debout, une main levée (salut)",
  "Debout, bras en V (célébration)",
  "Debout, bras ouverts (accueil)",
  "Debout, une main sur le menton (réflexion)",
  "Debout, mains dans le dos (autorité)",

  "Assis sur une chaise, dos droit",
  "Assis sur une chaise, penché en avant",
  "Assis sur une chaise, jambe croisée",
  "Assis, mains sur les genoux",
  "Assis au sol en tailleur",
  "Assis au sol, jambes allongées devant",
  "Assis accroupi (squat posé)",
  "Accroupi (talons au sol)",
  "À genoux (deux genoux)",
  "À genoux sur une jambe (fente basse)",

  "Fente avant (lunge)",
  "Fente arrière (lunge)",
  "En marche (un pas en avant)",
  "Position de départ de course (ready)",
  "En saut",
  "Atterrissage (genoux fléchis)",
  "Sur la pointe des pieds",
  "Adossé à un mur",
  "Appuyé sur une table",
  "Pivot de profil (pose 3/4)",

  "Couché sur le dos",
  "Couché sur le ventre",
  "Couché sur le côté",
  "Position planche (gainage)",
  "Position pompe (bras fléchis)",
  "Gainage, jambes relevées",
  "Étirement vers le haut (bras levés)",
  "Étirement latéral",
  "Torsion du buste (stretch)",
  "Pose de danse (pied en arrière)",

  "Yoga: posture de l’arbre",
  "Yoga: guerrier",
  "Yoga: chien tête en bas",
  "Bras tendu en avant (montre/indique)",
  "Bras tendu sur le côté (présentation)",
  "Une main sur le cœur",
  "Main derrière la nuque (détendu)",
  "Mains jointes devant soi (attente)",
  "Position de méditation (dos droit)",
  "Assis en avant sur chaise (prêt à se lever)"
];

/**
 * Une structure exportable si tu veux une seule import.
 */
export const POOLS = {
  version: APP_DATA_VERSION,
  kirbyEnvironments: KIRBY_ENVIRONMENTS,
  humanPoses: HUMAN_POSES
};
