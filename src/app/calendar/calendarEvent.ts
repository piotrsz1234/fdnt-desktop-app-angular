export class APICalendarEvent {
	ID : string = "";
	Name : string = "";
	ForWho : string = "";
	WhenBegins : Date = new Date();
	WhenEnds : Date = new Date();
	Location : string = "";
	TaskListID : string = "";
	IsForDedicatedGroup : boolean = false;
	Category : string = "";
	CreatorEmail : string = "";

}

export class CategoryCalendarEvent {
	ID : string = "";
	Name : string = "";
	Color : SerializableColor = new SerializableColor();
	IsPersonal : boolean = false;
	Owner : string = "";
}

export class SerializableColor {
	R : number=0;
	G : number=0;
	B : number=0;
	A : number=0;
}