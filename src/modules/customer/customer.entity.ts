import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'customers',
})
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 12 })
  phone!: string;

  @Column({ length: 35 })
  location!: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password!: string;


}

export class CustomerFillableFields {
  name!: string;
  description!: string;
  email!: string;
  password!: string;
  phone!: string;
  location!: string;
}
