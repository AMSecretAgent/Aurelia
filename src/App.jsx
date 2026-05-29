import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   AURÉLIA — Maison de Couture
   An ultra-luxury fashion app. Editorial noir, champagne gold.
   ============================================================ */

const C = {
  noir: "#0B0A09",
  noirSoft: "#141210",
  ivory: "#F2ECE1",
  ivoryDim: "rgba(242,236,225,0.55)",
  ivoryFaint: "rgba(242,236,225,0.32)",
  gold: "#C2A574",
  goldBright: "#DCC18C",
  line: "rgba(242,236,225,0.12)",
  lineSoft: "rgba(242,236,225,0.07)",
};

/* ---- swatch palette (procedural "fabrics") ---- */
const SWATCH = {
  noir:    { bg: "radial-gradient(130% 130% at 28% 18%, #2b2620 0%, #110f0c 48%, #060504 100%)", dark: false },
  onyx:    { bg: "radial-gradient(130% 130% at 72% 14%, #3c3c40 0%, #17181b 52%, #0a0a0b 100%)", dark: false },
  burgundy:{ bg: "radial-gradient(130% 130% at 66% 18%, #6f2333 0%, #45131f 52%, #280b12 100%)", dark: false },
  cognac:  { bg: "radial-gradient(130% 130% at 34% 22%, #ad7641 0%, #6e421f 55%, #3f2410 100%)", dark: false },
  forest:  { bg: "radial-gradient(130% 130% at 64% 18%, #314c3d 0%, #1b2d24 55%, #0d1712 100%)", dark: false },
  ivory:   { bg: "radial-gradient(130% 130% at 30% 20%, #f8f3e9 0%, #e7ddca 56%, #d6c9b1 100%)", dark: true },
  pearl:   { bg: "radial-gradient(130% 130% at 40% 24%, #fcf9f2 0%, #efe7d8 52%, #e0d3bf 100%)", dark: true },
  gold:    { bg: "radial-gradient(130% 130% at 40% 18%, #ecd6a1 0%, #c2a574 52%, #8a6f44 100%)", dark: true },
  blush:   { bg: "radial-gradient(130% 130% at 34% 24%, #eed5ce 0%, #d8b3a8 55%, #b88c7f 100%)", dark: true },
};

const PRODUCTS = [
  { id: "p1", name: "Nocturne", sub: "Robe du Soir", line: "Atelier", cat: "Eveningwear",
    price: null, priceLabel: "Sur mesure",
    mat: "Silk duchesse · hand-pleated bodice · 312 hours",
    note: "Cut from a single bolt of midnight duchesse, the Nocturne is draped to the figure across three fittings. The pleats are folded by hand and pressed with a cool iron over twelve days.",
    swatch: "noir", seed: 7 },
  { id: "p2", name: "Le Smoking", sub: "Veste de Soirée", line: "Heritage", cat: "Tailoring",
    price: 6400, priceLabel: null,
    mat: "Wool grain de poudre · silk satin revers · canvassed by hand",
    note: "The house's signature tuxedo, unchanged in silhouette since 1971. A fully floating canvas allows the jacket to settle into the wearer over a single season.",
    swatch: "onyx", seed: 21 },
  { id: "p3", name: "Aurélia", sub: "Manteau Portefeuille", line: "Maison", cat: "Outerwear",
    price: 4200, priceLabel: null,
    mat: "Double-faced cashmere · 12-gauge · no lining, no seams shown",
    note: "Two layers of cashmere joined entirely by hand so that no stitch appears on either face. The coat is reversible and weightless against the shoulder.",
    swatch: "ivory", seed: 4 },
  { id: "p4", name: "Velours", sub: "Manteau d'Opéra", line: "Atelier", cat: "Outerwear",
    price: 5600, priceLabel: null,
    mat: "Silk velvet · ciselé · cut on the cross",
    note: "An opera coat in deep bordeaux silk velvet, the pile brushed in a single direction so that the colour shifts as you move beneath the lights.",
    swatch: "burgundy", seed: 33 },
  { id: "p5", name: "Élan", sub: "Sac à Main", line: "Maison", cat: "Leather",
    price: 4700, priceLabel: null,
    mat: "Box calf · hand-burnished edges · solid brass clasp",
    note: "A structured top-handle in glazed box calf, the edges painted and burnished through nine passes. Each clasp is filed to its case by a single artisan.",
    swatch: "cognac", seed: 12 },
  { id: "p6", name: "Soir", sub: "Minaudière", line: "Atelier", cat: "Leather",
    price: 2900, priceLabel: null,
    mat: "Lacquered shell · hand-set onyx clasp · silk faille interior",
    note: "An evening minaudière in seventeen coats of lacquer, polished to a depth of black that reads almost wet under candlelight.",
    swatch: "gold", seed: 9 },
  { id: "p7", name: "Plissé", sub: "Chemisier de Soie", line: "Maison", cat: "Eveningwear",
    price: 1650, priceLabel: null,
    mat: "Silk crêpe de chine · accordion pleat · mother-of-pearl",
    note: "A fluid blouse in permanently pleated silk, set on the bias so it moves as a second skin rather than a garment.",
    swatch: "blush", seed: 18 },
  { id: "p8", name: "Séraphine", sub: "Robe de Mariée", line: "Atelier", cat: "Eveningwear",
    price: null, priceLabel: "Price upon request",
    mat: "Silk gazar · hand-embroidered seed pearl · 600+ hours",
    note: "The bridal commission. Embroidered entirely in the house ateliers over a season, the Séraphine is realised through five fittings and never repeated.",
    swatch: "pearl", seed: 41 },
  { id: "p9", name: "Cachemire", sub: "Col Roulé", line: "Maison", cat: "Knitwear",
    price: 1200, priceLabel: null,
    mat: "Mongolian cashmere · 2-ply · fully fashioned",
    note: "A roundneck knit from long-staple cashmere combed once a year, fashioned on the body so the shoulders are shaped, never cut.",
    swatch: "forest", seed: 28 },
];

const CATS = ["All", "Eveningwear", "Tailoring", "Outerwear", "Leather", "Knitwear"];

const fmt = (n) =>
  "€" + n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }).replace(/\u202f/g, " ");

/* ---- tiny seeded PRNG for fabric strokes ---- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Fabric({ seed = 1, dark = false }) {
  const rnd = mulberry32(seed * 2654435761);
  const stroke = dark ? "rgba(11,10,9,0.16)" : "rgba(220,193,140,0.20)";
  const lines = 6;
  const paths = [];
  for (let i = 0; i < lines; i++) {
    const y = (12 + (i * (140 - 24)) / (lines - 1)) + (rnd() - 0.5) * 8;
    const a = y + (rnd() - 0.5) * 26;
    const b = y + (rnd() - 0.5) * 26;
    const c = y + (rnd() - 0.5) * 26;
    paths.push(`M -8 ${y.toFixed(1)} C 25 ${a.toFixed(1)}, 55 ${b.toFixed(1)}, 108 ${c.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 100 140" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={stroke}
          strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

function Grain({ opacity = 0.06 }) {
  const noise =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `url("${noise}")`, opacity, mixBlendMode: "overlay",
    }} />
  );
}

/* ---- brand mark ---- */
function Monogram({ size = 22, color = C.gold }) {
  return (
    <span style={{
      fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
      fontSize: size, color, lineHeight: 1, letterSpacing: "0.02em",
      fontStyle: "italic",
    }}>A</span>
  );
}

/* ---- line icons ---- */
const Icon = ({ name, active }) => {
  const col = active ? C.gold : C.ivoryDim;
  const p = { fill: "none", stroke: col, strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" };
  const s = { width: 22, height: 22, display: "block" };
  switch (name) {
    case "maison":
      return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M4 11l8-6 8 6" /><path {...p} d="M6 10v9h12v-9" /><path {...p} d="M10.5 19v-4h3v4" /></svg>;
    case "shop":
      return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M5 8h14l-1 11H6L5 8z" /><path {...p} d="M9 8a3 3 0 0 1 6 0" /></svg>;
    case "atelier":
      return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="7" cy="7" r="2.4" /><circle {...p} cx="7" cy="17" r="2.4" /><path {...p} d="M9 8.5L20 18M9 15.5L20 6" /></svg>;
    case "bag":
      return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M6 8h12l-1 12H7L6 8z" /><path {...p} d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" /></svg>;
    case "circle":
      return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 4l2.2 5.4L20 10l-4 3.8 1 5.7-5-3-5 3 1-5.7L4 10l5.8-.6z" /></svg>;
    case "back":
      return <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24"><path {...p} d="M15 5l-7 7 7 7" /></svg>;
    case "heart":
      return <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24"><path fill={active ? C.gold : "none"} stroke={active ? C.gold : C.ivory} strokeWidth="1.3" d="M12 20s-7-4.3-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7-2.2C19 10.7 12 20 12 20z" /></svg>;
    case "close":
      return <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24"><path {...p} d="M6 6l12 12M18 6L6 18" /></svg>;
    default: return null;
  }
};

/* ============================================================ */

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [prev, setPrev] = useState("home");
  const [product, setProduct] = useState(null);
  const [bag, setBag] = useState([]);
  const [saved, setSaved] = useState(() => new Set());
  const [cat, setCat] = useState("All");
  const [toast, setToast] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("home"), 3000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen, product]);

  const go = (s) => { setPrev(screen); setScreen(s); };
  const openProduct = (p) => { setProduct(p); go("product"); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  const addToBag = (p) => {
    setBag((b) => [...b, { ...p, key: p.id + "-" + Date.now() }]);
    showToast("Added to your bag");
  };
  const toggleSave = (id) => {
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const subtotal = bag.reduce((s, p) => s + (p.price || 0), 0);

  return (
    <div style={styles.stage}>
      <style>{CSS}</style>

      {/* ambient backdrop */}
      <div style={styles.ambient} />
      <Grain opacity={0.05} />

      {/* phone */}
      <div style={styles.phone}>
        <div style={styles.bezelGlow} />
        <div style={styles.screenInner}>
          {/* status bar */}
          {screen !== "splash" && (
            <div style={styles.statusBar}>
              <span>9:41</span>
              <span style={{ letterSpacing: "0.3em", fontSize: 9 }}>AURÉLIA</span>
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={styles.signal} /><span style={styles.batt} />
              </span>
            </div>
          )}

          {/* top bar */}
          {screen !== "splash" && screen !== "product" && (
            <header style={styles.topBar}>
              <Monogram size={20} />
              <div style={styles.wordmark}>AURÉLIA</div>
              <button onClick={() => go("bag")} style={styles.bagBtn} aria-label="Bag">
                <Icon name="bag" />
                {bag.length > 0 && <span style={styles.bagDot}>{bag.length}</span>}
              </button>
            </header>
          )}

          {/* scroll body */}
          <main ref={scrollRef} className="scroll" style={styles.body}>
            {screen === "splash" && <Splash />}
            {screen === "home" && (
              <Home key="home" onShop={() => go("shop")} onAtelier={() => go("atelier")}
                onCircle={() => go("circle")} onOpen={openProduct} saved={saved} onSave={toggleSave} />
            )}
            {screen === "shop" && (
              <Shop key="shop" cat={cat} setCat={setCat} onOpen={openProduct}
                saved={saved} onSave={toggleSave} />
            )}
            {screen === "product" && product && (
              <Product key={product.id} p={product} onBack={() => go(prev === "product" ? "shop" : prev)}
                onAdd={addToBag} saved={saved.has(product.id)} onSave={() => toggleSave(product.id)} />
            )}
            {screen === "atelier" && <Atelier key="atelier" onRequest={() => showToast("Request received — Camille will write within 24h")} />}
            {screen === "bag" && (
              <Bag key="bag" bag={bag} subtotal={subtotal}
                onRemove={(k) => setBag((b) => b.filter((x) => x.key !== k))}
                onShop={() => go("shop")} onCheckout={() => showToast("Checkout is a preview")} />
            )}
            {screen === "circle" && (
              <Circle key="circle" saved={saved} bag={bag}
                onConcierge={() => go("atelier")} onShop={() => go("shop")} />
            )}
          </main>

          {/* bottom nav */}
          {screen !== "splash" && screen !== "product" && (
            <nav style={styles.nav}>
              {[
                ["home", "maison", "Maison"],
                ["shop", "shop", "Collection"],
                ["atelier", "atelier", "Atelier"],
                ["bag", "bag", "Bag"],
                ["circle", "circle", "Circle"],
              ].map(([key, icon, label]) => (
                <button key={key} onClick={() => go(key)} style={styles.navBtn}>
                  <Icon name={icon} active={screen === key} />
                  <span style={{ ...styles.navLabel, color: screen === key ? C.gold : C.ivoryFaint }}>{label}</span>
                  {key === "bag" && bag.length > 0 && <span style={styles.navBagDot} />}
                </button>
              ))}
            </nav>
          )}

          {/* toast */}
          {toast && <div className="toast" style={styles.toast}>{toast}</div>}
        </div>
      </div>

      <div style={styles.caption}>AURÉLIA — Maison de Couture · Paris</div>
    </div>
  );
}

/* ---------------- SPLASH ---------------- */
function Splash() {
  return (
    <div style={styles.splash}>
      <Grain opacity={0.07} />
      <div className="splashMark" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: 64, color: C.gold, lineHeight: 1, fontWeight: 500 }}>A</div>
        <div className="drawline" style={styles.splashLine} />
        <div style={styles.splashWord}>AURÉLIA</div>
        <div className="fadeDelay" style={styles.splashTag}>MAISON DE COUTURE</div>
      </div>
      <div className="fadeDelay2" style={styles.splashFoot}>
        <span style={{ color: C.gold }}>◆</span> BY INVITATION · ÉTÉ MMXXVI
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */
function Home({ onShop, onAtelier, onCircle, onOpen, saved, onSave }) {
  const featured = PRODUCTS.slice(0, 5);
  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      {/* hero */}
      <section style={{ position: "relative", height: 420, ...sw("noir") }}
        onClick={onShop} className="press">
        <Fabric seed={3} />
        <Grain opacity={0.08} />
        <div style={styles.heroGrad} />
        <div style={styles.heroInner}>
          <div className="rise" style={styles.kicker}>THE COLLECTION · ÉTÉ 2026</div>
          <h1 className="rise d1" style={styles.heroTitle}>Le<br />Crépuscule</h1>
          <div className="rise d2" style={styles.heroSub}>
            Forty-one pieces, drawn at dusk. Eveningwear, tailoring and the leather atelier.
          </div>
          <div className="rise d3" style={styles.heroCta}>DISCOVER&nbsp;&nbsp;—</div>
        </div>
      </section>

      {/* selects */}
      <section style={{ padding: "30px 22px 8px" }}>
        <Heading label="MAISON SELECTS" title="Chosen for the season" />
      </section>
      <div className="scroll-x" style={styles.hStrip}>
        {featured.map((p, i) => (
          <button key={p.id} onClick={() => onOpen(p)} className="press" style={styles.hCard}>
            <div style={{ position: "relative", height: 230, ...sw(p.swatch), borderRadius: 2, overflow: "hidden" }}>
              <Fabric seed={p.seed} dark={SWATCH[p.swatch].dark} />
              <Grain opacity={0.07} />
              <SaveBtn active={saved.has(p.id)} onClick={(e) => { e.stopPropagation(); onSave(p.id); }} dark={SWATCH[p.swatch].dark} />
            </div>
            <div style={styles.hMeta}>
              <div style={styles.pName}>{p.name}</div>
              <div style={styles.pSub}>{p.sub}</div>
              <div style={styles.pPrice}>{p.price ? fmt(p.price) : p.priceLabel}</div>
            </div>
          </button>
        ))}
      </div>

      {/* atelier band */}
      <Band swatch="burgundy" seed={33} kicker="L'ATELIER" title="Made to your measure"
        body="Begin a private commission with the house ateliers. Eveningwear, tailoring, bridal and leather — by appointment only."
        cta="ENTER THE ATELIER" onClick={onAtelier} />

      {/* circle band */}
      <Band swatch="gold" seed={9} dark kicker="NOIR CIRCLE" title="A standing invitation"
        body="Founding members receive a dedicated concierge, first viewings of each collection, and lifetime atelier care for every piece."
        cta="VIEW YOUR CIRCLE" onClick={onCircle} />

      <footer style={styles.footer}>
        <Monogram size={26} />
        <div style={styles.footCities}>PARIS · MILANO · NEW YORK · TŌKYŌ</div>
        <div style={styles.footFine}>© MMXXVI AURÉLIA · MAISON DE COUTURE</div>
      </footer>
    </div>
  );
}

/* ---------------- SHOP ---------------- */
function Shop({ cat, setCat, onOpen, saved, onSave }) {
  const list = cat === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "22px 22px 6px" }}>
        <Heading label="ÉTÉ 2026" title="The Collection" />
      </div>
      <div className="scroll-x" style={styles.chips}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{ ...styles.chip, ...(cat === c ? styles.chipOn : {}) }}>{c}</button>
        ))}
      </div>
      <div style={styles.grid}>
        {list.map((p) => (
          <button key={p.id} onClick={() => onOpen(p)} className="press fadeUp" style={styles.gCard}>
            <div style={{ position: "relative", height: 220, ...sw(p.swatch), borderRadius: 2, overflow: "hidden" }}>
              <Fabric seed={p.seed} dark={SWATCH[p.swatch].dark} />
              <Grain opacity={0.07} />
              <SaveBtn active={saved.has(p.id)} onClick={(e) => { e.stopPropagation(); onSave(p.id); }} dark={SWATCH[p.swatch].dark} />
              <span style={{ ...styles.lineTag, color: SWATCH[p.swatch].dark ? C.noir : C.ivory }}>{p.line}</span>
            </div>
            <div style={{ paddingTop: 10 }}>
              <div style={styles.pName}>{p.name}</div>
              <div style={styles.pSub}>{p.sub}</div>
              <div style={styles.pPrice}>{p.price ? fmt(p.price) : p.priceLabel}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PRODUCT ---------------- */
function Product({ p, onBack, onAdd, saved, onSave }) {
  const [openNote, setOpenNote] = useState(true);
  const dark = SWATCH[p.swatch].dark;
  const surMesure = !p.price;
  return (
    <div className="screen">
      <div style={{ position: "relative", height: 470, ...sw(p.swatch), overflow: "hidden" }}>
        <Fabric seed={p.seed} dark={dark} />
        <Grain opacity={0.08} />
        <button onClick={onBack} style={{ ...styles.pBack, color: dark ? C.noir : C.ivory,
          borderColor: dark ? "rgba(11,10,9,0.25)" : "rgba(242,236,225,0.3)" }}>
          <Icon name="back" /> 
        </button>
        <SaveBtn active={saved} onClick={onSave} dark={dark} big />
        <div style={styles.pHeroBottom}>
          <div style={{ ...styles.pHeroLine, color: dark ? "rgba(11,10,9,0.6)" : C.ivoryDim }}>{p.line.toUpperCase()}</div>
          <div style={{ ...styles.pHeroName, color: dark ? C.noir : C.ivory }}>{p.name}</div>
          <div style={{ ...styles.pHeroSub, color: dark ? "rgba(11,10,9,0.7)" : C.ivoryDim }}>{p.sub}</div>
        </div>
      </div>

      <div style={{ padding: "24px 24px 140px" }}>
        <div style={styles.priceRow}>
          <span style={styles.bigPrice}>{p.price ? fmt(p.price) : p.priceLabel}</span>
          <span style={styles.catTag}>{p.cat}</span>
        </div>

        <div style={styles.matBlock}>{p.mat}</div>

        <button onClick={() => setOpenNote(!openNote)} style={styles.noteToggle}>
          <span>ATELIER NOTE</span>
          <span style={{ color: C.gold }}>{openNote ? "—" : "+"}</span>
        </button>
        <div style={{ maxHeight: openNote ? 220 : 0, overflow: "hidden", transition: "max-height .45s ease" }}>
          <p style={styles.note}>{p.note}</p>
        </div>

        <div style={styles.specGrid}>
          <Spec k="Made in" v="Paris, 1er" />
          <Spec k="Lead time" v={surMesure ? "1 season" : "Ready"} />
          <Spec k="Care" v="Lifetime atelier" />
          <Spec k="Sizing" v="By appointment" />
        </div>

        <div style={styles.delivery}>
          <span style={{ color: C.gold }}>◆</span>&nbsp; Complimentary white-glove delivery & gift wrapping worldwide.
        </div>
      </div>

      {/* sticky CTA */}
      <div style={styles.stickyBar}>
        {surMesure ? (
          <button onClick={() => onAdd(p)} className="press" style={styles.ctaPrimary}>
            REQUEST AN APPOINTMENT
          </button>
        ) : (
          <button onClick={() => onAdd(p)} className="press" style={styles.ctaPrimary}>
            ADD TO BAG &nbsp;·&nbsp; {fmt(p.price)}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- ATELIER ---------------- */
function Atelier({ onRequest }) {
  const cats = [
    ["Eveningwear", "Gowns & robes du soir, draped to the figure"],
    ["Tailoring", "Le Smoking, suiting & the canvassed jacket"],
    ["Bridal", "The Séraphine commission, never repeated"],
    ["Leather", "Bespoke bags & small leather goods"],
  ];
  const [chosen, setChosen] = useState(null);
  const [thread, setThread] = useState([
    { who: "c", t: "Bonjour. I am Camille, your private concierge at the house. How may the ateliers serve you?" },
  ]);
  const pick = (name) => {
    setChosen(name);
    setThread((t) => [
      ...t,
      { who: "u", t: `I would like to begin a ${name.toLowerCase()} commission.` },
      { who: "c", t: `With pleasure. Our ${name.toLowerCase()} atelier works through three to five fittings over a single season. May I arrange a first appointment at the Paris salon?` },
    ]);
  };
  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <section style={{ position: "relative", height: 300, ...sw("noir") }}>
        <Fabric seed={51} />
        <Grain opacity={0.08} />
        <div style={styles.heroGrad} />
        <div style={{ position: "absolute", bottom: 26, left: 24, right: 24 }}>
          <div style={styles.kicker}>BESPOKE · BY APPOINTMENT</div>
          <h1 style={{ ...styles.heroTitle, fontSize: 52 }}>L'Atelier</h1>
          <div style={styles.heroSub}>Where a measurement becomes a garment, and a garment becomes yours alone.</div>
        </div>
      </section>

      <section style={{ padding: "26px 22px 8px" }}>
        <Heading label="BEGIN A COMMISSION" title="Choose your atelier" />
      </section>
      <div style={{ padding: "0 22px" }}>
        {cats.map(([name, desc]) => (
          <button key={name} onClick={() => pick(name)} className="press"
            style={{ ...styles.atelierRow, borderColor: chosen === name ? C.gold : C.line }}>
            <div>
              <div style={{ ...styles.atelierName, color: chosen === name ? C.gold : C.ivory }}>{name}</div>
              <div style={styles.atelierDesc}>{desc}</div>
            </div>
            <span style={{ color: chosen === name ? C.gold : C.ivoryFaint, fontFamily: "'Cormorant Garamond',serif", fontSize: 22 }}>→</span>
          </button>
        ))}
      </div>

      {/* concierge thread */}
      <section style={{ padding: "26px 22px 8px" }}>
        <Heading label="YOUR CONCIERGE" title="Camille Beaumont" />
      </section>
      <div style={{ padding: "0 22px" }}>
        {thread.map((m, i) => (
          <div key={i} className="fadeUp" style={{ display: "flex", justifyContent: m.who === "c" ? "flex-start" : "flex-end", marginBottom: 10 }}>
            <div style={m.who === "c" ? styles.msgC : styles.msgU}>{m.t}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        <button onClick={onRequest} className="press" style={styles.ctaPrimary}>
          REQUEST A PRIVATE APPOINTMENT
        </button>
        <div style={styles.salonNote}>Salons in Paris · Milano · New York · Tōkyō</div>
      </div>
    </div>
  );
}

/* ---------------- BAG ---------------- */
function Bag({ bag, subtotal, onRemove, onShop, onCheckout }) {
  if (bag.length === 0) {
    return (
      <div className="screen" style={styles.empty}>
        <Monogram size={40} />
        <div style={styles.emptyTitle}>Your bag awaits<br />its first treasure</div>
        <div style={styles.emptySub}>Each piece is held with complimentary white-glove care.</div>
        <button onClick={onShop} className="press" style={styles.ctaOutline}>EXPLORE THE COLLECTION</button>
      </div>
    );
  }
  return (
    <div className="screen" style={{ paddingBottom: 180 }}>
      <div style={{ padding: "22px 22px 14px" }}>
        <Heading label={`${bag.length} PIECE${bag.length > 1 ? "S" : ""}`} title="Your Bag" />
      </div>
      <div style={{ padding: "0 22px" }}>
        {bag.map((p) => (
          <div key={p.key} className="fadeUp" style={styles.bagItem}>
            <div style={{ position: "relative", width: 70, height: 90, ...sw(p.swatch), borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
              <Fabric seed={p.seed} dark={SWATCH[p.swatch].dark} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.pName}>{p.name}</div>
              <div style={styles.pSub}>{p.sub}</div>
              <div style={{ ...styles.pPrice, marginTop: 8 }}>{p.price ? fmt(p.price) : p.priceLabel}</div>
            </div>
            <button onClick={() => onRemove(p.key)} style={styles.removeBtn}><Icon name="close" /></button>
          </div>
        ))}
      </div>

      <div style={styles.summary}>
        <Row k="Subtotal" v={fmt(subtotal)} />
        <Row k="White-glove delivery" v="Complimentary" gold />
        <Row k="Gift wrapping" v="Included" gold />
        <div style={styles.summaryLine} />
        <Row k="Total" v={fmt(subtotal)} big />
      </div>

      <div style={styles.stickyBar}>
        <button onClick={onCheckout} className="press" style={styles.ctaPrimary}>PROCEED TO CHECKOUT</button>
      </div>
    </div>
  );
}

/* ---------------- CIRCLE ---------------- */
function Circle({ saved, bag, onConcierge, onShop }) {
  const savedList = PRODUCTS.filter((p) => saved.has(p.id));
  return (
    <div className="screen" style={{ paddingBottom: 30 }}>
      <div style={{ padding: "22px 22px 16px" }}>
        <Heading label="MEMBERSHIP" title="Noir Circle" />
      </div>

      {/* member card */}
      <div style={{ padding: "0 22px" }}>
        <div className="cardShine" style={styles.memberCard}>
          <Fabric seed={2} />
          <Grain opacity={0.09} />
          <div style={styles.cardTop}>
            <Monogram size={22} />
            <span style={styles.cardTier}>NOIR CIRCLE</span>
          </div>
          <div style={styles.cardName}>Mme. V. Laurent</div>
          <div style={styles.cardRow}>
            <span><span style={styles.cardK}>MEMBER SINCE</span><br />MMXIX</span>
            <span style={{ textAlign: "right" }}><span style={styles.cardK}>STATUS</span><br />FOUNDING</span>
          </div>
        </div>
      </div>

      {/* stats */}
      <div style={styles.stats}>
        <Stat n={bag.length} l="In Bag" />
        <Stat n={savedList.length} l="Saved" />
        <Stat n={"12"} l="Pieces Owned" />
      </div>

      {/* concierge */}
      <div style={{ padding: "0 22px" }}>
        <button onClick={onConcierge} className="press" style={styles.conciergeCard}>
          <div>
            <div style={{ ...styles.atelierName, color: C.gold }}>Your Concierge</div>
            <div style={styles.atelierDesc}>Camille Beaumont · répond sous 24h</div>
          </div>
          <span style={{ color: C.gold, fontSize: 20 }}>→</span>
        </button>
      </div>

      {/* menu */}
      <div style={{ padding: "8px 22px 0" }}>
        {["My Orders", "Private Appointments", "Atelier Care", "Settings & Preferences"].map((m) => (
          <button key={m} className="press" style={styles.menuRow}>
            <span>{m}</span><span style={{ color: C.ivoryFaint }}>→</span>
          </button>
        ))}
      </div>

      {/* saved */}
      <section style={{ padding: "26px 22px 8px" }}>
        <Heading label="SAVED PIECES" title={savedList.length ? "Your wishlist" : "Nothing saved yet"} />
      </section>
      {savedList.length === 0 ? (
        <div style={{ padding: "0 22px 8px" }}>
          <button onClick={onShop} className="press" style={styles.ctaOutline}>EXPLORE THE COLLECTION</button>
        </div>
      ) : (
        <div className="scroll-x" style={{ ...styles.hStrip, paddingTop: 4 }}>
          {savedList.map((p) => (
            <div key={p.id} style={styles.hCard}>
              <div style={{ position: "relative", height: 180, ...sw(p.swatch), borderRadius: 2, overflow: "hidden" }}>
                <Fabric seed={p.seed} dark={SWATCH[p.swatch].dark} />
                <Grain opacity={0.07} />
              </div>
              <div style={styles.hMeta}>
                <div style={styles.pName}>{p.name}</div>
                <div style={styles.pPrice}>{p.price ? fmt(p.price) : p.priceLabel}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- shared bits ---------------- */
function Heading({ label, title }) {
  return (
    <div>
      <div style={styles.kicker}>{label}</div>
      <h2 style={styles.h2}>{title}</h2>
    </div>
  );
}
function Band({ swatch, seed, dark, kicker, title, body, cta, onClick }) {
  return (
    <section onClick={onClick} className="press" style={{ position: "relative", margin: "30px 0 0", height: 300, ...sw(swatch), overflow: "hidden" }}>
      <Fabric seed={seed} dark={dark} />
      <Grain opacity={0.08} />
      {!dark && <div style={styles.heroGrad} />}
      <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
        <div style={{ ...styles.kicker, color: dark ? "rgba(11,10,9,0.6)" : C.gold }}>{kicker}</div>
        <h2 style={{ ...styles.h2, color: dark ? C.noir : C.ivory, marginBottom: 10 }}>{title}</h2>
        <p style={{ ...styles.bandBody, color: dark ? "rgba(11,10,9,0.78)" : C.ivoryDim }}>{body}</p>
        <div style={{ ...styles.heroCta, color: dark ? C.noir : C.gold, marginTop: 14 }}>{cta}&nbsp;&nbsp;—</div>
      </div>
    </section>
  );
}
function SaveBtn({ active, onClick, dark, big }) {
  return (
    <button onClick={onClick} style={{
      position: "absolute", top: big ? 18 : 10, right: big ? 18 : 10, zIndex: 3,
      width: big ? 40 : 32, height: big ? 40 : 32, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: dark ? "rgba(255,255,255,0.4)" : "rgba(11,10,9,0.35)",
      backdropFilter: "blur(6px)", border: "none", cursor: "pointer",
    }}>
      <Icon name="heart" active={active} />
    </button>
  );
}
function Spec({ k, v }) {
  return (
    <div style={styles.spec}>
      <div style={styles.specK}>{k.toUpperCase()}</div>
      <div style={styles.specV}>{v}</div>
    </div>
  );
}
function Row({ k, v, big, gold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: big ? 0 : 12 }}>
      <span style={{ fontFamily: "'Jost',sans-serif", fontSize: big ? 12 : 11, letterSpacing: "0.12em",
        color: big ? C.ivory : C.ivoryDim, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontFamily: big ? "'Cormorant Garamond',serif" : "'Jost',sans-serif",
        fontSize: big ? 26 : 13, color: gold ? C.gold : C.ivory, fontWeight: big ? 600 : 400 }}>{v}</span>
    </div>
  );
}
function Stat({ n, l }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: C.gold, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.18em", color: C.ivoryFaint, marginTop: 6, textTransform: "uppercase" }}>{l}</div>
    </div>
  );
}

const sw = (key) => ({ background: SWATCH[key].bg });

/* ---------------- styles ---------------- */
const styles = {
  stage: {
    minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", position: "relative",
    background: "#070605", padding: "28px 0", overflow: "hidden",
    fontFamily: "'Jost', sans-serif",
  },
  ambient: {
    position: "absolute", inset: 0,
    background: "radial-gradient(60% 50% at 50% 30%, rgba(194,165,116,0.10) 0%, rgba(7,6,5,0) 70%), radial-gradient(80% 60% at 50% 110%, rgba(110,35,51,0.10), rgba(7,6,5,0) 70%)",
  },
  phone: {
    position: "relative", width: 390, maxWidth: "94vw", height: 820, maxHeight: "92vh",
    borderRadius: 46, padding: 11, background: "linear-gradient(150deg,#26221c,#0c0b09)",
    boxShadow: "0 50px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(194,165,116,0.14), inset 0 0 0 1px rgba(0,0,0,0.6)",
  },
  bezelGlow: {
    position: "absolute", inset: 0, borderRadius: 46, pointerEvents: "none",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
  },
  screenInner: {
    position: "relative", width: "100%", height: "100%", borderRadius: 36,
    overflow: "hidden", background: C.noir, display: "flex", flexDirection: "column",
  },
  statusBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 24px 4px", color: C.ivory, fontSize: 12, fontWeight: 500,
    letterSpacing: "0.02em", flexShrink: 0,
  },
  signal: { width: 16, height: 9, borderRadius: 2, background: C.ivory, opacity: 0.85, display: "inline-block" },
  batt: { width: 22, height: 10, borderRadius: 2, border: `1px solid ${C.ivoryDim}`, position: "relative", display: "inline-block" },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 22px 12px", flexShrink: 0,
    borderBottom: `1px solid ${C.lineSoft}`,
  },
  wordmark: {
    fontFamily: "'Jost', sans-serif", fontSize: 15, letterSpacing: "0.42em",
    color: C.ivory, fontWeight: 400, paddingLeft: "0.42em",
  },
  bagBtn: { position: "relative", background: "none", border: "none", cursor: "pointer", padding: 0 },
  bagDot: {
    position: "absolute", top: -4, right: -6, minWidth: 15, height: 15, borderRadius: 8,
    background: C.gold, color: C.noir, fontSize: 9, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
    fontFamily: "'Jost',sans-serif",
  },
  body: { flex: 1, overflowY: "auto", position: "relative" },
  nav: {
    display: "flex", justifyContent: "space-around", alignItems: "center",
    padding: "10px 8px 14px", flexShrink: 0, position: "relative",
    background: "linear-gradient(to top, #0b0a09 60%, rgba(11,10,9,0.85))",
    borderTop: `1px solid ${C.lineSoft}`,
  },
  navBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "2px 6px", position: "relative" },
  navLabel: { fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase" },
  navBagDot: { position: "absolute", top: 0, right: 8, width: 5, height: 5, borderRadius: 3, background: C.gold },

  /* splash */
  splash: {
    position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 35%, #1a1712 0%, #0b0a09 60%, #050403 100%)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  splashLine: { width: 0, height: 1, background: C.gold, margin: "14px auto 16px" },
  splashWord: { fontFamily: "'Jost',sans-serif", fontSize: 20, letterSpacing: "0.6em", color: C.ivory, paddingLeft: "0.6em", fontWeight: 300 },
  splashTag: { fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.4em", color: C.gold, marginTop: 14, opacity: 0, paddingLeft: "0.4em" },
  splashFoot: { position: "absolute", bottom: 40, fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.32em", color: C.ivoryFaint, opacity: 0, display: "flex", gap: 8, alignItems: "center" },

  /* hero */
  heroGrad: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,5,4,0.92) 4%, rgba(6,5,4,0.1) 55%, rgba(6,5,4,0.3) 100%)" },
  heroInner: { position: "absolute", bottom: 30, left: 24, right: 24 },
  kicker: { fontFamily: "'Jost',sans-serif", fontSize: 9.5, letterSpacing: "0.34em", color: C.gold, marginBottom: 14, fontWeight: 400 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 62, lineHeight: 0.94, color: C.ivory, fontWeight: 500, margin: 0, fontStyle: "italic", letterSpacing: "-0.01em" },
  heroSub: { fontFamily: "'Jost',sans-serif", fontSize: 12.5, lineHeight: 1.6, color: C.ivoryDim, marginTop: 16, maxWidth: 270, fontWeight: 300 },
  heroCta: { fontFamily: "'Jost',sans-serif", fontSize: 10.5, letterSpacing: "0.28em", color: C.gold, marginTop: 18, fontWeight: 400 },

  /* headings */
  h2: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: C.ivory, fontWeight: 500, margin: "6px 0 0", fontStyle: "italic", letterSpacing: "-0.01em" },

  /* horizontal strip */
  hStrip: { display: "flex", gap: 14, overflowX: "auto", padding: "14px 22px 8px", scrollSnapType: "x mandatory" },
  hCard: { flex: "0 0 auto", width: 170, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", scrollSnapAlign: "start" },
  hMeta: { paddingTop: 10 },
  pName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.ivory, fontWeight: 600, lineHeight: 1.1, fontStyle: "italic" },
  pSub: { fontFamily: "'Jost',sans-serif", fontSize: 9.5, letterSpacing: "0.18em", color: C.ivoryFaint, marginTop: 4, textTransform: "uppercase" },
  pPrice: { fontFamily: "'Jost',sans-serif", fontSize: 11.5, letterSpacing: "0.08em", color: C.gold, marginTop: 6 },

  /* grid */
  chips: { display: "flex", gap: 10, overflowX: "auto", padding: "14px 22px 18px" },
  chip: { flex: "0 0 auto", fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 40, border: `1px solid ${C.line}`, background: "none", color: C.ivoryDim, cursor: "pointer" },
  chipOn: { background: C.gold, color: C.noir, border: `1px solid ${C.gold}` },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "0 22px" },
  gCard: { background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" },
  lineTag: { position: "absolute", top: 10, left: 10, fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.85 },

  /* product */
  pBack: { position: "absolute", top: 18, left: 18, zIndex: 3, width: 40, height: 40, borderRadius: "50%", border: "1px solid", background: "rgba(0,0,0,0.15)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  pHeroBottom: { position: "absolute", bottom: 26, left: 24, right: 24 },
  pHeroLine: { fontFamily: "'Jost',sans-serif", fontSize: 9.5, letterSpacing: "0.32em", marginBottom: 10 },
  pHeroName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 500, fontStyle: "italic", lineHeight: 0.95, letterSpacing: "-0.01em" },
  pHeroSub: { fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${C.line}`, paddingBottom: 18 },
  bigPrice: { fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: C.gold, fontWeight: 600 },
  catTag: { fontFamily: "'Jost',sans-serif", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.ivoryFaint },
  matBlock: { fontFamily: "'Jost',sans-serif", fontSize: 11.5, lineHeight: 1.7, color: C.ivoryDim, padding: "18px 0", letterSpacing: "0.02em", fontWeight: 300 },
  noteToggle: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", borderTop: `1px solid ${C.line}`, padding: "16px 0", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: "0.24em", color: C.ivory },
  note: { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, lineHeight: 1.65, color: C.ivoryDim, fontStyle: "italic", margin: "0 0 8px", fontWeight: 400 },
  specGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.line, border: `1px solid ${C.line}`, margin: "16px 0" },
  spec: { background: C.noir, padding: "14px 14px" },
  specK: { fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: "0.18em", color: C.ivoryFaint, marginBottom: 6 },
  specV: { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: C.ivory, fontStyle: "italic" },
  delivery: { fontFamily: "'Jost',sans-serif", fontSize: 10.5, lineHeight: 1.6, color: C.ivoryDim, marginTop: 8, fontWeight: 300 },
  stickyBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 22px 22px", background: "linear-gradient(to top, #0b0a09 70%, rgba(11,10,9,0))" },
  ctaPrimary: { width: "100%", padding: "17px", background: C.gold, color: C.noir, border: "none", borderRadius: 2, fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: "0.22em", fontWeight: 500, cursor: "pointer", textTransform: "uppercase" },
  ctaOutline: { width: "100%", padding: "16px", background: "none", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 2, fontFamily: "'Jost',sans-serif", fontSize: 10.5, letterSpacing: "0.22em", fontWeight: 400, cursor: "pointer", textTransform: "uppercase" },

  /* atelier */
  atelierRow: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "1px solid", borderRadius: 2, padding: "18px 18px", marginBottom: 12, cursor: "pointer", textAlign: "left", transition: "border-color .3s" },
  atelierName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, fontStyle: "italic" },
  atelierDesc: { fontFamily: "'Jost',sans-serif", fontSize: 10.5, color: C.ivoryFaint, marginTop: 4, letterSpacing: "0.02em", fontWeight: 300 },
  msgC: { maxWidth: "82%", background: C.noirSoft, border: `1px solid ${C.line}`, borderRadius: "2px 12px 12px 12px", padding: "12px 15px", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 15.5, lineHeight: 1.5, color: C.ivory },
  msgU: { maxWidth: "82%", background: "rgba(194,165,116,0.14)", border: `1px solid rgba(194,165,116,0.3)`, borderRadius: "12px 2px 12px 12px", padding: "12px 15px", fontFamily: "'Jost',sans-serif", fontSize: 12, lineHeight: 1.5, color: C.ivory, fontWeight: 300 },
  salonNote: { textAlign: "center", fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.24em", color: C.ivoryFaint, marginTop: 16 },

  /* bag */
  bagItem: { display: "flex", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.lineSoft}` },
  removeBtn: { background: "none", border: "none", cursor: "pointer", padding: 6, alignSelf: "flex-start" },
  summary: { margin: "24px 22px 0", padding: "20px 20px", border: `1px solid ${C.line}`, borderRadius: 2 },
  summaryLine: { height: 1, background: C.line, margin: "6px 0 16px" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 40px", textAlign: "center", gap: 16 },
  emptyTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: C.ivory, fontStyle: "italic", lineHeight: 1.1, marginTop: 8 },
  emptySub: { fontFamily: "'Jost',sans-serif", fontSize: 11, color: C.ivoryFaint, lineHeight: 1.6, fontWeight: 300, maxWidth: 230 },

  /* circle */
  memberCard: { position: "relative", borderRadius: 6, padding: "22px 22px 20px", overflow: "hidden", background: "linear-gradient(150deg,#1c1812 0%,#0a0908 100%)", boxShadow: "0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(194,165,116,0.25)", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTier: { fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: C.gold },
  cardName: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: C.ivory, fontStyle: "italic", margin: "auto 0" },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: "'Jost',sans-serif", fontSize: 12, color: C.ivory, letterSpacing: "0.1em" },
  cardK: { fontSize: 7.5, letterSpacing: "0.2em", color: C.ivoryFaint },
  stats: { display: "flex", padding: "24px 22px", margin: "0", gap: 8 },
  conciergeCard: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px", border: `1px solid rgba(194,165,116,0.3)`, background: "rgba(194,165,116,0.06)", borderRadius: 2, cursor: "pointer", textAlign: "left", marginBottom: 18 },
  menuRow: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 2px", borderBottom: `1px solid ${C.lineSoft}`, background: "none", border: "none", borderBottomStyle: "solid", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: "0.06em", color: C.ivory, fontWeight: 300 },

  /* footer + toast */
  footer: { textAlign: "center", padding: "40px 22px 30px", marginTop: 30, borderTop: `1px solid ${C.lineSoft}` },
  footCities: { fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: C.ivoryDim, marginTop: 16 },
  footFine: { fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: "0.18em", color: C.ivoryFaint, marginTop: 10 },
  bandBody: { fontFamily: "'Jost',sans-serif", fontSize: 11.5, lineHeight: 1.6, maxWidth: 290, fontWeight: 300 },
  caption: { position: "relative", marginTop: 22, fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,236,225,0.25)", textTransform: "uppercase" },
  toast: { position: "absolute", bottom: 92, left: "50%", transform: "translateX(-50%)", background: "rgba(11,10,9,0.94)", border: `1px solid ${C.gold}`, color: C.ivory, padding: "12px 22px", borderRadius: 40, fontFamily: "'Jost',sans-serif", fontSize: 10.5, letterSpacing: "0.12em", whiteSpace: "nowrap", zIndex: 50, backdropFilter: "blur(8px)", maxWidth: "90%", textAlign: "center" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Jost:wght@300;400;500&display=swap');
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.scroll::-webkit-scrollbar, .scroll-x::-webkit-scrollbar { display: none; }
.scroll, .scroll-x { -ms-overflow-style: none; scrollbar-width: none; }
.scroll-x { -webkit-overflow-scrolling: touch; }
.press { transition: transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s; }
.press:active { transform: scale(0.975); opacity: .92; }
.screen { animation: scr .55s cubic-bezier(.2,.8,.2,1) both; }
@keyframes scr { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.rise { animation: rise .8s cubic-bezier(.2,.8,.2,1) both; }
.rise.d1 { animation-delay: .12s; } .rise.d2 { animation-delay: .24s; } .rise.d3 { animation-delay: .36s; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.fadeUp { animation: fadeUp .7s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.splashMark { animation: smark 1.4s cubic-bezier(.2,.8,.2,1) both; }
@keyframes smark { from { opacity: 0; transform: scale(.92); letter-spacing: 0; } to { opacity: 1; transform: scale(1); } }
.drawline { animation: draw 1s ease .5s both; }
@keyframes draw { from { width: 0; } to { width: 64px; } }
.fadeDelay { animation: fd 1s ease 1.1s both; }
.fadeDelay2 { animation: fd 1s ease 1.5s both; }
@keyframes fd { from { opacity: 0; } to { opacity: 1; } }
.toast { animation: tin .3s ease both; }
@keyframes tin { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
.cardShine::before { content:''; position:absolute; inset:0; background: linear-gradient(115deg, transparent 30%, rgba(220,193,140,0.16) 48%, transparent 60%); animation: shine 6s ease-in-out infinite; pointer-events:none; }
@keyframes shine { 0%,100% { transform: translateX(-30%);} 50% { transform: translateX(30%);} }
`;