import { useNavigate } from "react-router-dom";
import { Button } from "@/components/retroui/Button";
import { CirclePlus, LogIn } from "lucide-react";
import PageTransition from "@/components/custom/PageTransition";
import PlayerSetupDialog from "@/containers/PlayerSetupDialog";
import JoinGameDialog from "@/containers/JoinGameDialog";
import SettingsDialog from "@/containers/SettingsDialog";
import { useCreateGame, useJoinGame } from "@/hooks/useGameMutations";
import type { GameMode } from "@/types/api";

const LandingPage = () => {
    const navigate = useNavigate();
    const createGame = useCreateGame();
    const joinGame = useJoinGame();

    const handleCreate = (name: string, avatar: string, mode: GameMode) => {
        createGame.mutate(
            { playerName: name, playerAvatar: avatar, mode },
            { onSuccess: () => navigate("/lobby") },
        );
    };

    const handleJoin = (roomCode: string, name: string, avatar: string) => {
        joinGame.mutate(
            { playerName: name, playerAvatar: avatar, roomCode },
            { onSuccess: () => navigate("/lobby") }
        );
    };

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center px-6 py-16 gap-16 max-w-md mx-auto">
                {/* Hero Card */}
                <div
                    className="w-full border-4 border-black p-10 shadow-xl text-center rotate-[-3deg]"
                    style={{ backgroundColor: "#FFDE03" }}
                >
                    <h1 className="font-head text-6xl tracking-tighter leading-none mb-2">
                        FLIP67
                    </h1>
                    <p className="font-sans text-sm uppercase tracking-widest border-t-4 border-black pt-3 mt-4 inline-block ">
                        best score tracker in the world ;)
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-4">
                    <PlayerSetupDialog onConfirm={handleCreate} showModeSelector>
                        <Button
                            size="lg"
                            className="bg-secondary w-full justify-between py-6 px-6 text-xl border-4 border-black shadow-lg"
                        >
                            <span className="font-head text-2xl uppercase text-left leading-tight">Create<br />Game</span>
                            <CirclePlus className="h-8 w-8" strokeWidth={2.5} />
                        </Button>
                    </PlayerSetupDialog>

                    <JoinGameDialog onConfirm={handleJoin}>
                        <Button
                            size="lg"
                            className="bg-tertiary w-full justify-between py-6 px-6 text-xl border-4 border-black shadow-lg"
                        >
                            <span className="font-head text-2xl uppercase text-left leading-tight">Join<br />Game</span>
                            <LogIn className="h-8 w-8" strokeWidth={2.5} />
                        </Button>
                    </JoinGameDialog>
                </div>

                <div className="bottom-6  max-w-md">
                    <SettingsDialog />
                </div>
            </div>
        </PageTransition>
    );
};

export default LandingPage;
