import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Controller('roles')
@UseGuards(JwtGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  /**
   * Get all roles
   */
  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllRoles() {
    return await this.rolesService.getAllRoles();
  }

  /**
   * Get role by ID
   */
  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getRoleById(@Param('id') roleId: string) {
    return await this.rolesService.getRoleById(roleId);
  }

  /**
   * Create custom role
   */
  @Post()
  @Roles('SUPER_ADMIN')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  /**
   * Assign role to user
   */
  @Post('assign')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async assignRoleToUser(@Body() assignRoleDto: AssignRoleDto) {
    return await this.rolesService.assignRoleToUser(assignRoleDto);
  }

  /**
   * Remove role from user
   */
  @Post(':id/remove/:userId')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('id') roleId: string,
  ) {
    return await this.rolesService.removeRoleFromUser(userId, roleId);
  }
}
