import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'common/user-roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);