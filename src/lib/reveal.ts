import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

/**
 * Staggered reveal for a tile's `[data-tile-block]` children when it scrolls
 * into view. Shared by the experience and project tiles.
 */
export function useTileReveal(ref: RefObject<HTMLElement | null>) {
    useGSAP(
        () => {
            const root = ref.current;
            if (!root || prefersReducedMotion()) return;

            const trigger = ScrollTrigger.create({
                trigger: root,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.from(root.querySelectorAll("[data-tile-block]"), {
                        opacity: 0,
                        y: 24,
                        duration: 0.6,
                        ease: "power3.out",
                        stagger: 0.06,
                        force3D: true,
                    });
                },
            });

            return () => trigger.kill();
        },
        { scope: ref },
    );
}

/**
 * Staggered reveal for a section header's `[data-anim]` children. Shared by the
 * experience and project section intros.
 */
export function useHeaderReveal(ref: RefObject<HTMLElement | null>) {
    useGSAP(
        () => {
            const root = ref.current;
            if (!root || prefersReducedMotion()) return;

            gsap.from(root.querySelectorAll("[data-anim]"), {
                opacity: 0,
                y: 28,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: root,
                    start: "top 75%",
                    once: true,
                },
            });
        },
        { scope: ref },
    );
}
