import { useRef } from "react";

import Stack from "./reactbits/stack";
import { useHeaderReveal, useTileReveal } from "../lib/reveal";
import { RichText, Stamp } from "./dossier";

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
            className="relative w-full bg-black text-white pb-20"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-24 pb-8 md:px-8 md:pt-28 md:pb-10">
                <div ref={headerRef} className="max-w-3xl">
                    <div
                        data-anim
                        className="mb-6 font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40"
                    >
                        Personal Projects
                    </div>
                    <h2
                        data-anim
                        className="mb-4 font-supreme text-4xl font-bold leading-none sm:text-5xl md:text-6xl"
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
                <span className="select-none font-supreme text-[8rem] font-bold leading-none text-white/[0.035] sm:text-[14rem] md:text-[22rem]">
                    {project.noteBg}
                </span>
            </div>

            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:gap-10 md:px-8 md:py-16">
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
                            <div className="font-supreme text-xl text-white/60 md:text-2xl">
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

                {project.media && project.media.length > 0 && (
                    project.media.length === 1 ? (
                        <MediaCell media={project.media[0]} title={project.title} eager />
                    ) : (
                        <div data-tile-block className="flex flex-col items-center gap-3 py-2">
                            <div className="relative aspect-16/10 w-full max-w-150">
                                <Stack
                                    sendToBackOnClick
                                    autoplay
                                    autoplayDelay={4000}
                                    pauseOnHover
                                    cardClassName="rounded-none border-4 border-white bg-black"
                                    cards={project.media.map((m, i) => (
                                        <img
                                            key={i}
                                            src={m.src}
                                            alt={m.alt ?? project.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="pointer-events-none h-full w-full object-contain"
                                        />
                                    ))}
                                />
                            </div>
                            <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/35">
                                Click to flip through · {String(project.media.length).padStart(2, "0")} frames
                            </div>
                        </div>
                    )
                )}

                <div data-tile-block className="flex flex-col gap-3">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        The Itch
                    </div>
                    <p className="max-w-4xl font-supreme text-xl leading-snug text-white/85 md:text-2xl">
                        <RichText text={project.itch} />
                    </p>
                </div>

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
                                    "group/link inline-flex items-center gap-2.5 px-6 py-3 font-jetbrains text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300";
                                const tone = isLive
                                    ? "bg-green-400 text-black hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/25"
                                    : "border border-white/25 font-normal text-white/80 hover:border-white/60 hover:bg-white/5 hover:text-white";

                                return (
                                    <a
                                        data-ctype={link.label.toLowerCase()}
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className={`${base} ${tone}`}
                                    >

                                        {!isLive && <GitHubMark className="size-4 pointer-events-none"/>}

                                        <span className="pointer-events-none">{isLive ? "Live Demo" : link.label}</span>

                                        <span className="pointer-events-none transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
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

function GitHubMark({className} : {className: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.83 1.21 1.83 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.28-1.53 3.29-1.21 3.29-1.21.66 1.64.24 2.86.12 3.16.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.09.81 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.83.56C20.57 21.91 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z" />
        </svg>
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
        <div className="mx-auto w-fit overflow-hidden rounded border border-white/15 bg-white/3 p-2 shadow-2xl shadow-black/70">
            {media.type === "video" ? (
                <video
                    className="block max-h-[58vh] w-auto max-w-full rounded-xs object-contain"
                    src={media.src}
                    poster={media.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            ) : (
                <img
                    className="block max-h-[58vh] w-auto max-w-full rounded-xs object-contain"
                    src={media.src}
                    alt={media.alt ?? title}
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                />
            )}
        </div>
    );
}

