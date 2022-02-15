import {Dto} from "./dto";

export interface UserSignupDto extends Dto {
	email: string;
	name?: string;
	surname?: string;
	chatId?: string;
}


export interface UserDto extends Dto {
	identityId: string;
	email: string;
	name?: string;
	surname?: string;
	chatId?: string;
}
