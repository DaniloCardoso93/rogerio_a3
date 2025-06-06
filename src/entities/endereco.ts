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
import { Cliente } from "./cliente";

@Entity("endereco")
export class Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  rua: string;

  @Column({ type: "varchar", length: 255 })
  bairro: string;

  @Column({ type: "varchar", length: 255 })
  cidade: string;

  @Column({ type: "varchar", length: 255 })
  estado: string;

  @Column({ type: "char", length: 8 })
  cep: string;

  @Column()
  cliente_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.enderecos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cliente_id" })
  cliente: Cliente;
}
