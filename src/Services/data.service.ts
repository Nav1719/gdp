import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FileData } from "../models/files-data";
import { User } from "../models/user";
import Firebase from "./firebase.service";

class DataServiceClazz {
  private readonly FirebaseStore: any = getFirestore(Firebase);

  private readonly userCollection = "users";
  private readonly filterTextKey = "filterText";
  private readonly keyWordsAndCountsKey = "keyWordsAndCounts";
  private readonly fileDataCollection = "fileData";

  constructor() {
    if (!this.FirebaseStore) {
      this.FirebaseStore = getFirestore(Firebase);
    }
  }

  async getUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    const usersCollection = collection(this.FirebaseStore, this.userCollection);
    const q = query(
      usersCollection,
      where("email", "==", email),
      where("password", "==", password)
    );
    const docSnap = await getDocs(q);
    let userByEmail: any = null;
    docSnap.forEach((doc) => {
      userByEmail = doc.data();
    });
    return userByEmail;
  }

  async getUserByEmail(email: string): Promise<User> {
    const usersCollection = collection(this.FirebaseStore, this.userCollection);
    const q = query(usersCollection, where("email", "==", email));
    const docSnap = await getDocs(q);
    let userByEmail: any = null;
    docSnap.forEach((doc) => {
      userByEmail = doc.data();
    });
    return userByEmail;
  }

  async getAllAdminUsers(): Promise<User[]> {
    const usersCollection = collection(this.FirebaseStore, this.userCollection);
    const q = query(usersCollection, where("isAdmin", "==", true));
    const docSnap = await getDocs(q);
    let adminUsers: DocumentData[] = [];
    docSnap.forEach((doc) => {
      adminUsers.push({ id: doc.id, ...doc.data() });
    });
    return adminUsers as User[];
  }

  async markAdminVerified(adminId: string): Promise<void> {
    const adminRef = doc(this.FirebaseStore, this.userCollection, adminId);
    await updateDoc(adminRef, {
      isVerifiedAdmin: true,
    });
  }

  async deleteUserByDocId(docId: string): Promise<string> {
    await deleteDoc(doc(this.FirebaseStore, this.userCollection, docId));
    return "Done";
  }

  async createAccount(user: User): Promise<string | null> {
    const userByEmail = await this.getUserByEmail(user.email);
    if (userByEmail) {
      return null;
    }

    const docRef = await addDoc(
      collection(this.FirebaseStore, this.userCollection),
      { ...user }
    );
    return docRef.id;
  }

  async getAllFileData(): Promise<FileData[] | null> {
    const querySnapshot = await getDocs(
      collection(this.FirebaseStore, this.fileDataCollection)
    );
    const allFileData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      allFileData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return allFileData as FileData[];
  }

  async getAllFileDataById(id: string): Promise<FileData | null> {
    const docRef = doc(this.FirebaseStore, this.fileDataCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FileData;
    } else {
      return null;
    }
  }

  async saveUploadedFilesData(fileData: FileData): Promise<string | null> {
    const docRef = await addDoc(
      collection(this.FirebaseStore, this.fileDataCollection),
      { ...fileData }
    );
    return docRef.id;
  }

  async deleteFeedDocId(docId: string): Promise<string> {
    await deleteDoc(doc(this.FirebaseStore, this.fileDataCollection, docId));
    return "Done";
  }

  rememberUser(user: Omit<User, "password">): void {
    localStorage.setItem(this.userCollection, JSON.stringify(user));
  }

  getCurrentUser(): Omit<User, "password"> {
    const stringData = localStorage.getItem(this.userCollection);
    return stringData ? JSON.parse(stringData) : null;
  }

  isCurrentUserAdmin(): boolean {
    return this.getCurrentUser() ? this.getCurrentUser().isAdmin : false;
  }

  isCurrentUserSuperUser(): boolean {
    return this.getCurrentUser() ? !!this.getCurrentUser().isSuperUser : false;
  }

  isCurrentAdminApprovedUser(): boolean {
    return this.getCurrentUser()
      ? !!this.getCurrentUser().isVerifiedAdmin
      : false;
  }

  signOutUser() {
    localStorage.removeItem(this.userCollection);
  }

  rememberSearchString(filterText: string): void {
    localStorage.setItem(this.filterTextKey, filterText);
  }

  getSearchString(): string {
    const stringData = localStorage.getItem(this.filterTextKey);
    return stringData?.trim() ? stringData.trim() : "";
  }

  rememberKeywordAndCounts(keyWordsAndCounts: Record<string, number>): void {
    localStorage.setItem(
      this.keyWordsAndCountsKey,
      JSON.stringify(keyWordsAndCounts)
    );
  }

  getKeywordsAndCounts(): Record<string, number> {
    const stringData = localStorage.getItem(this.keyWordsAndCountsKey);
    return stringData ? JSON.parse(stringData) : {};
  }

  forgetSearch(): void {
    localStorage.removeItem(this.filterTextKey);
    localStorage.removeItem(this.keyWordsAndCountsKey);
  }
}

const DataService = new DataServiceClazz();
export default DataService;
