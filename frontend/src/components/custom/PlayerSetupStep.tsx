import { Input } from "@/components/retroui/Input";

export const AVATARS = [
    "🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁",
    "🐸", "🐙", "🦄", "🐲", "🦋", "🐺", "🦝", "🐧",
    "🦖", "🦩", "🐳", "🦀", "🐝", "🦔", "🦥", "🐞",
];

interface PlayerSetupStepProps {
    name: string;
    avatar: string | null;
    accentColor: string;
    onNameChange: (name: string) => void;
    onAvatarChange: (avatar: string) => void;
}

const PlayerSetupStep = ({ name, avatar, accentColor, onNameChange, onAvatarChange }: PlayerSetupStepProps) => (
    <div className="flex flex-col gap-6 px-5 py-6">
        <div className="flex flex-col gap-2">
            <label className="font-head text-xs uppercase tracking-widest">
                Your Name
            </label>
            <Input
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="border-2 border-black font-sans text-base"
                maxLength={20}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="font-head text-xs uppercase tracking-widest">
                Pick an Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
                {AVATARS.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => onAvatarChange(emoji)}
                        className={`text-2xl p-1 rounded border-2 transition-all ${
                            avatar === emoji
                                ? `border-black scale-110 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`
                                : "border-transparent hover:border-black"
                        }`}
                        style={avatar === emoji ? { backgroundColor: accentColor } : {}}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default PlayerSetupStep;
