import { Etapa } from "../../admin/ABMEtapa/etapa";

export class PostulacionOfertaEtapa {
    // @ManyToOne()
    // @JoinColumn(name = "id_etapa")
    // private Etapa etapa;

    // @Column(name = "respuesta_candidato")
    // private String respuestaCandidato;

    // @Column(name = "retroalimentacion_empresa", columnDefinition = "TEXT")
    // private String retroalimentacionEmpresa;

    id!: number;
    fechaHoraAlta!: string;
    fechaHoraBaja!: string | null;
    etapa!: Etapa;
    respuestaCandidato!: string | null;
    retroalimentacionEmpresa!: string | null;
    
}