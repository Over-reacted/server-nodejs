import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Token, TokenEntity } from "./token.entity";

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
  ) {}

  async create(payload: TokenEntity): Promise<Token> {
    return await this.tokensRepository.save(this.tokensRepository.create(payload));
  }

  async delete(customerId: number, token: string) {
    return await this.tokensRepository.delete({ customerId: customerId, token: token });
  }

  async deleteAll(customerId: number) {
    await this.tokensRepository.delete({ customerId: customerId });
  }
  
  async get(id: number) {
    return await this.tokensRepository.findOne(id);
  }

  async exists(customerId: number, accessToken: string): Promise<boolean> {
    const token = await this.tokensRepository.findOne({ where: { customerId: customerId, token: accessToken } });

    if (token) {
      return true;
    }
    return false;
  }
}