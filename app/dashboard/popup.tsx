"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface PopupContextProps {
  showPopup: (content: React.ReactNode) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup은 PopupProvider 내부에서 사용되어야 합니다.");
  }
  return context;
}

export default function Popup({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(
    null
  );

  const showPopup = useCallback((content: React.ReactNode) => {
    setPopupContent(content);
  }, []);

  const hidePopup = useCallback(() => {
    setPopupContent(null);
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      <div className="relative w-full h-full transition-all">
        {popupContent === null ? null : (
          <>
          <div className="absolute z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {popupContent}
          </div>
            <div
              className="absolute w-full h-full flex items-center justify-center z-30 bg-grayscale-black opacity-70"
              onClick={hidePopup}
            />
          </>
        )}
        {children}
      </div>
    </PopupContext.Provider>
  );
}
