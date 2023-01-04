import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  async crearDocumento(col: string, data: any) {
    try {
      return await this.firestore.collection(col).add(data);
    } catch (error: any) {
      const code = error.code;
      return { code };
    }
  }

  async crearDocumentoConId(col: string, id: string, data: any) {
    try {
      return await this.firestore.collection(col).doc(id).set(data);
    } catch (error: any) {
      const code = error.code
      return code;
    }
  }
  
  async actualizarDoc(col: string, id: string, data: any) {
    try {
      return await this.firestore.collection(col).doc(id).set(data, { merge: true });
    } catch (error: any) {
      const code = error.code
      return code;
    }
  }

  async eliminarDoc(col: string, id: string) {
    try {
      return this.firestore.collection(col).doc(id).delete();
    } catch (error: any) {
      const code = error.code
      return code;
    }
  }

  crearIdDoc() {
    return this.firestore.createId();
  }

  getDocs<T>(col: string) {
    return this.firestore.collection<T>(col).valueChanges();
  }

  getDoc(col: string, id: string) {
    return this.firestore.collection(col).doc(id).valueChanges();
  }



}
