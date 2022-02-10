import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import LoginDto from './dto/login.dto';
import { comparePasswords } from '../shared/utils/bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public signUp(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  public async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async validateUser(request: LoginDto) {
    const user = await this.usersService.findByEmail({ email: request.email });
    if (!user) {
      return null;
    } else {
      if (comparePasswords(request.password, user.password)) {
        return user;
      } else {
        return null;
      }
    }
  }
}
