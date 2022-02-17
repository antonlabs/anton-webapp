
export interface UserSignupDto {
	email: string;
	name?: string;
	surname?: string;
	chatId?: string;
}


export interface UserDto {
	identityId?: string;
	email: string;
  avatar: string;
	name?: string;
	surname?: string;
	chatId?: string;
}
