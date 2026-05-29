import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import { Meta } from "./dossier";

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
            className="relative w-full overflow-hidden bg-black text-white"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col px-8 pt-28 pb-8 md:pt-32 lg:pt-40">
                <div
                    data-anim
                    className="mb-8 grid grid-cols-2 items-start gap-y-3 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/50 md:grid-cols-4"
                >
                    <Meta label="File" value="FILE 005" />
                    <Meta label="Section" value="Sign-Off" />
                    <Meta label="Status" value="Open to Roles" />
                    <Meta label="Response" value="< 24 hrs" />
                </div>

                <div
                    data-anim
                    className="mb-6 font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                    Final Transmission
                </div>

                <p data-anim className="font-supreme text-3xl text-white/40 md:text-4xl">
                    Have a problem to solve?
                </p>
                <p data-anim className="font-supreme text-3xl text-white md:text-4xl">
                    Let's <em className="font-instrument font-normal italic">engineer</em> a solution together.
                </p>

                <a
                    href={`mailto:${EMAIL}`}
                    data-anim
                    className="group mt-8 block w-fit"
                    aria-label={`Email ${EMAIL}`}
                >
                    <div className="flex items-end gap-4">
                        <span className="font-supreme text-6xl font-black leading-[0.9] text-white md:text-8xl">
                            Write me an Email
                        </span>
                    </div>
                    <span className="mt-2 block h-px w-0 bg-linear-to-r from-[#A855F7] to-[#06B6D4] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                    <span className="mt-3 block w-fit font-supreme text-xl font-bold text-white/70 transition-colors duration-500 group-hover:text-white md:text-2xl">
                        {EMAIL}
                    </span>
                </a>

                <div
                    data-anim
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 font-supreme text-lg text-white/50"
                >
                    <span>I usually respond in less than 24 hrs.</span>
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
                className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-8 pb-10 font-jetbrains text-[10px] uppercase tracking-[0.25em] text-white/40 md:flex-row md:items-center md:justify-between"
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

            <div className="overflow-hidden">
                <a
                    ref={wordmarkWrapRef}
                    href={`mailto:${EMAIL}`}
                    aria-label={`Email ${EMAIL}`}
                    className="group block"
                >
                    <svg
                        ref={wordmarkRef}
                        viewBox="0 0 488 92"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="block w-full fill-white"
                    >
                        <path d="M487.646 17.408H479.966V90.368H462.046V17.408H454.366V0.768005H487.646V17.408Z" />
                        <path d="M423.495 0.768005H451.655L457.415 90.368H438.215L437.959 71.552H435.911L435.655 90.368H417.735L423.495 0.768005ZM437.959 54.912L437.191 18.688H436.679L435.911 54.912H437.959Z" />
                        <path d="M417.12 90.368H399.2V54.656H397.92V90.368H380V0.768005H397.92V36.736H399.2V0.768005H417.12V90.368Z" />
                        <path d="M360.825 17.792C360.825 17.024 360.612 16.64 360.185 16.64C359.758 16.64 359.545 17.024 359.545 17.792V73.344C359.545 74.112 359.758 74.496 360.185 74.496C360.612 74.496 360.825 74.112 360.825 73.344V51.2H378.745V73.216C378.745 78.6773 377.081 83.0293 373.753 86.272C370.425 89.5147 365.945 91.136 360.313 91.136C354.681 91.136 350.158 89.5147 346.745 86.272C343.332 82.944 341.625 78.592 341.625 73.216V17.92C341.625 12.544 343.332 8.23467 346.745 4.992C350.158 1.664 354.681 0 360.313 0C365.945 0 370.425 1.62133 373.753 4.864C377.081 8.10666 378.745 12.4587 378.745 17.92V35.968H360.825V17.792Z" />
                        <path d="M296.87 0.768005H325.03L330.79 90.368H311.59L311.334 71.552H309.286L309.03 90.368H291.11L296.87 0.768005ZM311.334 54.912L310.566 18.688H310.054L309.286 54.912H311.334Z" />
                        <path d="M253.125 0.768005H280.005V17.408H271.045V36.096H279.365V52.736H271.045V73.728H280.645V90.368H253.125V0.768005Z" />
                        <path d="M246.411 90.368H218.251L212.235 0.768005H231.435L232.331 56.96L232.715 72.448H233.227L233.611 56.96L234.507 0.768005H252.427L246.411 90.368Z" />
                        <path d="M181.245 0.768005H209.405L215.165 90.368H195.965L195.709 71.552H193.661L193.405 90.368H175.485L181.245 0.768005ZM195.709 54.912L194.941 18.688H194.429L193.661 54.912H195.709Z" />
                        <path d="M174.87 90.368H156.95V54.656H155.67V90.368H137.75V0.768005H155.67V36.736H156.95V0.768005H174.87V90.368Z" />
                        <path d="M126.367 73.216C126.367 78.592 124.66 82.944 121.247 86.272C117.833 89.5147 113.311 91.136 107.679 91.136C102.047 91.136 97.5666 89.5147 94.2386 86.272C90.9106 83.0293 89.2466 78.6773 89.2466 73.216V57.6H107.167V73.344C107.167 74.112 107.38 74.496 107.807 74.496C108.233 74.496 108.447 74.112 108.447 73.344V60.16C108.447 58.5387 107.935 57.0453 106.911 55.68C105.887 54.3147 104.436 52.6507 102.559 50.688L99.9986 47.872C98.9746 46.7627 97.8226 45.5253 96.5426 44.16C95.3479 42.7093 94.1959 41.1307 93.0866 39.424C91.9772 37.632 91.0386 35.712 90.2706 33.664C89.5879 31.5307 89.2466 29.312 89.2466 27.008V17.92C89.2466 12.544 90.9533 8.23467 94.3666 4.992C97.7799 1.664 102.303 0 107.935 0C113.567 0 118.047 1.62133 121.375 4.864C124.703 8.10666 126.367 12.4587 126.367 17.92V29.568H108.447V17.792C108.447 17.024 108.233 16.64 107.807 16.64C107.38 16.64 107.167 17.024 107.167 17.792V27.008C107.167 28.7147 107.636 30.2507 108.575 31.616C109.599 32.9813 111.092 34.6453 113.055 36.608L115.615 39.296C116.639 40.4053 117.748 41.6853 118.943 43.136C120.223 44.5013 121.417 46.08 122.527 47.872C123.636 49.5787 124.532 51.4987 125.215 53.632C125.983 55.68 126.367 57.856 126.367 60.16V73.216Z" />
                        <path d="M88.6457 17.408H80.9657V90.368H63.0457V17.408H55.3657V0.768005H88.6457V17.408Z" />
                        <path d="M27.375 0.768005H54.255V17.408H45.295V36.096H53.615V52.736H45.295V73.728H54.895V90.368H27.375V0.768005Z" />
                        <path d="M17.92 0.768005V73.728H26.496V90.368H0V0.768005H17.92Z" />
                    </svg>
                </a>
            </div>
        </section>
    );
}
