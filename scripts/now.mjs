#!/usr/bin/env node
// Rychlá změna status readoutu: npm run now <playing|reading|watching> "hodnota"
// Bez argumentů vypíše aktuální stav.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../src/data/now.json", import.meta.url));
const now = JSON.parse(readFileSync(file, "utf8"));

const [key, ...rest] = process.argv.slice(2);
const value = rest.join(" ").trim();

if (!key) {
  for (const [k, v] of Object.entries(now)) console.log(`${k.padEnd(9)} ${v}`);
  process.exit(0);
}

if (!(key in now) || !value) {
  console.error(`Použití: npm run now <${Object.keys(now).join("|")}> "hodnota"`);
  process.exit(1);
}

now[key] = value;
writeFileSync(file, JSON.stringify(now, null, 2) + "\n");
console.log(`${key} → ${value}`);
