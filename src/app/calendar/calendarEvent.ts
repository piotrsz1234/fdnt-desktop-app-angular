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

export class CategoryCalendarEvent {
	iD : string = "";
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