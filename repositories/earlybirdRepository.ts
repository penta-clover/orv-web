import { FirebaseApp, initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbHrKpXJsUjt0oscx77Wn754wHgAqsir4",
  authDomain: "orv-im.firebaseapp.com",
  projectId: "orv-im",
  storageBucket: "orv-im.firebasestorage.app",
  messagingSenderId: "700370221085",
  appId: "1:700370221085:web:01080dc817c2ab7301eef4",
  measurementId: "G-VGK4GCEN7R"
};

const app = initializeApp(firebaseConfig);

export interface IEarlybirdRepository {
  register(data: any): Promise<any>;
}

export class EarlybirdRepository implements IEarlybirdRepository {

  async register(data: any): Promise<any> {
    console.log("Registering data:", data);

    // Firebase Firestore에 데이터 저장
    const db = getFirestore(app);
    data.createdAt = new Date();
    const docRef = await addDoc(collection(db, "earlybird"), data);
    console.log("Document written with ID: ", docRef.id);

    return Promise.resolve({ success: true });
  }

  async getWaitingNumber(): Promise<number> {
    // Firebase Firestore에서 전체 문서 개수 세기
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "earlybird"));
    return querySnapshot.size;
  }
}