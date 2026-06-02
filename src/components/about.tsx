import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { observeInView, prefersReducedMotion } from "../lib/motion";

// Eagerly resolve every tech logo to its built URL, keyed by a normalized slug
// of the filename (e.g. "chain-of-thought.svg" -> "chainofthought").
const ICON_URLS = import.meta.glob("../assets/logos/tech/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const TECH_ICONS: Record<string, string> = Object.fromEntries(
    Object.entries(ICON_URLS).map(([path, url]) => [
        slugify(path.split("/").pop()!.replace(".svg", "")),
        url,
    ]),
);

// Stack labels whose slug doesn't match their filename slug.
const ICON_ALIASES: Record<string, string> = {
    rest: "restapi",
    cicd: "githubactions",
};

// Logos that are black / near-black and would vanish on the dark background.
// These get flipped to white; everything else keeps its brand color.
const DARK_ICONS = new Set([
    "nextjs",
    "express",
    "flask",
    "rag",
    "chainofthought",
    "langchain",
    "langgraph",
]);

function resolveIcon(label: string): { url: string; dark: boolean } | null {
    const slug = slugify(label);
    const key = ICON_ALIASES[slug] ?? slug;
    const url = TECH_ICONS[key];
    return url ? { url, dark: DARK_ICONS.has(key) } : null;
}

const SEGMENTS: { text: string; italic: boolean }[] = [
    { text: "Hi, I'm", italic: false },
    { text: "Arjun", italic: true },
    { text: "- a software engineer who builds software that", italic: false },
    { text: "doesn't suck to use.", italic: true },
    { text: "I obsess over the", italic: false },
    { text: "details", italic: true },
    { text: "most people skip, a full-time believer that", italic: false },
    { text: "small details", italic: true },
    { text: "are what separate good products from unforgettable ones.", italic: false },
];

const WORDS = SEGMENTS.flatMap(({ text, italic }) =>
    text.split(/\s+/).filter(Boolean).map((word) => ({ text: word, italic })),
);

const CRAFT_PILLARS = [
    {
        n: "01",
        title: "Problem Solving",
        gloss: "I start by killing the wrong problem. Most of the work is figuring out what's actually breaking, and for whom, before a line gets written. The best fix is often the one you delete instead of build.",
    },
    {
        n: "02",
        title: "System Design",
        gloss: "I build backends that hold up at 3am, not just in the demo. Async orchestration, streaming pipelines, state that stays sane under load. I design for the failure path first and the happy path second.",
    },
    {
        n: "03",
        title: "Product Thinking",
        gloss: "I build for the person on the other end, not the spec. Asking why before how, cutting features that don't earn their place, and sweating the flow most engineers leave to chance.",
    },
    {
        n: "04",
        title: "Interface Craft",
        gloss: "I obsess over the things you feel but never notice. The timing of a transition, the weight of a font, the half pixel that's off. This whole site is the receipt: every hover, scroll and stagger was a decision.",
    },
];

type StackRow = {
    label: string;
    items: string[];
    direction: "left" | "right";
    font: string;
    duration: number;
};

const STACK_ROWS: StackRow[] = [
    {
        label: "LANGUAGES",
        items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash"],
        direction: "left",
        font: "font-inter font-bold",
        duration: 35,
    },
    {
        label: "BACKEND",
        items: [
            "FastAPI",
            "Flask",
            "LangGraph",
            "LangChain",
            "Node.js",
            "Express",
            "REST",
            "Streaming APIs",
            "Async Orchestration",
        ],
        direction: "left",
        font: "font-supreme font-bold",
        duration: 45,
    },
    {
        label: "DATA · INFRA",
        items: [
            "PostgreSQL",
            "MongoDB",
            "MSSQL",
            "Redis",
            "Elasticsearch",
            "Docker",
            "Git",
            "CI/CD",
            "Cloud AI",
        ],
        direction: "right",
        font: "font-jetbrains",
        duration: 55,
    },
    {
        label: "AI / LLM",
        items: [
            "RAG",
            "Multi-Agent Systems",
            "Chain-of-Thought",
            "Prompt Engineering",
            "Streaming Inference",
            "Agentic Reasoning",
            "Semantic Retrieval",
        ],
        direction: "left",
        font: "font-dotted",
        duration: 50,
    },
    {
        label: "FRONTEND",
        items: ["React", "Next.js", "TailwindCSS", "GSAP", "Lenis", "TypeScript"],
        direction: "right",
        font: "font-supreme",
        duration: 40,
    },
];

export function About() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative w-full bg-black text-white"
        >
            <Manifesto />
            <Craft />
            <Stack />
        </section>
    );
}

function Manifesto() {
    const ref = useRef<HTMLDivElement>(null);
    const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

    useGSAP(
        () => {
            gsap.from(wordsRef.current.filter(Boolean), {
                opacity: 0,
                y: 24,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.04,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 65%",
                },
            });

            const byline = ref.current?.querySelector("[data-byline]");
            if (byline) {
                gsap.from(byline, {
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: byline,
                        start: "top 85%",
                    },
                });
            }
        },
        { scope: ref },
    );

    return (
        <div ref={ref} className="flex min-h-screen w-full flex-col">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-24 pb-12 md:px-8">
                <p className="font-supreme text-2xl font-medium leading-tight sm:text-3xl md:text-4xl">
                    {WORDS.map((word, i) => (
                        <span key={i}>
                            <span
                                ref={(el) => {
                                    wordsRef.current[i] = el;
                                }}
                                className={
                                    word.italic
                                        ? "inline-block font-instrument font-normal italic"
                                        : "inline-block"
                                }
                            >
                                {word.text}
                            </span>
                            {i < WORDS.length - 1 ? " " : ""}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}

function Craft() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const header = ref.current?.querySelector("[data-craft-header]");
            const rows = ref.current?.querySelectorAll("[data-craft-row]");

            if (header) {
                gsap.from(header, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 70%",
                    },
                });
            }

            if (rows) {
                gsap.from(rows, {
                    opacity: 0,
                    y: 32,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 55%",
                    },
                });
            }
        },
        { scope: ref },
    );

    return (
        <div ref={ref} className="flex w-full flex-col">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 md:px-8 md:py-20 lg:py-24">
                <div data-craft-header className="mb-10 max-w-2xl md:mb-12">
                    <h2 className="mb-4 font-supreme text-4xl font-bold leading-none sm:text-5xl md:text-6xl">
                        The <em className="font-instrument font-normal italic">craft</em>.
                    </h2>
                    <p className="font-supreme text-lg text-white/50 md:text-xl">
                        Four things I obsess over. The instincts that shape every line of code I ship.
                    </p>
                </div>
                <div className="flex flex-col divide-y divide-white/10">
                    {CRAFT_PILLARS.map((pillar) => (
                        <div
                            key={pillar.n}
                            data-craft-row
                            className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-5 md:grid-cols-[48px_220px_1fr] md:gap-x-8"
                        >
                            <div className="self-start pt-2 font-jetbrains text-xs text-white/40">
                                [{pillar.n}]
                            </div>
                            <div className="font-supreme text-2xl font-bold transition-colors duration-500 group-hover:text-white md:text-3xl">
                                {pillar.title}
                            </div>
                            <div className="col-span-2 max-w-3xl font-supreme text-base text-white/50 transition-colors duration-500 group-hover:text-white/85 md:col-span-1 md:text-lg">
                                {pillar.gloss}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Stack() {
    const ref = useRef<HTMLDivElement>(null);
    const marqueeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(
        () => {
            const reduce = prefersReducedMotion();
            const tweens: gsap.core.Tween[] = [];

            marqueeRefs.current.forEach((track, i) => {
                if (!track || reduce) return;
                const row = STACK_ROWS[i];
                const distance = track.scrollWidth / 3;

                if (row.direction === "left") {
                    gsap.set(track, { x: 0 });
                    tweens.push(
                        gsap.to(track, {
                            x: -distance,
                            duration: row.duration,
                            ease: "none",
                            repeat: -1,
                        }),
                    );
                } else {
                    gsap.set(track, { x: -distance });
                    tweens.push(
                        gsap.to(track, {
                            x: 0,
                            duration: row.duration,
                            ease: "none",
                            repeat: -1,
                        }),
                    );
                }
            });

            const header = ref.current?.querySelector("[data-stack-header]");
            if (header) {
                gsap.from(header, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 70%",
                    },
                });
            }

            const rows = ref.current?.querySelectorAll("[data-marquee-row]");
            if (rows && rows.length > 0) {
                gsap.from(rows, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: rows[0],
                        start: "top 85%",
                    },
                });
            }

            // Pause the infinite marquees while the stack is off-screen so they
            // don't compete for frames with the experience/projects sections.
            let stopObserving: (() => void) | undefined;
            if (tweens.length > 0 && ref.current) {
                stopObserving = observeInView(ref.current, (inView) =>
                    tweens.forEach((t) => (inView ? t.play() : t.pause())),
                );
            }

            return () => {
                stopObserving?.();
                tweens.forEach((t) => t.kill());
            };
        },
        { scope: ref },
    );

    return (
        <div ref={ref} className="flex w-full flex-col">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 md:px-8 md:py-20 lg:py-24">
                <div data-stack-header className="mb-10 max-w-2xl md:mb-12">
                    <h2 className="mb-4 font-supreme text-4xl font-bold leading-none sm:text-5xl md:text-6xl">
                        The <em className="font-instrument font-normal italic">stack</em>.
                    </h2>
                    <p className="font-supreme text-lg text-white/50 md:text-xl">
                        Tools I reach for instinctively. Each one earned through shipping, breaking and debugging code.
                    </p>
                </div>

                <div className="flex flex-col">
                    {STACK_ROWS.map((row, i) => (
                        <div
                            key={row.label}
                            data-marquee-row
                            className="flex items-center gap-4 border-t border-white/10 py-5 last:border-b md:gap-8"
                        >
                            <div className="w-24 shrink-0 font-jetbrains text-xs uppercase tracking-widest text-white/40 md:w-40">
                                {row.label}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div
                                    ref={(el) => {
                                        marqueeRefs.current[i] = el;
                                    }}
                                    className={`flex w-max ${row.font} text-xl text-white/80 md:text-2xl`}
                                >
                                    {Array.from({ length: 3 }).flatMap((_, dupIdx) =>
                                        row.items.map((item, j) => {
                                            const icon = resolveIcon(item);
                                            return (
                                                <span
                                                    key={`${dupIdx}-${j}`}
                                                    className="inline-flex items-center"
                                                >
                                                    <span className="inline-flex items-center gap-2.5 px-6">
                                                        {icon && (
                                                            <img
                                                                src={icon.url}
                                                                alt=""
                                                                aria-hidden="true"
                                                                className={`h-[1em] w-[1em] shrink-0 object-contain ${
                                                                    icon.dark ? "brightness-0 invert" : ""
                                                                }`}
                                                            />
                                                        )}
                                                        {item}
                                                    </span>
                                                    <span className="text-white/20">·</span>
                                                </span>
                                            );
                                        }),
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}