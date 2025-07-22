import { Provincia } from "../../../admin/ABMProvincia/provincia";
import { Rubro } from "../../../admin/ABMRubro/rubro";

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
    contrasenia?: string;
    repetirContrasenia?: string;
}