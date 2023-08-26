import { omit } from 'lodash';
import { User } from '../models/user';

export type UserDto = Omit<User, 'password'>;

export const convertToUserDTO = (user: User): UserDto => {
  return omit(user.get({ plain: true }), ['password']);
};
