import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles/roles.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private rolesService: RolesService) {}

  async onModuleInit() {
    // Seed default roles on startup
    await this.rolesService.seedDefaultRoles();
  }

  getInfo() {
    return {
      name: 'MAGS AI Studio API',
      version: '1.0.0',
      description: 'AI SaaS Platform',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }
}
