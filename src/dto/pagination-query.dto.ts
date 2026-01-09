import { IsOptional, IsPositive } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 10, description: 'Number of items to return' })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiPropertyOptional({ example: 0, description: 'Number of items to skip' })
  @IsOptional()
  @IsPositive()
  offset: number;
}