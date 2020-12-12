import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
};

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'Simple API';
export const SWAGGER_API_DESCRIPTION = 'Simple API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';
