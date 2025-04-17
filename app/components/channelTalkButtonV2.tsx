import { Children, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ChannelTalkButton({
  children,
  text,
  className,
}: Readonly<{
  children: React.ReactNode;
  text?: string;
  className?: string;
}>) {
  return (
    <button
      className={cn(
        "text-head4 text-system-info underline channel-talk-button",
        className
      )}
    >
      {children}
      {text}
    </button>
  );
}
