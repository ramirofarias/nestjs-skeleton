import { IsEmail, IsString } from 'class-validator';

export default class LoginDto {
  @IsEmail({}, { message: 'Debe ingresar un email válido' })
  email: string;

  @IsString()
  password: string;
}
