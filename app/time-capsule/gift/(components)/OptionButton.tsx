export default function OptionButton({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) {
    return (
      <div
        className="w-full h-[48px] bg-main-lilac50 rounded-[12px] active:scale-95 text-head4 text-grayscale-800 flex items-center justify-center transition-all"
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  