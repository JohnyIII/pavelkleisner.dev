# Upgrade pavelkleisner.dev — návrh

Datum: 2026-06-03

## Cíl

Web nemá vypadat „vygenerovaně od AI" a má vystihnout, **kdo Pavel je a co dělá**. Technicky je stránka v pořádku (Astro + TS + Tailwind, dvojjazyčná EN/CZ, dva motivy, dobré SEO). Problém je v **hlasu, rytmu a chybějícím člověku**, ne v kódu.

## Co teď čte jako „od AI" (a co s tím)

- **Vyladěné, ale duté fráze** („where business rules meet runtime reality", „production mistakes are expensive") → přepsat do Pavlova hlasu, s konkrétními příběhy a názorem.
- **Symetrie** — skoro každá sekce = mřížka stejně velkých karet → zavést nerovnoměrný rytmus (různě široké bloky, prkna textu, panely).
- **Dekorativní fake-kód** (`// retry handler, off-by-one in production`) → odstranit; nahradit reálným obsahem (war story, status readout).
- **Chybí člověk** — žádná fotka, koníčky jen vyjmenované → fotka + reálné specifické věci.

## Rozhodnutí (potvrzená s uživatelem)

- **Tón:** „Člověk za kódem" — profesionál napřed, ale jasně je vidět člověk.
- **Kalibrace:** „Profesionální napřed" — homepage krotká a kredibilní; plný osobní obsah až na stránce „O mně".
- **Vizuál:** blend **editorial + terminál**:
  - Základ = editorial: patkové display nadpisy (Source Serif 4), hodně vzduchu, asymetrie.
  - Podpis = technický: mono labely (JetBrains Mono), „status readout", červený akcent (`#e22932`).
  - Sekundární zemitý akcent — lesní zelená (Podkrkonoší / mikina), použít střídmě.
  - Zachovat dva motivy: `void` (tmavý, víc terminál) a `paper` (světlý, víc editorial). Auto podle systému + přepínač.
- **Fotka:** ano, oříznutá jen na Pavla. Soubor dodá uživatel (např. `public/pavel.jpg`).
- **War story:** vyprávět **anonymně**, bez jmen partnerů.
- **Bez čísla epizod** anime. Anime jen kvalitativně (Big 3, teď One Piece).
- Dvojjazyčnost EN/CZ zůstává; přepisují se obě verze.

## Hlas / copy (pravidla)

- Pragmatický, vřelý, přímý. Žádné korporátní klišé, žádný motivační fluff.
- Smí být vidět názor a osobní zkušenost. Krátké, konkrétní.
- Leitmotiv: „klidnej profík, co radši opraví produkci, než aby měl pravdu."

## Struktura stránek

### Domů (krotká, kredibilní)
1. **Hero** — eyebrow (role) + jméno + jedna upřímná věta + fotka. **Žádné staty.** Asymetrie (text širší, fotka užší).
2. **Co umím** — Integrace / Releasy & rollouty / Debugging v **různě širokých** blocích (ne 4 stejné karty).
3. **War story** „UUID, které nebylo UUID" — krátký anonymní příběh (rollout 1.5, messageId, parsování ticketu z `IDTicketu_timestamp`). Ukazuje úsudek = nejprofesionálnější blok.
4. **Zkušenost v kostce + stack** — kompaktně (TSM/CETIN, MNCP, ZIS; hlavní/vedlejší stack).
5. **„Mimo klávesnici"** — JEDNA decentní věta („Hráč, čtenář a metalista z Podkrkonoší.") + odkaz „Víc o mně →". Žádné velké staty.
6. **CTA / kontakt.**

### O mně (tady plný člověk)
- Delší text Pavlovým hlasem: jak přemýšlí, jak pracuje.
- **Kariérní cesta** (timeline ZIS → MNCP → TSM → Nordic/Django) — vizuálně lehčí.
- **Pracovní styl** + „čemu se vyhýbám" (zachovat, přepsat do hlasu).
- **Mimo práci** (plno): hry (PS5, teď Saros), čtení (~125 knih, žánry, aktuálně čtené), anime (Big 3, One Piece — bez čísla dílů), metal (kapely), kafe (ruční mlýnek + moka), kolo, kočky i psi, Podkrkonoší.
- **Status readout** (now playing / reading / watching) jako podpis — **pouze na „O mně"**, ne na homepage. Udržováno **staticky** v jednom datovém souboru (např. `src/data/now.ts`), aktualizace ručně — žádné runtime API, drží to low-maintenance.
- Volitelně odkaz na AniList / Goodreads / GitHub.

### Zkušenosti (projekty)
- Zachovat přehled projektů + timeline; doplnit rámec „war stories" (anonymně).
- Odstranit dekorativní fake-kód.

### Kontakt
- Lehký refresh, beze změny struktury (e-mail, LinkedIn, GitHub).

## Technické poznámky

- Komponenty: rozšířit/upravit `PageIntro` (varianta s fotkou), přidat komponenty pro „war story" blok, „status readout", „mimo klávesnici" strip, různě široké „co dělám" bloky. Sdílet styly v `global.css`.
- Fotka: oříznout na Pavla, optimalizovat (`public/`), `width/height` + `loading`/`alpha` dle potřeby.
- i18n: texty do `src/i18n/*` nebo přímo do stránek (drží se stávající vzor — slovníky teď jen pro nav/routes; copy je v `.astro`). Přepsat EN i CZ.
- Zachovat SEO/schema.org, sitemap, oba motivy, výkon (statický build, Cloudflare Pages).
- `status readout` data: jeden zdroj pravdy, snadno editovatelný.

## Mimo rozsah (zatím)

- Blog a micro-SaaS stránky (web na ně má zůstat připravený, ale teď je neřešíme).
- Živé napojení na AniList/Goodreads API (zůstává statické, ručně aktualizované).

## Vyřešené body

- Fotka: hotová — `public/pavel.jpg` (oříznutá jen na Pavla). Originál mimo `public/`, v `.gitignore`.
- Status readout: pouze na „O mně", ne na homepage.
