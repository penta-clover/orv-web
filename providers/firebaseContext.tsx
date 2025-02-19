// FirebaseContext.tsx
import React, { createContext, useContext } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDbHrKpXJsUjt0oscx77Wn754wHgAqsir4",
    authDomain: "orv-im.firebaseapp.com",
    projectId: "orv-im",
    storageBucket: "orv-im.firebasestorage.app",
    messagingSenderId: "700370221085",
    appId: "1:700370221085:web:01080dc817c2ab7301eef4",
    measurementId: "G-VGK4GCEN7R"
  };

// Context 생성 (초깃값은 null)
const FirebaseContext = createContext<FirebaseApp | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  // 앱이 여러 번 초기화되지 않도록 주의하세요.
  const app = initializeApp(firebaseConfig);
  return (
    <FirebaseContext.Provider value={app}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseApp => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
