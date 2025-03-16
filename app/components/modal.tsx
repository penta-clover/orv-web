import { cn } from "@/lib/utils";

export default function Modal(props: {
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) {
  const {
    title,
    description,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel,
    isOpen,
    setIsOpen,
    children,
  } = props;

  return (
    <div>
      <div
        className={cn(
          isOpen ? "opacity-100 z-10" : "opacity-0 -z-10",
          "absolute top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center transition-opacity"
        )}
        onClick={() => setIsOpen(false)}
      >
        <div
          className="p-[24px] bg-grayscale-800 rounded-[10px] flex flex-col items-center gap-[8px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-head3 text-grayscale-50">{title}</div>
          <div className="text-body2 text-grayscale-300 text-center">
            {description.replace("\\n", "\n")}
          </div>
          <div className="flex gap-[10px] mt-[18px]">
            <button
              className="px-[14px] py-[9px] bg-grayscale-600 text-grayscale-50 text-head4 rounded-[10px] transition-all active:scale-95"
              onClick={onConfirm}
            >
              {confirmButtonText}
            </button>
            <button
              className="px-[14px] py-[9px] bg-main-lilac50 text-grayscale-800 text-head4 rounded-[10px] transition-all active:scale-95"
              onClick={onCancel}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
