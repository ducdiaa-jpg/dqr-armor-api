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

const ARMORS = [
  { id: "iron_plate", name: "Iron Plate", rarity: "Common" },
  { id: "steel_plate", name: "Steel Plate", rarity: "Uncommon" },
  { id: "mithril_plate", name: "Mithril Plate", rarity: "Rare" },
  { id: "dragon_scale", name: "Dragon Scale", rarity: "Epic" },
  { id: "void_armor", name: "Void Armor", rarity: "Legendary" },
];

app.get('/armors', (req, res) => res.json(ARMORS));
app.get('/stats/:uid', (req, res) => res.json(stats[req.params.uid] || {}));
app.post('/stats/:uid', (req, res) => {
  const uid = req.params.uid;
  const { item_id, value } = req.body;
  if (!stats[uid]) stats[uid] = {};
  stats[uid][item_id] = value;
  save();
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('API listening on', PORT));
