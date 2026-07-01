# Garantias Frontend

Frontend desarrollado en React para la gestión de garantías de equipos Lenovo. Permite registrar incidencias, realizar seguimiento, gestionar componentes reemplazados y visualizar métricas operativas mediante dashboards interactivos.

## Tecnologías

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Recharts
- React Router DOM
- html2canvas
- docx

---

## Principales Funcionalidades

### Gestión de Tickets

- Creación de tickets
- Búsqueda de tickets por serie
- Actualización de información
- Gestión de acciones realizadas
- Seguimiento de estados

### Gestión de Componentes

- Registro de componentes reemplazados
- Historial de cambios
- Visualización por ticket

### Dashboard

- Total de tickets
- Tickets abiertos y cerrados
- Garantías procedentes y no procedentes
- Casos por mes
- Casos por trimestre
- Ranking de componentes
- Distribución de tipos de daño

### Reportes

- Exportación de informe Word
- Inclusión automática de gráficos
- Resumen ejecutivo
- Indicadores KPI

---

## Arquitectura

```text
src
│
├── api
├── components
│   └── dashboard
├── pages
├── services
├── utils
├── assets
└── App.jsx
```

---

## Capturas del Sistema

### Dashboard

- KPIs operativos
- Gráficos interactivos
- Filtros por fecha

### Gestión de Tickets

- Registro de incidencias
- Consulta por serie
- Administración de componentes

---

## Instalación

Clonar repositorio:

```bash
git clone <URL_REPOSITORIO>
```

Instalar dependencias:

```bash
npm install
```

Ejecutar aplicación:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

---

## Integración Backend

Este frontend consume la API:

```text
Garantias.API
```

Tecnologías backend:

- .NET 8
- Entity Framework Core
- SQL Server

---

## Proyecto Relacionado

### Backend

🔗 Garantias.API

### QA Automation

🔗 Garantias-QA

Automatización implementada con:

- Playwright
- Postman
- Newman
- GitHub Actions

---

## Autor

Henry Gabriel Gómez Gerónimo

Ingeniero Electrónico | Soporte TI N2 | QA Automation | DevOps Enthusiast