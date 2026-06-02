/**
 * Renders inline rich text: `{{value}}` becomes an oversized bold span and
 * `__value__` becomes an italic serif emphasis. Used by the experience and
 * project tiles, which share this micro-syntax.
 */
export function RichText({ text }: { text: string }) {
    const parts = text.split(/(\{\{[^}]+\}\}|__[^_]+__)/g);
    return parts.map((part, i) => {
        const big = part.match(/^\{\{([^}]+)\}\}$/);
        if (big) {
            return (
                <span
                    key={i}
                    className="mx-1 inline-block font-supreme text-2xl font-bold leading-none text-white align-middle md:text-3xl"
                >
                    {big[1]}
                </span>
            );
        }
        const ital = part.match(/^__([^_]+)__$/);
        if (ital) {
            return (
                <em key={i} className="font-instrument font-normal italic">
                    {ital[1]}
                </em>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-white/35">{label}</span>
            <span className="text-white/80 normal-case tracking-normal font-supreme text-sm font-bold">
                {value}
            </span>
        </div>
    );
}

export function Stamp({
    label,
    accent,
    border,
    borderInner,
}: {
    label: string;
    accent: string;
    border: string;
    borderInner: string;
}) {
    return (
        <div className={`w-fit shrink-0 -rotate-6 border-2 ${border} p-1`}>
            <div className={`border ${borderInner} px-4 py-2 md:px-5 md:py-2.5`}>
                <span className={`font-jetbrains text-xs font-bold uppercase tracking-[0.3em] ${accent} md:text-sm`}>
                    {label}
                </span>
            </div>
        </div>
    );
}
