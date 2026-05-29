import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export type GalleryShot = { src: string; caption: string; alt: string };

/**
 * Full-bleed, scroll-pinned horizontal pan through a project's screenshots.
 * On desktop with motion allowed the section pins and the track scrubs sideways
 * with the page scroll; on touch / reduced-motion it degrades to a plain
 * captioned vertical stack (the GSAP setup never runs in that case because the
 * matchMedia query doesn't match, and the stack/pan subtrees are toggled by the
 * same query in CSS).
 */
export function ScrollGallery({ shots }: { shots: GalleryShot[] }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const total = shots.length;

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add(
                "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
                () => {
                    const track = trackRef.current;
                    const pin = pinRef.current;
                    if (!track || !pin) return;

                    const distance = () => track.scrollWidth - window.innerWidth;

                    gsap.to(track, {
                        x: () => -distance(),
                        ease: "none",
                        scrollTrigger: {
                            trigger: pin,
                            start: "top top",
                            end: () => "+=" + distance(),
                            pin: true,
                            scrub: 1,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                const idx = Math.round(self.progress * (total - 1));
                                setActive((prev) => (prev === idx ? prev : idx));
                            },
                        },
                    });
                },
            );

            return () => mm.revert();
        },
        { scope: rootRef },
    );

    return (
        <div ref={rootRef} className="w-full">
            {/* Pan — desktop + motion-safe */}
            <div className="hidden md:motion-safe:block">
                <div
                    ref={pinRef}
                    className="relative h-screen overflow-hidden bg-black"
                    style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
                >
                    <div ref={trackRef} className="flex h-full items-center will-change-transform">
                        {shots.map((shot, i) => (
                            <figure
                                key={i}
                                className="flex h-full w-screen shrink-0 items-center justify-center px-[7vw]"
                            >
                                <img
                                    src={shot.src}
                                    alt={shot.alt}
                                    draggable={false}
                                    className="max-h-[72vh] w-auto max-w-full select-none border border-white/12 object-contain"
                                />
                            </figure>
                        ))}
                    </div>

                    <div className="pointer-events-none absolute inset-0 px-[7vw] py-10">
                        <div className="flex justify-end font-jetbrains text-[10px] uppercase tracking-[0.3em] text-white/40">
                            <span className="tabular-nums text-white/60">
                                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stack — mobile or reduced-motion */}
            <div className="flex flex-col gap-10 md:motion-safe:hidden">
                {shots.map((shot, i) => (
                    <div key={i} className="overflow-hidden border border-white/10 bg-black">
                        <img
                            src={shot.src}
                            alt={shot.alt}
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
