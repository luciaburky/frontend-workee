import { TipoHabilidad } from "../ABMTipoHabilidad/tipo-habilidad";

export class Habilidad {
    id?: number; 
    nombreHabilidad?: string;
    fechaHoraAlta?: string;
    fechaHoraBaja?: string | null;
    idTipoHabilidad?: TipoHabilidad; 
}