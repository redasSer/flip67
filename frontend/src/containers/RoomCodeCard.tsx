import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/retroui/Button";
import { Loader } from "@/components/retroui/Loader";
import { useVibration } from "@/hooks/useVibration";

interface RoomCodeCardProps {
    code?: string;
}

const RoomCodeCard = ({ code }: RoomCodeCardProps) => {
    const [copied, setCopied] = useState(false);
    const { vibrate } = useVibration();

    const handleCopy = () => {
        if (!code) { return; }

        if (navigator.clipboard && window.isSecureContext) {
            // Modern async API — works on iOS 13.4+ when called from a direct user gesture
            navigator.clipboard.writeText(code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            // Fallback for older iOS / non-HTTPS
            const textArea = document.createElement('textarea');
            textArea.value = code;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            textArea.setAttribute('readonly', ''); // Key fix: readonly prevents keyboard from opening

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }

        vibrate.success();
    };

    return (
        <div className="w-full border-4 border-black p-6 shadow-xl bg-secondary flex flex-col items-center gap-3">
            <p className="font-head text-sm uppercase tracking-widest">
                Room Lobby
            </p>

            <div className="flex items-center gap-3">
                <span className="font-head text-5xl tracking-widest leading-none">
                    {code ? `#${code}` : <Loader variant="secondary"/>}
                </span>
                <Button
                    size="icon"
                    className="bg-white border-2 border-black hover:bg-white shadow-md"
                    onClick={handleCopy}
                    aria-label="Copy room code"
                    disabled={!code}
                >
                    {copied
                        ? <Check className="h-5 w-5" strokeWidth={2.5} />
                        : <Copy className="h-5 w-5" strokeWidth={2.5} />
                    }
                </Button>
            </div>

            <p className="font-sans text-xs uppercase tracking-widest border-t-2 border-black pt-3 text-black">
                Share this code with other players
            </p>
        </div>
    );
};

export default RoomCodeCard;
