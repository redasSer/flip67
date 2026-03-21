import { useState } from "react";
import { Dialog } from "@/components/retroui/Dialog";
import { Button } from "@/components/retroui/Button";
import { Loader } from "@/components/retroui/Loader";
import { ArrowRight } from "lucide-react";
import PlayerSetupStep from "@/components/custom/PlayerSetupStep";
import { checkGameExists } from "@/api/game";

interface JoinGameDialogProps {
    children: React.ReactNode;
    onConfirm: (roomCode: string, name: string, avatar: string) => void;
}

const JoinGameDialog = ({ children, onConfirm }: JoinGameDialogProps) => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"room" | "player">("room");
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const [roomError, setRoomError] = useState<string | null>(null);

    const roomCodeReady = roomCode.trim().length > 0;
    const playerReady = name.trim().length > 0 && avatar !== null;

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            setStep("room");
            setRoomCode("");
            setName("");
            setAvatar(null);
            setRoomError(null);
        }
    };

    const handleNext = async () => {
        if (!roomCodeReady || checking) return;
        setChecking(true);
        setRoomError(null);
        const exists = await checkGameExists(roomCode.trim().toUpperCase());
        setChecking(false);
        if (!exists) {
            setRoomError("Room not found. Check the code and try again.");
            return;
        }
        setStep("player");
    };

    const handleConfirm = () => {
        if (!playerReady) return;
        setOpen(false);
        onConfirm(roomCode.trim().toUpperCase(), name.trim(), avatar!);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Content
                size="sm"
                className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Dialog.Header className="border-b-4 border-black px-5 py-4">
                    <span className="font-head text-xl uppercase tracking-widest">
                        {step === "room" ? "Enter Room Code" : "Who are you?"}
                    </span>
                </Dialog.Header>

                {step === "room" ? (
                    <>
                        <div className="flex flex-col items-center gap-6 px-5 py-8">
                            <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                                Ask the host for the 4-digit room code
                            </p>
                            <div className="relative w-full">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-head text-4xl text-muted-foreground select-none">
                                    #
                                </span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="0000"
                                    value={roomCode}
                                    onChange={(e) => {
                                        setRoomCode(e.target.value.replace(/[^0-9]/g, ""));
                                        setRoomError(null);
                                    }}
                                    className="w-full bg-primary border-4 border-black pl-12 pr-4 py-4 font-head text-5xl tracking-[0.35em] text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-black/30"
                                />
                            </div>
                            {roomError && (
                                <p className="font-sans text-xs uppercase tracking-widest text-red-600">
                                    {roomError}
                                </p>
                            )}
                        </div>
                        <Dialog.Footer className="border-t-4 border-black px-5 py-4">
                            <Button
                                onClick={handleNext}
                                disabled={!roomCodeReady || checking}
                                className="w-full font-head text-lg uppercase tracking-widest border-2 border-black bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <span className="flex items-center justify-center h-7">
                                    {checking ? (
                                        <Loader variant="secondary" size="sm" />
                                    ) : (
                                        <>Next <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} /></>
                                    )}
                                </span>
                            </Button>
                        </Dialog.Footer>
                    </>
                ) : (
                    <>
                        <PlayerSetupStep
                            name={name}
                            avatar={avatar}
                            accentColor="var(--color-tertiary)"
                            onNameChange={setName}
                            onAvatarChange={setAvatar}
                        />
                        <Dialog.Footer className="border-t-4 border-black px-5 py-4">
                            <Button
                                onClick={handleConfirm}
                                disabled={!playerReady}
                                className="w-full font-head text-lg uppercase tracking-widest border-2 border-black bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {avatar && name.trim() ? `${avatar}  Join!` : "Join!"}
                            </Button>
                        </Dialog.Footer>
                    </>
                )}
            </Dialog.Content>
        </Dialog>
    );
};

export default JoinGameDialog;
