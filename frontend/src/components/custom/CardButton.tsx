import { Button, type IButtonProps } from "../retroui/Button";
import { cn } from "@/lib/utils";
import { useState, type CSSProperties } from "react";

interface CardButtonProps extends IButtonProps {
  color?: string;
  bgColor?: string;
  selected?: boolean;
}

const RAINBOW_GRADIENT = 
  "linear-gradient(45deg, #009688 0%, #009688 12.5%, #E53935 12.5%, #E53935 25%, #FFD600 25%, #FFD600 37.5%, #03A9F4 37.5%, #03A9F4 50%, #8BC34A 50%, #8BC34A 62.5%, #E53935 62.5%, #E53935 75%, #FFD600 75%, #FFD600 87.5% , #03A9F4 87.5%, #03A9F4 100%)";
function getCardStyle(color?: string, bgColor?: string, selected?: boolean): CSSProperties {
  const isRainbow = color === "rainbow";
  const defaultBg = bgColor ?? "#F0EDD6";

  if (isRainbow && selected) {
    return {
      backgroundImage: RAINBOW_GRADIENT,
      color: defaultBg,
    };
  }

  if (isRainbow) {
    return {
      backgroundColor: defaultBg,
    };
  }

  if (selected) {
    return {
      backgroundColor: color,
      color: defaultBg,
    };
  }

  return {
    backgroundColor: defaultBg,
    color: color,
  };
}

export function CardButton({ children, className, color, bgColor, selected, onClick, ...props }: CardButtonProps) {
  const isRainbow = color === "rainbow";
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = () => setPressed(true);
  const handlePointerUp = () => setPressed(false);

  return (
    <Button
      className={cn(
        "w-12 h-16 text-xl font-bold flex items-center justify-center hover:translate-y-0 hover:shadow-md active:!translate-y-0 active:!translate-x-0 active:!shadow-md",
        (selected || pressed) && "shadow-none translate-y-2 translate-x-1 hover:translate-y-2 hover:translate-x-1 hover:shadow-none",
        selected && "ring-2 ring-black",
        props.disabled && "opacity-40 cursor-not-allowed hover:translate-y-0",
        className
      )}
      style={getCardStyle(color, bgColor, selected)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={onClick}
      {...props}
    >
      {isRainbow && !selected ? (
        <span
          className="bg-clip-text text-transparent [text-shadow:_0_0.1px_0_rgb(0_0_0_/_10%)]"
          style={{ backgroundImage: RAINBOW_GRADIENT }}
        >
          {children}
        </span>
      ) : (
        <span className="" 
         data-text={children}
         >
          {children}
        </span>
      )}
    </Button>
  );
}