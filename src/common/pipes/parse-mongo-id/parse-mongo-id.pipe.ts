import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    console.log({value, metadata})
    
      if(!isValidObjectId(value)){
        throw new BadRequestException(`${value} is not valid MongoId`)
      }

    return value;
  }
}



/*
 Creamos este Custom Pipe para controla que el valor que no llega en el argumento sea un mongoId valido
*/