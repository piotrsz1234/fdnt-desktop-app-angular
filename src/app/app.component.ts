import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserInfo } from './login/user';
import { AuthService } from './auth/auth.service';
import { GetUser } from './config';

declare let loadMaterializeCss: Function;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'FNDT Application for Web';

	constructor(private router: Router, private auth : AuthService) {
		router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				setTimeout(loadMaterializeCss, 500);
				if (GetUser() == undefined || !this.auth.isLogged())
					router.navigateByUrl("/(main:login)");
			}
		});
	}

	onResize(event: any) {
		let el = document.getElementById("navbar");
		let content = document.getElementById("content");
		if (el != null && content != null) {
			content.style.height = (window.innerHeight - el.offsetHeight).toString() + "px";
		}
	}

	logOut() {
		this.auth.logout();
		localStorage.removeItem("user");
		this.router.navigateByUrl("/(main:login//sidebar:calendar)");
	}

	public ngOnInit(): void {
		this.onResize(null);
	}

	getLetter() {
		if (GetUser() == null || !this.auth.isLogged()) return "--";
		return (GetUser() as UserInfo).email.substr(0, 1).toUpperCase();
	}

}
