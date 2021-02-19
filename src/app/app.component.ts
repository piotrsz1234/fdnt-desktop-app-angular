import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserInfo } from './login/user';
import { AuthService } from './auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'FNDT Application for Web';

	constructor(router: Router, private auth : AuthService) {
		router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				if (!auth.isLogged())
					router.navigateByUrl("/(main:login//sidebar:calendar)");
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
	}

	public ngOnInit(): void {
		this.onResize(null);
	}

}
