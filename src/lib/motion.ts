import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Imperatively watch whether an element is on-screen. Fires `onChange(true)`
 * when it enters the viewport and `onChange(false)` when it leaves (and when
 * the tab is hidden). Returns a cleanup function.
 *
 * Used to pause expensive always-on animations (WebGL shader, infinite
 * marquees) while their host is not visible.
 */
export function observeInView(
    el: Element,
    onChange: (inView: boolean) => void,
    options?: IntersectionObserverInit,
): () => void {
    let intersecting = false;

    const emit = () => onChange(intersecting && !document.hidden);

    const observer = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        emit();
    }, options);
    observer.observe(el);

    document.addEventListener("visibilitychange", emit);

    return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", emit);
    };
}

/** Hook variant of {@link observeInView} for components that drive React state. */
export function useInView<T extends Element>(
    options?: IntersectionObserverInit,
): { ref: React.RefObject<T | null>; inView: boolean } {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        return observeInView(el, setInView, options);
    }, [options]);

    return { ref, inView };
}
