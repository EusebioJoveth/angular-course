import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private _authService: AuthService){}

  email:string = '';
  password:string = ''

  onSubmit(){
    console.log(`email ${this.email}, password ${this.password}`)
    if(this.email != "" && this.password != ""){
      this._authService.loginWithEmailPassword(this.email, this.password).then(userCredential => {
        console.log(`userCredential ${userCredential.user}`)
      }).catch(error =>{
        console.log(`error ${error}`)
      });
    }
  }

  googleLogin(){
    this._authService.googleLogin().then(userCredential => {
      console.log(`userCredential ${userCredential.user}`)
    }).catch(error =>{
      console.log(`error ${error}`)
    });
  }

}
