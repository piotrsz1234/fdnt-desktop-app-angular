import { CalendarEvent } from 'angular-calendar';
import { emptyGuid, GetUser } from '../config';
import { UserInfo } from '../login/user';

export class APICalendarEvent {
	id : string = "00000000-0000-0000-0000-000000000000";
	name : string = "";
	forWho : string = "";
	whenBegins : string = "";
	whenEnds : string = "";
	location : string = "";
	taskListID : string = "";
	isForDedicatedGroup : boolean = false;
	category : string = "";
	creatorEmail : string = "";

}

export class Participation {
	id: string = "";
	user: string = "";
	calendarEventId: string = "";
	hasOwnerConfirmed: boolean = false;
	hasParticipantConfirmed: boolean = false;

}

export function configureParticipationForRegistrator(calendarEvent : APICalendarEvent) {
		let registration = new Participation();
		registration.id = emptyGuid;
		registration.user = (GetUser() as UserInfo).email;
		registration.calendarEventId = calendarEvent.id;
		registration.hasParticipantConfirmed = true;
		registration.hasOwnerConfirmed = false;
	return registration;
}

export function configureParticipationAsInvitation(calendarEvent : APICalendarEvent) {
	let registration = new Participation();
	registration.id = emptyGuid;
	registration.user = (GetUser() as UserInfo).email;
	registration.calendarEventId = calendarEvent.id;
	registration.hasParticipantConfirmed = false;
	registration.hasOwnerConfirmed = true;
	return registration;
}

export function AreTheyTheSame(event1 :APICalendarEvent, event2 : CalendarEvent) {
	if(event1.name != event2.title) return false;
	if(JSON.stringify(event2.start) != JSON.stringify(new Date(event1.whenBegins))) return false;
	return true;
}

export class CategoryCalendarEvent {
	id : string = "";
	name : string = "";
	color : SerializableColor = new SerializableColor();
	isPersonal : boolean = false;
	owner : string = "";
}

export class SerializableColor {
	r : number=0;
	g : number=0;
	b : number=0;
	a : number=0;
}

export function CalculateColorForHex(color : SerializableColor) {
	let output = "#";
	output += getLetter(color.r % 16);
	output += getLetter(Math.floor(color.r / 16) % 16);
	output += getLetter(color.g % 16);
	output += getLetter(Math.floor(color.g / 16) % 16);
	output += getLetter(color.b % 16);
	output += getLetter(Math.floor(color.b / 16) % 16);
	//output += getLetter(color.a % 16);
	//output += getLetter(Math.floor(color.a / 16) % 16);
	return output;
}

export function CalculateSecondaryColorForHex(color : SerializableColor) {
	let output = "#";
	output += getLetter(Math.max(color.r % 16 - 1, 0));
	output += getLetter(Math.max(Math.floor(color.r / 16) % 16 - 1, 0));
	output += getLetter(Math.max(color.g % 16 - 1, 0));
	output += getLetter(Math.max(Math.floor(color.g / 16) % 16 - 1, 0));
	output += getLetter(Math.max(color.b % 16 - 1, 0));
	output += getLetter(Math.max(Math.floor(color.b / 16) % 16 - 1, 0));
	//output += getLetter(Math.max(color.a % 16 - 1, 0));
	//output += getLetter(Math.max(Math.floor(color.a / 16) % 16 - 1, 0));
	return output;
}

function getLetter(n : number) {
	if(n < 10) return n.toString();
	if(n == 10) return "A";
	if(n == 11) return "B";
	if(n == 12) return "C";
	if(n == 13) return "D";
	if(n == 14) return "E";
	if(n == 15) return "F";
	return "";
}