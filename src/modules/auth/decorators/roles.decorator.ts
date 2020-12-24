import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'shared/user-roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);