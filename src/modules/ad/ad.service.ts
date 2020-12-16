import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad, AdEntity } from './ad.entity';
import { CreateAdDto } from './dto/createAd.dto';
import { Customer } from 'modules/customer';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Customer)
    private readonly customerRepisotory: Repository<Customer>
  ) {}

  async getById(id: number) : Promise<AdEntity> {
    const ad = this.adRepository.createQueryBuilder("ads")
    .where("(ads.Id =:id AND ads.active = :isActive)")
    .setParameters({ id: id, isActive: true })
    .getOne();

    if (!ad) {
      throw new NotFoundException(
        "Ad doesn't exit",
      );
    }

    return ad;
  }

  async create(payload: CreateAdDto): Promise<AdEntity> {

    const customer = await this.customerRepisotory.findOne({ where: { id: payload.customerId }, relations: ['ads'] });

    if (!customer) {
      throw new NotFoundException(
        "Customer doesn't exit",
      );
    }

    const ad = await this.adRepository.save(payload);
    customer.ads.push(ad);

    await this.customerRepisotory.save(customer);

    return await this.adRepository.findOne(ad.id);
  }

  async getAllActive(): Promise<AdEntity[]> {
    return await this.adRepository
    .find({ where: { active: true }});
  }

  async getAllFeatured(): Promise<AdEntity[]> {
    return await this.adRepository
    .find({ where: { featured: true }});
  }

  async getAllForUser(customerId: number): Promise<AdEntity[]> {
    const customer = await this.customerRepisotory.findOne({ where: { id: customerId }, relations: ['ads'] });
    return customer.ads;
  }

  async getAllByCategory(category: string): Promise<AdEntity[]> {
    return await this.adRepository.find({ where: { category: category, active: true } });
  }

  async update(customerId: number, payload: any): Promise<AdEntity> {

    var ad = await this.adRepository
    .createQueryBuilder("ads")
    .innerJoinAndSelect("ads.customer", "customers")
    .where("(ads.id = :adId AND ads.customer.id = :customerId)")
    .setParameters({ adId: payload.id, customerId: customerId })
    .getOne();

    if (!ad) {
      throw new NotFoundException(
        "Ad doesn't exit",
      );
    }

    await this.adRepository
    .update({ id: ad.id }, payload).then();

    return await this.adRepository.findOne(ad.id);
  }

  async delete(id: number, customerId: number) {

    var ad = await this.adRepository
    .createQueryBuilder("ads")
    .innerJoinAndSelect("ads.customer", "customers")
    .where("(ads.id = :adId AND ads.customer.id = :customerId)")
    .setParameters({ adId: id, customerId: customerId })
    .getOne();

    if (!ad) {
      throw new NotFoundException(
        "Ad doesn't exit",
      );
    }

    await this.adRepository.delete(ad.id);
  }
}