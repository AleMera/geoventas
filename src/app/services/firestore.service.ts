import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore:AngularFirestore) { }
  
  crearDocumento(col: string, data:any){
    return this.firestore.collection(col).add(data);
  }
}
