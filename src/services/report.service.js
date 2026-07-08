import { Packer,  Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
  WidthType, ImageRun, Header, Footer
} from "docx";

import { saveAs } from "file-saver";
import encabezado from "../assets/encabezado.PNG"
import piedepagina from "../assets/piedepagina.PNG"

// ✅ Helper celda
const cell = (text, bold = false) =>
  new TableCell({
    children: [
      new Paragraph({
        alignment: bold ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: String(text || ""),
            bold
          })
        ]
      })
    ]
  });

// ✅ formato fecha
const formatFecha = (fecha) => {
  if (!fecha) return "-";

  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
};

// ✅ FUNCIÓN
export const generateInformeWord = async ({
  fechaDesde,
  fechaHasta,
  filteredTickets,
  totalTickets,
  cerrados,
  garantiasSi,
  garantiasNo,
  imgGarantias,
  imgTipoDano,
  imgRanking,
  dataTipoDano,
  dataRanking
}) => {

  const loadImage = async (img) => {
    const response = await fetch(img);
    return await response.arrayBuffer();
  };

  const headerImage = await loadImage(encabezado);
  const footerImage = await loadImage(piedepagina);

  const ticketsGarantia = filteredTickets.filter(
    (t) => t.procedeGarantia === "Sí"
  );

  const ticketsReparados = filteredTickets.filter(
    (t) => t.estado === "Cerrado"
  );

  // ✅ TABLAS CON CENTRADO
  const tablaFase1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          cell("Nro", true),
          cell("Serie", true),
          cell("Fecha de Reporte", true),
          cell("Problema", true),
          cell("Acciones Realizadas", true)
        ]
      }),
      ...filteredTickets.map((t, i) =>
        new TableRow({
          children: [
            cell(i + 1),
            cell(t.serie),
            cell(formatFecha(t.fechaReporte)),
            cell(t.problema),
            cell(t.acciones || "Pendiente")
          ]
        })
      )
    ]
  });

  const tablaFase2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          cell("Nro", true),
          cell("Serie", true),
          cell("Fecha de Revisión", true),
          cell("Caso", true)
        ]
      }),
      ...ticketsGarantia.map((t, i) =>
        new TableRow({
          children: [
            cell(i + 1),
            cell(t.serie),
            cell(formatFecha(t.fechaReporte)),
            cell(t.nroCaso || "-")
          ]
        })
      )
    ]
  });

  const tablaFase3 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          cell("Nro", true),
          cell("Serie", true),
          cell("Fecha de Atención", true),
          cell("Problema", true),
          cell("Acción", true)
        ]
      }),
      ...ticketsReparados.map((t, i) =>
        new TableRow({
          children: [
            cell(i + 1),
            cell(t.serie),
            cell(formatFecha(t.fechaGestionGarantia)),
            cell(t.problema),
            cell(t.observacion || "-")
          ]
        })
      )
    ]
  });

  const header = new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new ImageRun({
                        data: headerImage,
                        transformation: {
                            width: 600,
                            height: 80
                        }
                    })
                ]
            })
        ]
  });

  const footer = new Footer({
        children: [
            new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new ImageRun({
                data: footerImage,
                transformation: {
                    width: 600,
                    height: 60
                }
                })
            ]
            })
        ]
    });
    
    // =========================
    // ✅ CÁLCULOS PREVIOS
    // =========================

    const porcentajeSi = totalTickets > 0
    ? Math.round((garantiasSi / totalTickets) * 100)
    : 0;

    const porcentajeNo = totalTickets > 0
    ? Math.round((garantiasNo / totalTickets) * 100)
    : 0;

    // =========================
    // ✅ ANÁLISIS GARANTÍAS
    // =========================

    let analisisGarantia = "";

    if (porcentajeSi > 60) {
    analisisGarantia =
        "Se evidencia una alta dependencia del servicio de garantía, lo cual indica que una proporción significativa de fallas requiere intervención del fabricante.";
    } else if (porcentajeSi > 40) {
    analisisGarantia =
        "Se observa un equilibrio entre incidencias gestionadas por garantía y aquellas resueltas internamente, reflejando una gestión mixta del soporte técnico.";
    } else {
    analisisGarantia =
        "La mayoría de incidencias fueron resueltas por el equipo interno, lo que evidencia una alta capacidad operativa del área de soporte.";
    }

    
    // =========================
    // ✅ OBTENER DATA DE GRÁFICOS
    // =========================

    const topDano = [...dataTipoDano].sort((a, b) => b.value - a.value)[0];
    const topComponente = dataRanking?.[0];

    // ✅ DOCUMENTO FORMATEADO
    const doc = new Document({
        styles: {
        default: {
            document: {
            run: {
                font: "Trebuchet MS",
                size: 20
            }
            }
        }
        },
        sections: [
        {  
            headers: {
            default: header
            },
            footers: {
            default: footer
            },
            children: [

                // HEADER
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                    new TextRun({
                        text: "INFORME MENSUAL – RIMAC SEGUROS",
                        bold: true,
                        size: 30
                    })
                    ]
                }),

                new Paragraph({
                    text: `Periodo: ${fechaDesde} al ${fechaHasta}`,
                    spacing: {after: 100},
                    alignment: AlignmentType.JUSTIFIED
                }),

                new Paragraph({
                    text: "Proyecto: RIMAC SEGUROS – GESTIÓN DE GARANTÍAS",
                    spacing: {after: 100},
                    alignment: AlignmentType.JUSTIFIED
                }),

                new Paragraph({
                    text: "Dirección: Av. las Begonias 540, San Isidro 15046",
                    spacing: {after: 100},
                    alignment: AlignmentType.JUSTIFIED
                }),

                new Paragraph({
                    text: "Contactos: Sr. Manuel Cruzado",
                    spacing: { after: 200 },
                    alignment: AlignmentType.JUSTIFIED
                }),

                // INTRO
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: "INTRODUCCIÓN:", bold: true })]
                }),

                new Paragraph({
                    text: `Durante el periodo comprendido del ${fechaDesde} al ${fechaHasta}, se ha llevado a cabo la gestión técnica de garantías de equipos Lenovo.`,
                    alignment: AlignmentType.JUSTIFIED
                }),

                new Paragraph({
                    text: "El personal asignado al proyecto:",
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 }
                }),

                new Paragraph({ text: "Sr. Henry Gómez", bullet: {level:0} }),
                new Paragraph({ text: "Horario de lunes a viernes de 08:00 am – 06:00 pm", bullet: {level:0} }),

                new Paragraph({
                    text: "La gestión del servicio incluye las siguientes actividades:",
                    spacing: { before: 200, after: 200 },
                }),

                // ✅ VIÑETAS PROFESIONALES
                new Paragraph({ text: "Recepción y validación del equipo reportado por la mesa de servicio de Rímac.", bullet: { level: 0 } }),
                new Paragraph({ text: "Revisión técnica del equipo por parte del TI-ANCONA, verificando el estado físico y funcional.", bullet: { level: 0 } }),
                new Paragraph({ text: "Desarrollar la gestión de garantía, coordinando con Lenovo para la aprobación del caso.", bullet: { level: 0 } }),
                new Paragraph({ text: "Mantenimiento correctivo, en los casos donde se requiere el cambio de partes como mainboards u otros componentes.", bullet: { level: 0 } }),
                new Paragraph({ text: "Mantenimiento predictivo, aplicando medidas preventivas en equipos con signos de desgaste o fallas recurrentes.", bullet: { level: 0 } }),
                new Paragraph({ text: "Actualización de drivers y firmware, asegurando el correcto funcionamiento post intervención.", bullet: { level: 0 } }),

                new Paragraph({
                    text: "Toda esta información ha sido registrada y consolidada en el archivo Excel adjunto (ANEXO 01), el cual incluye las columnas de:",
                    spacing: { before: 200, after: 200 },
                }),

                // ✅ VIÑETAS PROFESIONALES
                new Paragraph({ text: "Nro. de Inventario", bullet: { level: 0 } }),
                new Paragraph({ text: "Serie", bullet: { level: 0 } }),
                new Paragraph({ text: "Problema de equipo", bullet: { level: 0 } }),
                new Paragraph({ text: "Fecha reportada de equipo dañado", bullet: { level: 0 } }),
                new Paragraph({ text: "Mes", bullet: { level: 0 } }),
                new Paragraph({ text: "Fecha de validación de equipo (Soporte In House)", bullet: { level: 0 } }),
                new Paragraph({ text: "Procede garantía", bullet: { level: 0 } }),
                new Paragraph({ text: "Fecha de gestión de garantía", bullet: { level: 0 } }),
                new Paragraph({ text: "Observación", bullet: { level: 0 } }),

                // FASE 1
                new Paragraph({
                    spacing: { before: 300, after: 100 },
                    children: [new TextRun({ text: "FASE 01: REVISIÓN DE EQUIPOS", bold: true })]
                }),

                new Paragraph({
                    text: `Durante el periodo se atendieron ${totalTickets} equipos reportados. Como buenas prácticas se procedió a diagnosticar los equipos, validar el hardware y dar una solución. Cuando se da el caso de requerir un repuesto se escala y coordina con el CAS de Lenovo (ANCONA).`,
                    alignment: AlignmentType.JUSTIFIED,
                    bullet: {level: 0}
                }),

                new Paragraph({
                    text: `En el siguiente cuadro se muestra a detalle la información de las incidencias:`,
                    alignment: AlignmentType.JUSTIFIED,
                    bullet: {level: 0},
                    spacing: { after: 200 }
                }),

                tablaFase1,

                // FASE 2
                new Paragraph({
                    spacing: { before: 300, after: 100 },
                    children: [new TextRun({ text: "FASE 02: COORDINACIÓN CON CAS", bold: true })]
                }),

                new Paragraph({
                    text: `Durante esta fase se realiza la respectiva coordinación con el CAS de Lenovo (ANCONA) para la fecha de reparación del equipo por proceso de garantía de hardware. Durante esta fase se escaló con el CAS ${ticketsGarantia.length} equipos.`,
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 }
                }),

                tablaFase2,

                // FASE 3
                new Paragraph({
                    spacing: { before: 300, after: 100 },
                    children: [new TextRun({ text: "FASE 03: MANTENIMIENTO CORRECTIVO", bold: true })]
                }),

                new Paragraph({
                    text: `Se realizaron mantenimientos correctivos a ${ticketsReparados.length} equipos.`,
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 }
                }),

                tablaFase3,

                // =========================
                // ✅ SECCIÓN GRÁFICOS
                // =========================
                new Paragraph({
                    spacing: { before: 300, after: 200 },
                    children: [
                        new TextRun({
                        text: "ANÁLISIS GRÁFICO DEL PERIODO",
                        bold: true,
                        size: 20
                        })
                    ]
                }),


                // =========================
                // ✅ GARANTÍAS
                // =========================
                new Paragraph({
                    text: "Distribución de Garantías",
                    spacing: { after: 100 }
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        ...(imgGarantias
                            ? [
                                new ImageRun({
                                    data: imgGarantias,
                                    transformation: {
                                        width: 400,
                                        height: 250
                                    }
                                })
                            ]
                        : [])
                    ]
                }),
 
                new Paragraph({
                text: `Durante el periodo analizado, ${garantiasSi} equipos (${porcentajeSi}%) fueron gestionados por garantía, mientras que ${garantiasNo} equipos (${porcentajeNo}%) fueron resueltos internamente. ${analisisGarantia}`,
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 }
                }),

                // =========================
                // ✅ TIPO DE DAÑO
                // =========================
                new Paragraph({
                    text: "Tipos de Daño",
                    spacing: { after: 100 }
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        ...(imgTipoDano
                            ? [
                                new ImageRun({
                                    data: imgTipoDano,
                                    transformation: {
                                        width: 450,
                                        height: 300
                                    }
                                })
                            ]
                        : [])
                    ]
                }),
                
                new Paragraph({
                text: topDano
                    ? `El tipo de daño más recurrente fue "${topDano.name}", registrando ${topDano.value} incidencias durante el periodo. Este comportamiento sugiere la necesidad de implementar acciones preventivas específicas orientadas a reducir este tipo de fallas.`
                    : "No se registraron datos relevantes de tipos de daño durante el periodo analizado.",
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 }
                }),

                // =========================
                // ✅ RANKING COMPONENTES
                // =========================
                new Paragraph({
                    text: "Ranking de Componentes",
                    spacing: { after: 100 }
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        ...(imgRanking
                            ? [
                                new ImageRun({
                                    data: imgRanking,
                                    transformation: {
                                        width: 500,
                                        height: 300
                                    }
                                })
                            ]
                        : [])
                    ]   
                }),
 
                new Paragraph({
                text: topComponente
                    ? `El componente con mayor incidencia fue "${topComponente.name}", con un total de ${topComponente.value} casos reportados. Esto lo posiciona como un punto crítico que debe ser considerado en futuros planes de mantenimiento, renovación o monitoreo preventivo.`
                    : "No se identificaron componentes críticos durante el periodo analizado.",
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 }
                }),

                // CONCLUSIONES
                new Paragraph({
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: "CONCLUSIONES:", bold: true })]
                }),

                new Paragraph({ 
                    text: `La mesa de servicio de Rimac nos ha reportado la cantidad de ${totalTickets} incidencias.`,
                    bullet: {level: 0}
                }),

                new Paragraph({
                    text: `${garantiasSi} equipos fueron pasados por garantía y resueltos por el CAS LENOVO PREMIER (ANCONA).`,
                    bullet: { level: 0 }
                }),

                new Paragraph({
                    text: `${garantiasNo} equipos fueron resueltos por el TI-ANCONA sin la necesidad de pasar por garantía.`,
                    bullet: { level: 0 }
                }),

                new Paragraph({ 
                    text: `${cerrados} casos fueron cerrados correctamente.`,
                    bullet: { level: 0}
                }),

                // RECOMENDACIONES
                new Paragraph({
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: "RECOMENDACIONES:", bold: true })]
                }),

                new Paragraph({ text: "Mejorar el cuidado físico de los equipos.", bullet: { level: 0 } }),
                new Paragraph({ text: "Implementar mantenimiento preventivo.", bullet: { level: 0 } }),
                new Paragraph({ text: "Capacitar a los usuarios.", bullet: { level: 0 } }),

                // FIRMA
                new Paragraph({ spacing: { before: 300 }, text: "Atentamente," }),
                new Paragraph({ text: "Henry Gómez" }),
                new Paragraph({ text: "Soporte TI" })

            ]
        }
        ]
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Informe_Mensual.docx");
    });
};
