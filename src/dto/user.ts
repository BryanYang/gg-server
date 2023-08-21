import { omit } from 'lodash';
import { User } from '../models/user';

export class UserDto {
  readonly id: number;

  readonly username: string;
  // 不包含敏感信息的字段

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }
}

export const convertToUserDTO = (user: User): UserDto => {
  return new UserDto(user);
};
