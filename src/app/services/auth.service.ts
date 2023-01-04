import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface LoginData {
  email: string;
  passwd: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // constructor(private auth: Auth) { }
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

  async registro(usuario: any) {
    try {
      return await (await this.auth.createUserWithEmailAndPassword(usuario.email, usuario.passwd))
    } catch (error: any) {
      const code = error.code;
      return { code };
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

  async getUid() {
    try {
      return await this.auth.currentUser;
    } catch (error) {
      return null;
    }
  }
}
