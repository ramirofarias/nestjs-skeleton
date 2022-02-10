import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/shared/utils/bcrypt';
import { Repository } from 'typeorm';
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
    const roles: Role[] = await this.assignRoles(req);

    const user = this.usersRepository.create({ ...req, password, roles });

    return this.usersRepository.save(user);
  }

  private async assignRoles(req: CreateUserDto) {
    let roles: Role[];
    if (!req.roles) {
      roles = [await this.rolesRepository.findOne(Roles.USUARIO)];
    } else {
      roles = await this.parseRoleRequest(req);
    }
    return roles;
  }

  private async parseRoleRequest(req: CreateUserDto) {
    const roles = await this.rolesRepository
      .createQueryBuilder('roles')
      .where('roles.name IN (:...roleNames)', {
        roleNames: req.roles,
      })
      .getMany();
    if (req.roles.length === roles.length) {
      return roles;
    } else {
      throw new UnprocessableEntityException('El rol no existe');
    }
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
