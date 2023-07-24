import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;
 
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?:number; 

}


//Este DTO es para ilncluir parameataros en la petilción get para mostrar todos los pokemons de la bd
// lso parametros son limit para que nos liste un limite de elmentos y el offset para que nos muestre 
// los siguieatnes. Ambos tienen que ser opcionales, Positivos y en el cso del imite tilene que se mayor 
// de 0