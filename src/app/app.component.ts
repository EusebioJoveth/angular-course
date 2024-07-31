import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { UserComponent } from './components/user/user.component';
import { DUMMY_USERS } from './dummy-users';
import { TasksComponent } from './components/tasks/tasks.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, UserComponent, TasksComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  userAuth:any;

  constructor(private _auth: AuthService){ }

  users = DUMMY_USERS;
  selectedUserId?:string;

  ngOnInit(): void {
   this._auth.isUserLoggedIn().subscribe(User =>{
    this.userAuth = User;
    console.log('User', this.userAuth)
   })
  }

  receiveData(authUser: any) {
    this.userAuth= authUser;
  }

  logout(){
    this._auth.signOut().then(() =>{
      this.userAuth = null;
    });
  }

  get selectedUser(){
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  onSelectUser(id:string){
    this.selectedUserId = id;
  }


  ngOnDestroy(): void {

  }
}
