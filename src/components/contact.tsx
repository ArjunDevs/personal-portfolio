import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";

const EMAIL = "arjuntandonprofessional@gmail.com";

const arrowEase = "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

type Channel = {
    label: string;
    handle: string;
    href: string;
    kind: "email" | "external" | "download";
};

const CHANNELS: Channel[] = [
    { label: "Email", handle: EMAIL, href: `mailto:${EMAIL}`, kind: "email" },
    { label: "GitHub", handle: "@ArjunDevs", href: "https://github.com/ArjunDevs", kind: "external" },
    {
        label: "LinkedIn",
        handle: "in/arjun-tandon",
        href: "https://www.linkedin.com/in/arjun-tandon-9326983a9/",
        kind: "external",
    },
    { label: "Resume", handle: "Backend · PDF", href: "/resume/ArjunTandon_Backend.pdf", kind: "download" },
];

const ARROW: Record<Channel["kind"], { glyph: string; motion: string }> = {
    email: { glyph: "→", motion: "group-hover/ch:translate-x-1" },
    external: { glyph: "↗", motion: "group-hover/ch:translate-x-0.5 group-hover/ch:-translate-y-0.5" },
    download: { glyph: "↓", motion: "group-hover/ch:translate-y-1" },
};

export function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const wordmarkWrapRef = useRef<HTMLAnchorElement>(null);
    const wordmarkRef = useRef<SVGSVGElement>(null);

    useGSAP(
        () => {
            const root = sectionRef.current;
            if (!root || prefersReducedMotion()) return;

            // Staggered reveal for the editorial content, matching the rest of
            // the site's section intros.
            gsap.from(root.querySelectorAll("[data-anim]"), {
                opacity: 0,
                y: 28,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: root, start: "top 70%", once: true },
            });

            // Masked rise for the giant wordmark as it enters view.
            const mark = wordmarkRef.current;
            if (mark) {
                gsap.fromTo(
                    mark,
                    { yPercent: 38 },
                    {
                        yPercent: 0,
                        duration: 1.3,
                        ease: "power3.out",
                        force3D: true,
                        scrollTrigger: { trigger: mark, start: "top 95%", once: true },
                    },
                );
            }

            // Cursor-follow parallax on the wordmark, echoing the hero wordmark
            // so the page opens and closes on the same gesture.
            const wrap = wordmarkWrapRef.current;
            if (wrap) {
                const x = gsap.quickTo(wrap, "x", { duration: 1.2, ease: "power3.out" });
                const y = gsap.quickTo(wrap, "y", { duration: 1.2, ease: "power3.out" });
                const onMove = (e: MouseEvent) => {
                    const rect = root.getBoundingClientRect();
                    const cx = (e.clientX - rect.left) / rect.width - 0.5;
                    const cy = (e.clientY - rect.top) / rect.height - 0.5;
                    x(cx * 22);
                    y(cy * 12);
                };
                root.addEventListener("mousemove", onMove);
                return () => root.removeEventListener("mousemove", onMove);
            }
        },
        { scope: sectionRef },
    );

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-black text-white flex flex-col"
        >
            <div className="flex-1 justify-between mx-auto flex w-full flex-col px-8 pt-8 pb-8">
                <div
                    data-anim
                    className="mb-6 font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                    Final Transmission
                </div>
                
                <div>
                    <p data-anim className="font-supreme text-3xl text-white/40 md:text-4xl">
                        Have a problem to solve?
                    </p>
                    <p data-anim className="font-supreme text-3xl text-white md:text-4xl">
                        Let's <em className="font-instrument font-normal italic">engineer</em> a solution together.
                    </p>
                </div>
                

                <div>
                    <a
                        data-ctype="email"
                        href={`mailto:${EMAIL}`}
                        data-anim
                        className="group mt-8 block w-fit"
                        aria-label={`Email ${EMAIL}`}
                    >
                        <div className="pointer-events-none">
                            <div className="flex items-end gap-4">
                                <span className="font-supreme text-6xl font-black leading-[0.9] text-white md:text-8xl">
                                    Write me an Email !
                                </span>
                            </div>
                            <span className="mt-2 block h-px w-0 bg-linear-to-r from-[#A855F7] to-[#06B6D4] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                            <span className="mt-3 block w-fit font-supreme text-xl font-bold text-white/70 transition-colors duration-500 group-hover:text-white md:text-2xl">
                                {EMAIL}
                            </span>
                        </div>
                        
                    </a>

                    <div
                        data-anim
                        className="flex flex-wrap items-center gap-x-3 gap-y-1 font-supreme text-lg text-white/50"
                    >
                        <span>I usually respond in less than 24 hrs.</span>
                    </div>
                </div>
                

                <div data-anim className="mt-10">
                    <div className="mb-4 font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Channels
                    </div>
                    <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 md:grid-cols-4">
                        {CHANNELS.map((c) => {
                            const arrow = ARROW[c.kind];
                            return (
                                <a
                                    key={c.label}
                                    href={c.href}
                                    {...(c.kind === "external"
                                        ? { target: "_blank", rel: "noreferrer noopener" }
                                        : {})}
                                    {...(c.kind === "download" ? { download: true } : {})}
                                    className="group/ch flex min-h-32 flex-col justify-between bg-black p-5 transition-colors hover:bg-white/3 md:min-h-40 md:p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40">
                                            {c.label}
                                        </span>
                                        <span
                                            className={`inline-block text-white/40 group-hover/ch:text-white ${arrowEase} ${arrow.motion}`}
                                            aria-hidden="true"
                                        >
                                            {arrow.glyph}
                                        </span>
                                    </div>
                                    <span className="break-all font-supreme text-base font-bold text-white/80 transition-colors duration-500 group-hover/ch:text-white md:text-lg">
                                        {c.handle}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div
                data-anim
                className="mx-auto flex w-full flex-col gap-4 px-8 pb-5 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40 md:flex-row md:items-center md:justify-between"
            >
                <span>© MMXXVI · Arjun Tandon</span>
                <span className="text-white/30">
                    Designed &amp; Built by Arjun · React · GSAP · Tailwind
                </span>
                <div className="flex items-center gap-6">
                    <a href="#hero" className="group flex items-center gap-2 hover:text-white">
                        <span>Back to the Top</span>
                        <span
                            className={`inline-block ${arrowEase} group-hover:-translate-y-1`}
                            aria-hidden="true"
                        >
                            ↑
                        </span>
                    </a>
                    <span className="text-white/30">INDEX 005 / SIGN-OFF</span>
                </div>
            </div>
        </section>
    );
}
