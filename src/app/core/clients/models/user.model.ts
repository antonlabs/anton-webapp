import {Model} from "./model";


export interface User extends Model {
    pk: string;
    sk: string
    email: string;
    creationDate: Date;
    name?: string;
    surname?: string;
    chatId?: string;
}