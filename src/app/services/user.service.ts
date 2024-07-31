import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docSnapshots, DocumentSnapshot, Firestore, orderBy, query, runTransaction, where } from '@angular/fire/firestore';
import { from, map, of, switchMap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _firestore: Firestore) { }

  getUsersOfCompany(idCompany: string) {
    const usersCollection = collection(this._firestore, "users");
    const usersCreatorQuery = query(usersCollection, where('idCompany', '==', idCompany), orderBy('name'));
    const users = collectionData(usersCreatorQuery, { idField: 'id' });
    return from(users);
  }

   getUserByIdSnapshots(idUser: string) {
    const ref = doc(this._firestore, 'users', `${idUser}`);
    return docSnapshots(ref).pipe(
      switchMap((docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as User;
          return of({ ID: docSnapshot.id, ...data });
        } else {
          // O documento não existe
          return of(null);
        }
      })
    );
  }

  async addUserWithIdDefined(user: User) {
    const collectionPath = `users/${user.id}`;
    const docRef = doc(this._firestore, collectionPath);

    const transaction = await runTransaction(this._firestore, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);
      if (!docSnapshot.exists()) {
        transaction.set(docRef, user);
      } else {
        console.warn("Already exists! Update only")
        transaction.update(docRef, { ...user })
      }
    });

    return transaction;
  }

  async createUser(valueUser: User) {
    const userCollection = collection(this._firestore, 'users');
    const transaction = await runTransaction(this._firestore, async (transaction) => {
      const userRef = doc(userCollection);

      const user = Object.assign(
        { online: 0, dateUpdate: new Date(), ...valueUser },
        { id: userRef.id }
      );
      transaction.set(userRef, user);
    });

    return transaction;
  }

  async updateUser(user: any) {
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    const transaction = await runTransaction(this._firestore, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User notfound!");
      }
      transaction.update(userDocRef, { ...user });
    });

    return transaction;
  }

  async deleteUser(userKey: string): Promise<void> {
    const userDocRef = doc(this._firestore, `users/${userKey}`);
    await deleteDoc(userDocRef);
  }
}
