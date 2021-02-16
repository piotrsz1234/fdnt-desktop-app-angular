import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from "firebase/app";
import { UserInfo } from '../login/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user: firebase.User = JSON.parse("{}");
	constructor(public afAuth: AngularFireAuth, database: AngularFireDatabase, router: Router) {
		this.afAuth.authState.subscribe(user => {
			if (user) {
				this.user = user;
				if(user.email == null) return;
				let path = "users/" + user.email.substr(0, user.email.indexOf("@"));
				path = this.removeDot(path);
				let usersTabs = database.object(path).snapshotChanges();
				let info = new UserInfo();
				info.email = user.email;
				usersTabs.subscribe(x => {
					let c =0;
					for(let k in JSON.parse(JSON.stringify(x.payload.val()))){
						c++;
					}
					info.groups = new Array<string>(c);
					c =0;
					for(let k in JSON.parse(JSON.stringify(x.payload.val()))){
						info.groups[c] = k;
						c++;
					}
					localStorage.setItem("user", JSON.stringify(info));
					router.navigate(["calendar"]);
				});
				let tabs = database.object("tabs").snapshotChanges();
				tabs.subscribe(x => {
					let tab = new Array<string>();
					for(let k in JSON.parse(JSON.stringify(x.payload.val()))){
						tab.push(k);
					}
					localStorage.setItem("tabs", JSON.stringify(tab));
				});
				localStorage.setItem('firebaseUser', JSON.stringify(this.user));
			} else {
				localStorage.removeItem('firebaseUser');
			}
		})
	}
	login(email:string, password:string) {
		return this.afAuth.signInWithEmailAndPassword(email, password);
	}

	removeDot(s : string) : string {
		let output = "";
		for(let i=0;i<s.length;i++)
			if(s[i] != '.') output +=s[i];
		return output;
	}
}
