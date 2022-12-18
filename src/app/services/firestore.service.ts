import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  crearDocumento(col: string, data: any) {
    return this.firestore.collection(col).add(data);
  }

  crearDocumentoConId(col: string, id: string, data: any) {
    return this.firestore.collection(col).doc(id).set(data);
  }

  crearIdDoc() {
    return this.firestore.createId();
  }

  actualizarDoc(col: string, id: string, data: any) {
    return this.firestore.collection(col).doc(id).set(data, { merge: true });
  }

  getDoc(col: string, id: string) {
    return this.firestore.collection(col).doc(id).get();
  }
}
