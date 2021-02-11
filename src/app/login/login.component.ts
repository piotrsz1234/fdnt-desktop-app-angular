import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  loginClicked() : void {
    let emailC = document.getElementById("email");
    let passwordC = document.getElementById("password");
    if(emailC == null || passwordC == null) return;
    console.log("dziala");
    emailC.setAttribute("disabled", "true");
    passwordC.setAttribute("disabled", "true");
    let email = (emailC as HTMLInputElement).value;
    let password = (passwordC as HTMLInputElement).value;
    
  }

}
