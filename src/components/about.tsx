import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { observeInView, prefersReducedMotion } from "../lib/motion";

const SEGMENTS: { text: string; italic: boolean }[] = [
    { text: "Hi, I'm", italic: false },
    { text: "Arjun", italic: true },
    { text: "- a software engineer who builds software that", italic: false },
    { text: "doesn't suck to use.", italic: true },
    { text: "Half engineer, half designer,", italic: true },
    { text: "full-time believer that", italic: false },
    { text: "small details", italic: true },
    { text: "are what separate good products from forgettable ones.", italic: false },
];

const WORDS = SEGMENTS.flatMap(({ text, italic }) =>
    text.split(/\s+/).filter(Boolean).map((word) => ({ text: word, italic })),
);

const CRAFT_PILLARS = [
    {
        n: "01",
        title: "Problem solving",
        gloss: "Untangling the messy middle. Finding the real question before answering it.",
    },
    {
        n: "02",
        title: "System design",
        gloss: "Async orchestration, streaming, distributed state. Architecture that survives scale.",
    },
    {
        n: "03",
        title: "AI orchestration",
        gloss: "Multi-agent graphs, RAG, agentic reasoning. Making LLMs behave in production.",
    },
    {
        n: "04",
        title: "Interface craft",
        gloss: "React, Next.js, motion. The reason this site looks the way it does.",
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
        font: "font-supreme italic",
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
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-8 pt-24 pb-12">
                <p className="font-supreme text-3xl font-semibold leading-tight md:text-4xl">
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
            <div className="mx-auto flex w-full max-w-6xl flex-col px-8 py-16 md:py-20 lg:py-24">
                <div data-craft-header className="mb-10 max-w-2xl md:mb-12">
                    <h2 className="mb-4 font-supreme text-5xl font-bold leading-none md:text-6xl">
                        The <em className="font-instrument font-normal italic">craft</em>.
                    </h2>
                    <p className="font-supreme text-lg italic text-white/50 md:text-xl">
                        Four things I obsess over. The instincts that shape every line of code I ship.
                    </p>
                </div>
                <div className="flex flex-col divide-y divide-white/10">
                    {CRAFT_PILLARS.map((pillar) => (
                        <div
                            key={pillar.n}
                            data-craft-row
                            className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-5 md:grid-cols-[48px_260px_1fr] md:gap-x-10"
                        >
                            <div className="self-start pt-2 font-jetbrains text-xs text-white/40">
                                [{pillar.n}]
                            </div>
                            <div className="font-supreme text-2xl font-bold transition-colors duration-500 group-hover:text-white md:text-3xl">
                                {pillar.title}
                            </div>
                            <div className="col-span-2 max-w-xl font-supreme text-base italic text-white/50 transition-colors duration-500 group-hover:text-white/85 md:col-span-1 md:text-lg">
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
            <div className="mx-auto flex w-full max-w-6xl flex-col px-8 py-16 md:py-20 lg:py-24">
                <div data-stack-header className="mb-10 max-w-2xl md:mb-12">
                    <h2 className="mb-4 font-supreme text-5xl font-bold leading-none md:text-6xl">
                        The <em className="font-instrument font-normal italic">stack</em>.
                    </h2>
                    <p className="font-supreme text-lg italic text-white/50 md:text-xl">
                        Tools I reach for instinctively. Each one earned through shipping, breaking and debugging code.
                    </p>
                </div>

                <div className="flex flex-col">
                    {STACK_ROWS.map((row, i) => (
                        <div
                            key={row.label}
                            data-marquee-row
                            className="flex items-center gap-8 border-t border-white/10 py-5 last:border-b"
                        >
                            <div className="w-32 shrink-0 font-jetbrains text-xs uppercase tracking-widest text-white/40 md:w-40">
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
                                        row.items.map((item, j) => (
                                            <span
                                                key={`${dupIdx}-${j}`}
                                                className="inline-flex items-center"
                                            >
                                                <span className="px-6">{item}</span>
                                                <span className="text-white/20">·</span>
                                            </span>
                                        )),
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