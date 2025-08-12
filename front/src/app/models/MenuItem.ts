export interface MenuItem {
    id?          : number;
    label?       : any;
    icon?        : string;
    link?        : string;
    subItems?    : any;
    parentId?    : number;
    isCollapsed? : any;
    collapseid?  : string;
    isTitle?     : boolean;
    badge?       : any;
    isLayout?    : boolean;
}