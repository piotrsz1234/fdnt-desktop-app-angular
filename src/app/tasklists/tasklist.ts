import { emptyGuid } from '../config';

export class TaskList {
    iD : string = "";
    name : string = "";
    owner : string = "";

    constructor() {
        this.iD = emptyGuid;
        this.name = "Wybierz listę zadań";
    }
}
