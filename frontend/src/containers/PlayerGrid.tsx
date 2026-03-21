import { AnimatePresence, motion } from "framer-motion";
import PlayerCard from "@/components/custom/PlayerCard";

interface Player {
    id: string;
    name: string;
    avatar: string;
}

interface PlayerGridProps {
    players: Player[];
}

const PlayerGrid = ({ players }: PlayerGridProps) => {
    if (players.length === 0) return null;

    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 w-full min-w-0">
            <AnimatePresence>
                {players.map((player) => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <PlayerCard
                            name={player.name}
                            avatar={player.avatar}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default PlayerGrid;
