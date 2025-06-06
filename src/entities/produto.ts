import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Cliente } from "./cliente";
import { ProdutoCliente } from "./produto_cliente";

@Entity("produto")
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  nome: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  preco: number;

  @Column()
  cliente_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.produtos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cliente_id" })
  cliente: Cliente;

  @OneToMany(() => ProdutoCliente, (produtoCliente) => produtoCliente.produto, {
    cascade: true,
  })
  vendas: ProdutoCliente[];
}
