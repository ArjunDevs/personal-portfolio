import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";
import { useHeaderReveal, useTileReveal } from "../lib/reveal";
import { RichText, Stamp } from "./dossier";

type Award = { title: string; subtitle: string };
type Metric = { value: string; label: string };
type ExperienceEntry = {
    fileNo: string;
    status: "active" | "archived";
    statusLabel: string;
    yearRange: string;
    yearBg: string;
    company: string;
    role: string;
    location: string;
    duration: string;
    mission: string;
    metrics: Metric[];
    bullets: string[];
    stack: string[];
    awards?: Award[];
};

const EXPERIENCES: ExperienceEntry[] = [
    {
        fileNo: "FILE 001",
        status: "active",
        statusLabel: "★ Active · 2025",
        yearRange: "Apr 2025 - Present",
        yearBg: "25",
        company: "Infosys",
        role: "Digital Specialist Engineer L1",
        location: "Bengaluru, IN",
        duration: "Ongoing",
        mission:
            "Architecting __production-grade__ AI platforms - multi-agent orchestration, streaming inference, and __async pipelines__ that hold up under __real enterprise load__.",
        metrics: [
            { value: "60% → 90%", label: "DAX query accuracy" },
            { value: "Multi-agent", label: "LangGraph orchestration" },
            { value: "RAG", label: "Semantic schema retrieval" },
            { value: "Streaming", label: "Async LLM inference" },
        ],
        bullets: [
            "Migrated the natural language query platform from SQL to DAX, enabling complex multidimensional analytical queries on enterprise datasets.",
            "Improved DAX query accuracy from {{60%}} to {{90%}} by applying Chain-of-Thought prompting and agentic reasoning - a multi-step decomposition approach for ambiguous, multi-part analytical requests.",
            "Designed multi-agent orchestration pipelines using LangGraph - nested agent graphs where a parent agent delegates subtasks to specialised children, enabling modular analytical workflows.",
            "Implemented RAG with Elasticsearch-backed semantic retrieval to replace full schema injection, reducing LLM payload size and query resolution latency.",
            "Re-architected a single synchronous endpoint into a multi-service async orchestration layer with persistent session state, enabling stateful iterative LLM workflows.",
            "Migrated REST endpoints to streaming APIs for long-running LLM inference, cutting client-side timeouts and lifting perceived responsiveness.",
        ],
        stack: ["LangGraph", "DAX", "Elasticsearch", "RAG", "Streaming APIs", "Python", "FastAPI"],
    },
    {
        fileNo: "FILE 002",
        status: "archived",
        statusLabel: "✕ Archived · Apr 2025",
        yearRange: "Jul 2022 - Apr 2025",
        yearBg: "22",
        company: "Infosys",
        role: "Digital Specialist Engineer L0",
        location: "Bengaluru, IN",
        duration: "2 yrs 9 mos",
        mission:
            "Built and shipped enterprise NLQ __from scratch__ - Text-to-SQL, validation pipelines, and a platform that scaled from __prototype__ to {{30,000+}} users across the company.",
        metrics: [
            { value: "30,000+", label: "Platform users reached" },
            { value: "95%", label: "Text-to-SQL accuracy" },
            { value: "100+", label: "Finance users served" },
            { value: "2", label: "Internal awards won" },
        ],
        bullets: [
            "Solely designed and built an internal Text-to-SQL platform from scratch, serving {{100+}} finance users at {{95%}} query accuracy via iterative validation and business rule enforcement pipelines.",
            "Key contributor to Navi Data Assist, a company-wide natural language data access platform that scaled to {{30,000+}} users - drove architectural decisions, resolved key blockers, and led technical problem-solving.",
            "Architected the LLM query processing backend: natural language to validated SQL via prompt engineering, with structured results and enforced schema constraints.",
            "Owned end-to-end AI pipeline performance: payload reduction, selective schema injection, execution environment controls, and output validation.",
        ],
        stack: ["Text-to-SQL", "Prompt Engineering", "LLM Pipelines", "Schema Validation", "Python", "MSSQL"],
        awards: [
            { title: "IS RISE Award", subtitle: "Best AI Project · H1-FY'24" },
            { title: "Insta Award", subtitle: "Navi Data Assist · Dec 2023" },
        ],
    },
];

export function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useHeaderReveal(headerRef);

    return (
        <section
            ref={sectionRef}
            id="experience"
            className="relative w-full bg-black text-white"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col px-8 pt-24 pb-8 md:pt-28 md:pb-10">
                <div ref={headerRef} className="max-w-2xl">
                    <h2
                        data-anim
                        className="mb-4 font-supreme text-5xl font-bold leading-none md:text-6xl"
                    >
                        My <em className="font-instrument font-normal italic">experience</em>.
                    </h2>
                    <p
                        data-anim
                        className="font-supreme text-lg text-white/60 md:text-xl"
                    >
                        Two roles. <em className="font-instrument font-normal text-white/85">3.9 years</em> of building backend systems and AI platforms that hold up <em className="font-instrument font-normal italic text-white/85">in production</em>.
                    </p>
                </div>
            </div>

            {EXPERIENCES.map((exp, i) => (
                <DossierTile key={exp.fileNo} exp={exp} index={i} />
            ))}
        </section>
    );
}

function DossierTile({ exp, index }: { exp: ExperienceEntry; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const yearBgRef = useRef<HTMLDivElement>(null);

    useTileReveal(ref);

    useGSAP(
        () => {
            const root = ref.current;
            const yearEl = yearBgRef.current;
            if (!root || !yearEl || prefersReducedMotion()) return;

            gsap.set(yearEl, { yPercent: 6, force3D: true });

            const parallaxTrigger = ScrollTrigger.create({
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: false,
                animation: gsap.fromTo(
                    yearEl,
                    { yPercent: 6 },
                    { yPercent: -6, ease: "none", force3D: true },
                ),
                // Only promote the giant glyph to its own layer while it is
                // actively scrubbing, so it isn't a permanent compositor cost.
                onToggle: (self) => {
                    yearEl.style.willChange = self.isActive ? "transform" : "auto";
                },
            });

            return () => {
                parallaxTrigger.kill();
                yearEl.style.willChange = "auto";
            };
        },
        { scope: ref },
    );

    const accent = exp.status === "active" ? "text-red-400" : "text-white/50";
    const accentBorder = exp.status === "active" ? "border-red-400/60" : "border-white/30";
    const accentBorderInner = exp.status === "active" ? "border-red-400/40" : "border-white/20";

    return (
        <div
            ref={ref}
            className="relative w-full overflow-hidden"
        >
            <div
                ref={yearBgRef}
                className="pointer-events-none absolute inset-0 flex items-center justify-end"
                aria-hidden="true"
                style={{ transform: "translate3d(0,0,0)" }}
            >
                <span className="select-none font-supreme text-[14rem] font-bold leading-none text-white/[0.035] md:text-[22rem]">
                    {exp.yearBg}
                </span>
            </div>

            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-8 py-12 md:gap-10 md:py-16">
                <div
                    data-tile-block
                    className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="flex flex-col gap-2">
                        <div className="font-jetbrains text-xs uppercase tracking-[0.3em] text-white/40">
                            Entry · {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                            <div className="font-supreme text-3xl font-bold leading-none md:text-5xl">
                                {exp.company}
                            </div>
                            <div className="font-supreme text-xl text-white/60 md:text-2xl">
                                {exp.role}
                            </div>
                        </div>
                    </div>

                    <Stamp
                        label={exp.statusLabel}
                        accent={accent}
                        border={accentBorder}
                        borderInner={accentBorderInner}
                    />
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Mission Brief
                    </div>
                    <p className="max-w-4xl font-supreme text-xl leading-snug text-white/85 md:text-2xl">
                        <RichText text={exp.mission} />
                    </p>
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Key Metrics
                    </div>
                    <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
                        {exp.metrics.map((m) => (
                            <div
                                key={m.label}
                                className="flex min-h-30 flex-col justify-between bg-black p-5 md:min-h-40 md:p-6"
                            >
                                <div className="font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40">
                                    {m.label}
                                </div>
                                <div className="font-supreme text-2xl font-bold leading-none text-white md:text-3xl">
                                    {m.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Operations Log
                    </div>
                    <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
                        {exp.bullets.map((b, i) => (
                            <li
                                key={i}
                                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 md:gap-x-10"
                            >
                                <span className="font-jetbrains text-xs text-white/40">
                                    [{String(i + 1).padStart(2, "0")}]
                                </span>
                                <p className="font-supreme text-base leading-relaxed text-white/75 md:text-lg">
                                    <RichText text={b} />
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Stack Deployed
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {exp.stack.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/15 px-3 py-1.5 font-jetbrains text-xs uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {exp.awards && exp.awards.length > 0 && (
                    <div data-tile-block className="flex flex-col gap-3">
                        <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                            Recognition
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {exp.awards.map((a) => (
                                <AwardSeal key={a.title} award={a} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AwardSeal({ award }: { award: Award }) {
    return (
        <div className="group/seal relative overflow-hidden border border-white/15 bg-white/2 p-5 transition-colors hover:bg-white/4">
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full border border-amber-400/30 transition-transform duration-700 group-hover/seal:scale-110" />
            <div className="pointer-events-none absolute -right-3 -top-3 size-14 rounded-full border border-amber-400/40" />
            <div className="relative flex flex-col gap-1">
                <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
                    ★ Award
                </div>
                <div className="font-supreme text-2xl font-bold leading-tight text-white md:text-3xl">
                    {award.title}
                </div>
                <div className="font-supreme text-base italic text-white/60">
                    {award.subtitle}
                </div>
            </div>
        </div>
    );
}
