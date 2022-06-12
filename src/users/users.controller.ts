import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serializse-interceptor';
import { ShowUserDto } from './dtos/show-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize<typeof ShowUserDto, User>(ShowUserDto)
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() sesstion: any): Promise<User> {
    const user = await this.authService.signup(body.email, body.password);
    sesstion.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
     const user = await this.authService.signin(body.email, body.password);
     session.userId = user.id;
     return user;
  }

//   @Get('/whoami')
//   whoAmI(@Session() session: any): Promise<User> {
//     return this.usersService.findOne(session.userId);
//   }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() currentUser: User): User {
    return currentUser;
  }

  @Post('/singout')
  signout(@Session() session: any): string {
    session.userId = null;
    return 'user signed out successfully.';
  }

  @Get('/:id')
  async findOneUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }

  @Get()
  findAllEmails(@Query('email') email: string): Promise<User[]> {
    return this.usersService.findEmails(email);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), updatedUser);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }
}
