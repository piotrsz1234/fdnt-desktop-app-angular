import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from 'firebase';
import { UserInfo } from '../login/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user: User;
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
						console.log(k);
						info.groups.push(k);
						c++;
					}
					info.groups = new Array<string>(c);
					c =0;
					for(let k in JSON.parse(JSON.stringify(x.payload.val()))){
						console.log(k);
						info.groups[c] = k;
						c++;
					}
					localStorage.setItem("user", JSON.stringify(info));
					router.navigate(["calendar"]);
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
