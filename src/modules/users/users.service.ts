import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
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
  public relations = ['roles'];

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly mailService: MailService,
  ) {}

  async create(req: CreateUserDto) {
    await this.checkIfUserExists(req);
    const password = hashPassword(req.password);
    const roles: Role[] = await this.assignRoles(req);
    const user = this.usersRepository.create({ ...req, password, roles });
    const token = 'asdasd';
    this.mailService.sendUserConfirmationEmail(user, token);
    return this.usersRepository.save(user);
  }

  private async checkIfUserExists(req: CreateUserDto) {
    const users = await this.usersRepository.find({
      email: req.email,
    });

    if (users.length) {
      throw new BadRequestException('El usuario ya existe');
    }
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
    return this.usersRepository.find({
      relations: this.relations,
      withDeleted: true,
    });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: this.relations,
      withDeleted: true,
    });
  }

  findByEmail(req: EmailDto) {
    const user = this.usersRepository.findOne({
      where: {
        email: req.email,
      },
      relations: this.relations,
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.usersRepository.softDelete({ id });
  }
}
