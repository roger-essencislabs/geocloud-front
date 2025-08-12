import { Account } from "./Account";

export class Profile {
    id?         : number;
    accountId?  : number;
    account?    : Account;
    name?       : string;
    imgType?    : string;
}
