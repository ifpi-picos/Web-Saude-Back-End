import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "../models/Usuario"
import { UnidadeDeSaude } from "../models/UnidadeDeSaude"
import { Endereco } from "../models/Endereco"
import { Especialidade } from "../models/Especialidades"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "aws-0-us-east-1.pooler.supabase.com",
  port: 5432,
  username: "postgres.sgqqwiuszrvlxcgkiuoc",
  password: "eric5500spfc",
  database: "postgres",
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