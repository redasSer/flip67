import { CardButton } from "@/components/custom/CardButton";
import { Button } from "@/components/retroui/Button";
import { Drawer } from "@/components/retroui/Drawer";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useScorePoints } from "@/hooks/useGameMutations";
import {
    CLASSIC_EFFECT_CARDS,
    CLASSIC_PLAY_CARDS,
    EXTRA_13_INDEX,
    VENGEANCE_EFFECT_CARDS,
    VENGEANCE_PLAY_CARDS,
} from "./cardConstants";
import type { GameMode } from "@/types/api";

interface CardDrawerProps {
    onApplyScore: (points: number) => void;
    mode?: GameMode;
}

const CardDrawer = ({ onApplyScore, mode = "CLASSIC" }: CardDrawerProps) => {
    const isVengeance = mode === "VENGEANCE";
    const PLAY_CARDS = isVengeance ? VENGEANCE_PLAY_CARDS : CLASSIC_PLAY_CARDS;
    const EFFECT_CARDS = isVengeance ? VENGEANCE_EFFECT_CARDS : CLASSIC_EFFECT_CARDS;

    const [open, setOpen] = useState(false);
    const [selectedPlayCards, setSelectedPlayCards] = useState<boolean[]>(
        () => new Array(PLAY_CARDS.length).fill(false)
    );
    const [selectedEffectCards, setSelectedEffectCards] = useState<boolean[]>(
        () => new Array(EFFECT_CARDS.length).fill(false)
    );
    const { mutate: scorePoints, isPending } = useScorePoints();

    const resetSelections = () => {
        setSelectedPlayCards(new Array(PLAY_CARDS.length).fill(false));
        setSelectedEffectCards(new Array(EFFECT_CARDS.length).fill(false));
    };

    const togglePlayCard = (index: number) => {
        setSelectedPlayCards((prev) => {
            const next = [...prev];
            if (isVengeance && index === 13 && next[13]) {
                next[EXTRA_13_INDEX] = false;
            }
            next[index] = !next[index];
            return next;
        });
    };

    const toggleEffectCard = (index: number) => {
        setSelectedEffectCards((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const selectedPlayCount = selectedPlayCards.filter(Boolean).length;
    const maxPlayCards = 7;
    const allPlayCardsSelected = selectedPlayCount >= maxPlayCards;
    const bonusPoints = allPlayCardsSelected ? 15 : 0;

    const base13Selected = isVengeance && selectedPlayCards[13];

    const total = (() => {
        let sum = 0;
        selectedPlayCards.forEach((selected, i) => {
            if (selected) sum += PLAY_CARDS[i].value;
        });

        if (isVengeance) {
            // If 0 is selected, all 7 cards must be selected for any score
            const zeroSelected = selectedPlayCards[0];
            if (zeroSelected && selectedPlayCount < 7) return 0;

            const hasDivider = selectedEffectCards.some(
                (sel, i) => sel && EFFECT_CARDS[i].isDivider
            );
            if (hasDivider) sum = Math.floor(sum / 2);
            selectedEffectCards.forEach((selected, i) => {
                if (selected && !EFFECT_CARDS[i].isDivider) sum -= EFFECT_CARDS[i].value;
            });
        } else {
            let multiplier = 1;
            selectedEffectCards.forEach((selected, i) => {
                if (selected) {
                    const card = EFFECT_CARDS[i];
                    if (card.isMultiplier) multiplier *= card.value;
                    else sum += card.value;
                }
            });
            sum = sum * multiplier;
        }

        return sum + bonusPoints;
    })();

    const handleApply = () => {
        scorePoints(total, {
            onSuccess: () => {
                onApplyScore(total);
                resetSelections();
                setOpen(false);
            },
        });
    };

    // Rows — extra-13 is excluded here; it's rendered inline in row 3
    const visiblePlayCards = PLAY_CARDS.filter((c) => !c.isExtra13);
    const firstRow = visiblePlayCards.filter((c) => c.value <= 6);
    const secondRow = visiblePlayCards.filter((c) => c.value >= 7 && c.value <= 12);

    const extra13Card = PLAY_CARDS[EXTRA_13_INDEX];

    return (
        <div>
            <Drawer open={open} onOpenChange={setOpen}>
                <Drawer.Trigger asChild>
                    <Button size="icon" className="fixed bottom-6 right-6 z-50 h-14 w-14 justify-center text-2xl font-bold">
                        <Plus className="h-7 w-7" strokeWidth={3} />
                    </Button>
                </Drawer.Trigger>
                <Drawer.Content>
                    <Drawer.Footer>
                        {/* Row 1: 0–6 */}
                        <div className="flex justify-center gap-1 mb-1">
                            {firstRow.map((card) => {
                                const idx = PLAY_CARDS.indexOf(card);
                                return (
                                    <CardButton
                                        color={card.color}
                                        key={idx}
                                        selected={selectedPlayCards[idx]}
                                        disabled={allPlayCardsSelected && !selectedPlayCards[idx]}
                                        onClick={() => togglePlayCard(idx)}
                                    >
                                        {card.label}
                                    </CardButton>
                                );
                            })}
                        </div>
                        {/* Row 2: 7–12 */}
                        <div className="flex justify-center gap-1 mb-1">
                            {secondRow.map((card) => {
                                const idx = PLAY_CARDS.indexOf(card);
                                return (
                                    <CardButton
                                        color={card.color}
                                        key={idx}
                                        selected={selectedPlayCards[idx]}
                                        disabled={allPlayCardsSelected && !selectedPlayCards[idx]}
                                        onClick={() => togglePlayCard(idx)}
                                    >
                                        {card.label}
                                    </CardButton>
                                );
                            })}
                        </div>
                        {/* Row 3: 13 (vengeance) + animated extra-13 to the right */}
                        {isVengeance && (
                            <div className="flex justify-center mb-1">
                                {/* Wrapper keeps base-13 centered; extra-13 grows out to the right without shifting base */}
                                <div className="relative flex items-center">
                                    <CardButton
                                        color={PLAY_CARDS[13].color}
                                        selected={selectedPlayCards[13]}
                                        disabled={allPlayCardsSelected && !selectedPlayCards[13]}
                                        onClick={() => togglePlayCard(13)}
                                    >
                                        {PLAY_CARDS[13].label}
                                    </CardButton>
                                    <AnimatePresence>
                                        {base13Selected && (
                                            <motion.div
                                                key="extra-13"
                                                style={{ position: "absolute", left: "calc(100% + 4px)" }}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                            >
                                                <CardButton
                                                    color={extra13Card.color}
                                                    selected={selectedPlayCards[EXTRA_13_INDEX]}
                                                    disabled={allPlayCardsSelected && !selectedPlayCards[EXTRA_13_INDEX]}
                                                    onClick={() => togglePlayCard(EXTRA_13_INDEX)}
                                                >
                                                    {extra13Card.label}
                                                </CardButton>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                        <hr className="border-t border-gray-300 my-2" />
                        {/* Effect cards */}
                        <div className="flex justify-center gap-1">
                            {EFFECT_CARDS.map((card, index) => (
                                <CardButton
                                    color={card.color}
                                    bgColor={isVengeance ? "#f0582e" : "#ffcf69"}
                                    key={`${card.label}-${index}`}
                                    selected={selectedEffectCards[index]}
                                    onClick={() => toggleEffectCard(index)}
                                >
                                    {card.label}
                                </CardButton>
                            ))}
                        </div>
                        <Button
                            onClick={handleApply}
                            disabled={total === 0 || isPending}
                            className="mt-3 mx-auto w-3/4 py-3 bg-verify text-white hover:bg-verify/90 justify-center text-lg">
                            <Check className="h-6 w-6 mr-2" />{isPending ? "APPLYING..." : `APPLY SCORE (${total})`}
                        </Button>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer>
        </div>
    );
};

export default CardDrawer;