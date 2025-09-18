import { PostulacionOfertaEtapa } from "./postulacion-oferta-etapa";

export class PostulacionSimplificadaDTO {
    idOferta!: number;
    idPostulacionOferta!: number;
    idCandidato!: number;
    idIniciadorPostulacion!: number;
    fechaHoraFinPostulacionOferta!: string | null;
    fechaHoraAbandonoOferta!: string | null;
    etapas!: PostulacionOfertaEtapa;

}

// private Date fechaHoraInicioPostulacion;
//     private Date fechaHoraAbandonoOferta;
//     private Date fechaHoraFinPostulacionOferta;
//     private Long idIniciadorPostulacion;
//     private Long idCandidato;
//     private Long idPostulacionOferta;
//     private Long idOferta;
