import Sidebar from "./sidebar";
import { SidebarProvider } from "./sidebarContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row w-full overflow-x-hidden">
      <div className="flex grow bg-[#050505]" />
      <div className="relative w-[100dvw] max-w-[450px] overflow-hidden">
        <SidebarProvider>
          <Sidebar />
          {children}
        </SidebarProvider>
      </div>
      <div className="flex grow bg-[#050505]" />
    </div>
  );
}
