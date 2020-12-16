import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  Put,
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiUnauthorizedResponse, ApiNotFoundResponse,  } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdsService } from './ad.service';
import { CreateAdDto } from './dto/createAd.dto';
import { UpdateAdDto } from './dto/updateAd.dto';

@Controller('api/ads')
@ApiTags('ads')
export class AdsController {

  constructor(
    private readonly adsService: AdsService 
  ) {}

  @Get()
  async getAllActive() : Promise<any>{
    return await this.adsService.getAllActive();
  }

  @Get('/featured')
  async getAllFeatured() : Promise<any>{
    return await this.adsService.getAllFeatured();
  }

  @ApiBearerAuth()
  @Get('/user/getAll')
  @UseGuards(AuthGuard("jwt"))
  async getAllForUser(@Request() request): Promise<any> {
    const customerId = request.user.id;
    return await this.adsService.getAllForUser(customerId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  async getById(@Param('id') id: number) : Promise<any> {
    return await this.adsService.getById(id);
  }

  @Get('categories/:category')
  @ApiResponse({ status: 200, description: 'Successful fetch of data' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('category') category: string): Promise<any> {
    return await this.adsService.getAllByCategory(category);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: 'Ad was successfully deleted' })
  @ApiResponse({ status: 400, description: 'Ad not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Request() request, @Param('id') id: number) : Promise<any>{
    const customerId = request.user.id;
    await this.adsService.delete(id, customerId);
  }

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 200, description: 'Ad was created successfully' })
  @UseGuards(AuthGuard("jwt"))
  async create(@Request() request, @Body() payload: CreateAdDto) : Promise<any>{
    payload.customerId = request.user.id;
    const ad = await this.adsService.create(payload);
    return ad;
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Ad was ' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard("jwt"))
  @Put(':id')
  async update(@Request() request, @Param('id') id: number, @Body() payload: UpdateAdDto) {
    payload.id = id;
    return await this.adsService.update(request.user.id, payload);
  }
}

