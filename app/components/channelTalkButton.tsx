import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ChannelTalkButton(props: {
  text: string;
  className?: string;
}) {
  useEffect(() => {
  }, []);

  return (
    <button
      className={cn(
        "text-head4 text-system-info underline channel-talk-button",
        props.className
      )}
    >
      {props.text}
    </button>
  );
}

