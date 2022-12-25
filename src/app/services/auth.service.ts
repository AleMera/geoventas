import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  async login(email: string, passwd: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, passwd);
    } catch (err: any) {
      // const msj = 'No se ha podido iniciar sesión';
      const code = err.code;
      return { code };
    }
  }

  async loginGoogle() {
    try {
      return await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      const msj = 'No se ha podido iniciar sesión';
      console.log(msj + ': ' + error);
      return msj;
    }
  }

  async registro(email: string, passwd: string) {
    try {
      return await this.auth.createUserWithEmailAndPassword(email, passwd); 
    } catch (error) {
      const msj = 'No se ha podido registrar';
      console.log(msj + ': ' + error);
      return msj;
    }
  }

  async logout() {
    try {
      return await this.auth.signOut();
    } catch (error) {
      const msj = 'No se ha podido cerrar sesión';
      console.log(msj + ': ' + error);
      return msj;
    }
  }

  //TODO: Crear el metodo para recuperar la contraseña y para modificar información del usuario

  getUserInfo() {
    return this.auth.authState;
  }
}
