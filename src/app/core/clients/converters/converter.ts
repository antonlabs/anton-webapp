import {Dto} from '../dto/dto';
import {Model} from '../models/model';

export interface Converter {
  toModel(val: Dto): Model;

  toDto(val: Model): Dto;
}
