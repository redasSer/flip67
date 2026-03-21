import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreEditor from "@/components/custom/ScoreEditor";
import { Pencil } from "lucide-react";

interface PlayerBarProps {
    rank: number;
    name: string;
    avatar: string;
    score: number;
    isSelf?: boolean;
    allowNegative?: boolean;
    onScoreEdit?: (newScore: number) => Promise<void>;
}

const PlayerBar = ({ rank, name, avatar, score, isSelf = false, allowNegative = false, onScoreEdit }: PlayerBarProps) => {
    const [editing, setEditing] = useState(false);
    const [pending, setPending] = useState(false);

    const handleConfirm = async (newScore: number) => {
        if (!onScoreEdit || newScore === score) { setEditing(false); return; }
        setPending(true);
        try {
            await onScoreEdit(newScore);
        } finally {
            setPending(false);
            setEditing(false);
        }
    };

    return (
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className={`relative w-full flex flex-col border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 overflow-visible ${
                isSelf ? "bg-tertiary" : "bg-white"
            }`}
        >
            {/* Self sticker */}
            {isSelf && (
                <span className="absolute -top-3 -left-3 z-10 font-head text-xs uppercase tracking-widest border-2 border-black px-2 py-0.5 bg-secondary shadow-[2px_2px_0_0_#000] -rotate-12 select-none">
                    YOU
                </span>
            )}

            {/* Top row: rank / avatar / name / score-or-edit-btn */}
            <div className="flex items-center gap-4 w-full min-w-0">
                {/* Rank */}
                <motion.span
                    layout="position"
                    className="font-head text-sm uppercase tracking-widest text-black/40 w-5 shrink-0 text-center"
                >
                    {rank}
                </motion.span>

                {/* Avatar */}
                <span className="text-3xl shrink-0">{avatar}</span>

                {/* Name */}
                <span className="font-head text-lg uppercase tracking-wide leading-tight truncate flex-1 min-w-0">
                    {name}
                </span>

                {/* Score + edit button (hidden while editing) */}
                <AnimatePresence mode="wait">
                    {!editing && (
                        <motion.div
                            key="score"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="flex items-center gap-2 shrink-0 ml-auto"
                        >
                            <motion.span
                                key={score}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="font-head text-2xl tabular-nums text-black"
                            >
                                {score}
                            </motion.span>
                            {isSelf && onScoreEdit && (
                                <button
                                    onClick={() => setEditing(true)}
                                    title="Edit score"
                                    className="h-7 w-7 border-2 border-black bg-white shadow-[2px_2px_0_0_#000] flex items-center justify-center active:shadow-none active:translate-x-px active:translate-y-px transition-all"
                                >
                                    <Pencil className="h-3.5 w-3.5" strokeWidth={3} />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom row: full-width editor */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        key="editor-row"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">
                            <ScoreEditor
                                currentScore={score}
                                isPending={pending}
                                allowNegative={allowNegative}
                                onConfirm={handleConfirm}
                                onCancel={() => setEditing(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PlayerBar;
