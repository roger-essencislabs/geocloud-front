import { Profile } from "./Profile";
import { Country } from "./Country";

export class User {
    id?             : number;
    profileId?      : number;
    profile?        : Profile;
    firstName?      : string;
    lastName?       : string;
    phone?          : string;
    email?          : string;
    password?       : string;
    countryId?      : number;
    country?        : Country;
    state?          : string;
    city?           : string;
    access?         : Date;
    attempts?       : number;
    blocked?        : boolean;
    imgTypeProfile? : string;
    imgTypeCover?   : string;
    register?       : Date;
    token?          : string;
}
