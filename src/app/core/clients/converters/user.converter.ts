import {DynamoConverter} from "./dynamo-converter";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {User} from "../models/user.model";
import {Converter} from "./converter";
import {UserDto} from "../dto/user.dto";


export class UserConverter implements DynamoConverter, Converter {
	fromDynamoModel(val: DocumentClient.AttributeMap): User {
		return {
			pk: val.pk,
			sk: val.sk,
			email: val.email,
			surname: val.surname,
			creationDate: new Date(val.creationDate),
			chatId: val.chatId,
		};
	}

	toDynamoModel(val: User): DocumentClient.PutItemInputAttributeMap {
		return {
			pk: val.pk,
			sk: 'USER',
			email: val.email,
			surname: val.surname,
			creationDate: (new Date()).toDateString(),
			chatId: val.chatId,
		}
	}

	toDto(val: User): UserDto {
		return {
			identityId: val.pk,
			email: val.email,
			name: val.name,
			surname: val.surname,
			chatId: val.chatId,
		};
	}

	toModel(val: UserDto): User {
		return {
			pk: val.identityId,
			sk: 'USER',
			email: val.email,
			surname: val.surname,
			creationDate: new Date(),
			chatId: val.chatId,
		};
	}

}
