import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Produto } from "./produto";
import { Cliente } from "./cliente";

@Entity("produto_cliente")
export class ProdutoCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  produto_id: number;

  @Column()
  comprador_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Produto, (produto) => produto.vendas, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "produto_id" })
  produto: Produto;

  @ManyToOne(() => Cliente, (cliente) => cliente.compras, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "comprador_id" })
  comprador: Cliente;
}
