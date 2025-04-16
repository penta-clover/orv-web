import StartButton from "./startButton";
import Sidebar from "./sidebar";
import Popup from "./popup";
import MobileNotSupported from "./home/mobileNotSupported";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Popup>
      <div className="flex flex-row h-[100dvh] w-[calc(100dvw)]">
        <Sidebar className="hidden xs:inline" />

        <div className="fixed top-0 block xs:hidden w-full z-40 bg-grayscale-black">
          <ActionBar className="" />
        </div>

        <div className="h-[100dvh] w-[calc(100dvw)] xs:w-[calc(100dvw-240px)] ">
          {children}
        </div>

        <div className="fixed right-[48px] bottom-[48px] hidden xs:inline">
          <StartButton />
        </div>
      </div>
    </Popup>
  );
}

function ActionBar({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between h-[56px] w-full",
        className
      )}
    >
      <div className="h-[56px] w-[74px] flex items-center justify-center" onClick={() => router.push("/dashboard/home")}>
        <Image
          unoptimized
          src="/icons/logo.svg"
          width={42}
          height={20}
          alt={""}
        />
      </div>

      <div className="flex items-center justify-center grow text-head4 text-grayscale-white" />
    </div>
  );
}
