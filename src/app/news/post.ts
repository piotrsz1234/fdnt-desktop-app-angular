import { emptyGuid } from '../config';

export class Post {
    id : string = "";
    html : string = "";
    publishDate : string = "";
    forWho : string = "";
    owner : string = "";
    isPublished : boolean = false;
    title : string = "";

    constructor() {
        this.id = emptyGuid;
    }

}