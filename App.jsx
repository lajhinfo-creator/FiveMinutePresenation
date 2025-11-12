import React, {
  Suspense,
  useEffect,
  useMemo,
  useState
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";

/**
 * 12-Page Interactive 3D Website — Template Deck
 * Topic: How to Make a No-Bake Cheesecake for Thanksgiving
 * Tech: React + Tailwind, @react-three/fiber + drei
 */

// ---- Utilities
function webGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const listener = () => setReduced(media.matches);
    listener();
    media.addEventListener?.("change", listener);
    return () => media.removeEventListener?.("change", listener);
  }, []);
  return reduced;
}

// ---- Slides (fixed instructional structure)
const SECTIONS = [
  { id: "waiting-room", label: "Waiting Room" },
  { id: "cover", label: "Cover" },
  { id: "welcome", label: "Welcome" },
  { id: "ice-breaker", label: "Ice Breaker" },
  { id: "wiifm", label: "WIIFM" },
  { id: "expectations", label: "Expectations" },
  { id: "objectives", label: "Objectives" },
  { id: "tell", label: "Tell" },
  { id: "show", label: "Show" },
  { id: "activity", label: "Activity" },
  { id: "feedback", label: "Feedback" },
  { id: "conclusion", label: "Conclusion" }
];

// ---- TOPIC CONFIG: No-Bake Cheesecake for Thanksgiving
const TOPIC = {
  id: "no-bake-cheesecake-thanksgiving",
  title: "How to Make a No-Bake Cheesecake for Thanksgiving",
  subtitle: "A simple, crowd-pleasing dessert — no oven required.",
  presenter: "Your Name",
  duration: "30–45 minutes",
  theme: {
    // Subdued monochrome: baseHue ~ 35–40 for warm holiday amber
    baseHue: 35,
    saturation: 70,
    minLightness: 32,
    maxLightness: 60,
    // Desaturated hero images (Pexels links as placeholders)
    waitingBg:
      "https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    coverBg:
      "https://images.pexels.com/photos/4109990/pexels-photo-4109990.jpeg?auto=compress&cs=tinysrgb&w=1200"
  },
  slides: {
    "waiting-room": {
      title: "Starting Soon",
      tagline:
        "Settle in while we prep the crust and gather the ingredients.",
      notes: [
        "Loop a short GIF or MP4 of cheesecake prep or a Thanksgiving table.",
        "Use chat or audio to welcome guests as they arrive."
      ]
    },
    cover: {
      title: "How to Make a No-Bake Cheesecake for Thanksgiving",
      subtitle: "From crust to chill — no oven required."
    },
    welcome: {
      title: "Welcome",
      body:
        "In this quick session, you’ll learn how to assemble a creamy, no-bake cheesecake that fits perfectly on a Thanksgiving dessert table — with no oven, minimal stress, and maximum praise."
    },
    "ice-breaker": {
      title: "Ice Breaker",
      prompt:
        "In the chat (or aloud), share your favorite Thanksgiving dessert — or the one you’d like to upgrade this year."
    },
    wiifm: {
      title: "Why Learn a No-Bake Thanksgiving Cheesecake?",
      bullets: [
        "Add a show-stopping dessert without fighting for oven space",
        "Prep ahead so you’re not scrambling day-of",
        "Customize flavors to match your family’s traditions"
      ]
    },
    expectations: {
      title: "What to Expect",
      bullets: [
        "Duration: ~30–45 minutes, including Q&A",
        "We’ll walk through crust, filling, and chill timing",
        "You’ll leave with a printable recipe and variation ideas"
      ]
    },
    objectives: {
      title: "By the End, You Will Be Able To…",
      bullets: [
        "List the 3 core components of a no-bake cheesecake",
        "Assemble a basic crust and stabilized filling",
        "Plan chill time so your cheesecake slices cleanly at dessert"
      ]
    },
    tell: {
      title: "Key Concepts — No-Bake Cheesecake Basics",
      body:
        "A no-bake cheesecake relies on a press-in crust, a stabilized cream cheese filling, and sufficient chill time instead of baking. Thanksgiving adds timing and portion planning to the mix.",
      bullets: [
        "Crust: crushed cookies + fat + firm press",
        "Filling: cream cheese + sweetness + structure (whipped cream or gelatin)",
        "Chill: hours, not minutes — for clean, confident slices"
      ]
    },
    show: {
      title: "Demo — From Crust to Chill",
      bullets: [
        "Step 1: Crush and press the crust into the pan",
        "Step 2: Whip and spread the filling evenly",
        "Step 3: Smooth the top, cover, and chill until dessert time"
      ]
    },
    activity: {
      title: "Activity — Your Cheesecake Game Plan",
      prompt:
        "Which component matters MOST for getting clean slices on Thanksgiving night?",
      options: [
        { value: "crust", label: "The crust ingredients" },
        { value: "filling", label: "The filling flavor" },
        { value: "chill", label: "The chill time" }
      ],
      correctValue: "chill"
    },
    feedback: {
      title: "Feedback",
      why:
        "Chill time lets the filling fully set so you can cut clean slices without the cheesecake sagging or collapsing — especially important when serving a table of hungry guests."
    },
    conclusion: {
      title: "Wrap-Up & Next Steps",
      bullets: [
        "Crust, filling, and chill work together for success",
        "No-bake cheesecake frees up oven space and your time",
        "Small tweaks in toppings and flavors fit any Thanksgiving table"
      ],
      primaryCta: "Download the Thanksgiving cheesecake recipe",
      secondaryCta: "See flavor and topping variations"
    }
  }
};

// ---- 3D: Minimal, fast placeholder object
function Rotator({ color = "#38bdf8", speed = 0.5, paused = false }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (paused) return;
    let raf;
    const loop = (now) => {
      setT(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  return (
    <group rotation={[t * 0.25 * speed, t * 0.5 * speed, 0]}>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.35, 220, 36]} />
        <meshStandardMaterial
          metalness={0.4}
          roughness={0.25}
          color={color}
        />
      </mesh>

      {/* Example callout anchored to 3D geometry */}
      <Html
        position={[1.4, 0.4, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <div className="flex items-center gap-2 text-[10px] font-medium text-sky-100">
          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
          <span className="px-2 py-1 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur">
            Key Step Highlight
          </span>
        </div>
      </Html>
    </group>
  );
}

function Scene({ section, reducedMotion, perf }) {
  const baseHue = TOPIC.theme.baseHue ?? 210;
  const saturation = TOPIC.theme.saturation ?? 70;
  const minL = TOPIC.theme.minLightness ?? 35;
  const maxL = TOPIC.theme.maxLightness ?? 65;

  const index = SECTIONS.findIndex((s) => s.id === section);
  const t = SECTIONS.length > 1 ? index / (SECTIONS.length - 1) : 0.5;
  const lightness = minL + (maxL - minL) * t;
  const color = `hsl(${baseHue} ${saturation}% ${lightness}%)`;

  const quality = useMemo(() => {
    switch (perf) {
      case "low":
        return { shadows: false, env: "sunset", speed: 0.18 };
      case "high":
        return { shadows: true, env: "city", speed: 0.7 };
      default:
        return { shadows: true, env: "park", speed: 0.4 };
    }
  }, [perf]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow={quality.shadows}
        position={[4, 6, 4]}
        intensity={1.1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={<Html>Loading 3D…</Html>}>
        <Environment preset={quality.env} />
      </Suspense>
      <Rotator
        color={color}
        speed={quality.speed}
        paused={reducedMotion}
      />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// ---- Main App
export default function App() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [perf, setPerf] = useState("auto"); // auto | low | high
  const [hasWebGL, setHasWebGL] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  // Activity state
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setHasWebGL(webGLAvailable()), []);

  const quizConfig = TOPIC.slides["activity"];
  const correctValue = quizConfig?.correctValue;
  const isCorrect =
    submitted && answer && answer === correctValue;

  // DPR (device pixel ratio) strategy for perf
  const dpr = useMemo(() => {
    if (perf === "low") return [0.75, 1];
    if (perf === "high") return [1.5, 2];
    const base =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;
    return [
      Math.max(0.9, base * 0.9),
      Math.min(1.5, base * 1.1)
    ];
  }, [perf]);

  // Keyboard nav
  const onKey = (e) => {
    if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    )
      return;
    const currentIndex = SECTIONS.findIndex(
      (s) => s.id === active
    );
    if (e.key === "ArrowRight")
      setActive(
        SECTIONS[(currentIndex + 1) % SECTIONS.length].id
      );
    if (e.key === "ArrowLeft")
      setActive(
        SECTIONS[
          (currentIndex - 1 + SECTIONS.length) %
            SECTIONS.length
        ].id
      );
  };

  const index = SECTIONS.findIndex((s) => s.id === active);
  const total = SECTIONS.length;

  const next = () =>
    setActive(SECTIONS[(index + 1) % total].id);
  const prev = () =>
    setActive(
      SECTIONS[(index - 1 + total) % total].id
    );

  const Progress = () => (
    <div
      className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
      aria-hidden
    >
      <div
        className="h-full bg-sky-500"
        style={{
          width: `${((index + 1) / total) * 100}%`
        }}
      />
    </div>
  );

  function GlassHero({ bg, children }) {
    return (
      <div className="relative mt-4 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/60">
        {bg && (
          <div className="absolute inset-0">
            <img
              src={bg}
              alt=""
              className="w-full h-full object-cover opacity-70"
              style={{
                filter:
                  "grayscale(1) contrast(1.1) brightness(0.8)"
              }}
            />
          </div>
        )}
        <div className="relative p-4 sm:p-6 bg-gradient-to-t from-neutral-950/80 via-neutral-950/60 to-neutral-900/30 backdrop-blur-md">
          {children}
        </div>
      </div>
    );
  }

  function SectionContent() {
    const slideConfig = TOPIC.slides[active] || {};

    switch (active) {
      case "waiting-room":
        return (
          <article aria-labelledby="waiting-title">
            <h2
              id="waiting-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Starting Soon"}
            </h2>
            <p className="text-neutral-300 mt-2">
              {slideConfig.tagline ||
                "Feel free to grab water and get settled."}
            </p>
            <GlassHero bg={TOPIC.theme.waitingBg}>
              <p className="text-sm text-neutral-200">
                This functions like a waiting room slide.
                Swap the background image or GIF to match
                any topic.
              </p>
            </GlassHero>
            {slideConfig.notes && (
              <ul className="mt-4 grid gap-2 text-neutral-300 text-sm">
                {slideConfig.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </article>
        );

      case "cover":
        return (
          <article aria-labelledby="cover-title">
            <GlassHero bg={TOPIC.theme.coverBg}>
              <h2
                id="cover-title"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              >
                {slideConfig.title || TOPIC.title}
              </h2>
              <p className="text-neutral-200 mt-2">
                {slideConfig.subtitle || TOPIC.subtitle}
              </p>
              <p className="text-neutral-400 text-sm mt-1">
                {TOPIC.presenter} • {TOPIC.duration}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 rounded-xl bg-white text-black font-medium"
                  onClick={next}
                >
                  Begin Session
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
                  onClick={() =>
                    setActive("expectations")
                  }
                >
                  View Expectations
                </button>
              </div>
            </GlassHero>
          </article>
        );

      case "welcome":
        return (
          <article aria-labelledby="welcome-title">
            <h2
              id="welcome-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Welcome"}
            </h2>
            <p className="text-neutral-300 mt-2">
              {slideConfig.body ||
                "Thank your audience, name who this session is for, and ground them in what you’ll explore together."}
            </p>
          </article>
        );

      case "ice-breaker":
        return (
          <article aria-labelledby="ice-title">
            <h2
              id="ice-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Ice Breaker"}
            </h2>
            <p className="text-neutral-300 mt-2">
              {slideConfig.prompt ||
                "In one sentence, share what you hope to learn today."}
            </p>
          </article>
        );

      case "wiifm":
        return (
          <article aria-labelledby="wiifm-title">
            <h2
              id="wiifm-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title ||
                "WIIFM — Why It Matters"}
            </h2>
            <ul className="mt-3 grid gap-2">
              {(slideConfig.bullets || []).map((b, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-sm"
                >
                  {b}
                </li>
              ))}
            </ul>
          </article>
        );

      case "expectations":
        return (
          <article aria-labelledby="exp-title">
            <h2
              id="exp-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title ||
                "Expectations & Preparation"}
            </h2>
            <ul className="mt-3 grid gap-2">
              {(slideConfig.bullets || []).map((b, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-sm"
                >
                  {b}
                </li>
              ))}
            </ul>
          </article>
        );

      case "objectives":
        return (
          <article aria-labelledby="obj-title">
            <h2
              id="obj-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Learning Objectives"}
            </h2>
            <ol className="mt-3 grid gap-2 list-decimal list-inside text-neutral-200 text-sm">
              {(slideConfig.bullets || []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ol>
          </article>
        );

      case "tell":
        return (
          <article aria-labelledby="tell-title">
            <h2
              id="tell-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Tell — Key Concepts"}
            </h2>
            {slideConfig.body && (
              <p className="text-neutral-300 mt-2">
                {slideConfig.body}
              </p>
            )}
            {slideConfig.bullets && (
              <ul className="mt-3 grid gap-2">
                {slideConfig.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-sm"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </article>
        );

      case "show":
        return (
          <article aria-labelledby="show-title">
            <h2
              id="show-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Show — Demo"}
            </h2>
            <ul className="mt-3 grid gap-2">
              {(slideConfig.bullets || []).map((b, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-sm"
                >
                  {b}
                </li>
              ))}
            </ul>
          </article>
        );

      case "activity":
        return (
          <article aria-labelledby="act-title">
            <h2
              id="act-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {slideConfig.title || "Activity"}
            </h2>
            <p className="text-neutral-300 mt-2">
              {slideConfig.prompt ||
                "Quick check based on what you just saw."}
            </p>
            {slideConfig.options && (
              <form
                className="mt-4 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                  setActive("feedback");
                }}
              >
                <fieldset className="grid gap-2 text-sm text-neutral-200">
                  {slideConfig.options.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt.value}
                        onChange={(e) =>
                          setAnswer(e.target.value)
                        }
                      />
                      {opt.label}
                    </label>
                  ))}
                </fieldset>
                <div className="flex gap-3 mt-3">
                  <button
                    className="px-4 py-2 rounded-xl bg-white text-black font-medium"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
                    type="button"
                    onClick={() => {
                      setAnswer("");
                      setSubmitted(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </article>
        );

      case "feedback": {
        const fb = TOPIC.slides["feedback"] || {};
        return (
          <article aria-labelledby="fb-title">
            <h2
              id="fb-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {fb.title || "Feedback"}
            </h2>
            {!submitted ? (
              <p className="text-neutral-300 mt-2">
                Complete the activity on the previous slide
                to see feedback.
              </p>
            ) : (
              <div
                className={`mt-3 p-4 rounded-xl border text-sm ${
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/40"
                    : "bg-rose-500/10 border-rose-500/40"
                }`}
              >
                <p className="font-medium">
                  {isCorrect
                    ? "Correct — chill time is critical for clean slices."
                    : "Good try — the chill time matters most for clean slices."}
                </p>
                <p className="text-neutral-200 mt-1">
                  {fb.why}
                </p>
              </div>
            )}
          </article>
        );
      }

      case "conclusion": {
        const c = TOPIC.slides["conclusion"] || {};
        return (
          <article aria-labelledby="end-title">
            <h2
              id="end-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {c.title || "Conclusion & Call to Action"}
            </h2>
            {c.bullets && (
              <ul className="mt-3 grid gap-2 text-sm text-neutral-200">
                {c.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {c.primaryCta && (
                <button className="px-4 py-2 rounded-xl bg-white text-black font-medium text-center">
                  {c.primaryCta}
                </button>
              )}
              {c.secondaryCta && (
                <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
                  {c.secondaryCta}
                </button>
              )}
            </div>
          </article>
        );
      }

      default:
        return null;
    }
  }

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100"
      onKeyDown={onKey}
      tabIndex={0}
    >
      {/* Skip link for accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-1 rounded"
      >
        Skip to content
      </a>

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-tight">
            3D Interactive Deck — {TOPIC.title}
          </div>
          <nav
            className="hidden md:flex flex-wrap gap-2"
            aria-label="Primary"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors ${
                  active === s.id
                    ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-600/40"
                    : "hover:bg-white/5"
                }`}
                aria-current={
                  active === s.id ? "page" : undefined
                }
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto w-32 sm:w-40">
            <Progress />
          </div>
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <label className="text-xs text-neutral-300">
              Quality
            </label>
            <select
              className="bg-neutral-800 border border-white/10 rounded px-2 py-1 text-xs sm:text-sm"
              value={perf}
              onChange={(e) => setPerf(e.target.value)}
              aria-label="Performance mode"
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        id="content"
        className="max-w-7xl mx-auto p-4 grid md:grid-cols-2 gap-6"
      >
        {/* Left: 3D viewport */}
        <section className="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
          {hasWebGL ? (
            <Canvas
              shadows
              dpr={dpr}
              camera={{ position: [4, 3, 6], fov: 50 }}
              gl={{ antialias: perf !== "low" }}
            >
              <Suspense
                fallback={<Html center>Loading scene…</Html>}
              >
                <Scene
                  section={active}
                  reducedMotion={reducedMotion}
                  perf={perf}
                />
              </Suspense>
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center p-6">
              <div>
                <h2 className="text-lg font-semibold">
                  Interactive 3D Unavailable
                </h2>
                <p className="text-neutral-300 mt-2">
                  Your browser/device doesn’t support WebGL.
                  You’ll still get the full content and a fast
                  2D experience.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Right: Slide content */}
        <section className="space-y-6">
          <SectionContent />
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
              onClick={prev}
              aria-label="Previous slide"
            >
              ← Prev
            </button>
            <div className="text-xs sm:text-sm text-neutral-400">
              Slide {index + 1} / {total}
            </div>
            <button
              className="px-4 py-2 rounded-xl bg-white text-black font-medium"
              onClick={next}
              aria-label="Next slide"
            >
              Next →
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-6 text-xs sm:text-sm text-neutral-400 flex flex-wrap items-center justify-between gap-3">
        <span>
          © {new Date().getFullYear()} 3D Interactive Deck
          Template
        </span>
        <div className="flex items-center gap-2">
          <button
            className="hover:text-neutral-200 text-left"
            onClick={() => setActive("conclusion")}
          >
            Jump to Conclusion
          </button>
          <span aria-hidden>•</span>
          <button
            className="hover:text-neutral-200 text-left"
            onClick={() => setActive("activity")}
          >
            Jump to Activity
          </button>
        </div>
      </footer>
    </div>
  );
}
