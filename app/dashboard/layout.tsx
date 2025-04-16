import StartButton from "./startButton";
import Sidebar from "./sidebar";
import Popup from "./popup";
import ActionBar from "./actionBar";
import {
  MobileSidebarProvider,
  useMobileSidebar,
} from "./mobileSidebarContext";
import MobileSidebar from "./mobileSidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Popup>
      <MobileSidebarProvider>
        <div className="flex flex-row h-[100dvh] w-[calc(100dvw)]">
          <Sidebar className="hidden xs:inline" />

          <div className="fixed top-0 block xs:hidden w-full z-40 bg-grayscale-black">
            <ActionBar className="" />
          </div>

          <div className="h-[100dvh] w-[calc(100dvw)] xs:w-[calc(100dvw-240px)] ">
            <div className="block xs:hidden">
              <MobileSidebar />
            </div>
            {children}
          </div>

          <div className="fixed right-[48px] bottom-[48px] hidden xs:inline">
            <StartButton />
          </div>
        </div>
      </MobileSidebarProvider>
    </Popup>
  );
}
