import { useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/custom/PageHeader";
import PageTransition from "@/components/custom/PageTransition";
import PlayerBar from "@/components/custom/PlayerBar";
import CardDrawer from "@/containers/CardDrawer";
import useGameStore from "@/stores/gameStore";
import { useScorePoints } from "@/hooks/useGameMutations";

const GamePage = () => {
    const session = useGameStore((s) => s.session);
    const players = useGameStore((s) => s.players);
    const mode = useGameStore((s) => s.mode);
    const { mutateAsync: scorePoints } = useScorePoints();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sorted = [...players].sort((a, b) => b.score - a.score);

    const handleScoreEdit = async (currentScore: number, newScore: number) => {
        const delta = newScore - currentScore;
        if (delta !== 0) await scorePoints(delta);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto pt-16 overflow-hidden">
            <PageHeader roomCode={session?.roomCode} />
            <PageTransition>
                <motion.div layout className="flex flex-col w-full px-4 pt-6 pb-24 gap-3 min-w-0">
                    {sorted.map((player, index) => {
                        const isSelf = player.id === session?.playerId;
                        return (
                            <PlayerBar
                                key={player.id}
                                rank={index + 1}
                                name={player.name}
                                avatar={player.avatar}
                                score={player.score}
                                isSelf={isSelf}
                                allowNegative={mode === 'VENGEANCE'}
                                onScoreEdit={
                                    isSelf
                                        ? (newScore) => handleScoreEdit(player.score, newScore)
                                        : undefined
                                }
                            />
                        );
                    })}
                </motion.div>
            </PageTransition>
            <CardDrawer onApplyScore={(_points) => {}} mode={mode} />
        </div>
    );
};

export default GamePage;
