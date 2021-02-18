import { emptyGuid } from '../config';

export class TaskList {
    id : string = "";
    name : string = "";
    owner : string = "";
    deadline : string = "";
    constructor(b : boolean = false) {
        this.id = emptyGuid;
        if (!b)
            this.name = "Wybierz listę zadań";
        else this.name = "";
        this.owner = "";
    }
}

export class Task {
    id :string = emptyGuid;
    title : string = "";
    text : string = "";
    ownerId : string = "";
    maximumCountOfPeopleWhoCanDoIt : number = 1;
}

export class Declaration {
    id : string = emptyGuid;
    person : string = "";
    task : string = "";
    isCompleted : boolean = false;
}