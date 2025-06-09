import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Produto } from "../entities/produto";
import { Cliente } from "../entities/cliente";
import { CustomRepositoryNotFoundError } from "typeorm";
import { json } from "stream/consumers";

const produtoRepository = AppDataSource.getRepository(Produto);
const clienteRepository = AppDataSource.getRepository(Cliente);

export class ProdutoController {

  async create(req: Request, res: Response) {
    try {
      const { nome, preco,  clienteId } = req.body;
      if(!nome || !preco ||!clienteId){
        return res.status(400).json({Message:"Dados obrigatórios: Nome,Preço,ClienteId"})
      }
      const cliente = await clienteRepository.findOneBy({ id: clienteId });
      if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });

      const produto = produtoRepository.create({
        nome,
        preco,
        cliente,
      });

      await produtoRepository.save(produto);

      return res.status(201).json(produto);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar produto", error });
    }
  }

  async findById(req:Request, res:Response){
    try {
      const {id} = req.params;
      const produto = await produtoRepository.findOne({
        where:{id:parseInt(id)},
        relations:["cliente","vendas","vendas.comprador"]
      }) 
      if(!produto){
        return res.status(404).json({message:"Produto não encontrado"})
      }
      return res.json(produto)
    } catch (error) {
      console.error("Erro ao buscar produto: ",error)
      return res.status(500).json({message:"Erro interno do servidor"})
    }
  }

  async findByCliente(req:Request, res:Response){
    try {
      const {clienteId} = req.params;
      const produtos = await produtoRepository.find({
        where:{cliente_id:parseInt(clienteId)},
        relations:["cliente","vendas"]
      })
      return res.json(produtos)
    } catch (error) {
      console.error("Erro ao buscar produto do cliente: ",error)
      return res.status(500).json({message:"Erro interno do servidor"})
    }

  }

  async update(req:Request,res:Response ){
    try{
      const {id} = req.params;
      const {nome,preco} = req.body;


      const produto = await produtoRepository.findOne({
        where:{id:parseInt(id)},
      });
      if(!produto){
        return res.status(404).json({message:"Produto não encontrado"});
      }

      if(nome) produto.nome = nome;
      if(preco) produto.preco = parseFloat(preco);

      await produtoRepository.save(produto)
      return res.json({
        message:"Produto atualizado com sucesso",
        produto:produto
      })

  }catch(error){
    console.error("Erro ao editar produto: ",error)
    return res.status(500).json({message:"Erro interno do servidor"})
  }
}

  async list(req: Request, res: Response) {
    const produtos = await produtoRepository.find({ relations: ["cliente"] });
    return res.json(produtos);
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await produtoRepository.findOne({where:{id:parseInt(id)}})
      if(!produto) res.status(404).json({messsage:"Produto não encontrado"})
      
      await produtoRepository.softDelete(id)
      return res.json({message:"Produto deletado com sucesso"})
      
    } catch (error) {
      console.error("Erro ao deletar produto: ",error)
      return res.status(500).json({message:"Erro interno do servidor"})
    }
  }
}
