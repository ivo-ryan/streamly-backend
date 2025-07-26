import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";
import { ZodError } from "zod";

export const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res, next) => {
    if(error instanceof HttpError) {
        res.status(error.status).json({message: error.message})
    }else if(error instanceof Error){
        res.status(500).json({ message: error.message })      
    }
    else if(error instanceof ZodError) {
        res.status(500).json({message: 'Error de validação!'})
  }
    else{
        res.status(500).json({ message: 'Error interno no servidor desconhecido' })
    }
}