// ✅ 1. GARANTÍA (SI / NO)
export const getGarantiaData = (tickets) => {
  const si = tickets.filter(t => t.procedeGarantia === "Sí").length;
  const no = tickets.filter(t => t.procedeGarantia === "No").length;

  return [
    { name: "Sí", value: si },
    { name: "No", value: no }
  ];
};

// ✅ 2. TIPO DE DAÑO
export const getTipoDanoData = (tickets) => {
  const counts = {
    1: 0,
    2: 0,
    3: 0
  };

  tickets.forEach(t => {
    let id = t.tipoDanoId;

    // 🔥 fallback si no viene el id
    if (id == null) {
      if (t.tipoDano === "Daño por usuario") id = 1;
      else if (t.tipoDano === "Daño de fábrica") id = 2;
      else if (t.tipoDano === "Software") id = 3;
    }

    if (id != null) {
      counts[id]++;
    }
  });

  return [
    { name: "Software", value: counts[3] },
    { name: "Daño de fábrica", value: counts[2] },
    { name: "Daño por usuario", value: counts[1] }
  ];
};


// ✅ 3. CASOS POR MES + AÑO
export const getCasosPorMes = (tickets) => {
  const meses = {};

  tickets.forEach(t => {
    const date = new Date(t.fechaReporte);
    const mes = date.toLocaleString("es-ES", { month: "short" });
    const year = date.getFullYear();

    const key = `${mes}`;

    if (!meses[key]) meses[key] = { mes };

    if (!meses[key][year]) meses[key][year] = 0;

    meses[key][year]++;
  });

  return Object.values(meses);
};

// ✅ 4. TRIMESTRES
export const getCasosPorTrimestre = (tickets) => {
  const map = {};

  tickets.forEach(t => {
    const year = new Date(t.fechaReporte).getFullYear();
    const trimestre = t.trimestre === "-" ? "Sin dato" : t.trimestre;

    if (!map[trimestre]) map[trimestre] = { trimestre };

    if (!map[trimestre][year]) map[trimestre][year] = 0;

    map[trimestre][year]++;
  });

  return Object.values(map);
};

// ✅ 5. RANKING COMPONENTES
export const getRankingComponentes = (tickets) => {
  const map = {};

  tickets.forEach(t => {
    t.detalles.forEach(d => {
      if (!map[d.componente]) map[d.componente] = 0;
      map[d.componente]++;
    });
  });

  return Object.keys(map)
    .map(key => ({
      name: key,
      value: map[key]
    }))
    .sort((a, b) => b.value - a.value);
};