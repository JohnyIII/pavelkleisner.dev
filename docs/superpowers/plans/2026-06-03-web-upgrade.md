# pavelkleisner.dev — Web Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přepsat obsah a vizuál osobního webu tak, aby nepůsobil „vygenerovaně od AI" a vystihoval, kdo Pavel je a co dělá — profesionál napřed, jasně lidský.

**Architecture:** Astro statický web, jedna sdílená šablona (`Layout.astro`), jeden stylesheet (`global.css`), dvojjazyčnost EN (`/`) a CZ (`/cz`). Úpravy = nové/upravené `.astro` komponenty + nový datový soubor pro „status readout" + přepsaný copy v existujících stránkách. Žádné runtime API, vše statické.

**Tech Stack:** Astro 6, TypeScript, Tailwind 4 (utility + custom CSS v `global.css`), Cloudflare Pages.

**Verifikace (místo unit testů):** web nemá test runner. Každý task ověř takto:
- `npm run build` musí projít bez chyb (hláška `Complete!`, exit 0).
- `npm run dev` (běží na `http://localhost:4321`), pak vizuální kontrola dané stránky — ideálně Playwright MCP: `browser_navigate` na URL + `browser_take_screenshot`, porovnat se spec sekcí. Zkontroluj EN i CZ variantu.
- Po vizuálním OK commit na větvi `web-upgrade`.

**Hlas/copy pravidla:** pragmatický, vřelý, přímý; žádné korporátní klišé ani fluff; smí být názor a konkrétní zkušenost; krátké. Leitmotiv: „klidnej profík, co radši opraví produkci, než aby měl pravdu."

**Spec:** `docs/superpowers/specs/2026-06-03-web-upgrade-design.md`

---

## File Structure

**Create:**
- `src/data/now.ts` — zdroj pravdy pro status readout (now playing/reading/watching).
- `src/components/StatusReadout.astro` — mono panel „now_playing/reading/watching" (jen na About).
- `src/components/WarStory.astro` — zvýrazněný blok pro anonymní war story.

**Modify:**
- `src/components/PageIntro.astro` — přidat volitelnou fotku v hero + slot pro akční tlačítka.
- `src/styles/global.css` — nový zemitý zelený akcent + styly pro hero foto, war story, off-clock, status readout; odstranit závislost na `.fit-eg`.
- `src/pages/index.astro` + `src/pages/cz/index.astro` — nový rytmus homepage, přepsaný copy, fotka, war story, off-clock řádek, bez fake-kódu.
- `src/pages/about.astro` + `src/pages/cz/o-mne.astro` — přepsaný copy do hlasu, plná sekce „Mimo práci", status readout, fotka v hero.
- `src/pages/projects.astro` + `src/pages/cz/projekty.astro` — přepsaný copy, odstranit dekorativní prvky, war-story rámec.
- `src/pages/contact.astro` + `src/pages/cz/kontakt.astro` — lehký přepis do hlasu.

`public/pavel.jpg` už existuje (oříznutá fotka, 360×500).

---

## Task 1: Zelený akcent + hero s fotkou (komponenta)

**Files:**
- Modify: `src/styles/global.css` (`:root` a `[data-theme="paper"]` bloky + nové styly na konec před media queries)
- Modify: `src/components/PageIntro.astro`

- [ ] **Step 1: Přidat zelený akcent token do obou motivů**

V `src/styles/global.css` do `:root` (za řádek `--c-accent-2: #61d7e8;`) přidej:

```css
  --c-accent-3: #5fb37a;
```

Do `[data-theme="paper"]` (za `--c-accent-2: #1f6268;`) přidej:

```css
  --c-accent-3: #3a5a40;
```

- [ ] **Step 2: Rozšířit PageIntro o fotku a actions slot**

Přepiš `src/components/PageIntro.astro` na:

```astro
---
const {
    eyebrow,
    title,
    highlight,
    lead,
    body,
    photo,
    photoAlt,
} = Astro.props;
---

<section class="page-intro">
    <div>
        {eyebrow && <div class="section-label mb-4">{eyebrow}</div>}
        <h1 class="page-title">
            {title}{highlight && <> <span class="accent-text">{highlight}</span></>}
        </h1>
        {lead && <p class="page-lead">{lead}</p>}
        {body && <p class="page-body">{body}</p>}
        <slot name="actions" />
    </div>
    <div class="page-aside">
        {photo
            ? <img class="hero-photo" src={photo} alt={photoAlt ?? ""} width="360" height="500" loading="eager" />
            : <slot />}
    </div>
</section>
```

- [ ] **Step 3: Styl fotky**

V `src/styles/global.css` přidej (za blok `.page-aside:empty { display: none; }` / před `.page-intro:has(...)`):

```css
.hero-photo {
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 360 / 500;
  object-fit: cover;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build projde bez chyb (`Complete!`).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/PageIntro.astro
git commit -m "feat: add green accent token and photo support in hero"
```

---

## Task 2: Homepage hero — fotka, hlas, bez statů (EN)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Přepsat hero blok**

V `src/pages/index.astro` nahraď celý `<PageIntro ...> ... </PageIntro>` blok tímto:

```astro
    <PageIntro
        eyebrow="Senior Backend & Integration Engineer"
        title="Pavel Kleisner"
        lead="Backend, integrations and releases — the unglamorous part where systems meet real data and have to stay up."
        body="I work on Kotlin/Java/Spring services and PostgreSQL, mostly around TSM/CETIN production flow: B2B behaviour, data compatibility, incident analysis and rolling out new platform versions. I'd rather fix production than be right about it."
        photo="/pavel.jpg"
        photoAlt="Pavel Kleisner"
    >
        <div slot="actions" class="flex flex-wrap gap-3 mt-8">
            <a href="/projects" class="btn-primary">View experience</a>
            <a href="/contact" class="btn-secondary">Contact</a>
        </div>
    </PageIntro>
```

- [ ] **Step 2: Build + vizuální kontrola**

Run: `npm run build` (expected: projde). Pak `npm run dev` a přes Playwright MCP: `browser_navigate` na `http://localhost:4321/`, `browser_take_screenshot`. Ověř: hero má vlevo text + tlačítka, vpravo fotku, žádné staty v heru.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage hero with photo and human voice (EN)"
```

---

## Task 3: WarStory komponenta + nasazení na homepage (EN)

**Files:**
- Create: `src/components/WarStory.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Vytvořit komponentu**

`src/components/WarStory.astro`:

```astro
---
const { kicker, title } = Astro.props;
---

<section class="war-story mb-24">
    {kicker && <div class="war-kicker">{kicker}</div>}
    <h2 class="war-title">{title}</h2>
    <div class="war-body"><slot /></div>
</section>
```

- [ ] **Step 2: Styly war story**

V `src/styles/global.css` přidej (poblíž `.cta-band`):

```css
.war-story {
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-accent);
  border-radius: var(--radius-card);
  background: var(--c-card);
  padding: 1.75rem 2rem;
  box-shadow: var(--shadow-card);
}

.war-kicker {
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.war-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 0.85rem;
}

.war-body {
  max-width: 52rem;
  color: var(--c-muted);
  line-height: 1.7;
}

.war-body code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--c-text);
  background: color-mix(in srgb, var(--c-accent) 12%, transparent);
  padding: 0.05rem 0.3rem;
  border-radius: 3px;
}
```

- [ ] **Step 3: Importovat a vložit na homepage**

V `src/pages/index.astro` přidej do importů (k ostatním `import ... from "@/components/..."`):

```astro
import WarStory from "@/components/WarStory.astro";
```

Vlož war story **za** sekci „Where I fit best" a **před** sekci „Core stack":

```astro
    <WarStory kicker="War story · anonymised" title="The UUID that wasn't a UUID">
        <p class="mb-4">
            When we rolled out the first platform version, the integration spec said the
            <code>messageId</code> would be a UUID. One partner started failing immediately.
            Their system was quietly parsing the ticket ID <em>out of</em> the old
            <code>ticketId_timestamp</code> format — even though the ticket ID sat right
            there in the message body.
        </p>
        <p>
            The clean fix was on their side, but in a corporate setting that change would take
            months. So I adapted our side back to the old shape and kept production running.
            Sometimes the right call isn't the pure one — it's the one that doesn't break
            someone else at 2 a.m.
        </p>
    </WarStory>
```

- [ ] **Step 4: Build + vizuální kontrola**

Run: `npm run build` (projde). `npm run dev`, Playwright `browser_navigate` `http://localhost:4321/`, screenshot. Ověř: war story panel s červeným levým proužkem mezi „Where I fit best" a „Core stack".

- [ ] **Step 5: Commit**

```bash
git add src/components/WarStory.astro src/styles/global.css src/pages/index.astro
git commit -m "feat: add anonymised war story block to homepage (EN)"
```

---

## Task 4: Homepage — odstranit fake-kód, off-clock řádek, doladit copy (EN)

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Odstranit fake-kód z „Where I fit best"**

V `src/pages/index.astro` v sekci „Where I fit best" smaž všechny čtyři `<div class="fit-eg">...</div>` řádky (dekorativní `// ...` komentáře). Zbydou jen `fit-cat` a `fit-desc`.

Zároveň přepiš `body` u `SectionIntro` na hlas:

```astro
        <SectionIntro
            title="Where I fit best"
            body="Usually the value isn't another abstraction layer. It's a change that survives real data, integrations, support and the next release."
        />
```

- [ ] **Step 2: Upravit fit-grid na 2 sloupce (bez code sloupce)**

V `src/styles/global.css` změň `.fit-grid` `grid-template-columns`:

```css
.fit-grid {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: 1rem 1.5rem;
  border-top: 1px solid var(--c-border);
}
```

A odstraň `.fit-eg` selektory (pravidlo `.fit-eg { ... }` a zmínku `.fit-row > .fit-eg` v `.fit-row > .fit-cat, .fit-row > .fit-desc, .fit-row > .fit-eg { ... }` → nech jen `.fit-cat, .fit-desc`). V media query `@media (max-width: 900px)` uprav blok `.fit-row > .fit-cat, .fit-row > .fit-desc, .fit-row > .fit-eg` → odstraň `.fit-eg`, a smaž pravidlo `.fit-row > .fit-eg { padding-bottom: 1rem; border-bottom: 1px solid var(--c-border); }` (nahraď `border-bottom` na `.fit-desc`):

```css
@media (max-width: 900px) {
  /* ... ponech snapshot a fit-grid: 1fr ... */
  .fit-row > .fit-cat,
  .fit-row > .fit-desc {
    padding: 0.4rem 0;
    border-bottom: 0;
  }

  .fit-row > .fit-cat {
    padding-top: 1rem;
  }

  .fit-row > .fit-desc {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--c-border);
  }
}
```

- [ ] **Step 3: Nahradit závěrečnou CTA off-clock řádkem + CTA**

V `src/pages/index.astro` **před** `<CtaBand ...>` přidej off-clock řádek:

```astro
    <section class="offclock-line mb-24">
        <span class="offclock-kicker">Off the keyboard</span>
        <span>I'm a gamer, a heavy reader and a metalhead from the Krkonoše foothills.</span>
        <a href="/about" class="offclock-link">More about me →</a>
    </section>
```

- [ ] **Step 4: Styl off-clock řádku**

V `src/styles/global.css` přidej:

```css
.offclock-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.9rem;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  padding: 1.4rem 0;
  color: var(--c-text);
  font-size: 1.05rem;
  line-height: 1.6;
}

.offclock-kicker {
  color: var(--c-accent-3);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
}

.offclock-link {
  color: var(--c-accent-2);
  font-weight: 700;
  white-space: nowrap;
}

.offclock-link:hover {
  color: var(--c-accent);
}
```

- [ ] **Step 5: Build + vizuální kontrola**

Run: `npm run build` (projde). `npm run dev`, screenshot `http://localhost:4321/`. Ověř: žádný fake-kód, „Where I fit best" je dvousloupcový seznam, před CTA je jednořádkový off-clock se zeleným kickerem a odkazem.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "feat: drop fake-code, add off-clock line, voice copy (EN homepage)"
```

---

## Task 5: Status readout — data + komponenta + About hero/sekce (EN)

**Files:**
- Create: `src/data/now.ts`
- Create: `src/components/StatusReadout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Datový soubor**

`src/data/now.ts`:

```ts
export const now = {
  playing: "Saros (PS5)",
  reading: "Mycelium — Vilma Kadlečková",
  watching: "One Piece",
};
```

- [ ] **Step 2: Komponenta**

`src/components/StatusReadout.astro`:

```astro
---
import { now } from "@/data/now";
---

<div class="status-readout">
    <div class="sr-row"><span class="sr-key">now_playing</span><span class="sr-val">{now.playing}</span></div>
    <div class="sr-row"><span class="sr-key">now_reading</span><span class="sr-val">{now.reading}</span></div>
    <div class="sr-row"><span class="sr-key">now_watching</span><span class="sr-val">{now.watching}</span></div>
</div>
```

- [ ] **Step 3: Styly status readout**

V `src/styles/global.css` přidej:

```css
.status-readout {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  background: var(--c-card);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  max-width: 32rem;
}

.sr-row {
  display: flex;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border-bottom: 1px solid var(--c-border);
}

.sr-row:last-child {
  border-bottom: 0;
}

.sr-key {
  color: var(--c-accent-2);
  min-width: 8.5rem;
}

.sr-val {
  color: var(--c-text);
}
```

- [ ] **Step 4: Přidat fotku do About hero + import StatusReadout**

V `src/pages/about.astro` přidej do importů:

```astro
import StatusReadout from "@/components/StatusReadout.astro";
```

Uprav `<PageIntro ...>` (About) — přidej fotku:

```astro
    <PageIntro
        title="About"
        highlight="me"
        lead="Senior backend and integration engineer — Kotlin, Java, Spring, PostgreSQL and the production systems that run on them."
        body="I'm at my best where correctness, compatibility and release safety actually matter. My job isn't only writing backend code; it's owning the place where implementation, domain behaviour, integration contracts and production releases overlap. I like to help, I keep learning, and I try not to pretend to be more than I am."
        photo="/pavel.jpg"
        photoAlt="Pavel Kleisner"
    />
```

- [ ] **Step 5: Build + vizuální kontrola**

Run: `npm run build` (projde). `npm run dev`, screenshot `http://localhost:4321/about`. Ověř: About hero má fotku; komponenta StatusReadout zatím není v stránce vidět (vloží se v Tasku 6).

- [ ] **Step 6: Commit**

```bash
git add src/data/now.ts src/components/StatusReadout.astro src/styles/global.css src/pages/about.astro
git commit -m "feat: add status readout component and About hero photo (EN)"
```

---

## Task 6: About — plná sekce „Off the clock" + hlas (EN)

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Přepsat „How I think about software" do hlasu**

V `src/pages/about.astro` nech strukturu 3 InfoCards, ale přepiš texty:

```astro
            <InfoCard title="Small, explicit changes">
                In a live system a precisely named rule, an isolated mapping or one focused
                test usually beats a big rewrite. Less to go wrong at 2 a.m.
            </InfoCard>
            <InfoCard title="Modern when it pays off">
                I like new versions and tools — but only when they make the system more
                reliable, more observable or easier to change. Not for the CV.
            </InfoCard>
            <InfoCard title="It's not done at deploy">
                The real system starts after deployment: old data, retries, external
                contracts, logs, metrics and whoever has to support it.
            </InfoCard>
```

- [ ] **Step 2: Nahradit „Beyond code" sekci plnou „Off the clock"**

Najdi sekci `<section class="mb-24">` s `<SectionIntro title="Beyond code" />` a celou ji nahraď:

```astro
    <section class="mb-24">
        <SectionIntro
            title="Off the clock"
            body="I build things end to end partly because I genuinely enjoy this stuff. Here's the human behind the commits."
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InfoCard title="Reading & audiobooks">
                Around 125 books and counting — LitRPG (Vasily Mahanenko), a lot of Czech
                sci-fi/fantasy (Kotleta, Sněgoňová, Starý, Kadlečková, Stehlíková), plus
                Andy Weir, Liu Cixin, Sapkowski and Pratchett. I do most of it as audiobooks.
            </InfoCard>
            <InfoCard title="Anime">
                Grew up on the shounen Big 3 (Naruto, One Piece, Bleach). One Piece is the
                one still running — and I'm still watching.
            </InfoCard>
            <InfoCard title="Gaming">
                My main way to switch off. PlayStation 5, currently playing Saros.
            </InfoCard>
            <InfoCard title="Metal & coffee & bikes">
                Iron Maiden, Arch Enemy, Jinjer, HammerFall and friends in the headphones.
                Coffee ground fresh in a hand mill and brewed in a moka pot. A bike waiting
                for a rebuild. Cats and dogs both welcome.
            </InfoCard>
        </div>

        <p class="card-body mb-4">From Horní Radechová near Náchod, in the Krkonoše foothills.</p>
        <StatusReadout />
    </section>
```

- [ ] **Step 3: Build + vizuální kontrola**

Run: `npm run build` (projde). `npm run dev`, screenshot `http://localhost:4321/about`. Ověř: sekce „Off the clock" se 4 kartami + řádek o Podkrkonoší + mono status readout.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: full off-the-clock section and voice copy (EN About)"
```

---

## Task 7: Projects + Contact — hlas, bez ozdob (EN)

**Files:**
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Projects — přepsat lead/intro do hlasu**

V `src/pages/projects.astro` uprav `PageIntro`:

```astro
    <PageIntro
        title="Projects &"
        highlight="experience"
        lead="The systems that shaped how I work."
        body="Most of it is internal or client-owned, so the code isn't public. I describe the responsibility, the stack and the kind of problems I actually handled — not screenshots of code I can't show."
    />
```

- [ ] **Step 2: Contact — přepsat do hlasu**

V `src/pages/contact.astro` uprav `PageIntro` `lead` a `CtaBand`:

```astro
    <PageIntro
        title="Contact"
        lead="Backend work, integrations, release ownership, or a production issue that needs untangling? Email is the fastest way to me."
    />
```

`CtaBand`:

```astro
    <CtaBand
        title="Open to focused collaboration"
        body="I'm the best fit where backend behaviour, data, external contracts and production releases all matter at once. Clear scope, real responsibility and direct communication — that's where I do my best work."
        href="mailto:contact@pavelkleisner.dev"
        label="Send me an email"
    />
```

- [ ] **Step 3: Build + vizuální kontrola**

Run: `npm run build` (projde). Screenshot `http://localhost:4321/projects` a `/contact`. Ověř copy.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects.astro src/pages/contact.astro
git commit -m "feat: voice copy for projects and contact (EN)"
```

---

## Task 8: CZ homepage — zrcadlit Tasky 2–4

**Files:**
- Modify: `src/pages/cz/index.astro`

- [ ] **Step 1: Hero (fotka, hlas, bez statů)**

Nahraď `<PageIntro ...>...</PageIntro>` v `src/pages/cz/index.astro`:

```astro
    <PageIntro
        eyebrow="Senior Backend & Integration Engineer"
        title="Pavel Kleisner"
        lead="Backend, integrace a releasy — ta nezáživná část, kde se systém potká s reálnými daty a má zůstat naživu."
        body="Dělám Kotlin/Java/Spring služby a PostgreSQL, hlavně kolem TSM/CETIN produkčního flow: B2B chování, datová kompatibilita, incidenty a rollout nových verzí. Radši opravím produkci, než abych měl pravdu."
        photo="/pavel.jpg"
        photoAlt="Pavel Kleisner"
    >
        <div slot="actions" class="flex flex-wrap gap-3 mt-8">
            <a href="/cz/projekty" class="btn-primary">Zkušenosti</a>
            <a href="/cz/kontakt" class="btn-secondary">Kontakt</a>
        </div>
    </PageIntro>
```

- [ ] **Step 2: Import + war story (CZ)**

Přidej import `import WarStory from "@/components/WarStory.astro";`. Mezi „Kde dávám největší smysl" a „Hlavní stack" vlož:

```astro
    <WarStory kicker="War story · anonymně" title="UUID, které nebylo UUID">
        <p class="mb-4">
            Při rolloutu první verze platformy slibovala kuchařka <code>messageId</code> jako
            UUID. Jednomu partnerovi to začalo hned padat. Jejich systém si potichu parsoval ID
            ticketu <em>ze</em> starého formátu <code>idTicketu_timestamp</code> — přestože ID
            ticketu měli rovnou v těle zprávy.
        </p>
        <p>
            Čistá oprava byla na jejich straně, jenže v korporátu by trvala měsíce. Tak jsem naši
            stranu přizpůsobil zpět původnímu tvaru a nechal produkci běžet. Někdy správné řešení
            není to čisté — je to to, které ve dvě ráno nerozbije někoho jiného.
        </p>
    </WarStory>
```

- [ ] **Step 3: Odstranit fake-kód + off-clock řádek (CZ)**

V sekci „Kde dávám největší smysl" smaž všechny čtyři `<div class="fit-eg">...</div>`.

Před `<CtaBand ...>` přidej:

```astro
    <section class="offclock-line mb-24">
        <span class="offclock-kicker">Mimo klávesnici</span>
        <span>Hráč, čtenář a metalista z Podkrkonoší.</span>
        <a href="/cz/o-mne" class="offclock-link">Víc o mně →</a>
    </section>
```

- [ ] **Step 4: Build + vizuální kontrola**

Run: `npm run build` (projde). Screenshot `http://localhost:4321/cz`. Ověř shodu s EN homepage (fotka, war story, off-clock, bez fake-kódu).

- [ ] **Step 5: Commit**

```bash
git add src/pages/cz/index.astro
git commit -m "feat: CZ homepage parity (hero, war story, off-clock, voice)"
```

---

## Task 9: CZ About (`o-mne`) — zrcadlit Tasky 5–6

**Files:**
- Modify: `src/pages/cz/o-mne.astro`

- [ ] **Step 1: Import StatusReadout + fotka v hero**

Přidej `import StatusReadout from "@/components/StatusReadout.astro";`. Uprav `PageIntro`:

```astro
    <PageIntro
        title="O"
        highlight="mně"
        lead="Senior backend a integrační vývojář — Kotlin, Java, Spring, PostgreSQL a produkční systémy, co na nich běží."
        body="Nejlíp mi je tam, kde fakt záleží na správnosti, kompatibilitě a bezpečnosti releasů. Není to jen psaní backendu — je to vlastnictví místa, kde se potká implementace, doménové chování, integrační kontrakty a produkční nasazení. Rád pomáhám, pořád se učím a nehraju si na víc, než jsem."
        photo="/pavel.jpg"
        photoAlt="Pavel Kleisner"
    />
```

> Pozn.: pokud `cz/o-mne.astro` dnes nemá `highlight`, přidej ho do `PageIntro` props (komponenta ho podporuje).

- [ ] **Step 2: Přepsat „Jak přemýšlím o softwaru" (3 karty)**

Najdi sekci s 3 InfoCards o přemýšlení a přepiš texty:

```astro
            <InfoCard title="Malé, jasné změny">
                V živém systému většinou přesně pojmenované pravidlo, izolovaný mapping nebo
                jeden cílený test porazí velký rewrite. Míň věcí, co se ve dvě ráno rozbije.
            </InfoCard>
            <InfoCard title="Moderní, když se to vyplatí">
                Mám rád nové verze a nástroje — ale jen když dělají systém spolehlivější,
                přehlednější nebo snazší na změnu. Ne kvůli životopisu.
            </InfoCard>
            <InfoCard title="Nasazením to nekončí">
                Skutečný systém začíná po nasazení: stará data, retry, externí kontrakty,
                logy, metriky a ten, kdo to bude supportovat.
            </InfoCard>
```

- [ ] **Step 3: Nahradit „Beyond code"/„Mimo kód" plnou „Mimo práci"**

Najdi sekci s `SectionIntro title="Beyond code"` (nebo CZ ekvivalent) a nahraď:

```astro
    <section class="mb-24">
        <SectionIntro
            title="Mimo práci"
            body="Stavím věci od začátku do konce i proto, že mě to baví. Tady je člověk za commity."
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InfoCard title="Čtení & audioknihy">
                Asi 125 knih a přibývá — LitRPG (Vasily Mahanenko), spousta české sci-fi/fantasy
                (Kotleta, Sněgoňová, Starý, Kadlečková, Stehlíková) a k tomu Andy Weir, Liu Cixin,
                Sapkowski a Pratchett. Většinu poslouchám jako audioknihy.
            </InfoCard>
            <InfoCard title="Anime">
                Vyrostl jsem na shounen Big 3 (Naruto, One Piece, Bleach). One Piece pořád běží —
                a já se pořád dívám.
            </InfoCard>
            <InfoCard title="Hraní">
                Hlavní způsob, jak vypnout. PlayStation 5, teď hraju Saros.
            </InfoCard>
            <InfoCard title="Metal & kafe & kolo">
                Iron Maiden, Arch Enemy, Jinjer, HammerFall a spol. ve sluchátkách. Kafe čerstvě
                namleté v ručním mlýnku a uvařené v moka konvičce. Kolo, co čeká na repas. Kočky
                i psi vítáni.
            </InfoCard>
        </div>

        <p class="card-body mb-4">Z Horní Radechové u Náchoda, v Podkrkonoší.</p>
        <StatusReadout />
    </section>
```

- [ ] **Step 4: Build + vizuální kontrola**

Run: `npm run build` (projde). Screenshot `http://localhost:4321/cz/o-mne`. Ověř shodu s EN About.

- [ ] **Step 5: Commit**

```bash
git add src/pages/cz/o-mne.astro
git commit -m "feat: CZ About parity (off the clock, status readout, voice)"
```

---

## Task 10: CZ Projects + Contact — zrcadlit Task 7

**Files:**
- Modify: `src/pages/cz/projekty.astro`
- Modify: `src/pages/cz/kontakt.astro`

- [ ] **Step 1: `cz/projekty.astro` — lead/body**

```astro
    <PageIntro
        title="Projekty &"
        highlight="zkušenosti"
        lead="Systémy, které zformovaly, jak pracuju."
        body="Většina je interní nebo klientská, takže kód není veřejný. Popisuju odpovědnost, stack a typ problémů, které jsem reálně řešil — ne screenshoty kódu, který stejně nemůžu ukázat."
    />
```

> Pozn.: pokud stránka dnes nepoužívá `highlight`, přidej ho.

- [ ] **Step 2: `cz/kontakt.astro` — lead + CtaBand**

```astro
    <PageIntro
        title="Kontakt"
        lead="Backend, integrace, vlastnictví releasů nebo produkční problém, co potřebuje rozmotat? E-mail je ke mně nejrychlejší cesta."
    />
```

```astro
    <CtaBand
        title="Otevřený cílené spolupráci"
        body="Nejvíc sedím tam, kde najednou záleží na backendovém chování, datech, externích kontraktech i produkčních releasech. Jasný scope, reálná odpovědnost a přímá komunikace — tam odvádím nejlepší práci."
        href="mailto:contact@pavelkleisner.dev"
        label="Napiš mi e-mail"
    />
```

- [ ] **Step 3: Build + vizuální kontrola**

Run: `npm run build` (projde). Screenshot `http://localhost:4321/cz/projekty` a `/cz/kontakt`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/cz/projekty.astro src/pages/cz/kontakt.astro
git commit -m "feat: CZ projects and contact voice copy"
```

---

## Task 11: Finální průchod — oba motivy, mobil, meta

**Files:**
- Modify (dle nálezů): `src/pages/*`, `src/styles/global.css`

- [ ] **Step 1: Build celého webu**

Run: `npm run build`
Expected: projde, žádné varování o chybějících assetech (`/pavel.jpg` existuje).

- [ ] **Step 2: Vizuální kontrola obou motivů + mobilu**

`npm run dev`. Přes Playwright MCP projdi `/`, `/about`, `/projects`, `/contact` a CZ ekvivalenty:
- Přepni motiv (tlačítko v hlavičce ukládá `pavelkleisner-theme` do localStorage) a screenshotni `void` i `paper` na homepage a About.
- `browser_resize` na 390×844 (mobil), screenshot homepage + About. Ověř: fotka v heru se neroztahuje, off-clock řádek se zalamuje, war story čitelná, status readout nepřetéká.

Oprav případné rozbité rozložení v `global.css` (media queries) inline a znovu ověř.

- [ ] **Step 3: Zkontrolovat meta/OG**

Ověř, že `Layout.astro` defaultní popis stále sedí (zmiňuje backend/integrace) a `personSchema` je pravdivý. Žádná změna není nutná, pokud copy nezměnil zásadně positioning. (OG obrázek `og-image.png` ponech.)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final pass — themes, mobile, meta review"
```

---

## Self-Review (autor plánu)

- **Spec coverage:** hero bez statů + fotka (T1,T2,T8) ✓; war story anonymně (T3,T8) ✓; co umím bez fake-kódu (T4,T8) ✓; off-clock řádek na homepage (T4,T8) ✓; status readout jen na About (T5,T6,T9) ✓; plná „Mimo práci" bez čísla epizod (T6,T9) ✓; hlas/copy EN+CZ (všechny tasky) ✓; zelený akcent + editorial/terminál blend (T1 + styly) ✓; oba motivy + mobil (T11) ✓; projects/contact refresh (T7,T10) ✓; bez fake-kódu i jinde (T4 — `.fit-eg` jediný výskyt) ✓.
- **Placeholdery:** žádné TBD; veškerý copy a CSS je konkrétní.
- **Typová/název konzistence:** `photo`/`photoAlt` props (T1) použity stejně v T2/T5/T8/T9; `now` objekt (T5) klíče `playing/reading/watching` použity v StatusReadout; `.fit-eg` odstraněn ve stylu i markupu společně (T4).
