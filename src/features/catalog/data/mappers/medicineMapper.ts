import type { Medicine } from '../../domain/entities/Medicine';
import type { MedicineDto } from '../dtos/MedicineDto';

export function toMedicine(dto: MedicineDto): Medicine {
  if (typeof dto.id !== 'string' || dto.id.trim() === '') {
    throw new Error('Medicine id must be a non-empty string');
  }
  if (typeof dto.name !== 'string' || dto.name.trim() === '') {
    throw new Error('Medicine name must be a non-empty string');
  }
  if (typeof dto.salt !== 'string' || dto.salt.trim() === '') {
    throw new Error('Medicine salt must be a non-empty string');
  }
  if (typeof dto.price !== 'number' || !Number.isFinite(dto.price) || dto.price < 0) {
    throw new Error('Medicine price must be a finite number >= 0');
  }
  if (typeof dto.maxQty !== 'number' || !Number.isInteger(dto.maxQty) || dto.maxQty < 1) {
    throw new Error('Medicine maxQty must be an integer >= 1');
  }
  if (typeof dto.rx !== 'boolean') {
    throw new Error('Medicine rx must be a boolean');
  }

  return {
    id: dto.id,
    name: dto.name,
    salt: dto.salt,
    price: dto.price,
    maxQty: dto.maxQty,
    rx: dto.rx,
  };
}
