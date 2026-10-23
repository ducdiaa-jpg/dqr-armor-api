const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'stats.json');

app.use(cors());
app.use(express.json());

let stats = {};
try { stats = JSON.parse(fs.readFileSync(DATA_FILE)); } catch {}

function save() { fs.writeFileSync(DATA_FILE, JSON.stringify(stats, null, 2)); }

const ITEMS = [
  { id: "iron_plate", name: "Iron Plate", type: "Armor", rarity: "Common", image: "https://via.placeholder.com/96x96/8e44ad/ffffff?text=Iron+Plate", stats: "Def 12" },
  { id: "steel_plate", name: "Steel Plate", type: "Armor", rarity: "Uncommon", image: "https://via.placeholder.com/96x96/27ae60/ffffff?text=Steel+Plate", stats: "Def 25" },
  { id: "mithril_plate", name: "Mithril Plate", type: "Armor", rarity: "Rare", image: "https://via.placeholder.com/96x96/3498db/ffffff?text=Mithril+Plate", stats: "Def 48" },
  { id: "dragon_scale", name: "Dragon Scale", type: "Armor", rarity: "Epic", image: "https://via.placeholder.com/96x96/9b59b6/ffffff?text=Dragon+Scale", stats: "Def 85" },
  { id: "void_armor", name: "Void Armor", type: "Armor", rarity: "Legendary", image: "https://via.placeholder.com/96x96/e74c3c/ffffff?text=Void+Armor", stats: "Def 150" },
  { id: "bronze_dagger", name: "Bronze Dagger", type: "Weapon", rarity: "Common", image: "https://via.placeholder.com/96x96/f39c12/ffffff?text=Bronze+Dagger", stats: "Phys 120" },
  { id: "iron_sword", name: "Iron Sword", type: "Weapon", rarity: "Common", image: "https://via.placeholder.com/96x96/f1c40f/ffffff?text=Iron+Sword", stats: "Phys 250" },
  { id: "steel_sword", name: "Steel Sword", type: "Weapon", rarity: "Uncommon", image: "https://via.placeholder.com/96x96/e67e22/ffffff?text=Steel+Sword", stats: "Phys 420" },
  { id: "mithril_sword", name: "Mithril Sword", type: "Weapon", rarity: "Rare", image: "https://via.placeholder.com/96x96/1abc9c/ffffff?text=Mithril+Sword", stats: "Phys 750" },
  { id: "dragon_blade", name: "Dragon Blade", type: "Weapon", rarity: "Epic", image: "https://via.placeholder.com/96x96/16a085/ffffff?text=Dragon+Blade", stats: "Phys 1200" },
  { id: "void_reaper", name: "Void Reaper", type: "Weapon", rarity: "Legendary", image: "https://via.placeholder.com/96x96/c0392b/ffffff?text=Void+Reaper", stats: "Phys 2000" },
  { id: "dracani_gilded_staff", name: "Dracani Gilded Staff", type: "Weapon", rarity: "Rare", image: "https://via.placeholder.com/96x96/f39c12/ffffff?text=Dracani+Staff", stats: "Phys 982 Spell 99.1m" },
];

app.get('/items', (req, res) => res.json(ITEMS));
app.get('/stats', (req, res) => res.json(stats));
app.get('/stats/:name', (req, res) => res.json(stats[req.params.name] || {}));
app.post('/stats/:name', (req, res) => {
  const name = req.params.name;
  const { item_id, value } = req.body;
  if (!stats[name]) stats[name] = {};
  stats[name][item_id] = value;
  save();
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('API listening on', PORT));