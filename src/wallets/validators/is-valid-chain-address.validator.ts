import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ChainType } from '../entities/chain-type.enum';
import { validate } from 'src/util/validate-address';

export function IsValidChainAddress(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidChainAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          //@ts-expect-error Ignoring because in order to check ChainAddress object must have a chain field
          const chain: ChainType = args.object.chain;
          return validate(chain, value);
        },
        defaultMessage() {
          return 'Invalid address for the specified chain type';
        },
      },
    });
  };
}
