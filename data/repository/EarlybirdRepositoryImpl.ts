import { EarlybirdRepository } from "@/domain/repository/EarlybirdRepository";
import { FirebaseApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

export class EarlybirdRepositoryImpl implements EarlybirdRepository {
  constructor(private app: FirebaseApp) {}

  async register(data: any): Promise<any> {
    console.log("Registering data:", data);
    const db = getFirestore(this.app);
    data.createdAt = new Date();
    const docRef = await addDoc(collection(db, "earlybird"), data);
    console.log("Document written with ID: ", docRef.id);
    return { success: true };
  }

  async getWaitingNumber(): Promise<number> {
    const db = getFirestore(this.app);
    const querySnapshot = await getDocs(collection(db, "earlybird"));
    return querySnapshot.size;
  }
}