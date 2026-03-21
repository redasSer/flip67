const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full min-w-0 overflow-hidden">
            {children}
        </div>
    );
};

export default PageTransition;
