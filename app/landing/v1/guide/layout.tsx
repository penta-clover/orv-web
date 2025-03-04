export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-row w-full overflow-x-hidden overflow-y-hidden">
      <div className="flex grow bg-[#050505]" />
      <div className="relative w-[100dvw] max-w-[450px]">{children}</div>
      <div className="flex grow bg-[#050505]" />
    </div>
  );
}
