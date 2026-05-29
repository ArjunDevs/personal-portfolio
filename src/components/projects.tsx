import { useRef } from "react";

import { ScrollGallery } from "./scroll-gallery";
import { useHeaderReveal, useTileReveal } from "../lib/reveal";
import { Meta, RichText, Stamp } from "./dossier";

import shotLanding   from "../assets/projects/synclabs/Screenshot 2026-05-24 235343.png";
import shotDashboard from "../assets/projects/synclabs/Screenshot 2026-05-24 235248.png";
import shotEditor    from "../assets/projects/synclabs/Screenshot 2026-05-24 235305.png";
import shotShare     from "../assets/projects/synclabs/Screenshot 2026-05-24 235317.png";

type ProjectStatus = "live" | "shipped" | "wip" | "sandbox";
type ProjectLink = { label: string; href: string; primary?: boolean };
type ProjectMedia = { type: "image" | "video"; src: string; alt?: string; poster?: string; caption?: string };

type PersonalProject = {
    noteNo: string;
    noteBg: string;
    status: ProjectStatus;
    statusLabel: string;
    builtIn: string;
    category: string;
    title: string;
    tagline: string;
    itch: string;
    description: string;
    highlights: string[];
    stack: string[];
    links: ProjectLink[];
    media?: ProjectMedia[];
};

const synclabsShots: ProjectMedia[] = [
    { type: "image", src: shotLanding,   alt: "SyncLabs landing page",                                  caption: "Landing" },
    { type: "image", src: shotDashboard, alt: "SyncLabs project dashboard",                             caption: "Dashboard" },
    { type: "image", src: shotShare,     alt: "SyncLabs share settings - role-based access control",    caption: "Share Settings" },
    { type: "image", src: shotEditor,    alt: "SyncLabs collaborative editor with live comments",       caption: "Editor" },
];

const STATUS_STYLES: Record<
    ProjectStatus,
    { accent: string; border: string; borderInner: string }
> = {
    live:    { accent: "text-green-400", border: "border-green-400/60", borderInner: "border-green-400/40" },
    shipped: { accent: "text-sky-400",   border: "border-sky-400/60",   borderInner: "border-sky-400/40" },
    wip:     { accent: "text-amber-400", border: "border-amber-400/60", borderInner: "border-amber-400/40" },
    sandbox: { accent: "text-white/50",  border: "border-white/30",     borderInner: "border-white/20" },
};

const PROJECTS: PersonalProject[] = [
    {
        noteNo: "NOTE 001",
        noteBg: "001",
        status: "shipped",
        statusLabel: "✓ Shipped",
        builtIn: "2024",
        category: "Realtime · Collab",
        title: "SyncLabs",
        tagline: "Realtime collaborative code editor",
        itch:
            "Wanted to understand how Google Docs-style collaboration actually works - __CRDTs__, presence, and conflict-free state sync - by building one __end to end__.",
        description:
            "A fullstack realtime collaborative coding platform supporting simultaneous multi-user editing with {{live state sync}} across distributed clients - file explorer, cursors, presence, and inline commenting.",
        highlights: [
            "CRDT-based conflict resolution via {{Y.js}} and Liveblocks - consistent low-latency updates without centralised locking.",
            "Synchronised file explorer, live cursors, presence, and inline commenting across multiple connected users.",
            "Role-based access control - __owner__, __admin__, __editor__, __viewer__ - for room-level access and sharing.",
            "NextAuth for app-level auth, Liveblocks ID tokens for room-level access, Upstash Redis for rate limiting.",
        ],
        stack: ["Next.js", "TypeScript", "Y.js", "Liveblocks", "NextAuth", "Upstash Redis", "Tailwind"],
        links: [
            { label: "Live", href: "https://synclabs-seven.vercel.app/" },
            { label: "GitHub", href: "https://github.com/ArjunDevs/SyncLabs" },
        ],
        media: synclabsShots,
    }
];

export function PersonalProjects() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useHeaderReveal(headerRef);

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="relative w-full bg-black text-white"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col px-8 pt-28 pb-10 md:pt-32 md:pb-12 lg:pt-40">
                <div ref={headerRef} className="max-w-3xl">
                    <div
                        data-anim
                        className="mb-6 font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40"
                    >
                        Personal Projects
                    </div>
                    <h2
                        data-anim
                        className="mb-4 font-supreme text-5xl font-bold leading-none md:text-6xl"
                    >
                        Things I've built{" "}
                        <em className="font-instrument font-normal italic">outside the day job</em>.
                    </h2>
                    <p
                        data-anim
                        className="font-supreme text-lg text-white/60 md:text-xl"
                    >
                        Side projects where the brief was{" "}
                        <em className="font-instrument font-normal italic text-white/85">mine</em>. Built to learn something{" "}
                        <em className="font-instrument font-normal italic text-white/85">hard</em>, scratch a personal{" "}
                        <em className="font-instrument font-normal italic text-white/85">itch</em>, or just see if it could be{" "}
                        <em className="font-instrument font-normal italic text-white/85">done</em>.
                    </p>
                </div>
            </div>

            {PROJECTS.map((project, i) => (
                <FieldNoteTile key={project.noteNo} project={project} index={i} />
            ))}
        </section>
    );
}

function FieldNoteTile({ project, index }: { project: PersonalProject; index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useTileReveal(ref);

    const style = STATUS_STYLES[project.status];

    return (
        <div ref={ref} className="relative w-full overflow-hidden">
            <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end"
                aria-hidden="true"
            >
                <span className="select-none font-supreme text-[14rem] font-bold leading-none text-white/[0.035] md:text-[22rem]">
                    {project.noteBg}
                </span>
            </div>

            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-8 py-16 md:gap-16 md:py-20 lg:gap-20 lg:py-24">
                <div
                    data-tile-block
                    className="grid grid-cols-2 items-start gap-y-3 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/50 md:grid-cols-4"
                >
                    <Meta label="Note" value={project.noteNo} />
                    <Meta label="Built In" value={project.builtIn} />
                    <Meta label="Status" value={project.statusLabel} />
                    <Meta label="Category" value={project.category} />
                </div>

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
                                {project.title}
                            </div>
                            <div className="font-supreme text-xl italic text-white/60 md:text-2xl">
                                {project.tagline}
                            </div>
                        </div>
                    </div>

                    <Stamp
                        label={project.statusLabel}
                        accent={style.accent}
                        border={style.border}
                        borderInner={style.borderInner}
                    />
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        The Itch
                    </div>
                    <p className="max-w-4xl font-supreme text-xl leading-snug text-white/85 md:text-2xl">
                        <RichText text={project.itch} />
                    </p>
                </div>

                {project.media && project.media.length > 0 && (
                    project.media.length === 1 ? (
                        <div data-tile-block className="flex flex-col gap-3">
                            <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                                Glimpses
                            </div>
                            <MediaCell media={project.media[0]} title={project.title} eager />
                        </div>
                    ) : (
                        <ScrollGallery
                            shots={project.media
                                .filter((m) => m.type === "image")
                                .map((m) => ({
                                    src: m.src,
                                    caption: m.caption ?? "",
                                    alt: m.alt ?? project.title,
                                }))}
                        />
                    )
                )}

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        What It Is
                    </div>
                    <p className="max-w-4xl font-supreme text-base leading-relaxed text-white/75 md:text-lg">
                        <RichText text={project.description} />
                    </p>
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Technique
                    </div>
                    <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
                        {project.highlights.map((h, i) => (
                            <li
                                key={i}
                                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 md:gap-x-10"
                            >
                                <span className="font-jetbrains text-xs text-white/40">
                                    [{String(i + 1).padStart(2, "0")}]
                                </span>
                                <p className="font-supreme text-base leading-relaxed text-white/75 md:text-lg">
                                    <RichText text={h} />
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/15 px-3 py-1.5 font-jetbrains text-xs uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {project.links.length > 0 && (
                    <div data-tile-block className="flex flex-col gap-3">
                        <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                            Where To Find It
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {project.links.map((link) => {
                                const isLive = link.label.toLowerCase() === "live";
                                const base =
                                    "group/link inline-flex items-center gap-3 border px-5 py-3 font-jetbrains text-xs uppercase tracking-[0.25em] transition-colors";
                                const tone = isLive
                                    ? "border-green-400/60 text-green-400 hover:border-green-400 hover:bg-green-400/5"
                                    : "border-white/20 text-white/80 hover:border-white/60 hover:bg-white/5 hover:text-white";
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className={`${base} ${tone}`}
                                    >
                                        <span>{link.label}</span>
                                        <span className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                                            ↗
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MediaCell({
    media,
    title,
    eager = false,
}: {
    media: ProjectMedia;
    title: string;
    eager?: boolean;
}) {
    return (
        <div className="relative w-full overflow-hidden border border-white/10 bg-black">
            {media.type === "video" ? (
                <video
                    className="block h-auto w-full"
                    src={media.src}
                    poster={media.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) : (
                <img
                    className="block h-auto w-full"
                    src={media.src}
                    alt={media.alt ?? title}
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                />
            )}
        </div>
    );
}

