import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth : AuthService) { }

  ngOnInit(): void {
  }

  loginClicked() : void {
    let emailC = document.getElementById("email");
    let passwordC = document.getElementById("password");
    if(emailC == null || passwordC == null) return;
    let email = (emailC as HTMLInputElement).value;
    let password = (passwordC as HTMLInputElement).value;
    this.auth.login(email, password);
  }

}
