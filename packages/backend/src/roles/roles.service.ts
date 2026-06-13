import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ROLE_PERMISSIONS } from '@/permissions/permissions.constants';

@Injectable()
export class RolesService {
  private readonly systemRoles = ['SUPER_ADMIN', 'ADMIN', 'TEAM_OWNER', 'MEMBER', 'VIEWER'];

  constructor(private prisma: PrismaService) {}

  /**
   * Get all roles
   */
  async getAllRoles() {
    return await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        userRoles: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  /**
   * Create custom role
   */
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, description, permissionIds } = createRoleDto;

    // Check if role already exists
    const existingRole = await this.prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    // Create role
    const role = await this.prisma.role.create({
      data: {
        name,
        description,
      },
    });

    // Assign permissions to role
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissions = permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      }));

      await this.prisma.rolePermission.createMany({
        data: rolePermissions,
      });
    }

    return this.getRoleById(role.id);
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if user already has this role
    const existingUserRole = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (existingUserRole) {
      throw new BadRequestException('User already has this role');
    }

    // Assign role
    const userRole = await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return userRole;
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string) {
    // Check if user has this role
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('User does not have this role');
    }

    // Delete user role
    await this.prisma.userRole.delete({
      where: {
        id: userRole.id,
      },
    });

    return { message: 'Role removed from user' };
  }

  /**
   * Seed default roles (call during app initialization)
   */
  async seedDefaultRoles() {
    // Check if roles already exist
    const existingRoles = await this.prisma.role.findMany();

    if (existingRoles.length > 0) {
      console.log('Roles already seeded');
      return;
    }

    // Seed permissions
    const permissionNames = Object.values(
      Object.values(ROLE_PERMISSIONS).reduce((acc, perms) => {
        perms.forEach((perm) => {
          acc[perm] = perm;
        });
        return acc;
      }, {} as Record<string, string>),
    );

    const permissions = await Promise.all(
      permissionNames.map((permName) =>
        this.prisma.permission.create({
          data: {
            name: permName,
            category: permName.split('.')[0],
          },
        }),
      ),
    );

    // Create roles with permissions
    const rolesData = [
      {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with all permissions',
        permissions: permissions,
      },
      {
        name: 'ADMIN',
        description: 'Administrator',
        permissions: permissions.filter((p) =>
          ROLE_PERMISSIONS.ADMIN.includes(p.name),
        ),
      },
      {
        name: 'TEAM_OWNER',
        description: 'Team Owner',
        permissions: permissions.filter((p) =>
          ROLE_PERMISSIONS.TEAM_OWNER.includes(p.name),
        ),
      },
      {
        name: 'MEMBER',
        description: 'Team Member',
        permissions: permissions.filter((p) =>
          ROLE_PERMISSIONS.MEMBER.includes(p.name),
        ),
      },
      {
        name: 'VIEWER',
        description: 'Viewer',
        permissions: permissions.filter((p) =>
          ROLE_PERMISSIONS.VIEWER.includes(p.name),
        ),
      },
    ];

    for (const roleData of rolesData) {
      const role = await this.prisma.role.create({
        data: {
          name: roleData.name,
          description: roleData.description,
        },
      });

      const rolePermissions = roleData.permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
      }));

      await this.prisma.rolePermission.createMany({
        data: rolePermissions,
      });
    }

    console.log('✅ Default roles seeded successfully');
  }
}
