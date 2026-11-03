/**
 * visitor-graph.js — Interactive Website Visitors Analytics Dashboard
 * Features:
 *  - Real session tracking (localStorage increment)
 *  - Filterable by: Day, Weekly, Monthly, Quarterly
 *  - Dual-layer bezier spline wave chart (matching reference screenshot)
 *  - Interactive cursor scrubbing with red-dashed guide line & floating pill tooltip
 */

const DATASETS = {
  day: {
    title: 'Today (Hourly)',
    total: '842',
    growth: '+14.2%',
    yLabels: ['160', '80', '20'],
    xLabels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    main: [18, 12, 28, 76, 124, 98, 154, 110],
    secondary: [10, 8, 16, 48, 88, 72, 112, 85],
    yMax: 180,
    unit: 'visitors',
  },
  weekly: {
    title: 'Last 7 Days',
    total: '4,620',
    growth: '+18.4%',
    yLabels: ['1.0k', '500', '100'],
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    main: [390, 520, 580, 690, 880, 760, 920],
    secondary: [260, 340, 420, 490, 610, 540, 680],
    yMax: 1050,
    unit: 'visitors',
  },
  monthly: {
    title: 'Last 30 Days',
    total: '32.4k',
    growth: '+26.8%',
    yLabels: ['8.0k', '4.0k', '1.0k'],
    xLabels: ['Oct 1', 'Oct 6', 'Oct 11', 'Oct 16', 'Oct 21', 'Oct 26', 'Oct 31'],
    main: [2800, 3600, 3200, 4900, 5700, 6800, 7400],
    secondary: [1900, 2400, 2600, 3500, 4100, 4900, 5300],
    yMax: 8500,
    unit: 'visits',
  },
  quarterly: {
    title: 'Last Quarter (Q4)',
    total: '108.6k',
    growth: '+34.5%',
    yLabels: ['25k', '15k', '5k'],
    xLabels: ['Aug 01', 'Aug 20', 'Sep 10', 'Sep 30', 'Oct 15', 'Nov 03'],
    main: [11200, 14600, 17800, 21400, 24800, 28600],
    secondary: [7800, 9900, 12400, 15100, 17200, 20100],
    yMax: 32000,
    unit: 'visits',
  },
};

export function initVisitorGraph() {
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

  // Track session visits via localStorage
  let visits = parseInt(localStorage.getItem('shubham_portfolio_visits') || '0', 10);
  visits += 1;
  localStorage.setItem('shubham_portfolio_visits', String(visits));

  let currentFilter = 'weekly';
  let activePoints = [];

  // Chart coordinate boundaries (inside viewBox="0 0 500 160")
  const PLOT_X_START = 52;
  const PLOT_X_END = 485;
  const PLOT_Y_TOP = 20;
  const PLOT_Y_BOTTOM = 135;

  function toCoordinates(values, yMax) {
    const count = values.length;
    const xStep = (PLOT_X_END - PLOT_X_START) / (count - 1);

    return values.map((val, idx) => {
      const x = PLOT_X_START + idx * xStep;
      const normalizedY = Math.max(0, Math.min(1, val / yMax));
      const y = PLOT_Y_BOTTOM - normalizedY * (PLOT_Y_BOTTOM - PLOT_Y_TOP);
      return { x, y, val };
    });
  }

  // Smooth cubic Bezier spline generator through point array
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
    const ds = DATASETS[filterKey];
    if (!ds) return;

    currentFilter = filterKey;

    // Update stats
    if (statTotal) statTotal.textContent = ds.total;
    if (statGrowth) statGrowth.textContent = ds.growth;

    // Update Y Labels
    if (yLabelsGroup) {
      const texts = yLabelsGroup.querySelectorAll('text');
      if (texts.length >= 3) {
        texts[0].textContent = ds.yLabels[0];
        texts[1].textContent = ds.yLabels[1];
        texts[2].textContent = ds.yLabels[2];
      }
    }

    // Update X Labels
    if (xLabelsContainer) {
      xLabelsContainer.innerHTML = ds.xLabels
        .map((label) => `<span>${label}</span>`)
        .join('');
    }

    // Compute coordinate points
    activePoints = toCoordinates(ds.main, ds.yMax);
    const bgPoints = toCoordinates(ds.secondary, ds.yMax);

    // Apply paths
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

    // Position tooltip relative to chartWrap
    const svgRect = svg.getBoundingClientRect();
    const wrapRect = chartWrap.getBoundingClientRect();

    const scaleX = svgRect.width / 500;
    const scaleY = svgRect.height / 160;

    const screenX = (pt.x * scaleX) + (svgRect.left - wrapRect.left);
    const screenY = (pt.y * scaleY) + (svgRect.top - wrapRect.top);

    tooltip.style.left = `${screenX}px`;
    tooltip.style.top = `${screenY}px`;

    const ds = DATASETS[currentFilter];
    const formattedVal = typeof pt.val === 'number' && pt.val >= 1000
      ? (pt.val >= 10000 ? (pt.val / 1000).toFixed(1) + 'k' : (pt.val).toLocaleString())
      : String(pt.val);

    tooltipText.innerHTML = `${label ? label + ' · ' : ''}<strong>${formattedVal}</strong> ${ds.unit}`;
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

    // Find closest point
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

    const ds = DATASETS[currentFilter];
    const label = ds.xLabels[closestIndex] || '';
    showGuideAtPoint(closest, label);
  }

  // Event Listeners for scrubbing
  chartWrap.addEventListener('mousemove', (e) => handlePointer(e.clientX));
  chartWrap.addEventListener('mouseleave', hideGuide);

  chartWrap.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX);
    }
  }, { passive: true });

  chartWrap.addEventListener('touchend', hideGuide);

  // Filter button clicks
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterKey = btn.dataset.filter;
      if (!filterKey || filterKey === currentFilter) return;

      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      render(filterKey);
    });
  });

  // Initial render with 'weekly'
  render('weekly');
}
