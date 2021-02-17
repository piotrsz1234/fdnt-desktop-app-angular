import { UserInfo } from './login/user';

export var apiUrl = "https://localhost:44363/api/v1.0/";

export function CombineUrls(url1: string, url2: string): string
{
    var output = url1;
    if(url1[url1.length-1] == '/')
        if(url2[0] == '/')
            output += url2.substr(1);
        else output += url2;
    else
        if(url2[0] == '/')
            output += url2;
        else output += '/' + url2;
    return output;
}

export function GetUser() {
    let temp = localStorage.getItem("user") as string;
    if(temp == "") return null;
    return JSON.parse(temp) as UserInfo;
}

export var emptyGuid = "00000000-0000-0000-0000-000000000000";