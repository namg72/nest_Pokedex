import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { normalize } from 'path';


@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
){}

  async executedSeed() {

   const {data} = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=800")

   //borramos toda la base de datos pirmero ante de insertar
   await this.pokemonModel.deleteMany({});

   //Cremaos un array vacin con lso campos definidos de lo que vamos a capturar de la data
   const pokemonToInsert: {name: string, no: number}[]=[]
   
   //vanmos a sacar en name y el nº de pokemon de la data. el name viene tal cual, pero el nº lo tenemos que sacar del url cortando
   // mediante splice el string de la misma cortando los segmentos por la barra / y nos quedamos con la penultima posicion
    data.results.forEach(async (pokemon)=>{
     const name = pokemon.name
     const segment= pokemon.url.split('/')
     const no:number = +segment[segment.length - 2]

     //insertamos en el array cada nombre y no de pokemon
    pokemonToInsert.push({name, no})
     
    })
    
    //ahhora insertamos todo el array utilizando el metoodo create de pokemonModel
    await this.pokemonModel.create(pokemonToInsert)

    return  data.results

  } 
}
  