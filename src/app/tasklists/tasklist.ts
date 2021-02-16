import { emptyGuid } from '../config';

export class TaskList {
    id : string = "";
    name : string = "";
    owner : string = "";

    constructor() {
        this.id = emptyGuid;
        this.name = "Wybierz listę zadań";
    }
}
