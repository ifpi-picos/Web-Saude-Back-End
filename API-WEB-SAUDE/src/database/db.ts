import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "../models/Usuario"
import { UnidadeDeSaude } from "../models/UnidadeDeSaude"
import { Endereco } from "../models/Endereco"
import { Especialidade } from "../models/Especialidades"
import dotenv from 'dotenv';


dotenv.config()
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: 5432,
  username: process.env.USER, 
  password: process.env.PASSWORD, 
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  subscribers: [],
  entities:[
      Especialidade,
      UnidadeDeSaude,
      Usuario,
      Endereco
  ]

}) 

console.log(process.env.USER)