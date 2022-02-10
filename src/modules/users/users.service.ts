import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import LoginDto from 'src/auth/dto/login.dto';
import { comparePasswords, hashPassword } from 'src/shared/utils/bcrypt';
import { Equal, Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Roles } from '../roles/entities/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import EmailDto from './dto/email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(req: CreateUserDto) {
    const users = await this.usersRepository.find({
      email: req.email,
    });

    if (users.length) {
      throw new BadRequestException('El usuario ya existe');
    }

    const password = hashPassword(req.password);

    let roles = [];
    if (!req.roles) {
      roles = [await this.rolesRepository.findOne(Roles.USUARIO)];
    } else {
      for (const role in req.roles) {
        const createdRole = await this.rolesRepository.findOne({
          name: req.roles[role],
        });
        if (createdRole) {
          roles.push(createdRole);
        } else {
          throw new BadRequestException('El rol no existe');
        }
      }
    }

    const user = this.usersRepository.create({ ...req, password, roles });

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({ relations: ['roles'] });
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
    return this.usersRepository.softDelete({ id });
  }
}
