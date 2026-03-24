import { Especialidade } from "../types/espcialidade";
export interface Medico {
    id: number;
    nome: string;
    crm: string;
    especialidade: Especialidade;
    ativo: boolean;
}