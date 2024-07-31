import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthOfUser } from '../../models/auth-user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(){}

  @Input({required: true}) userAuth!:AuthOfUser;
  @Output() dataEvent = new EventEmitter<any>();

  logout(){
    this.dataEvent.emit();
  }

}
