import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LoginDto from 'src/auth/dto/login.dto';
import { comparePasswords, hashPassword } from 'src/shared/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import EmailDto from './dto/email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(req: CreateUserDto) {
    const users = await this.usersRepository.find({ email: req.email });

    if (users.length) {
      throw new BadRequestException('El usuario ya existe');
    }

    const password = hashPassword(req.password);
    const user = this.usersRepository.create({ ...req, password });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ id });
  }

  findByEmail(req: EmailDto) {
    const users = this.usersRepository.createQueryBuilder('user');
    return users.where('user.email = :email', { email: req.email }).getOne();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
