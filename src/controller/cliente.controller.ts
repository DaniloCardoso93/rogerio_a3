import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cliente } from "../entities/cliente";
import { Endereco } from "../entities/endereco";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const clienteRepository = AppDataSource.getRepository(Cliente);
const enderecoRepository = AppDataSource.getRepository(Endereco);

export class ClienteController {
  async create(req: Request, res: Response) {
    try {
      const {
        nome,
        data_nascimento,
        cpf,
        email,
        senha,
        celular,
        cnpj,
        endereco,
      } = req.body;

      if (
        !endereco ||
        !endereco.rua ||
        !endereco.bairro ||
        !endereco.cidade ||
        !endereco.estado ||
        !endereco.cep
      ) {
        return res.status(400).json({
          message: "Dados de endereço são obrigatórios",
          required: [
            "endereco.rua",
            "endereco.bairro",
            "endereco.cidade",
            "endereco.estado",
            "endereco.cep",
          ],
        });
      }

      const clienteExistente = await clienteRepository.findOne({
        where: { email },
      });
      if (clienteExistente) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const cliente = clienteRepository.create({
          nome,
          data_nascimento: new Date(data_nascimento),
          cpf,
          email,
          senha: senhaHash,
          celular,
          cnpj,
        });

        const clienteSalvo = await queryRunner.manager.save(cliente);

        const novoEndereco = enderecoRepository.create({
          rua: endereco.rua,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
          cep: endereco.cep,
          cliente_id: clienteSalvo.id,
        });

        const enderecoSalvo = await queryRunner.manager.save(novoEndereco);

        await queryRunner.commitTransaction();

        const clienteCompleto = await clienteRepository.findOne({
          where: { id: clienteSalvo.id },
          relations: ["enderecos"],
        });

        if (clienteCompleto) {
          const { senha: _, ...clienteSemSenha } = clienteCompleto;

          return res.status(201).json({
            message: "Cliente e endereço criados com sucesso",
            cliente: clienteSemSenha,
          });
        }

        return res
          .status(500)
          .json({ message: "Erro ao buscar cliente criado" });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const cliente = await clienteRepository.findOne({ where: { email } });
      if (!cliente) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const senhaValida = await bcrypt.compare(senha, cliente.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: cliente.id, email: cliente.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" }
      );

      const { senha: _, ...clienteSemSenha } = cliente;

      return res.json({
        message: "Login realizado com sucesso",
        token,
        cliente: clienteSemSenha,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cliente = await clienteRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["enderecos", "produtos", "compras"],
      });

      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const { senha: _, ...clienteSemSenha } = cliente;

      return res.json(clienteSemSenha);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const clientes = await clienteRepository.find({
        relations: ["enderecos", "produtos", "compras"],
      });

      const clientesSemSenha = clientes.map((cliente) => {
        const { senha: _, ...clienteSemSenha } = cliente;
        return clienteSemSenha;
      });

      return res.json(clientesSemSenha);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, data_nascimento, cpf, email, senha, celular, cnpj } =
        req.body;

      const cliente = await clienteRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      if (email && email !== cliente.email) {
        const emailExistente = await clienteRepository.findOne({
          where: { email },
        });
        if (emailExistente) {
          return res.status(400).json({ message: "Email já cadastrado" });
        }
      }

      if (nome) cliente.nome = nome;
      if (data_nascimento) cliente.data_nascimento = new Date(data_nascimento);
      if (cpf) cliente.cpf = cpf;
      if (email) cliente.email = email;
      if (celular) cliente.celular = celular;
      if (cnpj) cliente.cnpj = cnpj;

      if (senha) {
        cliente.senha = await bcrypt.hash(senha, 10);
      }

      await clienteRepository.save(cliente);

      const { senha: _, ...clienteSemSenha } = cliente;

      return res.json({
        message: "Cliente atualizado com sucesso",
        cliente: clienteSemSenha,
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cliente = await clienteRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      await clienteRepository.softDelete(id);

      return res.json({ message: "Cliente deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
