import { Customer } from 'modules/customer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'ads',
})
export class Ad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 60 })
  title!: string;

  @Column({ length: 50 })
  category!: string;

  @Column({ length: 600 })
  description!: string;

  @Column({ length: 12 })
  phone!: string;

  @Column('boolean', {default: false})
  featured: boolean = false;

  @Column('boolean', {default: false})
  active: boolean = false;

  @ManyToOne(() => Customer, customer => customer.ads)
    customer: Customer;
}

export class AdEntity {
  title!: string;
  category!: string;
  description!: string;
  phone!: string;
  featured! : boolean;
  active!: boolean;
}
