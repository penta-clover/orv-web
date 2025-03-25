import StartButton from "./startButton";
import Sidebar from "./sidebar";
import Popup from "./popup";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Popup>
      <div className="flex flex-row h-[100dvh] w-[calc(100dvw)]">
        <Sidebar />
        <div className="h-[100dvh] w-[calc(100dvw-240px)]">{children}</div>

        <div className="fixed right-[48px] bottom-[48px]">
          <StartButton />
        </div>
      </div>
    </Popup>
  );
}
