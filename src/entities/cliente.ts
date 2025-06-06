import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Endereco } from "./endereco";
import { Produto } from "./produto";
import { ProdutoCliente } from "./produto_cliente";

@Entity("cliente")
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  nome: string;

  @Column({ type: "date" })
  data_nascimento: Date;

  @Column({ type: "char", length: 11, nullable: true })
  cpf: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  senha: string;

  @Column({ type: "varchar", length: 255 })
  celular: string;

  @Column({ type: "char", length: 14, nullable: true })
  cnpj: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Endereco, (endereco) => endereco.cliente, { cascade: true })
  enderecos: Endereco[];

  @OneToMany(() => Produto, (produto) => produto.cliente, { cascade: true })
  produtos: Produto[];

  @OneToMany(
    () => ProdutoCliente,
    (produtoCliente) => produtoCliente.comprador,
    { cascade: true }
  )
  compras: ProdutoCliente[];
}
