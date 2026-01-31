// app.js
// Génération JSON: personnage fixe + posture + environnement Kirby
// Features: seed reproductible, anti-répétition (combos), copy clipboard, download, historique local

import { POOLS, APP_DATA_VERSION } from "./data.js";

/* =========================
   Config / LocalStorage keys
   ========================= */
const APP_VERSION = APP_DATA_VERSION || "0.1.0";

const LS_KEYS = {
  history: "bpkt.history.v1",
  usedPairs: "bpkt.usedPairs.v1",
  brand: "bpkt.brand.v1"
};

const HISTORY_LIMIT = 20;

/* =========================
   DOM helpers
   ========================= */
const $ = (id) => document.getElementById(id);

const els = {
  // Header
  status: $("status"),
  versionBadge: $("appVersionBadge"),

  // Brand inputs
  brandName: $("brandName"),
  brandDescription: $("brandDescription"),

  // Options
  seed: $("seed"),
  prettyJson: $("prettyJson"),
  avoidRepeats: $("avoidRepeats"),
  saveHistory: $("saveHistory"),

  // Buttons
  generateBtn: $("generateBtn"),
  copyBtn: $("copyBtn"),
  downloadBtn: $("downloadBtn"),
  randomSeedBtn: $("randomSeedBtn"),
  clearBtn: $("clearBtn"),
  clearHistoryBtn: $("clearHistoryBtn"),

  // Output
  jsonOutput: $("jsonOutput"),
  posePreview: $("posePreview"),
  envPreview: $("envPreview"),

  // History UI
  historyList: $("historyList")
};

/* =========================
   Seeded RNG (Mulberry32)
   ========================= */
function hashToSeed(str) {
  // FNV-1a (32-bit)
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildRngFromSeed(seedRaw) {
  const seedValue = (seedRaw || "").trim() || String(Date.now());
  const seed = hashToSeed(seedValue);
  return { rnd: mulberry32(seed), seedValue };
}

/* =========================
   Data helpers
   ========================= */
function safeArray(v) {
  return Array.isArray(v) ? v.filter(Boolean) : [];
}

function pickOne(arr, rnd) {
  if (!arr.length) return null;
  const idx = Math.floor(rnd() * arr.length);
  return arr[idx];
}

/**
 * Anti-répétition:
 * - On considère une "pair key" = `${poseIndex}:${envIndex}`
 * - Tant que possible, on évite les pairs déjà sorties.
 * - Quand tout est épuisé (50*50 = 2500 combos), on reset proprement.
 */
function chooseUniquePair({ poses, envs, rnd, avoidRepeats }) {
  const nPoses = poses.length;
  const nEnvs = envs.length;

  if (nPoses === 0 || nEnvs === 0) {
    return { pose: null, env: null, poseIndex: -1, envIndex: -1, exhausted: false };
  }

  if (!avoidRepeats) {
    const poseIndex = Math.floor(rnd() * nPoses);
    const envIndex = Math.floor(rnd() * nEnvs);
    return {
      pose: poses[poseIndex],
      env: envs[envIndex],
      poseIndex,
      envIndex,
      exhausted: false
    };
  }

  const used = loadUsedPairs();
  const totalCombos = nPoses * nEnvs;

  // Si on a tout consommé => reset
  if (used.size >= totalCombos) {
    saveUsedPairs(new Set());
    return chooseUniquePair({ poses, envs, rnd, avoidRepeats: false, exhausted: true });
  }

  // Tentatives random (rapide, suffisant à 2500 combos)
  const maxTries = 2000;
  for (let i = 0; i < maxTries; i++) {
    const poseIndex = Math.floor(rnd() * nPoses);
    const envIndex = Math.floor(rnd() * nEnvs);
    const key = `${poseIndex}:${envIndex}`;
    if (!used.has(key)) {
      used.add(key);
      saveUsedPairs(used);
      return {
        pose: poses[poseIndex],
        env: envs[envIndex],
        poseIndex,
        envIndex,
        exhausted: false
      };
    }
  }

  // Fallback déterministe si l’aléatoire n’a pas trouvé (rare)
  for (let p = 0; p < nPoses; p++) {
    for (let e = 0; e < nEnvs; e++) {
      const key = `${p}:${e}`;
      if (!used.has(key)) {
        used.add(key);
        saveUsedPairs(used);
        return { pose: poses[p], env: envs[e], poseIndex: p, envIndex: e, exhausted: false };
      }
    }
  }

  // Théoriquement impossible si checks corrects, mais on sécurise
  saveUsedPairs(new Set());
  const poseIndex = Math.floor(rnd() * nPoses);
  const envIndex = Math.floor(rnd() * nEnvs);
  return {
    pose: poses[poseIndex],
    env: envs[envIndex],
    poseIndex,
    envIndex,
    exhausted: true
  };
}

/* =========================
   JSON build
   ========================= */
function uid(prefix = "bpkt") {
  const ts = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}_${r}`;
}

function nowIso() {
  return new Date().toISOString();
}

function buildPayload({ brandName, brandDescription, pose, env, seedValue }) {
  return {
    meta: {
      id: uid("payload"),
      generatedAt: nowIso(),
      seed: seedValue,
      version: APP_VERSION
    },
    brandCharacter: {
      name: brandName || "",
      description: brandDescription || ""
    },
    selection: {
      pose: pose || "",
      kirbyEnvironment: env || ""
    }
  };
}

/* =========================
   LocalStorage: brand + history + usedPairs
   ========================= */
function loadBrand() {
  const raw = localStorage.getItem(LS_KEYS.brand);
  if (!raw) return { name: "", description: "" };
  try {
    const v = JSON.parse(raw);
    return {
      name: typeof v?.name === "string" ? v.name : "",
      description: typeof v?.description === "string" ? v.description : ""
    };
  } catch {
    return { name: "", description: "" };
  }
}

function saveBrand({ name, description }) {
  localStorage.setItem(LS_KEYS.brand, JSON.stringify({ name, description }));
}

function loadHistory() {
  const raw = localStorage.getItem(LS_KEYS.history);
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  const trimmed = list.slice(0, HISTORY_LIMIT);
  localStorage.setItem(LS_KEYS.history, JSON.stringify(trimmed));
}

function loadUsedPairs() {
  const raw = localStorage.getItem(LS_KEYS.usedPairs);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function saveUsedPairs(set) {
  localStorage.setItem(LS_KEYS.usedPairs, JSON.stringify([...set]));
}

/* =========================
   UI actions
   ========================= */
function setStatus(msg) {
  els.status.textContent = msg;
}

function setOutput(payload, { pretty }) {
  const space = pretty ? 2 : 0;
  els.jsonOutput.value = JSON.stringify(payload, null, space);

  els.copyBtn.disabled = false;
  els.downloadBtn.disabled = false;
}

function clearOutput() {
  els.jsonOutput.value = "";
  els.posePreview.textContent = "—";
  els.envPreview.textContent = "—";
  els.copyBtn.disabled = true;
  els.downloadBtn.disabled = true;
  setStatus("Sortie nettoyée.");
}

async function copyJson() {
  const text = (els.jsonOutput.value || "").trim();
  if (!text) return setStatus("Rien à copier.");
  try {
    await navigator.clipboard.writeText(text);
    setStatus("JSON copié dans le presse-papiers.");
  } catch {
    setStatus("Copie impossible (permissions navigateur).");
  }
}

function downloadJson() {
  const text = (els.jsonOutput.value || "").trim();
  if (!text) return setStatus("Rien à télécharger.");
  const filename = `brand_pose_kirby_${Date.now()}.json`;
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus("Téléchargement lancé.");
}

function renderHistory() {
  const list = loadHistory();
  els.historyList.innerHTML = "";

  if (list.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="meta"><div class="t">Aucun historique</div><div class="s">Génère une première combinaison.</div></div>`;
    els.historyList.appendChild(li);
    return;
  }

  for (const item of list) {
    const li = document.createElement("li");

    const meta = document.createElement("div");
    meta.className = "meta";

    const t = document.createElement("div");
    t.className = "t";
    t.textContent = `${item.selection?.pose || "—"}  ×  ${item.selection?.kirbyEnvironment || "—"}`;

    const s = document.createElement("div");
    s.className = "s";
    s.textContent = `${item.meta?.generatedAt || ""} • seed: ${item.meta?.seed || ""}`;

    meta.appendChild(t);
    meta.appendChild(s);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Charger";
    btn.addEventListener("click", () => {
      const payload = item;
      const pretty = !!els.prettyJson.checked;
      setOutput(payload, { pretty });
      els.posePreview.textContent = payload.selection?.pose || "—";
      els.envPreview.textContent = payload.selection?.kirbyEnvironment || "—";
      setStatus("Historique chargé.");
    });

    li.appendChild(meta);
    li.appendChild(btn);
    els.historyList.appendChild(li);
  }
}

function clearHistory() {
  localStorage.removeItem(LS_KEYS.history);
  renderHistory();
  setStatus("Historique vidé.");
}

/* =========================
   Core: Generate
   ========================= */
function onGenerate() {
  const poses = safeArray(POOLS?.humanPoses);
  const envs = safeArray(POOLS?.kirbyEnvironments);

  if (!poses.length || !envs.length) {
    setStatus("Données manquantes: vérifie data.js.");
    return;
  }

  // Persist brand as the user types (enterprise-grade UX: zéro friction)
  const brandName = (els.brandName.value || "").trim();
  const brandDescription = (els.brandDescription.value || "").trim();
  saveBrand({ name: brandName, description: brandDescription });

  const { rnd, seedValue } = buildRngFromSeed(els.seed.value);

  const avoidRepeats = !!els.avoidRepeats.checked;
  const pretty = !!els.prettyJson.checked;
  const saveHist = !!els.saveHistory.checked;

  const { pose, env, exhausted } = chooseUniquePair({
    poses,
    envs,
    rnd,
    avoidRepeats
  });

  const payload = buildPayload({
    brandName,
    brandDescription,
    pose,
    env,
    seedValue
  });

  // Update UI
  els.posePreview.textContent = pose || "—";
  els.envPreview.textContent = env || "—";
  setOutput(payload, { pretty });

  // History
  if (saveHist) {
    const list = loadHistory();
    list.unshift(payload);
    saveHistory(list);
    renderHistory();
  }

  if (exhausted) {
    setStatus("Toutes les combinaisons ont été consommées: reset auto effectué.");
  } else {
    setStatus("Nouvelle combinaison générée.");
  }
}

/* =========================
   Init
   ========================= */
function init() {
  // Version label
  els.versionBadge.textContent = `v${APP_VERSION}`;

  // Load brand from localStorage
  const savedBrand = loadBrand();
  els.brandName.value = savedBrand.name;
  els.brandDescription.value = savedBrand.description;

  // Initial state
  clearOutput();
  renderHistory();
  setStatus("Prêt. Clique sur Générer.");

  // Events
  els.generateBtn.addEventListener("click", onGenerate);
  els.copyBtn.addEventListener("click", copyJson);
  els.downloadBtn.addEventListener("click", downloadJson);

  els.randomSeedBtn.addEventListener("click", () => {
    els.seed.value = String(Date.now());
    setStatus("Seed mise à jour.");
  });

  els.clearBtn.addEventListener("click", clearOutput);
  els.clearHistoryBtn.addEventListener("click", clearHistory);

  // Live save brand (best effort)
  els.brandName.addEventListener("input", () => {
    saveBrand({ name: els.brandName.value || "", description: els.brandDescription.value || "" });
  });
  els.brandDescription.addEventListener("input", () => {
    saveBrand({ name: els.brandName.value || "", description: els.brandDescription.value || "" });
  });
}

init();
