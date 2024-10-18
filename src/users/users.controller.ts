import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserRole } from '../auth/roles/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users') 
@ApiBearerAuth() 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' }) 
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Detalles del usuario.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;

    
    if (user.role === UserRole.USER && user.id !== id) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }

    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto, @Request() req) {
    const user = req.user;

    
    if (user.id !== id) {
      throw new ForbiddenException('You do not have permission to edit this resource.');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async remove(@Param('id') id: string, @Request() req) {
    const userToDelete = await this.usersService.findById(id);

   
    if (userToDelete.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins cannot be deleted.');
    }

    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.USER)
  @Patch(':id/mark-for-deletion')
  @ApiOperation({ summary: 'Marcar un usuario para eliminación' })
  @ApiResponse({ status: 200, description: 'Usuario marcado para eliminación.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async markForDeletion(@Param('id') id: string, @Request() req) {
    const user = req.user;

    
    if (user.id !== id) {
      throw new ForbiddenException('You do not have permission to mark this resource for deletion.');
    }

    return this.usersService.markForDeletion(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.USER) 
  @Patch('deactivate')
  @ApiOperation({ summary: 'Solicitar desactivación del usuario' })
  @ApiResponse({ status: 200, description: 'Solicitud de desactivación recibida.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async requestDeactivation(@Request() req) {
    const user = req.user;

    
    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

 
    await this.usersService.requestDeactivation(user.id);
    return { message: 'Request for deactivation received.' };
  }
}
