import { Dialog } from "../retroui/Dialog";
import { Button } from "../retroui/Button";
import { LogOut, RotateCcw } from "lucide-react";
import { Text } from "../retroui/Text";
import useGameStore from "@/stores/gameStore";
import { useLeaveGame, useResetGame } from "@/hooks/useGameMutations";

interface PageHeaderProps {
    roomCode?: string;
}

const PageHeader = (props: PageHeaderProps) => {
    const { roomCode } = props;
    const session = useGameStore((state) => state.session);
    const mode = useGameStore((state) => state.mode);
    const { mutate: leave, isPending: isLeavePending } = useLeaveGame();
    const { mutate: reset, isPending: isResetPending } = useResetGame();

    const handleLeave = () => {
        if (session) {
            leave({ gameId: session.gameId, playerId: session.playerId });
        }
    };

    const resetDialog = session?.host && (
        <Dialog>
            <Dialog.Trigger asChild>
                <Button className="h-8 flex items-center gap-2 bg-[#FF9500] border-2 border-[#2d2f2f] px-3 py-1 font-headline font-black text-sm text-white shadow-[2px_2px_0px_0px_#2d2f2f] uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <RotateCcw className="h-5" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content size={'sm'}>
                <Dialog.Header>
                    <Text as={"h5"}>Reset game?</Text>
                </Dialog.Header>
                <section className="flex flex-col gap-4 p-4">
                    <section className="text-xl">
                        <p>This will reset all player scores.</p>
                    </section>
                    <section className="flex w-full justify-end">
                        <Dialog.Trigger asChild>
                            <Button onClick={() => reset()} disabled={isResetPending}>YES</Button>
                        </Dialog.Trigger>
                    </section>
                </section>
            </Dialog.Content>
        </Dialog>
    );

    const dialog = (
        <Dialog>
            <Dialog.Trigger asChild>
                <Button className="h-8 flex items-center gap-2 bg-[#FF3B30] border-2 border-[#2d2f2f] px-3 py-1 font-headline font-black text-sm text-white shadow-[2px_2px_0px_0px_#2d2f2f] uppercase tracking-wide active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <LogOut className="h-5" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content size={'sm'}>
                <Dialog.Header>
                    <Text as={"h5"}>Leave?</Text>
                </Dialog.Header>
                <section className="flex flex-col gap-4 p-4">
                    <section className="text-xl">
                        <p>Are you sure you want to leave this room? :(</p>
                    </section>
                    <section className="flex w-full justify-end">
                        <Dialog.Trigger asChild>
                            <Button onClick={handleLeave} disabled={isLeavePending}>YES</Button>
                        </Dialog.Trigger>
                    </section>
                </section>
            </Dialog.Content>
        </Dialog>
    );

    return (
        <header className="bg-[#FFDE03] dark:bg-[#FFDE03] text-[#2d2f2f] docked full-width top-0 border-b-4 border-[#2d2f2f] shadow-[4px_4px_0px_0px_#2d2f2f] flex items-center w-full px-4 h-16 z-50 fixed">
            {/* Left: Title */}
            <div className="flex-1 flex items-center">
                <div className="flex flex-col items-start">
                    <h1 className="font-lexend font-black tracking-tighter uppercase text-2xl text-[#2d2f2f]">FLIP67</h1>
                    {mode === 'VENGEANCE' && (
                        <span className="bg-[#FF3B30] text-white font-headline font-black text-[9px] uppercase tracking-wide px-1.5 py-0.5 border border-[#2d2f2f] shadow-[1px_1px_0px_0px_#2d2f2f] rotate-[-1deg] -mt-1 leading-none">
                            with a vengeance
                        </span>
                    )}
                </div>
            </div>

            {/* Center: Room code badge */}
            {roomCode &&
                <div className="bg-[#FFFFFF] border-2 border-[#2d2f2f] px-3 py-1 font-headline font-black text-sm shadow-[2px_2px_0px_0px_#2d2f2f] rotate-[-2deg]">
                    {`#${roomCode}`}
                </div>
            }

            {/* Right: Reset (host only) + Leave buttons */}
            <div className="flex-1 flex items-center justify-end gap-2">
                {resetDialog}
                {dialog}
            </div>
        </header>
    );
};

export default PageHeader;