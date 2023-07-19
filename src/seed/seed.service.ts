import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  async executedSeed() {

   const {data} = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=800")

   //vanmos a sacar en name y el nº de pokemon de la data. el name viene tal cual, pero el nº lo tenemos que sacar del url cortando
   // mediante splice el string de la misma cortando los segmentos por la barra / y nos quedamos con la penultima posicion

   data.results.forEach((pokemon)=>{
     const name = pokemon.name
     const segment= pokemon.url.split('/')
     const no:number = +segment[segment.length - 2]

    console.log(name, no);
    })
    

    return  data.results

  } 
}
  