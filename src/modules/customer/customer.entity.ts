import { Exclude } from 'class-transformer';
import { Ad } from 'modules/ad/ad.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Ad, ad => ad.customer)
  ads: Ad[];
}

export class CustomerEntity {
  name!: string;
  description!: string;
  email!: string;
  password!: string;
  phone!: string;
  location!: string;
}
