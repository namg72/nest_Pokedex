import { BadRequestException, ConfigurableModuleBuilder, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {


 private defaultLimit : number

  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
      private readonly configSerice: ConfigService ){

        this.defaultLimit = configSerice.get('defaultLimit')
      }


  //Creando Pokemon
  async create(createPokemonDto: CreatePokemonDto) {

    //pasamos a minuscula el nombre ante de insertarlo en la bd
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      
      return pokemon;

    }catch (error) {
      this.handleexception(error)
      
    }
  }



  //Listando todos los PôKemon. 
  findAll(paginationDto: PaginationDto) {

   //estrameos los valores del paginatioDto que nos llega y si no llegada nada le damos un valor por defecto

      const {limit= this.defaultLimit, offset=0} = paginationDto


      //ahora usamos estos valores para establercer el limite de podemon, salto de paginas y tambien los ordenamos por su numero y con select le podemos
      // restar lo que no queramos que nos aparezca
      
      return this.pokemonModel.find()
        .limit(limit)
        .skip(offset)
        .sort({
          no:1
        })
        .select("-__v")

  }



  //Buscando por id/Nombre/MongoID
  async findOne(term: string) {
  
    let pokemon:Pokemon;

    //no utilizamos findONebyId porque no no es el id y lo tratamos como un numero
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term})

    }

    // buscamos un mongo id 
    if ( isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById( term)
    } 
    
    // Si no entra en las anteriores lo intentamos por nombre
    if(!pokemon){
      pokemon= await this.pokemonModel.findOne({name: term.toLowerCase().trim()})

    }
 
    

    if(!pokemon){
      throw new NotFoundException (`Pokemon wuith id, name or no "${term}" not found in`)
    }
    return pokemon
  }



  // Actualizando Pokemon
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    let pokemon:Pokemon;

     pokemon = await this.findOne(term)

     //controlamos que si viene el nombre lo pongamos en minuscula
     if(updatePokemonDto.name){
         updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
     }
      

     //Controlamos que no nos venga en la data un propiedad ya eexiste en otro elemento de la bd
     try {
       //acutualizamos el pokemon pasandole la data. 
       await pokemon.updateOne(updatePokemonDto, {new: true})

       //ya lo tenemos grabado y ahora para retornalo como respuesta sin tener que buscarlo en le bd lo que hecemos es un retur de sus propeidades
      //expandidas y las sustituimos por las de la data
     
      return {... pokemon.toJSON, ...updatePokemonDto}
      
     } catch (error) {
        this.handleexception(error)
     }


      
  }


  //Borrando Pokemon



        //METODO PARA BORRAR CUALQUIER TERMINO QUE VENGA YA SEA ID,NOMBRE O NO
        /*
          async remove(term: string) {
              const pokemon: Pokemon = await this.findOne(term)
              await pokemon.deleteOne()
              return `the pokemon ${JSON.stringify(pokemon)} is deleted`
          }
         */   

     
  // VAMOS A USAR UN CUSTOMPIPE PARA CONTROLAR QUE LO QUE VENGA SEA UN ID.MONGO Y SACAR EL ERROR SI NO LO ES
   async remove(term: string){

     const {deletedCount} = await this.pokemonModel.deleteOne({_id: term})

     if(deletedCount===0){
        throw new BadRequestException(`Pokemon with id ""${term} not exitis in bd`)
     }

     return `the Pokemon with id "${term} hast benn remove`

   }
        
    



//Metodo para manejar la excelpción en caso que intenemos crear un pokiemon ya existente o queramos actualizar el valor de sus propiedades por otras que ya 
//existieran en otro elemento de la bd ya que las pusimos como unicas

handleexception(error: any){
  if(error.code===11000){
    throw new BadRequestException(`Pokemon exists ${JSON.stringify(error.keyValue)}`)
  }else{
    console.log(error);
    return `Can´t create or update the pokemon`
  }

}



}

 