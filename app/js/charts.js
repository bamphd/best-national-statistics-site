/* AngkaNusa chart helpers — small canvas charts drawn by hand, no library.
   Each function takes a canvas element sized by CSS and paints at device
   pixel ratio so lines and labels stay sharp on retina screens. */
window.ANGKA_CHARTS = (function () {
  var TEAL = '#12806f', TEAL_DARK = '#0b4f4a', AMBER = '#e8a13a', RED = '#c0453e',
      GREY = '#8fa3ab', GRID = '#e7e0cf', INK = '#17252b';
  var PALETTE = ['#0b4f4a', '#12806f', '#e8a13a', '#c77f1a', '#5b8e7d', '#c0453e', '#7a6c5d', '#43565f', '#a8b8ae'];

  function setup(canvas, heightCss) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
    var h = heightCss || 240;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.font = '11px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    return { ctx: ctx, w: w, h: h };
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    if (n <= 1) return p;
    if (n <= 2) return 2 * p;
    if (n <= 2.5) return 2.5 * p;
    if (n <= 5) return 5 * p;
    return 10 * p;
  }

  function axes(ctx, x0, y0, x1, y1, min, max, fmt) {
    ctx.strokeStyle = GRID; ctx.fillStyle = GREY; ctx.lineWidth = 1;
    var step = niceMax((max - min) / 4);
    var first = Math.ceil(min / step) * step;
    for (var v = first; v <= max + 1e-9; v += step) {
      var y = y1 - (y1 - y0) * (v - min) / (max - min);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(fmt(v), x0 - 6, y + 3);
    }
  }

  function lineChart(canvas, labels, values, opts) {
    opts = opts || {};
    var s = setup(canvas, opts.height || 240), ctx = s.ctx;
    var x0 = 44, x1 = s.w - 14, y0 = 14, y1 = s.h - 26;
    var min = Math.min.apply(null, values.concat([0]));
    var max = niceMax(Math.max.apply(null, values));
    if (min < 0) min = -niceMax(-min);
    axes(ctx, x0, y0, x1, y1, min, max, function (v) { return (Math.round(v * 10) / 10).toString(); });
    var X = function (i) { return x0 + (x1 - x0) * i / (values.length - 1); };
    var Y = function (v) { return y1 - (y1 - y0) * (v - min) / (max - min); };
    if (min < 0) { ctx.strokeStyle = GREY; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke(); }
    ctx.beginPath();
    values.forEach(function (v, i) { i === 0 ? ctx.moveTo(X(i), Y(v)) : ctx.lineTo(X(i), Y(v)); });
    ctx.strokeStyle = opts.color || TEAL; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.lineTo(X(values.length - 1), Y(min < 0 ? 0 : min)); ctx.lineTo(X(0), Y(min < 0 ? 0 : min)); ctx.closePath();
    ctx.fillStyle = 'rgba(18,128,111,.12)'; ctx.fill();
    ctx.fillStyle = INK; ctx.textAlign = 'center';
    values.forEach(function (v, i) {
      ctx.beginPath(); ctx.arc(X(i), Y(v), 3.5, 0, 7); ctx.fillStyle = opts.color || TEAL_DARK; ctx.fill();
      ctx.fillStyle = INK;
      ctx.fillText((opts.fmt ? opts.fmt(v) : v), X(i), Y(v) - 9);
      ctx.fillStyle = GREY;
      ctx.fillText(labels[i], X(i), s.h - 8);
      ctx.fillStyle = INK;
    });
  }

  function barChart(canvas, labels, values, opts) {
    opts = opts || {};
    var s = setup(canvas, opts.height || 240), ctx = s.ctx;
    var x0 = 44, x1 = s.w - 10, y0 = 16, y1 = s.h - 26;
    var max = niceMax(Math.max.apply(null, values));
    axes(ctx, x0, y0, x1, y1, 0, max, function (v) { return Math.round(v).toString(); });
    var slot = (x1 - x0) / values.length, bw = Math.min(46, slot * 0.62);
    values.forEach(function (v, i) {
      var cx = x0 + slot * i + slot / 2;
      var bh = (y1 - y0) * v / max;
      ctx.fillStyle = (opts.colors && opts.colors[i]) || TEAL;
      ctx.beginPath();
      ctx.roundRect(cx - bw / 2, y1 - bh, bw, bh, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillStyle = INK; ctx.textAlign = 'center';
      ctx.fillText(opts.fmt ? opts.fmt(v) : v, cx, y1 - bh - 6);
      ctx.fillStyle = GREY;
      ctx.fillText(labels[i], cx, s.h - 8);
    });
  }

  function donutChart(canvas, items, opts) {
    opts = opts || {};
    var s = setup(canvas, opts.height || 230), ctx = s.ctx;
    var total = items.reduce(function (a, b) { return a + b.value; }, 0);
    var cx = Math.min(s.w * 0.30, 138), cy = s.h / 2, r = Math.min(cx, cy) - 18;
    var start = -Math.PI / 2;
    items.forEach(function (it, i) {
      var sweep = Math.PI * 2 * it.value / total;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + sweep);
      ctx.arc(cx, cy, r * 0.58, start + sweep, start, true);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();
      start += sweep;
    });
    ctx.fillStyle = INK; ctx.textAlign = 'center';
    ctx.font = 'bold 15px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText(opts.centerTop || '', cx, cy - 2);
    ctx.font = '11px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillStyle = GREY;
    ctx.fillText(opts.centerBottom || '', cx, cy + 14);
    ctx.textAlign = 'left';
    var lx = cx + r + 26, ly = cy - (items.length * 19) / 2 + 8;
    items.forEach(function (it, i) {
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fillRect(lx, ly - 9, 10, 10);
      ctx.fillStyle = INK;
      var pct = (100 * it.value / total).toFixed(1) + '%';
      ctx.fillText(it.name + '  ' + pct, lx + 16, ly);
      ly += 19;
    });
  }

  function hbarChart(canvas, items, opts) {
    opts = opts || {};
    var rowH = 26, labelW = opts.labelW || 150;
    var s = setup(canvas, items.length * rowH + 12), ctx = s.ctx;
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }));
    var x0 = labelW, x1 = s.w - 52;
    items.forEach(function (it, i) {
      var y = 8 + i * rowH;
      ctx.fillStyle = INK; ctx.textAlign = 'right';
      ctx.fillText(it.name, x0 - 8, y + 12);
      ctx.fillStyle = '#e3efec';
      ctx.beginPath(); ctx.roundRect(x0, y + 2, x1 - x0, 13, 4); ctx.fill();
      ctx.fillStyle = it.color || TEAL;
      ctx.beginPath(); ctx.roundRect(x0, y + 2, Math.max(3, (x1 - x0) * it.value / max), 13, 4); ctx.fill();
      ctx.fillStyle = INK; ctx.textAlign = 'left';
      ctx.fillText(opts.fmt ? opts.fmt(it.value) : it.value, x1 + 7, y + 12);
    });
  }

  return { lineChart: lineChart, barChart: barChart, donutChart: donutChart, hbarChart: hbarChart, PALETTE: PALETTE };
})();
