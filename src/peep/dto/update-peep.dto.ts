import { PartialType } from '@nestjs/mapped-types';
import { CreatePeepDto } from './create-peep.dto';

export class UpdatePeepDto extends PartialType(CreatePeepDto) {}
