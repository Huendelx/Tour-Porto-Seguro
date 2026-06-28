"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";

const AUTOPLAY_MS = 5000;
const SCROLL_MS = 2200;

const SLIDES = [
  { id: "arraial",  title: "Onde o mar encontra o asfalto.",        label: "Arraial d'Ajuda",   img: "/images/arraial.webp" },
  { id: "espelho",  title: "A praia mais bonita do Brasil.",         label: "Praia do Espelho",  img: "/images/espelho.webp" },
  { id: "caraiva",  title: "Sem carros. Sem barulho. Só você.",      label: "Caraíva",           img: "/images/caraiva.webp" },
  { id: "coroa",    title: "Uma piscina natural no meio do oceano.",  label: "Coroa Vermelha",    img: "/images/coroa.webp" },
  { id: "morro",    title: "Beleza que não cabe em foto.",            label: "Morro de Brejo",    img: "/images/morro.webp" },
  { id: "recife",   title: "O recife mais vivo do Nordeste.",         label: "Recife de Fora",    img: "/images/recife.webp" },
];

function CardFrost({ src }: { src: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);

  const applyFrost = () => {
    const img = imgRef.current;
    const frost = frostRef.current;
    if (!img || !frost) return;
    try {
      const sw = Math.max(1, img.naturalWidth);
      const sh = Math.max(1, Math.floor(img.naturalHeight * 0.45));
      const canvas = document.createElement("canvas");
      canvas.width = sw; canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, sw, sh);
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 24) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
      frost.style.setProperty("--hl-fc", `${r},${g},${b}`);
    } catch {
      frost.style.setProperty("--hl-fc", "0,0,0");
    }
  };

  return (
    <div className="hl-card-body">
      <img ref={imgRef} src={src} alt="" onLoad={applyFrost} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div ref={frostRef} className="hl-card-frost" style={{ "--hl-fc": "0,0,0" } as React.CSSProperties} />
    </div>
  );
}

export default function NossosDestaques() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ticker, setTicker] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const isProgramScroll = useRef(false);
  const isFromScroll = useRef(false);
  const finishedRef = useRef(false);
  const userPausedRef = useRef(false);
  const total = SLIDES.length;

  useEffect(() => { finishedRef.current = finished; }, [finished]);
  useEffect(() => { setProgress(0); }, [active, ticker]);

  // autoplay timer
  useEffect(() => {
    if (!playing || finished) return;
    let cancelled = false;
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - start) / AUTOPLAY_MS);
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (active >= total - 1) {
          setFinished(true);
          setPlaying(false);
        } else {
          setActive((a) => a + 1);
        }
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafId); };
  }, [playing, finished, active, total, ticker]);

  // smooth scroll to active card
  useEffect(() => {
    const el = cardRefs.current[active];
    const track = trackRef.current;
    if (!el || !track) return;
    const target = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    if (isFromScroll.current) { isFromScroll.current = false; return; }
    const start = track.scrollLeft;
    const clampedTarget = Math.max(0, target);
    const dist = clampedTarget - start;
    if (Math.abs(dist) < 1) return;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    isProgramScroll.current = true;
    track.style.scrollSnapType = "none";
    let rafId: number;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / SCROLL_MS);
      track.scrollLeft = start + dist * ease(p);
      if (p < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        isProgramScroll.current = false;
        track.style.scrollSnapType = "";
      }
    };
    rafId = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafId); isProgramScroll.current = false; track.style.scrollSnapType = ""; };
  }, [active]);

  // sync dots on manual scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (isProgramScroll.current) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs((el.offsetLeft + el.clientWidth / 2) - center);
        if (d < minDist) { minDist = d; closest = i; }
      });
      isFromScroll.current = true;
      setActive(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // prevent scroll restoration
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, []);

  // IntersectionObserver — show player + auto-start
  useEffect(() => {
    const el = cardsWrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setPlayerVisible(e.isIntersecting);
        if (e.isIntersecting && !finishedRef.current && !userPausedRef.current) {
          setPlaying(true);
        } else if (!e.isIntersecting) {
          setPlaying(false);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goTo = (i: number) => {
    if (i === active && !finished) { setTicker((t) => t + 1); return; }
    if (finished) { setFinished(false); setPlaying(true); }
    setActive(i);
  };

  const togglePlay = () => {
    if (finished) { setActive(0); setFinished(false); setPlaying(true); userPausedRef.current = false; return; }
    const next = !playing;
    userPausedRef.current = !next;
    setPlaying(next);
  };

  const slide = SLIDES[active];

  return (
    <section className="hl-section">
      <div className="hl-head">
        <h2>Nossos destaques.</h2>
        <p className="hl-sub">Os destinos mais amados pelos viajantes que passaram por aqui.</p>
      </div>

      <div ref={cardsWrapRef} className="hl-cards-region">
        <div className="hl-track" ref={trackRef}>
          <div className="hl-track-pad" />
          {SLIDES.map((item, i) => (
            <article
              key={item.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`hl-card${i === active ? " hl-card-active" : ""}`}
              onClick={() => goTo(i)}
            >
              <CardFrost src={item.img} />
              <div className="hl-card-head">
                <h3>{item.title}</h3>
                <span className="hl-card-label">{item.label}</span>
              </div>
            </article>
          ))}
          <div className="hl-track-pad" />
        </div>

        <div className={`hl-player-wrap${playerVisible ? " is-shown" : ""}`}>
          <div className="hl-loader-pill">
            <div className="hl-dots">
              {SLIDES.map((_, i) => {
                const isActive = i === active;
                const isDone = i < active || (finished && i === active);
                return (
                  <button
                    key={i}
                    className={`hl-dot${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  >
                    <span className="hl-dot-bg" />
                    {isActive && (
                      <span className="hl-dot-fill" style={{ transform: `scaleX(${finished ? 1 : progress})` }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="hl-play-pill" onClick={togglePlay}>
            {finished ? (
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ transform: "scaleX(-1) rotate(-20deg)" }}>
                <path d="M4 13a9 9 0 1 1 2.6 6.4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M3.5 7v6h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            ) : playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="3" y="3" width="6.5" height="18" rx="2.5" fill="currentColor" />
                <rect x="14.5" y="3" width="6.5" height="18" rx="2.5" fill="currentColor" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M5 3v18l16-9L5 3z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
