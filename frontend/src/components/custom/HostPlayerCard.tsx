interface HostPlayerCardProps {
    name: string;
    avatar: string;
}

const HostPlayerCard = ({ name, avatar }: HostPlayerCardProps) => (
    <div className="w-full flex items-center gap-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-5 py-4 overflow-hidden">
        <span className="text-4xl shrink-0">{avatar}</span>
        <div className="flex flex-col flex-1 min-w-0">
            <span className="font-head text-xs uppercase tracking-widest text-black/60 leading-none mb-1">
                Host
            </span>
            <span className="font-head text-xl uppercase tracking-wide leading-tight truncate">
                {name}
            </span>
        </div>
        <span className="ml-auto shrink-0 font-head text-xs uppercase tracking-widest border-2 border-black px-2 py-1 bg-white">
            👑
        </span>
    </div>
);

export default HostPlayerCard;
