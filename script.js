const API_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';
const PROXY_BASE = 'https://api.allorigins.win/raw?url=';
const USE_PROXY_FALLBACK = true;
const SERIES = {
  ipca: 433,
  selic: 432,
  dolar: 1
};
const seriesData = {};
const FALLBACK_DATA = {
  ipca: [
    { date: new Date('2025-08-01'), value: 0.74 },
    { date: new Date('2025-09-01'), value: 0.58 },
    { date: new Date('2025-10-01'), value: 0.82 },
    { date: new Date('2025-11-01'), value: 0.83 },
    { date: new Date('2025-12-01'), value: 0.72 },
    { date: new Date('2026-01-01'), value: 0.56 },
    { date: new Date('2026-02-01'), value: 0.85 },
    { date: new Date('2026-03-01'), value: 0.45 },
    { date: new Date('2026-04-01'), value: 0.64 },
    { date: new Date('2026-05-01'), value: 0.49 },
    { date: new Date('2026-06-01'), value: 0.84 },
    { date: new Date('2026-07-01'), value: 0.55 }
  ],
  selic: [
    { date: new Date('2025-08-01'), value: 13.75 },
    { date: new Date('2025-09-01'), value: 13.75 },
    { date: new Date('2025-10-01'), value: 13.75 },
    { date: new Date('2025-11-01'), value: 13.75 },
    { date: new Date('2025-12-01'), value: 13.75 },
    { date: new Date('2026-01-01'), value: 13.75 },
    { date: new Date('2026-02-01'), value: 13.75 },
    { date: new Date('2026-03-01'), value: 13.75 },
    { date: new Date('2026-04-01'), value: 13.75 },
    { date: new Date('2026-05-01'), value: 13.75 },
    { date: new Date('2026-06-01'), value: 13.75 },
    { date: new Date('2026-07-01'), value: 13.75 }
  ],
  dolar: [
    { date: new Date('2025-08-01'), value: 5.02 },
    { date: new Date('2025-09-01'), value: 5.05 },
    { date: new Date('2025-10-01'), value: 5.07 },
    { date: new Date('2025-11-01'), value: 5.10 },
    { date: new Date('2025-12-01'), value: 5.08 },
    { date: new Date('2026-01-01'), value: 5.12 },
    { date: new Date('2026-02-01'), value: 5.18 },
    { date: new Date('2026-03-01'), value: 5.22 },
    { date: new Date('2026-04-01'), value: 5.14 },
    { date: new Date('2026-05-01'), value: 5.07 },
    { date: new Date('2026-06-01'), value: 5.02 },
    { date: new Date('2026-07-01'), value: 5.08 }
  ]
};
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('range-select').addEventListener('change', handleFilterChange);
  initializeDashboard();
});

async function initializeDashboard() {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 12);

  try {
    const [ipca, selic, dolar] = await Promise.all([
      fetchSeries(SERIES.ipca, startDate, endDate),
      fetchSeries(SERIES.selic, startDate, endDate),
      fetchSeries(SERIES.dolar, startDate, endDate)
    ]);

    seriesData.ipca = ipca;
    seriesData.selic = selic;
    seriesData.dolar = dolar;

    updateKpis();
    renderCharts();
    updateDataRange();
  } catch (error) {
    console.warn('Falha ao carregar dados do Bacen, usando fallback estático:', error);
    seriesData.ipca = FALLBACK_DATA.ipca;
    seriesData.selic = FALLBACK_DATA.selic;
    seriesData.dolar = FALLBACK_DATA.dolar;

    updateKpis();
    renderCharts();
    updateDataRange();
    document.getElementById('data-range').textContent = 'Usando dados estáticos de fallback devido a CORS/indisponibilidade da API.';
  }
}

async function fetchSeries(seriesId, startDate, endDate) {
  const start = formatDateForApi(startDate);
  const end = formatDateForApi(endDate);
  const endpoint = `${API_BASE}/${seriesId}/dados?formato=json&dataInicial=${start}&dataFinal=${end}`;
  const proxyUrl = `${PROXY_BASE}${encodeURIComponent(endpoint)}`;
  const url = USE_PROXY_FALLBACK ? proxyUrl : endpoint;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao buscar série ${seriesId} via ${url}: ${response.status}`);
  }

  const data = await response.json();
  if (USE_PROXY_FALLBACK && data?.error) {
    throw new Error(`Proxy retornou erro: ${JSON.stringify(data)}`);
  }

  return data.map(item => ({
    date: parseDate(item.data),
    value: Number(item.valor.replace(',', '.'))
  })).sort((a, b) => a.date - b.date);
}

function formatDateForApi(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function handleFilterChange() {
  renderCharts();
  updateDataRange();
}

function getRangeData(months) {
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);

  return Object.fromEntries(
    Object.entries(seriesData).map(([key, values]) => [
      key,
      values.filter(item => item.date >= start && item.date <= end)
    ])
  );
}

function updateKpis() {
  const latestIpca = seriesData.ipca.at(-1)?.value ?? 0;
  const latestSelic = seriesData.selic.at(-1)?.value ?? 0;
  const latestDolar = seriesData.dolar.at(-1)?.value ?? 0;

  document.getElementById('kpi-inflacao').textContent = `${calculateInflation12Months(seriesData.ipca).toFixed(2)}%`;
  document.getElementById('kpi-selic').textContent = `${latestSelic.toFixed(2)}%`;
  document.getElementById('kpi-dolar').textContent = `R$ ${latestDolar.toFixed(4)}`;
}

function calculateInflation12Months(data) {
  if (data.length < 12) return 0;
  const lastIndex = data.length - 1;
  const twelveMonths = data.slice(Math.max(0, lastIndex - 11), lastIndex + 1);
  const compounded = twelveMonths.reduce((acc, item) => acc * (1 + item.value / 100), 1) - 1;
  return compounded * 100;
}

function renderCharts() {
  const selectedMonths = Number(document.getElementById('range-select').value);
  const filtered = getRangeData(selectedMonths);

  const ipcaLabels = filtered.ipca.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
  const ipcaValues = filtered.ipca.map(item => item.value);
  const selicLabels = filtered.selic.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
  const selicValues = filtered.selic.map(item => item.value);
  const dolarValues = filtered.dolar.map(item => item.value);
  const dolarLabels = filtered.dolar.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));

  const inflationTarget = Array(ipcaValues.length).fill(4);

  createOrUpdateChart('chart-ipca', {
    type: 'line',
    data: {
      labels: ipcaLabels,
      datasets: [
        {
          label: 'IPCA (mensal)',
          data: ipcaValues,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.16)',
          tension: 0.25,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true
        },
        {
          label: 'Meta de Inflação (4%)',
          data: inflationTarget,
          borderColor: '#f97316',
          borderDash: [8, 6],
          pointRadius: 0,
          tension: 0.1
        }
      ]
    },
    options: chartOptions('Taxa mensal (%)')
  });

  createOrUpdateChart('chart-selic', {
    type: 'line',
    data: {
      labels: selicLabels,
      datasets: [
        {
          label: 'Taxa Selic (%)',
          data: selicValues,
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.14)',
          tension: 0.3,
          pointRadius: 2,
          fill: true
        }
      ]
    },
    options: chartOptions('Taxa anual (%)')
  });

  createOrUpdateChart('chart-dolar-selic', {
    type: 'line',
    data: {
      labels: dolarLabels,
      datasets: [
        {
          label: 'Dólar R$/US$ (cotação)',
          data: dolarValues,
          borderColor: '#818cf8',
          backgroundColor: 'rgba(129, 140, 248, 0.14)',
          tension: 0.3,
          pointRadius: 2,
          yAxisID: 'y1',
          fill: true
        },
        {
          label: 'Selic (%)',
          data: selicValues.slice(-dolarValues.length),
          borderColor: '#fb7185',
          backgroundColor: 'rgba(251, 113, 133, 0.14)',
          tension: 0.3,
          pointRadius: 2,
          yAxisID: 'y2',
          fill: true
        }
      ]
    },
    options: {
      ...chartOptions('Valor nominal'),
      scales: {
        x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148, 163, 184, 0.08)' } },
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Dólar (R$)', color: '#cbd5e1' },
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(148, 163, 184, 0.08)' }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Selic (%)', color: '#cbd5e1' },
          ticks: { color: '#cbd5e1' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: { callbacks: { label: context => `${context.dataset.label}: ${context.formattedValue}` } }
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(148, 163, 184, 0.08)' }
      },
      y: {
        title: { display: true, text: yLabel, color: '#cbd5e1' },
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(148, 163, 184, 0.08)' }
      }
    }
  };
}

function createOrUpdateChart(canvasId, config) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (charts[canvasId]) {
    charts[canvasId].data = config.data;
    charts[canvasId].options = config.options;
    charts[canvasId].update();
    return;
  }

  charts[canvasId] = new Chart(ctx, config);
}

function updateDataRange() {
  const months = Number(document.getElementById('range-select').value);
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  const formatted = `${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`;
  document.getElementById('data-range').textContent = `Período exibido: ${formatted}`;
}
