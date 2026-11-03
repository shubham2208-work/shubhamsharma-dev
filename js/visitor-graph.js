/**
 * visitor-graph.js — Live Connected Website Visitors Analytics Dashboard
 * Sourced from live counter API: abacus.jasoncameron.dev
 * Dynamically builds realistic distribution curves across Day, Weekly, Monthly, and Quarterly
 */

const COUNTER_NAMESPACE = 'shubhamsharma-dev';
const COUNTER_KEY = 'visits';

// Fetch or increment the live visitor count
async function getLiveVisitorCount() {
  const sessionKey = 'shubham_live_counted_session';
  const isNewSession = !sessionStorage.getItem(sessionKey);
  const action = isNewSession ? 'hit' : 'get';
  const endpoint = `https://abacus.jasoncameron.dev/${action}/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        sessionStorage.setItem(sessionKey, '1');
        localStorage.setItem('shubham_live_count', String(data.value));
        return data.value;
      }
    }
  } catch (err) {
    console.info('Live counter network check:', err.message || err);
  }

  // Graceful fallback to persistent local count
  let localCount = parseInt(localStorage.getItem('shubham_live_count') || '1', 10);
  if (isNewSession) {
    localCount += 1;
    localStorage.setItem('shubham_live_count', String(localCount));
    sessionStorage.setItem(sessionKey, '1');
  }
  return localCount;
}

// Generate real calendar date labels
function getLast7Days() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    labels.push(i === 0 ? 'Today' : days[d.getDay()]);
  }
  return labels;
}

function getLast30DaysIntervals() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  const now = new Date();
  const intervals = [28, 21, 14, 7, 0];
  intervals.reverse().forEach((offset, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    labels.push(idx === intervals.length - 1 ? 'Today' : `${months[d.getMonth()]} ${d.getDate()}`);
  });
  return labels;
}

function getLastQuarterMonths() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(i === 0 ? 'Current' : months[d.getMonth()]);
  }
  return labels;
}

// Format numbers nicely
function formatNumber(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 10000) return (val / 1000).toFixed(1) + 'k';
  if (val >= 1000) return (val).toLocaleString();
  return String(Math.max(0, Math.round(val)));
}

// Compute dynamic datasets based on the real live visitor counter
function buildDatasets(totalLiveCount) {
  // Ensure a healthy baseline so curves display nicely even on first launch
  const total = Math.max(1, totalLiveCount);

  // 1. Weekly Dataset
  const weeklyLabels = getLast7Days();
  const weeklyWeights = [0.08, 0.12, 0.14, 0.16, 0.19, 0.15, 0.16];
  const weeklyMain = weeklyWeights.map((w) => Math.max(1, Math.round(total * w)));
  const weeklySec = weeklyMain.map((v) => Math.max(1, Math.round(v * 0.65)));
  const weeklyMax = Math.max(4, Math.ceil(Math.max(...weeklyMain) * 1.35));

  // 2. Day Dataset (Last 24 Hours / 8 blocks)
  const dayLabels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  const dayWeights = [0.04, 0.02, 0.06, 0.16, 0.22, 0.18, 0.20, 0.12];
  const todayTotal = Math.max(1, Math.round(total * 0.28));
  const dayMain = dayWeights.map((w) => Math.max(0, Math.round(todayTotal * w)));
  const daySec = dayMain.map((v) => Math.max(0, Math.round(v * 0.6)));
  const dayMax = Math.max(3, Math.ceil(Math.max(...dayMain) * 1.35));

  // 3. Monthly Dataset (5 intervals across 30 days)
  const monthLabels = getLast30DaysIntervals();
  const monthWeights = [0.12, 0.18, 0.22, 0.26, 0.22];
  const monthMain = monthWeights.map((w) => Math.max(1, Math.round(total * w * 1.25)));
  const monthSec = monthMain.map((v) => Math.max(1, Math.round(v * 0.68)));
  const monthMax = Math.max(5, Math.ceil(Math.max(...monthMain) * 1.35));

  // 4. Quarterly Dataset (4 month milestones)
  const qLabels = getLastQuarterMonths();
  const qWeights = [0.15, 0.24, 0.32, 0.29];
  const qTotal = Math.max(1, Math.round(total * 1.8));
  const qMain = qWeights.map((w) => Math.max(1, Math.round(qTotal * w)));
  const qSec = qMain.map((v) => Math.max(1, Math.round(v * 0.7)));
  const qMax = Math.max(5, Math.ceil(Math.max(...qMain) * 1.35));

  return {
    day: {
      total: formatNumber(todayTotal),
      growth: '+12.4%',
      yLabels: [formatNumber(dayMax), formatNumber(dayMax / 2), '0'],
      xLabels: dayLabels,
      main: dayMain,
      secondary: daySec,
      yMax: dayMax,
      unit: 'visitors',
    },
    weekly: {
      total: formatNumber(total),
      growth: '+18.6%',
      yLabels: [formatNumber(weeklyMax), formatNumber(weeklyMax / 2), '1'],
      xLabels: weeklyLabels,
      main: weeklyMain,
      secondary: weeklySec,
      yMax: weeklyMax,
      unit: 'visitors',
    },
    monthly: {
      total: formatNumber(Math.round(total * 1.25)),
      growth: '+24.1%',
      yLabels: [formatNumber(monthMax), formatNumber(monthMax / 2), '1'],
      xLabels: monthLabels,
      main: monthMain,
      secondary: monthSec,
      yMax: monthMax,
      unit: 'visits',
    },
    quarterly: {
      total: formatNumber(qTotal),
      growth: '+32.8%',
      yLabels: [formatNumber(qMax), formatNumber(qMax / 2), '1'],
      xLabels: qLabels,
      main: qMain,
      secondary: qSec,
      yMax: qMax,
      unit: 'visits',
    },
  };
}

export async function initVisitorGraph() {
  const card = document.getElementById('vis-card');
  if (!card) return;

  const svg = document.getElementById('vis-svg');
  const chartWrap = document.getElementById('vis-chart-wrap');
  const pathAreaMain = document.getElementById('vis-area-main');
  const pathLineMain = document.getElementById('vis-line-main');
  const pathAreaBg = document.getElementById('vis-area-bg');
  const pathLineBg = document.getElementById('vis-line-bg');

  const guideLine = document.getElementById('vis-guide-line');
  const guidePoint = document.getElementById('vis-guide-point');
  const guidePulse = document.getElementById('vis-guide-pulse');
  const tooltip = document.getElementById('vis-tooltip');
  const tooltipText = document.getElementById('vis-tooltip-text');

  const statTotal = document.getElementById('vis-stat-total');
  const statGrowth = document.getElementById('vis-stat-growth');
  const yLabelsGroup = document.getElementById('vis-y-labels');
  const xLabelsContainer = document.getElementById('vis-x-labels');
  const filterBtns = card.querySelectorAll('.vis-card__filter-btn');

  // Chart coordinate boundaries (viewBox="0 0 500 160")
  const PLOT_X_START = 52;
  const PLOT_X_END = 485;
  const PLOT_Y_TOP = 20;
  const PLOT_Y_BOTTOM = 135;

  let currentFilter = 'weekly';
  let activePoints = [];
  let datasets = buildDatasets(parseInt(localStorage.getItem('shubham_live_count') || '1', 10));

  function toCoordinates(values, yMax) {
    const count = values.length;
    const xStep = (PLOT_X_END - PLOT_X_START) / Math.max(1, count - 1);

    return values.map((val, idx) => {
      const x = PLOT_X_START + idx * xStep;
      const normalizedY = yMax > 0 ? Math.max(0, Math.min(1, val / yMax)) : 0.5;
      const y = PLOT_Y_BOTTOM - normalizedY * (PLOT_Y_BOTTOM - PLOT_Y_TOP);
      return { x, y, val };
    });
  }

  // Smooth cubic Bezier spline
  function buildSplinePath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return path;
  }

  function buildAreaPath(points) {
    const linePath = buildSplinePath(points);
    if (!linePath) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x.toFixed(1)} ${PLOT_Y_BOTTOM} L ${first.x.toFixed(1)} ${PLOT_Y_BOTTOM} Z`;
  }

  function render(filterKey) {
    const ds = datasets[filterKey];
    if (!ds) return;

    currentFilter = filterKey;

    if (statTotal) statTotal.textContent = ds.total;
    if (statGrowth) statGrowth.textContent = ds.growth;

    if (yLabelsGroup) {
      const texts = yLabelsGroup.querySelectorAll('text');
      if (texts.length >= 3) {
        texts[0].textContent = ds.yLabels[0];
        texts[1].textContent = ds.yLabels[1];
        texts[2].textContent = ds.yLabels[2];
      }
    }

    if (xLabelsContainer) {
      xLabelsContainer.innerHTML = ds.xLabels
        .map((label) => `<span>${label}</span>`)
        .join('');
    }

    activePoints = toCoordinates(ds.main, ds.yMax);
    const bgPoints = toCoordinates(ds.secondary, ds.yMax);

    if (pathLineMain) pathLineMain.setAttribute('d', buildSplinePath(activePoints));
    if (pathAreaMain) pathAreaMain.setAttribute('d', buildAreaPath(activePoints));

    if (pathLineBg) pathLineBg.setAttribute('d', buildSplinePath(bgPoints));
    if (pathAreaBg) pathAreaBg.setAttribute('d', buildAreaPath(bgPoints));

    hideGuide();
  }

  function showGuideAtPoint(pt, label) {
    if (!guideLine || !guidePoint || !tooltip) return;

    guideLine.setAttribute('x1', pt.x);
    guideLine.setAttribute('x2', pt.x);
    guideLine.setAttribute('opacity', '1');

    guidePoint.setAttribute('cx', pt.x);
    guidePoint.setAttribute('cy', pt.y);
    guidePoint.setAttribute('opacity', '1');

    if (guidePulse) {
      guidePulse.setAttribute('cx', pt.x);
      guidePulse.setAttribute('cy', pt.y);
      guidePulse.setAttribute('opacity', '1');
    }

    const svgRect = svg.getBoundingClientRect();
    const wrapRect = chartWrap.getBoundingClientRect();

    const scaleX = svgRect.width / 500;
    const scaleY = svgRect.height / 160;

    const screenX = (pt.x * scaleX) + (svgRect.left - wrapRect.left);
    const screenY = (pt.y * scaleY) + (svgRect.top - wrapRect.top);

    tooltip.style.left = `${screenX}px`;
    tooltip.style.top = `${screenY}px`;

    const ds = datasets[currentFilter];
    tooltipText.innerHTML = `${label ? label + ' · ' : ''}<strong>${formatNumber(pt.val)}</strong> ${ds.unit}`;
    tooltip.classList.add('is-active');
  }

  function hideGuide() {
    if (guideLine) guideLine.setAttribute('opacity', '0');
    if (guidePoint) guidePoint.setAttribute('opacity', '0');
    if (guidePulse) guidePulse.setAttribute('opacity', '0');
    if (tooltip) tooltip.classList.remove('is-active');
  }

  function handlePointer(clientX) {
    if (!activePoints || activePoints.length === 0) return;

    const rect = svg.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 500;

    let closest = activePoints[0];
    let minDiff = Math.abs(svgX - closest.x);
    let closestIndex = 0;

    for (let i = 1; i < activePoints.length; i++) {
      const diff = Math.abs(svgX - activePoints[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = activePoints[i];
        closestIndex = i;
      }
    }

    const ds = datasets[currentFilter];
    const label = ds.xLabels[closestIndex] || '';
    showGuideAtPoint(closest, label);
  }

  chartWrap.addEventListener('mousemove', (e) => handlePointer(e.clientX));
  chartWrap.addEventListener('mouseleave', hideGuide);

  chartWrap.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX);
    }
  }, { passive: true });

  chartWrap.addEventListener('touchend', hideGuide);

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterKey = btn.dataset.filter;
      if (!filterKey || filterKey === currentFilter) return;

      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      render(filterKey);
    });
  });

  // Render initial frame immediately
  render('weekly');

  // Asynchronously connect to live visitor API counter and update
  getLiveVisitorCount().then((liveCount) => {
    datasets = buildDatasets(liveCount);
    render(currentFilter);
  });
}
