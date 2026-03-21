interface PlayerCardProps {
    name: string;
    avatar: string;
}

const PlayerCard = ({ name, avatar }: PlayerCardProps) => (
    <div className="flex flex-col items-center gap-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-4 overflow-hidden min-w-0">
        <span className="text-3xl">{avatar}</span>
        <span className="font-head text-xs uppercase tracking-wide leading-tight text-center w-full truncate">
            {name}
        </span>
    </div>
);

export default PlayerCard;
