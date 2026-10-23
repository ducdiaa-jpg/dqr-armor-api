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

const ITEMS = {
  armors: [
    { id: "iron_plate", name: "Iron Plate", rarity: "Common" },
    { id: "steel_plate", name: "Steel Plate", rarity: "Uncommon" },
    { id: "mithril_plate", name: "Mithril Plate", rarity: "Rare" },
    { id: "dragon_scale", name: "Dragon Scale", rarity: "Epic" },
    { id: "void_armor", name: "Void Armor", rarity: "Legendary" },
  ],
  weapons: [
    { id: "bronze_dagger", name: "Bronze Dagger", rarity: "Common" },
    { id: "iron_sword", name: "Iron Sword", rarity: "Common" },
    { id: "steel_sword", name: "Steel Sword", rarity: "Uncommon" },
    { id: "mithril_sword", name: "Mithril Sword", rarity: "Rare" },
    { id: "dragon_blade", name: "Dragon Blade", rarity: "Epic" },
    { id: "void_reaper", name: "Void Reaper", rarity: "Legendary" },
  ],
};

function allItems() { return [...ITEMS.armors, ...ITEMS.weapons]; }

app.get('/items', (req, res) => res.json(allItems()));
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