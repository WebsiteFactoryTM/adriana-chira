# Comparația vizuală cu designul aprobat

Testul de acceptanță al fazei de UI (`../../../03-PROMPT-CLAUDE-CODE.md` §0):
homepage-ul randat și `../homepage-approved.html` trebuie să fie indistinctibile
la **375px, 768px și 1440px**.

`compare.html` încarcă ambele pagini în două `<iframe>` de aceeași lățime, în
același document. Fiind same-origin, poate măsura ambele DOM-uri și le poate
compara nod cu text lângă nod cu text: poziție, dimensiune, `font-size`,
`line-height`, `font-weight`, `color`, `letter-spacing`.

## Cum se rulează

```bash
# 1. Copiază designul și harnessul în public/ (temporar — NU se comite)
mkdir -p public/__ref
cp -r design/homepage-approved.html design/support.js design/assets public/__ref/
cp design/compare/compare.html public/__ref/

# 2. Build de PRODUCȚIE, nu dev — vezi capcana de mai jos
pnpm build && pnpm start

# 3. Deschide http://localhost:3000/__ref/compare.html
```

În consolă:

```js
await setW(390, 844)   // lățime iframe = viewport + 15px scrollbar → 375px
heights()              // înălțimile celor 12 secțiuni, design vs implementare
sect('#servicii')      // diferențele nod cu nod dintr-o secțiune
scrollBoth(3400)       // derulează ambele iframe-uri sincron, pentru captură
setScale(0.47)         // micșorează ambele coloane ca să încapă la 1440px
```

Lățimile de test: `setW(390, …)` → 375px, `setW(783, …)` → 768px,
`setW(1440, …)` → 1425px de layout. `innerWidth` include bara de derulare,
deci se adaugă 15px la lățimea dorită.

## Capcane

**Rulează pe build de producție.** În `next dev`, dacă deschizi site-ul prin
altceva decât `localhost` (de ex. IP-ul din rețea), Next blochează resursele de
dev cross-origin și **hidratarea nu se produce**: meniul mobil nu se deschide,
bara de consimțământ nu apare. Nu e un bug al site-ului. Mesajul apare în logul
serverului, nu în consola browserului.

**Șterge `public/__ref/` înainte de commit.** Altfel ajunge în build.
