import { useState } from "react";
import { Settings } from "lucide-react";
import { Dialog } from "@/components/retroui/Dialog";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { getHapticsEnabled, setHapticsEnabled, useVibration } from "@/hooks/useVibration";

const SettingsDialog = () => {
    const [haptics, setHaptics] = useState<boolean>(getHapticsEnabled);
    const { vibrate } = useVibration();

    const handleToggle = () => {
        const next = !haptics;
        setHaptics(next);
        setHapticsEnabled(next);
    };

    return (
        <Dialog>
            <Dialog.Trigger asChild>
                <Button
                    className="bg-white w-full gap-1 justify-between py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_#2d2f2f]"
                    size="sm"
                    aria-label="Settings"
                    onClick={() => vibrate.selection()}
                >
                    <span className="font-head text-sm uppercase tracking-widest text-left">Settings</span>
                    <Settings className="h-4 w-5 text-[#2d2f2f]" strokeWidth={2.5} />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content size="sm">
                <Dialog.Header>
                    <Text as="h5">Settings</Text>
                </Dialog.Header>
                <section className="flex flex-col gap-4 p-4">
                    <div className="flex items-center justify-between">
                        <span className="font-head text-sm uppercase tracking-widest text-[#2d2f2f]">
                            Enable Haptics
                        </span>
                        <button
                            onClick={handleToggle}
                            className={`relative w-12 h-6 border-2 border-[#2d2f2f] shadow-[2px_2px_0px_0px_#2d2f2f] transition-colors duration-150 ${
                                haptics ? "bg-[#FFDE03]" : "bg-[#e5e5e5]"
                            }`}
                            aria-checked={haptics}
                            role="switch"
                        >
                            <span
                                className={`absolute top-0.5 h-4 w-4 border-2 border-[#2d2f2f] bg-white transition-all duration-150 ${
                                    haptics ? "left-6" : "left-0.5"
                                }`}
                            />
                        </button>
                    </div>
                </section>
            </Dialog.Content>
        </Dialog>
    );
};

export default SettingsDialog;
