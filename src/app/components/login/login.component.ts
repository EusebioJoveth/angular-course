import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthOfUser} from '../../models/auth-user';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
import { Company } from '../../models/company';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  constructor(private _authService: AuthService, private _toastr: ToastrService,
    private _company: CompanyService, private _user:UserService
  ){}

  email:string = '';
  password:string = ''
  UserCredential: any;
  user!: User;
  clicked:boolean = false;
  subscriptions: Subscription[] = [];
  @Output() dataEvent = new EventEmitter<any>();

  onSubmit(){
    this.clicked = true;
    if(this.email != "" && this.password != ""){
      this._authService.createUserWithEmailAndPassword(this.email, this.password).then((userCredential:any) => {
        this.UserCredential = userCredential.user;
        const company: Company = {
          id: this.UserCredential.uid,
          name:this.UserCredential.email.split('@')[0]
        };
        this.createCompany(company);

      }).catch(error =>{
        if(error.code === "auth/email-already-in-use"){
          this.enterTheSystem();
        }else{
          this.clicked = false;
          this._toastr.error(`error ${error.code}`, 'Erro ao efetuar login');
        }
      });
    }else{
      this.clicked = false;
      this._toastr.warning('Preencha os campos email e a palavra pass!');
    }
  }

   createCompany(company: Company){
     this._company.createCompany(company).then(() =>{
      this.user = this.userField;
      this.addUser(this.user);
     }).catch((error) =>{
      this.clicked = false;
      this._authService.signOut();
      this._toastr.error("Erro ao criar Empresa");
     });
  }

  get userField(){
     const user: User = {
      id: this.UserCredential.uid,
      idCompany:this.UserCredential.uid,
      avatar: this.UserCredential.photoURL,
      name: this.UserCredential.email.split('@')[0],
      email:this.UserCredential.email,
      admin: true,
      accessToken:this.UserCredential?.accessToken ?? null
    }
    return user;
  }

  addUser(user:User){
    this._user.addUserWithIdDefined(user).then(() =>{
     this.msgConect();
      this.clicked = false;
      this.dataEvent.emit(this.UserCredential);
    }).catch((error) =>{
      this.clicked = false;
      this._toastr.error('Erro ao entrar no sistema');
    });
  }

  enterTheSystem(){
    this._authService.signInEmailPassWord(this.email, this.password).then((User) =>{
      const userAuth = User.user;
      const onSubscribe  = this._user.getUserByIdSnapshots(userAuth.uid).subscribe((response:any )=>{
          const UserR = response;
        if(UserR?.idCompany){
          this.msgConect();
          this.dataEvent.emit(User);
          this.clicked = false;
        }else{

        this.UserCredential = userAuth;
        const company: Company = {
          id: this.UserCredential.uid,
          name:this.UserCredential.email.split('@')[0]
        };
        this.createCompany(company);

        }
        });
        this.subscriptions.push(onSubscribe);
      }).catch(error =>{
        this.clicked = false;
        this._toastr.error('Palavra passe errada');
      });

  }

  msgConect(){
    this._toastr.success("Conectado...", "", {
      timeOut: 1200,
      progressBar: true,
      progressAnimation: "increasing",
    });
  }

  googleLogin(){
    this.clicked = true;
    this._authService.googleLogin().then((userCredential:any) => {
      this.UserCredential = userCredential.user;
      const onSubscribe  = this._user.getUserByIdSnapshots(this.UserCredential.uid).subscribe((response:any )=>{
        const UserR = response;
      if(UserR?.idCompany){
        this.msgConect();
        this.dataEvent.emit(this.UserCredential);
        this.clicked = false;
      }else{

      const company: Company = {
        id: this.UserCredential.uid,
        name:this.UserCredential.email.split('@')[0]
      };
      this.createCompany(company);

      }
      });

      this.subscriptions.push(onSubscribe);
    }).catch(error =>{
      this._toastr.error(`error ${error}`);
      this.clicked = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
