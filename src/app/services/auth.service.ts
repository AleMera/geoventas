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

  async registro(credenciales: any) {
    try {
      return await (await this.auth.createUserWithEmailAndPassword(credenciales.email, credenciales.passwd))
    } catch (error: any) {
      const code = error.code;
      return { code };
    }
  }

  // async logout() {
  //   try {
  //     return await this.auth.signOut();
  //   } catch (error) {
  //     const msj = 'No se ha podido cerrar sesión';
  //     console.log(msj + ': ' + error);
  //     return msj;
  //   }
  // }
  logout() {
    return this.auth.signOut();
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
