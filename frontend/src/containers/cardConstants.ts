export interface PlayCard {
    value: number;
    label: string;
    isMultiplier?: boolean;
    isDivider?: boolean;
    color?: string;
    /** Marks this as the extra selectable copy of 13 in vengeance mode */
    isExtra13?: boolean;
}

// ── Classic ───────────────────────────────────────────────────────────────────
export const CLASSIC_PLAY_CARDS: PlayCard[] = [
    { label: "0", value: 0, color: "rainbow" },
    { label: "1", value: 1, color: "#B5ADA3" },
    { label: "2", value: 2, color: "#a9b533" },
    { label: "3", value: 3, color: "#EF5350" },
    { label: "4", value: 4, color: "#4DB6AC" },
    { label: "5", value: 5, color: "#66BB6A" },
    { label: "6", value: 6, color: "#AB47BC" },
    { label: "7", value: 7, color: "#f79c9c" },
    { label: "8", value: 8, color: "#8BC34A" },
    { label: "9", value: 9, color: "#FF9800" },
    { label: "10", value: 10, color: "#D32F2F" },
    { label: "11", value: 11, color: "#1E88E5" },
    { label: "12", value: 12, color: "#757474" },
];

export const CLASSIC_EFFECT_CARDS: PlayCard[] = [
    { label: "+2", value: 2, color: "#f0582e" },
    { label: "+4", value: 4, color: "#f0582e" },
    { label: "+6", value: 6, color: "#f0582e" },
    { label: "+8", value: 8, color: "#f0582e" },
    { label: "+10", value: 10, color: "#f0582e" },
    { label: "x2", value: 2, isMultiplier: true, color: "#f0582e" },
];

// ── Vengeance ─────────────────────────────────────────────────────────────────
// The extra-13 card (index 14) is only rendered when the base-13 (index 13) is selected.
export const VENGEANCE_PLAY_CARDS: PlayCard[] = [
    { label: "0", value: 0, color: "rainbow" },
    { label: "1", value: 1, color: "#B5ADA3" },
    { label: "2", value: 2, color: "#a9b533" },
    { label: "3", value: 3, color: "#EF5350" },
    { label: "4", value: 4, color: "#4DB6AC" },
    { label: "5", value: 5, color: "#66BB6A" },
    { label: "6", value: 6, color: "#AB47BC" },
    { label: "7", value: 7, color: "#f79c9c" },
    { label: "8", value: 8, color: "#8BC34A" },
    { label: "9", value: 9, color: "#FF9800" },
    { label: "10", value: 10, color: "#D32F2F" },
    { label: "11", value: 11, color: "#1E88E5" },
    { label: "12", value: 12, color: "#757474" },
    { label: "13", value: 13, color: "#007fe0" },
    { label: "13", value: 13, color: "rainbow", isExtra13: true },
];

export const VENGEANCE_EFFECT_CARDS: PlayCard[] = [
    { label: "-2", value: 2, color: "#ffcf69" },
    { label: "-4", value: 4, color: "#ffcf69" },
    { label: "-6", value: 6, color: "#ffcf69" },
    { label: "-8", value: 8, color: "#ffcf69" },
    { label: "-10", value: 10, color: "#ffcf69" },
    { label: "÷2", value: 2, isDivider: true, color: "#ffcf69" },
];

/** Index of the extra-13 card inside VENGEANCE_PLAY_CARDS */
export const EXTRA_13_INDEX = 14;
