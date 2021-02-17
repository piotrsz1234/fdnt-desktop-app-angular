import { emptyGuid } from '../config';

export class Post {
    iD : string = "";
    html : string = "";
    publishDate : string = "";
    forWho : string = "";
    owner : string = "";
    isPublished : boolean = false;
    title : string = "";

    constructor() {
        this.iD = emptyGuid;
    }

}