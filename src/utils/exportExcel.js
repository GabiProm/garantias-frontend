import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTicketsToExcel = (data) => {

  // ✅ DETALLE COMPLETO (MEJORADO)
  const detalle = data.map(t => ({
    "ID": t.id,
    "Serie": t.serie || "-",
    "Nro Inventario": t.nroInventario || "-",
    "Ticket Rimac": t.ticketRimac || "-",
    "Nro Caso": t.nroCaso || "-",
    "Problema": t.problema || "-",
    "Tipo Daño": t.tipoDano || "-",
    "Estado": t.estado || "-",

    "Fecha Reporte": t.fechaReporte
      ? new Date(t.fechaReporte).toLocaleDateString("es-PE")
      : "-",

    "Fecha Validación": t.fechaValidacion
      ? new Date(t.fechaValidacion).toLocaleDateString("es-PE")
      : "-",

    "Fecha Gestión": t.fechaGestionGarantia
      ? new Date(t.fechaGestionGarantia).toLocaleDateString("es-PE")
      : "-",

    "Trimestre": t.trimestre || "-",

    "Procede Garantía": t.procedeGarantia === "Sí" ? "Sí" : "No",

    "Observación": t.observacion
      ? t.observacion.slice(0, 120)
      : "-"
  }));

  // ✅ KPI
  const total = data.length;
  const cerrados = data.filter(t => t.estado === "Cerrado").length;
  const abiertos = total - cerrados;
  const porcentaje = total ? ((cerrados / total) * 100).toFixed(1) : 0;

  // ✅ TRIMESTRE + AÑO
  const trimestreYear = {};
  const trimestreGlobal = {};

  data.forEach(t => {
    const year = t.fechaGestionGarantia
      ? new Date(t.fechaGestionGarantia).getFullYear()
      : "Sin año";

    const tri = t.trimestre || "Sin dato";
    const key = `${year}-${tri}`;

    if (!trimestreYear[key]) {
      trimestreYear[key] = {
        Año: year,
        Trimestre: tri,
        Casos: 0
      };
    }

    trimestreYear[key].Casos++;

    trimestreGlobal[tri] = (trimestreGlobal[tri] || 0) + 1;
  });

  // ✅ ORDENAR TRIMESTRES
  const ordenTrimestres = ["Q1", "Q2", "Q3", "Q4", "Sin dato"];

  const sheetTrimestre = Object.values(trimestreYear).sort((a, b) => {
    if (a.Año === b.Año) {
      return ordenTrimestres.indexOf(a.Trimestre) - ordenTrimestres.indexOf(b.Trimestre);
    }
    return a.Año - b.Año;
  });

    // ✅ TRIMESTRE CRÍTICO
  const trimestreCritico = Object.keys(trimestreGlobal).reduce((a, b) =>
    trimestreGlobal[a] > trimestreGlobal[b] ? a : b
  );

  // ✅ TIPO DAÑO FRECUENTE
  const countDano = {};
  data.forEach(t => {
    const tipo = t.tipoDano || "-";
    countDano[tipo] = (countDano[tipo] || 0) + 1;
  });

  const danoFrecuente = Object.keys(countDano).reduce((a, b) =>
    countDano[a] > countDano[b] ? a : b
  );

  // ✅ RESUMEN EJECUTIVO (MEJORADO)
  const resumen = [
    { Indicador: "📊 Total Tickets", Valor: total },
    { Indicador: "✅ Cerrados", Valor: cerrados },
    { Indicador: "🟢 Abiertos", Valor: abiertos },
    { Indicador: "📈 % Cerrados", Valor: porcentaje + "%" },
    { Indicador: "🚨 Trimestre Crítico", Valor: trimestreCritico },
    { Indicador: "⚠️ Tipo Daño Frecuente", Valor: danoFrecuente }
  ];

  // ✅ CREAR LIBRO
  const wb = XLSX.utils.book_new();

  const wsResumen = XLSX.utils.json_to_sheet(resumen);
  const wsData = XLSX.utils.json_to_sheet(detalle);
  const wsTrimestre = XLSX.utils.json_to_sheet(sheetTrimestre);

  // ✅ AUTO-ANCHO COLUMNAS (LIMITADO)
  const autoWidth = (sheet, data) => {
    const cols = Object.keys(data[0]).map(key => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...data.map(row => String(row[key] || "").length)
        ),
        30
      )
    }));
    sheet["!cols"] = cols;
  };

  autoWidth(wsData, detalle);
  autoWidth(wsResumen, resumen);
  autoWidth(wsTrimestre, sheetTrimestre);

  // ✅ FREEZE HEADER
  wsData["!freeze"] = { ySplit: 1 };

  // ✅ AGREGAR HOJAS
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen Ejecutivo");
  XLSX.utils.book_append_sheet(wb, wsData, "Tickets");
  XLSX.utils.book_append_sheet(wb, wsTrimestre, "Trimestre Año");

  // ✅ NOMBRE DINÁMICO
  const fecha = new Date().toISOString().split("T")[0];

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  saveAs(
    new Blob([buffer], { type: "application/octet-stream" }),
    `Reporte_Tickets_${fecha}.xlsx`
  );
};