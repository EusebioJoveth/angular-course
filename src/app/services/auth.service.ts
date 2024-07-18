import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, linkWithCredential, signInWithPopup} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _auth: Auth) { }

  async loginWithEmailPassword(email: string, password: string){
  return await createUserWithEmailAndPassword(this._auth,email, password);
  }

  async googleLogin(){
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/user.info');
    return await signInWithPopup(this._auth, provider);
  }
}
