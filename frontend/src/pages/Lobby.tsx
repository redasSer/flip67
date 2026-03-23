import PageHeader from "@/components/custom/PageHeader";
import PageTransition from "@/components/custom/PageTransition";
import RoomCodeCard from "@/containers/RoomCodeCard";
import HostPlayerCard from "@/components/custom/HostPlayerCard";
import PlayerGrid from "@/containers/PlayerGrid";
import { Button } from "@/components/retroui/Button";
import { Play } from "lucide-react";
import useGameStore from "@/stores/gameStore";
import { useStartGame } from "@/hooks/useGameMutations";
import { useVibration } from "@/hooks/useVibration";

const Lobby = () => {
    const session = useGameStore((s) => s.session);
    const players = useGameStore((s) => s.players);
    const { mutate: startGame, isPending } = useStartGame();
    const { vibrate } = useVibration();

    const host = players.find((p) => p.host);
    const nonHostPlayers = players.filter((p) => !p.host);
    const totalPlayers = players.length;

    const amIHost = session?.host;

    const handleStartGame = () => {
        if (session?.gameId) {
            startGame(session.gameId);
            vibrate.success();
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto pt-16 overflow-hidden">
            <PageHeader />
            <PageTransition>
                <div className="flex flex-col w-full px-4 pt-6 pb-12 gap-8 min-w-0">
                    <RoomCodeCard code={session?.roomCode} />

                    {/* Player count bar */}
                    <div className="flex items-center w-full h-10">
                        <div className="flex items-center justify-center gap-2 w-3/5 h-12 bg-tertiary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-head text-lg leading-none text-black">{totalPlayers}</span>
                            <span className="font-head text-s uppercase tracking-widest text-black/60">Players</span>
                        </div>
                        <div className="w-1/2 flex items-center px-4">
                            <div className="w-full h-[3px] bg-black/15" />
                        </div>
                    </div>

                    {/* Host + Players unified list */}
                    <div className="flex flex-col gap-3">
                        {host && <HostPlayerCard name={host.name} avatar={host.avatar} />}
                        <PlayerGrid players={nonHostPlayers} />
                    </div>

                    {amIHost && (
                        <div className="pt-4 pb-2">
                            <Button
                                size="lg"
                                className="w-full justify-center py-5 text-xl border-4 border-black shadow-lg gap-3 bg-verify text-white"
                                onClick={handleStartGame}
                                disabled={isPending}
                            >
                                <Play className="h-6 w-6 fill-current" strokeWidth={2.5} />
                                <span className="font-head text-2xl uppercase">
                                    {isPending ? "Starting..." : "Start Game"}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </PageTransition>
        </div>
    );
};

export default Lobby;
