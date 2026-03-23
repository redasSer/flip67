import { useWebHaptics } from "web-haptics/react";

const HAPTICS_KEY = "haptics_enabled";

export const getHapticsEnabled = (): boolean => {
    const stored = localStorage.getItem(HAPTICS_KEY);
    return stored === null ? true : stored === "true";
};

export const setHapticsEnabled = (enabled: boolean): void => {
    localStorage.setItem(HAPTICS_KEY, String(enabled));
};

export const useVibration = () => {
    const { trigger } = useWebHaptics();

    const fire = (pattern: Parameters<typeof trigger>[0]) => {
        if (!getHapticsEnabled()) return;
        trigger(pattern);
    };

    return {
        vibrate: {
            soft: () => fire("soft"),
            success: () => fire("success"),
            warning: () => fire("warning"),
            error: () => fire("error"),
            selection: () => fire("selection"),
            rigid: () => fire("rigid"),
            nudge: () => fire("nudge"),
            buzz: () => fire("buzz"),
        },
    };
};