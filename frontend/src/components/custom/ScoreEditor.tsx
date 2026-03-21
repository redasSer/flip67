import { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreEditorProps {
    currentScore: number;
    isPending?: boolean;
    allowNegative?: boolean;
    onConfirm: (newScore: number) => void;
    onCancel: () => void;
}

const ScoreEditor = ({ currentScore, isPending, allowNegative = false, onConfirm, onCancel }: ScoreEditorProps) => {
    const [value, setValue] = useState(currentScore);
    // Keep a raw string so the user can type "-" before digits
    const [raw, setRaw] = useState(String(currentScore));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Slight delay so the animation can start before we focus
        const t = setTimeout(() => inputRef.current?.focus(), 80);
        return () => clearTimeout(t);
    }, []);

    const clamp = (n: number) => allowNegative ? n : Math.max(0, n);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        // Allow an optional leading minus, then digits only
        if (!/^-?\d*$/.test(text)) return;
        setRaw(text);
        const parsed = parseInt(text, 10);
        setValue(isNaN(parsed) ? 0 : clamp(parsed));
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") onConfirm(value);
        if (e.key === "Escape") onCancel();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex items-center gap-1.5 w-full"
        >
            {/* Stepper − */}
            <button
                onClick={() => { const next = clamp(value - 1); setValue(next); setRaw(String(next)); }}
                disabled={isPending}
                className="h-9 w-9 shrink-0 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] font-head text-lg font-black flex items-center justify-center active:shadow-none active:translate-x-px active:translate-y-px transition-all disabled:opacity-40"
            >
                <Minus className="h-4 w-4" strokeWidth={3} />
            </button>

            {/* Number input — grows to fill available space */}
            <input
                ref={inputRef}
                type="text"
                inputMode={allowNegative ? "text" : "numeric"}
                pattern={allowNegative ? "-?[0-9]*" : "[0-9]*"}
                value={raw}
                onChange={handleChange}
                onKeyDown={handleKey}
                disabled={isPending}
                className="flex-1 min-w-0 h-9 border-2 border-black bg-accent text-center font-head text-xl font-black tabular-nums shadow-[2px_2px_0_0_#000] focus:outline-none focus:bg-primary disabled:opacity-60"
            />

            {/* Stepper + */}
            <button
                onClick={() => { const next = value + 1; setValue(next); setRaw(String(next)); }}
                disabled={isPending}
                className="h-9 w-9 shrink-0 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] font-head text-lg font-black flex items-center justify-center active:shadow-none active:translate-x-px active:translate-y-px transition-all disabled:opacity-40"
            >
                <Plus className="h-4 w-4" strokeWidth={3} />
            </button>

            {/* Confirm */}
            <button
                onClick={() => onConfirm(value)}
                disabled={isPending}
                className="h-9 w-9 shrink-0 border-2 border-black bg-verify text-white shadow-[2px_2px_0_0_#000] font-head flex items-center justify-center active:shadow-none active:translate-x-px active:translate-y-px transition-all disabled:opacity-40"
            >
                {isPending
                    ? <span className="text-[10px] font-head font-black animate-pulse">...</span>
                    : <Check className="h-4 w-4" strokeWidth={3} />
                }
            </button>

            {/* Cancel */}
            <button
                onClick={onCancel}
                disabled={isPending}
                className="h-9 w-9 shrink-0 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] font-head flex items-center justify-center active:shadow-none active:translate-x-px active:translate-y-px transition-all disabled:opacity-40"
            >
                <X className="h-4 w-4" strokeWidth={3} />
            </button>
        </motion.div>
    );
};

export default ScoreEditor;
