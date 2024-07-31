import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, docSnapshots, Firestore, runTransaction, updateDoc } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private _firestore: Firestore) { }

  async getCompanyById(idCompany: any) {
    const ref = doc(this._firestore, 'companys', `${idCompany}`);
    return docSnapshots(ref).pipe(
      map((docSnapshot:any) => {
        const data = docSnapshot.data() as Company;
        return { ID: docSnapshot.id, ...data };
      })
    );
  }

  async createCompany(company: Company) {
    const companyRef = collection(this._firestore, 'companys');
    const docRef = doc(companyRef, company.id);

    try {
      await runTransaction(this._firestore, async (transaction) => {
        const docSnapshot = await transaction.get(docRef);
        if (!docSnapshot.exists()) {
          transaction.set(docRef, company);
        } else {
          transaction.update(docRef, {...company})
        }
      });
      return 'Company create with successful!.';
    } catch (error) {
      console.error('Error to create company: ', error);
      throw error;
    }
  }

  async updateCompany(company: any) {
    const docInstance = doc(
      this._firestore,
      'companys',
      `${company.id}`
    );

    return await updateDoc(docInstance, {...company});
  }

  async deleteCompany(idCompany: string) {
    const docInstance = doc(
      this._firestore,
      'companys',
      `${idCompany}`
    );
    return await deleteDoc(docInstance);
  }
}
