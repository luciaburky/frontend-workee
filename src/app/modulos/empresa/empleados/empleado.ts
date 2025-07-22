import { Usuario } from "../../seguridad/usuario";

export class Empleado {
    id?: number;
    nombreEmpleadoEmpresa?: string;
    apellidoEmpleadoEmpresa?: string;
    puestoEmpleadoEmpresa?: string;
    fechaHoraAlta?: string;
    fechaHoraBaja?: string | null;
    idEmpresa?: number;
    usuario?: Usuario;
}