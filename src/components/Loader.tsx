import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
    onComplete: () => void;
}

const STRIP_COUNT = 12;

const STATUS_STEPS = [
    { threshold: 0, label: "INITIALIZING" },
    { threshold: 15, label: "ENDERING PLASMA" },
    { threshold: 35, label: "MOUNTING HERO" },
    { threshold: 60, label: "LOADING TYPOGRAPHY" },
    { threshold: 85, label: "FINAL CALIBRATION" },
    { threshold: 100, label: "READY" },
] as const;

function getStatus(p: number) {
    let label: string = STATUS_STEPS[0].label;
    for (const s of STATUS_STEPS) {
        if (p >= s.threshold) label = s.label;
    }
    return label;
}

export function Loader({ onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0);
    const numberRef = useRef<HTMLSpanElement>(null);
    const stripsRef = useRef<(HTMLDivElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef({ value: 0 });
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const setTarget = (v: number) => {
            if (v <= targetRef.current.value) return;
            tweenRef.current?.kill();
            tweenRef.current = gsap.to(targetRef.current, {
                value: v,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () =>
                    setProgress(Math.round(targetRef.current.value)),
            });
        };

        setTarget(15);

        const handleReadyState = () => {
            if (document.readyState === "interactive") setTarget(35);
            if (document.readyState === "complete") setTarget(85);
        };
        handleReadyState();
        document.addEventListener("readystatechange", handleReadyState);

        document.fonts.ready.then(() => setTarget(60));

        const minTimer = window.setTimeout(() => setTarget(100), 1800);

        return () => {
            document.removeEventListener("readystatechange", handleReadyState);
            clearTimeout(minTimer);
            tweenRef.current?.kill();
        };
    }, []);

    useEffect(() => {
        if (progress < 100) return;

        const tl = gsap.timeline({
            onComplete: () => onCompleteRef.current(),
            delay: 0.3,
        });

        tl.to([headerRef.current, footerRef.current, numberRef.current], {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
        });

        tl.to(
            stripsRef.current.filter(Boolean),
            {
                yPercent: 100,
                duration: 0.9,
                ease: "expo.inOut",
                stagger: { each: 0.04, from: "start" },
            },
            ">-0.1",
        );

        return () => {
            tl.kill();
        };
    }, [progress]);

    const status = getStatus(progress);
    const progressStr = String(progress).padStart(3, "0");

    return (
        <div
            role="status"
            aria-label={`Loading, ${progress} percent`}
            className="fixed inset-0 z-100 overflow-hidden"
        >
            <div className="absolute inset-0 flex">
                {Array.from({ length: STRIP_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            stripsRef.current[i] = el;
                        }}
                        className="h-full flex-1 bg-white"
                        style={{
                            borderRight:
                                i < STRIP_COUNT - 1
                                    ? "1px solid rgba(0, 0, 0, 0.1)"
                                    : "none",
                        }}
                    />
                ))}
            </div>

            <div
                ref={headerRef}
                className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-8 pt-5 text-xs tracking-wide text-black font-jetbrains"
            >
                <div className="flex items-center gap-2">
                    <span className="text-black/50 animate-breathe">✱</span>
                    <span className="font-bold">ARJUN TANDON</span>
                </div>
                <div className="text-right leading-relaxed">
                    <div>INDEX 000 / PORTFOLIO</div>
                    <div className="text-black/50">MMXXVI</div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span
                    ref={numberRef}
                    className="font-humane text-black font-black tabular-nums leading-none select-none"
                    style={{ fontSize: "clamp(10rem, 38vw, 38rem)" }}
                >
                    {progressStr}
                </span>
            </div>

            <div
                ref={footerRef}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-8 pb-5"
            >
                <div className="relative mb-3 h-px w-full overflow-hidden bg-black/10">
                    <div
                        className="absolute inset-y-0 left-0 bg-black"
                        style={{
                            width: `${progress}%`,
                            transition: "width 0.3s ease-out",
                        }}
                    />
                </div>
                <div className="flex items-end justify-between text-xs tracking-wide text-black font-jetbrains">
                    <div>
                        <div className="font-bold">LOADING</div>
                        <div className="mt-1 flex items-center gap-2 text-black/60">
                            <span className="text-black animate-breathe">▶</span>
                            <span className="inline-block min-w-45">
                                {status}
                            </span>
                            <span className="text-black animate-breathe">_</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-black tabular-nums">
                            {progressStr}
                        </span>
                        <span className="text-black/40"> / 100</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
