import { UserInfo } from './login/user';
import { TaskList } from './tasklists/tasklist';

export var apiUrl = "https://localhost:44363/api/v1.0/";

export function CombineUrls(url1: string, url2: string): string {
    var output = url1;
    if (url1[url1.length - 1] == '/')
        if (url2[0] == '/')
            output += url2.substr(1);
        else output += url2;
    else
        if (url2[0] == '/')
            output += url2;
        else output += '/' + url2;
    return output;
}

export function GetUser() {
    let temp = localStorage.getItem("user") as string;
    if (temp == "") return null;
    return JSON.parse(temp) as UserInfo;
}

export function getDateString(date : Date) {
    return twoDigitNumber(date.getDate()) + "." + twoDigitNumber(date.getMonth()) + "." + date.getFullYear() + " r.";
}

function twoDigitNumber(t: number): string {
    if (t < 10) return "0" + t;
    return t.toString();
}

export function Count<T>(array: Array<T>, func: (f: T) => boolean) {
    let output = 0;
    for (let i = 0; i < array.length; i++)
        if (func(array[i])) output++;
    return output;
}

export function RemoveWhere<T>(array: Array<T>, func: (f: T) => boolean) {
    let output = new Array<T>();
    for (let k of array)
        if (!func(k)) output.push(k);
    return output;
}

export function Where<T>(array: Array<T>, func: (f: T) => boolean) {
    let output = new Array<T>();
    for (let k of array)
        if (func(k)) output.push(k);
    return output;
}

export function FirstOrDefault<T>(array: Array<T>, func: (f: T) => boolean) {
    for (let k of array)
        if (func(k)) return k;
    return undefined;
}

export var emptyGuid = "00000000-0000-0000-0000-000000000000";