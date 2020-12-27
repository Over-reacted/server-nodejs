import { Exclude } from 'class-transformer';
import { UserRoles } from 'common/user-roles';
import { UserStatus } from 'common/user-status';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'customers',
})
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, default: null } )
  name: string;

  @Column({ length: 500, default: null })
  description: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 12, default: null })
  phone: string;

  @Column({ length: 35, default: null })
  location: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.CUSTOMER
  })
  role: UserRoles;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  emailStatus: UserStatus;
}

export class CustomerEntity {
  email!: string;
  password!: string;
  name?: string;
  description?: string;
  phone?: string;
  location?: string;
}
