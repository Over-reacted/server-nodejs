import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tokens',
})
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerId!: number;

  @Column()
  token!: string;  
}

export class TokenEntity {
  customerId!: number;
  token!: string;
}
