import { useState } from "react";
import { Dialog } from "@/components/retroui/Dialog";
import { Button } from "@/components/retroui/Button";
import PlayerSetupStep from "@/components/custom/PlayerSetupStep";
import type { GameMode } from "@/types/api";

interface PlayerSetupDialogProps {
    children: React.ReactNode;
    onConfirm: (name: string, avatar: string, mode: GameMode) => void;
    showModeSelector?: boolean;
}

const PlayerSetupDialog = ({ children, onConfirm, showModeSelector = false }: PlayerSetupDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [mode, setMode] = useState<GameMode>("CLASSIC");

    const isReady = name.trim().length > 0 && avatar !== null;

    const handleConfirm = () => {
        if (!isReady) return;
        setOpen(false);
        onConfirm(name.trim(), avatar!, mode);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Content
                size="sm"
                className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Dialog.Header className="border-b-4 border-black px-5 py-4">
                    <span className="font-head text-xl uppercase tracking-widest">Who are you?</span>
                </Dialog.Header>

                <PlayerSetupStep
                    name={name}
                    avatar={avatar}
                    accentColor="var(--color-secondary)"
                    onNameChange={setName}
                    onAvatarChange={setAvatar}
                />

                {showModeSelector && (
                    <div className="px-5 py-3 border-t-4 border-black">
                        <p className="font-head text-xs uppercase tracking-widest mb-2 text-gray-500">Game Mode</p>
                        <div className="flex gap-2">
                            {(["CLASSIC", "VENGEANCE"] as GameMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={[
                                        "flex-1 py-2 font-head text-sm uppercase tracking-widest border-2 border-black transition-colors",
                                        mode === m
                                            ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                                            : "bg-white text-black hover:bg-gray-100",
                                    ].join(" ")}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <Dialog.Footer className="border-t-4 border-black px-5 py-4">
                    <Button
                        onClick={handleConfirm}
                        disabled={!isReady}
                        className="w-full font-head text-lg uppercase tracking-widest border-2 border-black bg-secondary disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {avatar && name.trim() ? `${avatar}  Let's go!` : "Let's go!"}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog>
    );
};

export default PlayerSetupDialog;
