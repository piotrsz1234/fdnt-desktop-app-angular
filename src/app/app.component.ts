import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { User } from './login/user';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'FNDT Application for Web';

	constructor(router: Router) {
		let t = new User();
		t.email = "piotr@dzielo.pl";
		t.groups = ["Bialostocka"];
		localStorage.setItem("user", JSON.stringify(t));
		router.events.subscribe((ev) => {
			return;
			/*if (ev instanceof NavigationEnd) {
				let json = localStorage.getItem("user");
				if (json == null || json == "") router.navigate(["login"]);
				else {
					let user: User = new User();
					user = JSON.parse(json);
					if (user == null) router.navigate(["login"]);
				}
			}*/
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
