import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import PlasmaWave from "./reactbits/plasma-wave";

const WEATHER_CODE_LABELS: Record<number, string> = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    56: "Freezing Drizzle",
    57: "Freezing Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    66: "Freezing Rain",
    67: "Rreezing Rain",
    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Showers",
    85: "Snow Showers",
    86: "Snow Showers",
    95: "Shunderstorm",
    96: "Shunderstorm",
    99: "Thunderstorm",
};

const istTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

const LATITUDE = 12.97158;
const LONGITUDE = 77.59456;

const toDMS = (deg: number, positive: "N" | "E", negative: "S" | "W") => {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const minFloat = (abs - d) * 60;
    const m = Math.floor(minFloat);
    const s = ((minFloat - m) * 60).toFixed(1);
    return `${d}° ${m}' ${s}" ${deg >= 0 ? positive : negative}`;
};

const coordinateLabel = `${toDMS(LATITUDE, "N", "S")}, ${toDMS(LONGITUDE, "E", "W")}`;

export function Hero() {
    const [istTime, setIstTime] = useState(() => istTimeFormatter.format(new Date()));
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [displayTemp, setDisplayTemp] = useState(0);

    const heroRef = useRef<HTMLElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const indexRef = useRef<HTMLDivElement>(null);
    const wordmarkRef = useRef<SVGSVGElement>(null);
    const starRef = useRef<HTMLSpanElement>(null);
    const raysRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tick = () => setIstTime(istTimeFormatter.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code`,
            { signal: controller.signal },
        )
            .then((res) => res.json())
            .then((data) => {
                setWeather({
                    temp: data.current.temperature_2m,
                    code: data.current.weather_code,
                });
            })
            .catch(() => {});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!weather) return;
        const obj = { val: 0 };
        const tween = gsap.to(obj, {
            val: weather.temp,
            duration: 1.0,
            ease: "power2.out",
            onUpdate: () => setDisplayTemp(Math.round(obj.val)),
        });
        return () => {
            tween.kill();
        };
    }, [weather]);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const root = heroRef.current;
            if (!root) return;

            gsap.to(starRef.current, {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: "none",
            });

            const wordmarkX = gsap.quickTo(wordmarkRef.current, "x", {
                duration: 1.2,
                ease: "power3.out",
            });
            const wordmarkY = gsap.quickTo(wordmarkRef.current, "y", {
                duration: 1.2,
                ease: "power3.out",
            });
            const taglineX = gsap.quickTo(taglineRef.current, "x", {
                duration: 1.4,
                ease: "power3.out",
            });
            const taglineY = gsap.quickTo(taglineRef.current, "y", {
                duration: 1.4,
                ease: "power3.out",
            });

            const onMove = (e: MouseEvent) => {
                const rect = root.getBoundingClientRect();
                const cx = (e.clientX - rect.left) / rect.width - 0.5;
                const cy = (e.clientY - rect.top) / rect.height - 0.5;
                wordmarkX(cx * 18);
                wordmarkY(cy * 18);
                taglineX(cx * 10);
                taglineY(cy * 10);
            };

            root.addEventListener("mousemove", onMove);

            return () => {
                root.removeEventListener("mousemove", onMove);
            };
        },
        { scope: heroRef },
    );

    const weatherLabel = weather
        ? `${displayTemp}° C, ${WEATHER_CODE_LABELS[weather.code] ?? "-"}`
        : "-";

    const arrowEase = "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

    return (
        <section
            id="hero"
            ref={heroRef}
            className="relative flex h-screen w-full flex-col bg-black text-white font-jetbrains overflow-hidden"
        >
            <div
                ref={raysRef}
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
            >
                <PlasmaWave
                    colors={["#A855F7","#06B6D4"]}
                    speed1={0.05}
                    speed2={0.05}
                    focalLength={0.8}
                    bend1={1}
                    bend2={0.5}
                    dir2={1}
                    rotationDeg={0}
                />
            </div>

            <header className="relative z-10 flex items-center justify-between px-8 pt-5 pb-4 text-xs tracking-wide">
                <div className="flex items-center gap-2" data-header-item>
                    <span ref={starRef} className="text-white/50 inline-block">✱</span>
                    <span className="font-jetbrains">ARJUN TANDON</span>
                </div>
                <nav className="flex gap-8">
                    <a data-ctype="nav" href="#about" data-header-item><span className="text-white/40 font-jetbrains pointer-events-none">01 · </span>ABOUT</a>
                    <a data-ctype="nav" href="#experience" data-header-item><span className="text-white/40 font-jetbrains pointer-events-none">02 · </span>EXPERIENCE</a>
                    <a data-ctype="nav" href="#projects" data-header-item><span className="text-white/40 font-jetbrains pointer-events-none">03 · </span>PROJECTS</a>
                    <a data-ctype="nav" href="#contact" data-header-item><span className="text-white/40 font-jetbrains pointer-events-none">04 · </span>CONTACT</a>
                </nav>
            </header>

            <div className="relative z-10 flex flex-row justify-between items-center gap-6 px-8 pt-5 leading-relaxed text-sm">
                <div data-meta-item>
                    <div className="mb-2 text-xs text-white/40 uppercase tracking-wider font-jetbrains">The Role</div>
                    <div className="font-supreme font-bold text-base">Software Engineer</div>
                    <div className="text-sm text-white/50 font-supreme">Backend · Full Stack · Generative AI</div>
                </div>
                <div data-meta-item>
                    <div className="mb-2 text-xs text-white/40 uppercase tracking-wider font-jetbrains">Based In</div>
                    <div className="font-supreme font-bold text-base">Bangalore, Karnataka, IN</div>
                    <div className="text-sm text-white/50 font-supreme">{coordinateLabel}</div>
                </div>
                <a data-ctype="email" href="mailto:arjuntandonprofessional@gmail.com" className="group block" data-meta-item>
                    <div className="pointer-events-none">
                        <div className="mb-2 text-xs text-white/40 uppercase tracking-wider font-jetbrains">Status</div>
                        <div className="flex items-center gap-2 font-supreme font-bold text-base transition-colors group-hover:text-white/70">
                            <span className="relative inline-flex size-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                            </span>
                            Open to Roles
                            <span className={`inline-block ${arrowEase} group-hover:translate-x-1`}>→</span>
                        </div>
                        <div className="text-sm text-white/50 font-supreme">Full-time · Pan-India · Remote</div>
                    </div>  
                </a>
                <a
                    href="/resume/ArjunTandon_Backend.pdf"
                    download
                    className="group block"
                    data-meta-item
                    data-ctype="download"
                >
                    <div className="pointer-events-none">
                        <div className="mb-2 text-xs text-white/40 uppercase tracking-wider font-jetbrains">Resume</div>
                        <div className="flex items-center gap-1.5 font-supreme font-bold text-base transition-colors group-hover:text-white/70">
                            Click To Download PDF
                            <span className={`inline-block ${arrowEase} group-hover:translate-y-1`}>↓</span>
                        </div>
                        <div className="text-sm text-white/50 font-supreme">Updated May 2026</div>
                    </div>
                </a>
                <div className="text-right min-w-44" data-meta-item>
                    <div className="mb-2 text-xs text-white/40 uppercase tracking-wider font-jetbrains">Local Time</div>
                    <div className="font-supreme font-bold text-base">
                        {(() => {
                            const [hh, mm] = istTime.split(":");
                            return (
                                <>
                                    {hh}
                                    <span className="animate-breathe"> : </span>
                                    {mm} IST
                                </>
                            );
                        })()}
                    </div>
                    <div className="text-sm text-white/50 font-supreme">{weatherLabel}</div>
                </div>
            </div>

            <div className="relative z-10 mt-auto flex items-end justify-between gap-8 px-8 pb-4">
                <p ref={taglineRef} className="max-w-lg text-2xl leading-relaxed font-supreme">
                    I ship <em className="font-instrument">thoughtfully crafted</em> products - frontends, backends, and infrastructure that feel effortless.
                </p>
                <div ref={indexRef} className="text-right text-xs text-white/50 tracking-wider font-jetbrains">
                    <div>INDEX 001 / PORTFOLIO</div>
                    <div>MMXXVI</div>
                </div>
            </div>

            <svg
                ref={wordmarkRef}
                viewBox="0 0 466 92"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 overflow-hidden"
            >
                <path d="M465.613 90.3681H438.605L433.741 25.0881H433.229L434.637 53.8881L436.045 90.3681H418.765V0.768066H445.773L450.765 66.0481H451.277L449.741 37.2481L448.333 0.768066H465.613V90.3681Z" />
                <path d="M380.39 17.92C380.39 12.544 382.097 8.23467 385.51 4.992C388.923 1.664 393.446 0 399.078 0C404.71 0 409.19 1.62133 412.518 4.864C415.846 8.10666 417.51 12.4587 417.51 17.92V73.216C417.51 78.6773 415.846 83.0293 412.518 86.272C409.19 89.5147 404.71 91.136 399.078 91.136C393.446 91.136 388.923 89.5147 385.51 86.272C382.097 82.944 380.39 78.592 380.39 73.216V17.92ZM398.95 74.496C399.377 74.496 399.59 74.112 399.59 73.344V17.792C399.59 17.024 399.377 16.64 398.95 16.64C398.523 16.64 398.31 17.024 398.31 17.792V73.344C398.31 74.112 398.523 74.496 398.95 74.496Z" />
                <path d="M379.135 72.4481C379.135 77.9094 377.471 82.2614 374.143 85.5041C370.815 88.7467 366.335 90.3681 360.703 90.3681H342.015V0.768066H360.703C366.335 0.768066 370.815 2.3894 374.143 5.63206C377.471 8.87474 379.135 13.2267 379.135 18.6881V72.4481ZM361.215 18.9441C361.215 17.9201 361.002 17.4081 360.575 17.4081H359.935V73.7281H360.575C361.002 73.7281 361.215 73.2161 361.215 72.1921V18.9441Z" />
                <path d="M340.738 90.3681H313.73L308.866 25.0881H308.354L309.762 53.8881L311.17 90.3681H293.89V0.768066H320.898L325.89 66.0481H326.402L324.866 37.2481L323.458 0.768066H340.738V90.3681Z" />
                <path d="M259.385 0.768066H287.545L293.305 90.3681H274.105L273.849 71.5521H271.801L271.545 90.3681H253.625L259.385 0.768066ZM273.849 54.9121L273.081 18.6881H272.569L271.801 54.9121H273.849Z" />
                <path d="M256.661 17.4081H248.981V90.3681H231.061V17.4081H223.381V0.768066H256.661V17.4081Z" />
                <path d="M201.988 90.3681H174.98L170.116 25.0881H169.604L171.012 53.8881L172.42 90.3681H155.14V0.768066H182.148L187.14 66.0481H187.652L186.116 37.2481L184.708 0.768066H201.988V90.3681Z" />
                <path d="M153.885 73.2161C153.885 78.6774 152.221 83.0294 148.893 86.2721C145.565 89.5147 141.085 91.1361 135.453 91.1361C129.821 91.1361 125.298 89.5147 121.885 86.2721C118.472 82.9441 116.765 78.5921 116.765 73.2161V0.768066H134.685V72.9601C134.685 73.9841 134.898 74.4961 135.325 74.4961C135.752 74.4961 135.965 73.9841 135.965 72.9601V0.768066H153.885V73.2161Z" />
                <path d="M115.51 73.2161C115.51 78.6774 113.846 83.0294 110.518 86.2721C107.19 89.5147 102.71 91.1361 97.0781 91.1361C91.4461 91.1361 86.9235 89.5147 83.5101 86.2721C80.0968 82.9441 78.3901 78.5921 78.3901 73.2161V51.2001H96.3101V73.3441C96.3101 74.1121 96.5235 74.4961 96.9501 74.4961C97.3768 74.4961 97.5901 74.1121 97.5901 73.3441V0.768066H115.51V73.2161Z" />
                <path d="M59.4651 54.7841C59.4651 53.7601 59.2518 53.2481 58.8251 53.2481H58.1851V90.3681H40.2651V0.768066H60.2331C65.6945 0.768066 69.9185 2.34673 72.9051 5.50407C75.8918 8.6614 77.3851 13.0561 77.3851 18.6881V30.3361C77.3851 34.9441 76.7878 38.2721 75.5931 40.3201C74.4838 42.3681 72.4358 43.8187 69.4491 44.6721V45.1841C72.4358 46.1227 74.4838 47.9147 75.5931 50.5601C76.7878 53.1201 77.3851 56.9601 77.3851 62.0801V78.5921C77.3851 80.8961 77.4705 82.8161 77.6411 84.3521C77.8971 85.8881 78.2385 87.8081 78.6651 90.1121V90.3681H60.7451C60.3185 88.0641 59.9771 86.1014 59.7211 84.4801C59.5505 82.8587 59.4651 80.8961 59.4651 78.5921V54.7841ZM59.4651 18.9441C59.4651 17.9201 59.2518 17.4081 58.8251 17.4081H58.1851V36.6081H58.8251C59.2518 36.6081 59.4651 36.0961 59.4651 35.0721V18.9441Z" />
                <path d="M5.76 0.768066H33.92L39.68 90.3681H20.48L20.224 71.5521H18.176L17.92 90.3681H0L5.76 0.768066ZM20.224 54.9121L19.456 18.6881H18.944L18.176 54.9121H20.224Z" />
            </svg>
        </section>
    )
}
