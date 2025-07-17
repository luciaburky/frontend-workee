export class UsuarioEmpleadoRequest {
    id?: number;
    nombreEmpleadoEmpresa?: string;
    apellidoEmpleadoEmpresa?: string;
    puestoEmpleadoEmpresa?: string;
    fechaHoraAlta?: string;
    fechaHoraBaja?: string | null;
    idEmpresa?: number;
    correoEmpleadoEmpresa?: string;
    contrasenia?: string;
    repetirContrasenia?: string;
    // urlFoto????
}

