import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserInfo } from './login/user';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'FNDT Application for Web';

	constructor(router: Router) {
		router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				let json = localStorage.getItem("user");
				if (json == null || json == "") router.navigate(["login"]);
				else {
					let user: UserInfo = new UserInfo();
					user = JSON.parse(json);
					if (user == null) router.navigate(["login"]);
				}
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

	public ngOnInit(): void {
		this.onResize(null);
	}

}
