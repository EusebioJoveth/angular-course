import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Auth, EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, linkWithCredential, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:any;

  constructor(private _auth: Auth, @Inject(PLATFORM_ID) private platformId: Object,) {
    this.changeAuthState();
   }

  changeAuthState(){
    onAuthStateChanged(this._auth, (user) => {
      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          this.user =user;
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      }
    });
  }

  isUserLoggedIn(): Observable<AuthUser | null> {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        return of(null);
      }
      const user = JSON.parse(userString) as AuthUser;
      return of(user);
    } catch (error) {
      console.error('Erro ao recuperar o usuário do localStorage:', error);
      return of(null);
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string){
  return await createUserWithEmailAndPassword(this._auth,email, password);
  }

  async signInEmailPassWord(email: string, password: string):Promise<any>{
    return await signInWithEmailAndPassword(this._auth,email, password);
  }

  async googleLogin(){
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    return await signInWithPopup(this._auth, provider);
  }

  async signOut() {
    return await signOut(this._auth).then(()=>{
      localStorage.removeItem('user');
    });
  }
}
