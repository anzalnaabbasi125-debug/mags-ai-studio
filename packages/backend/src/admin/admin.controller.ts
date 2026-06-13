import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtGuard } from '@/auth/guards/jwt.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * Get all users
   */
  @Get('users')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllUsers(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return await this.adminService.getAllUsers(parseInt(skip), parseInt(take));
  }

  /**
   * Get user by ID
   */
  @Get('users/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getUserById(@Param('id') userId: string) {
    return await this.adminService.getUserById(userId);
  }

  /**
   * Update user role
   */
  @Patch('users/:id/role')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return await this.adminService.updateUserRole(userId, updateUserRoleDto);
  }

  /**
   * Deactivate user
   */
  @Patch('users/:id/deactivate')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deactivateUser(@Param('id') userId: string, @CurrentUser() user: any) {
    return await this.adminService.deactivateUser(userId, user.sub);
  }

  /**
   * Activate user
   */
  @Patch('users/:id/activate')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async activateUser(@Param('id') userId: string, @CurrentUser() user: any) {
    return await this.adminService.activateUser(userId, user.sub);
  }

  /**
   * Get audit logs
   */
  @Get('audit-logs')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAuditLogs(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '50',
  ) {
    return await this.adminService.getAuditLogs(parseInt(skip), parseInt(take));
  }
}
