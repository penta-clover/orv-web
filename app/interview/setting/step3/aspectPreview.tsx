import { cn } from "@/lib/utils";

export function AspectPreview(props: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const { children, selected, onClick, disabled = false } = props;

  return (
    <div
      className={cn(
        selected ? "border-main-lilac50" : "border-transparent",
        "rounded-[12px] overflow-hidden border-[2px] aspect-[16/9] cursor-pointer relative"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {disabled && <Skeleton />}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-grayscale-900">
      <div className="absolute inset-0 bg-gradient-to-r from-grayscale-900 via-grayscale-700 to-grayscale-900 animate-skeleton-wave" />
    </div>
  );
}
