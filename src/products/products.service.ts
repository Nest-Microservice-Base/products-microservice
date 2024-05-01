import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  // logger
  private readonly logger = new Logger('ProductsService');

  // validate database connect
  onModuleInit() {
    this.$connect();
    this.logger.log(`Database connected ...`);
  }

  create(createProductDto: CreateProductDto) {
    // Insert by prisma
    return this.product.create({
      data: createProductDto,
    });
  }

  // get all records of product of database
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // total record product
    const totalRecords = await this.product.count({
      where: { available: true },
    });
    // total of pages
    const lastPage = Math.ceil(totalRecords / limit);

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalRecords,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Produduct with id ${id} not found.`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    //return this.product.delete({ where: { id } });

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
