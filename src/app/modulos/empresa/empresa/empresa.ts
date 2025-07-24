import { Provincia } from "../../../admin/ABMProvincia/provincia";
import { Rubro } from "../../../admin/ABMRubro/rubro";
import { Usuario } from "../../seguridad/usuario";

export class Empresa {
    id?: number;
    fechaHoraBaja?: string | null;
    nombreEmpresa?: string;
    descripcionEmpresa?: string;
    numeroIdentificacionFiscal?: string;
    telefonoEmpresa?: number;
    emailEmpresa?: string;
    direccionEmpresa?: string;
    sitioWebEmpresa?: string;
    provincia?: Provincia;
    rubro?: Rubro;
    usuario?: Usuario;
    // contrasenia?: string;
    // repetirContrasenia?: string;
}