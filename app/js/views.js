/* AngkaNusa views — one renderer per section. Each view returns its HTML and
   a mount() that draws its charts and wires its controls, so every button,
   tab, selector and search box on the page actually does something. */
window.ANGKA_VIEWS = (function () {
  var D = window.ANGKA, C = window.ANGKA_CHARTS;

  function srcLine(src, year) {
    return '<span class="src">Source: <b>' + src + '</b>' + (year ? ' · ' + year : '') + '</span>';
  }
  function kpiCard(k) {
    return '<article class="card kpi" data-search="' + k.label.toLowerCase() + '">' +
      '<div class="label">' + k.label + '</div>' +
      '<div class="value">' + k.value + (k.unit ? ' <span class="unit">' + k.unit + '</span>' : '') + '</div>' +
      '<div class="delta ' + k.dir + '">' + k.delta + '</div>' + srcLine(k.src, k.year) + '</article>';
  }
  function chartCard(title, id, note, src, year) {
    return '<article class="card"><h3>' + title + '</h3><div class="chart-box"><canvas id="' + id + '"></canvas></div>' +
      (note ? '<p class="note">' + note + '</p>' : '') + srcLine(src, year) + '</article>';
  }
  function byId(id) { return document.getElementById(id); }

  /* ---------------- Overview ---------------- */
  function overview() {
    var kpis = D.headline.map(kpiCard).join('');
    var facts = D.quickFacts.slice(0, 5).map(function (f) {
      return '<li>' + f.text + '<span class="src">Source: <b>' + f.src + '</b></span></li>';
    }).join('');
    var html =
      '<section class="hero"><div>' +
      '<h1>Indonesia, counted.</h1>' +
      '<p>The world’s fourth most populous country and largest archipelago — its people, economy, ' +
      'regions, work and trade, in official figures with every source and year named.</p></div>' +
      '<div class="hero-stat"><div class="big">283.5M</div><div class="cap">people · BPS 2024</div></div></section>' +
      '<h2 class="section-title">Headline indicators</h2>' +
      '<div class="grid kpis" id="kpi-grid">' + kpis + '</div>' +
      '<p class="empty-note" id="kpi-empty" hidden>No indicator matches your search. <a href="#/overview" id="kpi-reset">Show all</a></p>' +
      '<h2 class="section-title">The economy at a glance</h2>' +
      '<div class="grid two">' +
      chartCard('Real GDP growth, 2019–2024 (%)', 'ov-growth', 'The 2020 pandemic contraction (−2.07%) is the only fall in the series; growth has held near 5% since 2022.', 'BPS', '2019–2024') +
      chartCard('GDP by industry, 2024', 'ov-sectors', 'Manufacturing is the largest single industry at about a fifth of GDP.', 'BPS', 2024) +
      '</div>' +
      '<h2 class="section-title">Where people live</h2>' +
      '<div class="grid two">' +
      chartCard('Population by island group (millions)', 'ov-islands', 'More than half of Indonesians live on Java, one of the world’s most densely populated islands.', 'BPS Census', 2020) +
      '<article class="card"><h3>Quick facts</h3><ul class="fact-list">' + facts + '</ul></article>' +
      '</div>' +
      '<p class="note" style="margin-top:16px">Dig deeper: <a href="#/economy">Economy</a> · <a href="#/population">Population</a> · ' +
      '<a href="#/regions">Regions</a> · <a href="#/labor">Labor</a> · <a href="#/trade">Trade</a></p>';
    return { html: html, mount: function () {
      C.lineChart(byId('ov-growth'), D.years, D.series.gdpGrowth.values, { fmt: function (v) { return v.toFixed(1); } });
      C.donutChart(byId('ov-sectors'), D.sectors.map(function (s) { return { name: s.name, value: s.share }; }),
        { centerTop: 'US$1.40T', centerBottom: 'GDP 2024', height: 250 });
      C.hbarChart(byId('ov-islands'), D.islands.map(function (i) { return { name: i.name, value: i.pop }; }),
        { fmt: function (v) { return v.toFixed(1); }, labelW: 150 });
      var reset = byId('kpi-reset');
      if (reset) reset.addEventListener('click', function (e) {
        e.preventDefault();
        var box = byId('site-search'); if (box) { box.value = ''; box.dispatchEvent(new Event('input')); }
      });
    } };
  }

  /* ---------------- Economy ---------------- */
  function economy() {
    var chips = D.years.map(function (y, i) {
      return '<button class="chip' + (i === D.years.length - 1 ? ' on' : '') + '" data-year="' + i + '">' + y + '</button>';
    }).join('');
    var sectorRows = D.sectors.map(function (s) {
      return '<tr><td>' + s.name + '</td><td>' + s.share.toFixed(1) + '%</td>' +
        '<td class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:' + (s.share / 19 * 100) + '%"></div></div></td></tr>';
    }).join('');
    var html =
      '<div class="page-head"><h1>Economy</h1><p>Southeast Asia’s largest economy: steady ~5% growth, low inflation and a ' +
      'trade surplus. Pick a year to see that year’s headline figures.</p></div>' +
      '<div class="controls"><span class="ctl-label">Year</span><div class="chip-row" id="econ-years">' + chips + '</div></div>' +
      '<div class="grid kpis" id="econ-kpis"></div>' +
      '<h2 class="section-title">Trends 2019–2024</h2>' +
      '<div class="grid two">' +
      chartCard('Real GDP growth (%)', 'ec-growth', null, 'BPS', '2019–2024') +
      chartCard('Inflation, December y/y (%)', 'ec-inflation', 'The 2022 spike (5.51%) followed the subsidised-fuel price rise; inflation fell back below 2% by 2024.', 'BPS', '2019–2024') +
      chartCard('GDP, current US$ (billion)', 'ec-gdp', null, 'World Bank', '2019–2024') +
      '<article class="card"><h3>GDP by industry, 2024</h3><table class="data"><thead><tr><th>Industry</th><th>Share</th><th></th></tr></thead>' +
      '<tbody>' + sectorRows + '</tbody></table>' + srcLine('BPS', 2024) + '</article>' +
      '</div>';
    return { html: html, mount: function () {
      function showYear(i) {
        var y = D.years[i];
        var cards = [
          { label: 'GDP growth', value: D.series.gdpGrowth.values[i].toFixed(2), unit: '%', delta: y === 2020 ? 'pandemic contraction' : 'real, y/y', dir: D.series.gdpGrowth.values[i] < 0 ? 'down' : 'up', src: 'BPS', year: y },
          { label: 'Inflation (Dec y/y)', value: D.series.inflation.values[i].toFixed(2), unit: '%', delta: 'consumer prices', dir: 'flat', src: 'BPS', year: y },
          { label: 'GDP (nominal)', value: 'US$' + D.series.gdpNominal.values[i].toLocaleString('en-US'), unit: 'billion', delta: 'current prices', dir: 'flat', src: 'World Bank', year: y },
          { label: 'Exports of goods', value: 'US$' + D.series.exports.values[i].toFixed(1), unit: 'billion', delta: 'goods, f.o.b.', dir: 'flat', src: 'BPS', year: y }
        ];
        byId('econ-kpis').innerHTML = cards.map(kpiCard).join('');
        document.querySelectorAll('#econ-years .chip').forEach(function (c) {
          c.classList.toggle('on', Number(c.dataset.year) === i);
        });
      }
      document.querySelectorAll('#econ-years .chip').forEach(function (c) {
        c.addEventListener('click', function () { showYear(Number(c.dataset.year)); });
      });
      showYear(D.years.length - 1);
      C.lineChart(byId('ec-growth'), D.years, D.series.gdpGrowth.values, { fmt: function (v) { return v.toFixed(1); } });
      C.barChart(byId('ec-inflation'), D.years, D.series.inflation.values, { fmt: function (v) { return v.toFixed(1); } });
      C.barChart(byId('ec-gdp'), D.years, D.series.gdpNominal.values, { fmt: function (v) { return v; } });
    } };
  }

  /* ---------------- Population ---------------- */
  function population() {
    var islandRows = D.islands.map(function (i) {
      return '<tr><td>' + i.name + '</td><td>' + i.pop.toFixed(1) + 'M</td><td>' + i.share.toFixed(1) + '%</td></tr>';
    }).join('');
    var facts = [
      { text: 'Fourth most populous country on Earth, after India, China and the United States.', src: 'UN, 2024' },
      { text: 'Population density about <b>149 people/km²</b> nationally — but over <b>16,000/km²</b> in Jakarta.', src: 'BPS, 2024' },
      { text: 'Urban share about <b>59%</b> and rising roughly a point a year.', src: 'World Bank, 2023' },
      { text: 'Infant mortality about <b>16 per 1,000</b> live births, down from 39 in 2000.', src: 'World Bank, 2023' }
    ].map(function (f) { return '<li>' + f.text + '<span class="src">Source: <b>' + f.src + '</b></span></li>'; }).join('');
    var html =
      '<div class="page-head"><h1>Population</h1><p>283.5 million people across 17,000+ islands — young, urbanising, and ' +
      'concentrated on Java. The 2020 census counted 270.2 million.</p></div>' +
      '<div class="grid kpis">' +
      kpiCard({ label: 'Population', value: '283.5', unit: 'million', delta: '+0.8% a year', dir: 'up', src: 'BPS projection', year: 2024 }) +
      kpiCard({ label: 'Median age', value: '30.9', unit: 'years', delta: 'demographic bonus window', dir: 'flat', src: 'UN WPP', year: 2024 }) +
      kpiCard({ label: 'Fertility rate', value: '2.2', unit: 'children', delta: 'near replacement level', dir: 'down', src: 'World Bank', year: 2023 }) +
      kpiCard({ label: 'Life expectancy', value: '71.1', unit: 'years', delta: 'from 66.6 in 2000', dir: 'up', src: 'World Bank', year: 2023 }) +
      '</div>' +
      '<h2 class="section-title">Who Indonesians are</h2>' +
      '<div class="grid two">' +
      chartCard('Age structure, 2024', 'pop-age', 'Seven in ten Indonesians are of working age — the demographic bonus peaks around 2030–2040.', 'BPS projection', 2024) +
      chartCard('Religion, 2020 census', 'pop-religion', 'Indonesia recognises six official religions; the census records the world’s largest Muslim population.', 'BPS Census', 2020) +
      '<article class="card"><h3>Population by island group</h3><table class="data"><thead><tr><th>Island group</th><th>People</th><th>Share</th></tr></thead>' +
      '<tbody>' + islandRows + '</tbody></table>' + srcLine('BPS Census', 2020) + '</article>' +
      '<article class="card"><h3>Population facts</h3><ul class="fact-list">' + facts + '</ul></article>' +
      '</div>';
    return { html: html, mount: function () {
      C.donutChart(byId('pop-age'), D.ageGroups.map(function (a) { return { name: a.name, value: a.share }; }),
        { centerTop: '69.3%', centerBottom: 'working age', height: 240 });
      C.donutChart(byId('pop-religion'), D.religions.map(function (r) { return { name: r.name, value: r.share }; }),
        { centerTop: '270.2M', centerBottom: 'census 2020', height: 240 });
    } };
  }

  /* ---------------- Regions ---------------- */
  function regions() {
    var islandCards = D.islands.map(function (i) {
      return '<article class="card"><h3>' + i.name + '</h3>' +
        '<div class="value" style="font-size:24px;font-weight:800">' + i.pop.toFixed(1) + 'M <span class="unit">people</span></div>' +
        '<p class="note">' + i.share.toFixed(1) + '% of population · ' + i.gdpShare.toFixed(1) + '% of GDP</p>' +
        srcLine('BPS Census 2020 · BPS GDP 2024', '') + '</article>';
    }).join('');
    var html =
      '<div class="page-head"><h1>Regions</h1><p>38 provinces in six island groups. Java holds 56% of the people and ' +
      '57% of GDP; the east — Kalimantan, Sulawesi, Maluku and Papua — is where growth is fastest.</p></div>' +
      '<div class="grid three">' + islandCards + '</div>' +
      '<h2 class="section-title">Largest provinces</h2>' +
      '<div class="controls"><span class="ctl-label">Filter</span>' +
      '<input class="ctl" id="prov-search" type="search" placeholder="Type a province or capital…">' +
      '<span class="ctl-label">Sort</span>' +
      '<select class="ctl" id="prov-sort"><option value="pop">Most people</option><option value="area">Largest area</option>' +
      '<option value="density">Most dense</option><option value="name">Name A–Z</option></select></div>' +
      '<article class="card"><table class="data"><thead><tr><th>#</th><th>Province</th><th>Capital</th><th>Population</th><th>Area km²</th><th>People/km²</th></tr></thead>' +
      '<tbody id="prov-body"></tbody></table>' +
      '<p class="empty-note" id="prov-empty" hidden>No province matches that filter.</p>' + srcLine('BPS Census 2020 · area: BIG', '') + '</article>' +
      '<div class="grid two" style="margin-top:14px">' +
      chartCard('Share of national GDP by island group, 2024 (%)', 'reg-gdp', 'Kalimantan punches above its population share thanks to mining and energy.', 'BPS', 2024) +
      '<article class="card"><h3>Region notes</h3><ul class="fact-list">' +
      '<li><b>Jakarta</b> is the densest province: 10.56M people in 664 km².<span class="src">Source: <b>BPS Census 2020</b></span></li>' +
      '<li><b>Papua</b> is the largest province by land — 319,036 km², bigger than Italy.<span class="src">Source: <b>BIG</b></span></li>' +
      '<li>The new capital <b>Nusantara</b> is rising in East Kalimantan (Penajam Paser Utara).<span class="src">Source: <b>IKN Authority, 2024</b></span></li>' +
      '<li>Fastest-growing province economies are in the east: <b>North Maluku</b> grew over 20% in 2023 on nickel smelting.<span class="src">Source: <b>BPS, 2023</b></span></li>' +
      '</ul></article></div>';
    return { html: html, mount: function () {
      function render() {
        var q = (byId('prov-search').value || '').toLowerCase();
        var mode = byId('prov-sort').value;
        var rows = D.provinces.filter(function (p) {
          return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.capital.toLowerCase().indexOf(q) >= 0;
        }).sort(function (a, b) {
          if (mode === 'area') return b.area - a.area;
          if (mode === 'density') return (b.pop * 1e6 / b.area) - (a.pop * 1e6 / a.area);
          if (mode === 'name') return a.name < b.name ? -1 : 1;
          return b.pop - a.pop;
        });
        byId('prov-body').innerHTML = rows.map(function (p, i) {
          return '<tr><td class="rank">' + (i + 1) + '</td><td>' + p.name + '</td><td>' + p.capital + '</td>' +
            '<td>' + p.pop.toFixed(2) + 'M</td><td>' + p.area.toLocaleString('en-US') + '</td>' +
            '<td>' + Math.round(p.pop * 1e6 / p.area).toLocaleString('en-US') + '</td></tr>';
        }).join('');
        byId('prov-empty').hidden = rows.length > 0;
      }
      byId('prov-search').addEventListener('input', render);
      byId('prov-sort').addEventListener('change', render);
      render();
      C.barChart(byId('reg-gdp'), D.islands.map(function (i) { return i.name.replace(' & ', ' & '); }),
        D.islands.map(function (i) { return i.gdpShare; }),
        { fmt: function (v) { return v.toFixed(1); }, colors: ['#0b4f4a', '#12806f', '#5b8e7d', '#e8a13a', '#c77f1a', '#7a6c5d'] });
    } };
  }

  /* ---------------- Labor ---------------- */
  function labor() {
    var html =
      '<div class="page-head"><h1>Labor</h1><p>A 152-million-strong workforce, unemployment at its lowest since before ' +
      'the pandemic — and more than half of workers still in informal jobs.</p></div>' +
      '<div class="grid kpis">' +
      kpiCard({ label: 'Labor force', value: '152.1', unit: 'million', delta: 'Aug 2024', dir: 'flat', src: 'BPS Sakernas', year: 2024 }) +
      kpiCard({ label: 'Employed', value: '144.6', unit: 'million', delta: '95.1% of labor force', dir: 'up', src: 'BPS Sakernas', year: 2024 }) +
      kpiCard({ label: 'Unemployment', value: '4.91', unit: '%', delta: '7.5M people jobless', dir: 'down', src: 'BPS Sakernas, Aug', year: 2024 }) +
      kpiCard({ label: 'Informal workers', value: '57.9', unit: '%', delta: 'of all employed', dir: 'flat', src: 'BPS Sakernas', year: 2024 }) +
      '</div>' +
      '<div class="tabs" id="labor-tabs" role="tablist">' +
      '<button class="on" data-tab="jobs">Where people work</button>' +
      '<button data-tab="unemp">Unemployment trend</button>' +
      '<button data-tab="wages">Wages</button></div>' +
      '<div id="labor-panel"></div>';
    return { html: html, mount: function () {
      function panel(tab) {
        var el = byId('labor-panel');
        if (tab === 'jobs') {
          el.innerHTML = '<div class="grid two">' +
            chartCard('Employment by sector, Aug 2024 (% of employed)', 'lab-sector', 'Agriculture still employs more Indonesians than any other sector, though its share falls every year.', 'BPS Sakernas', 2024) +
            '<article class="card"><h3>Reading the numbers</h3><ul class="fact-list">' +
            '<li><b>57.9%</b> of workers are informal — no contract, no social security.<span class="src">Source: <b>BPS Sakernas, Aug 2024</b></span></li>' +
            '<li><b>21.4%</b> of 15–24-year-olds are not in employment, education or training (NEET).<span class="src">Source: <b>BPS Sakernas, 2024</b></span></li>' +
            '<li>Women are <b>36%</b> of the workforce; the female participation rate is about 55%.<span class="src">Source: <b>BPS Sakernas, Aug 2024</b></span></li>' +
            '</ul></article></div>';
          C.hbarChart(byId('lab-sector'), D.labor.bySector.map(function (s) { return { name: s.name, value: s.share }; }),
            { fmt: function (v) { return v.toFixed(1) + '%'; }, labelW: 120 });
        } else if (tab === 'unemp') {
          el.innerHTML = '<div class="grid two">' +
            chartCard('Open unemployment rate, August (%)', 'lab-unemp', 'Unemployment spiked to 7.07% in August 2020 and has fallen every year since, to 4.91% in 2024 — the lowest in the series.', 'BPS Sakernas', '2019–2024') +
            chartCard('Poverty rate, September (%)', 'lab-poverty', 'Poverty fell to a record-low 8.57% in September 2024 (24.1 million people).', 'BPS', '2019–2024') +
            '</div>';
          C.lineChart(byId('lab-unemp'), D.years, D.series.unemployment.values, { fmt: function (v) { return v.toFixed(1); } });
          C.lineChart(byId('lab-poverty'), D.years, D.series.poverty.values, { color: '#c77f1a', fmt: function (v) { return v.toFixed(1); } });
        } else {
          el.innerHTML = '<article class="card"><h3>Wages</h3><p>' + D.labor.wageNote + '</p>' +
            '<table class="data"><thead><tr><th>Benchmark</th><th>Monthly</th><th>Source</th></tr></thead><tbody>' +
            '<tr><td>Jakarta minimum wage (UMP) 2025</td><td>Rp5,396,761</td><td>Jakarta govt decree, Dec 2024</td></tr>' +
            '<tr><td>National average net wage, employees</td><td>≈ Rp3.1M</td><td>BPS Sakernas, Aug 2024</td></tr>' +
            '<tr><td>Lowest provincial minimum wage (Central Java) 2025</td><td>Rp2,169,349</td><td>Provincial decree, Dec 2024</td></tr>' +
            '</tbody></table>' + srcLine('BPS · provincial governments', '2024–2025') + '</article>';
        }
        document.querySelectorAll('#labor-tabs button').forEach(function (b) {
          b.classList.toggle('on', b.dataset.tab === tab);
        });
      }
      document.querySelectorAll('#labor-tabs button').forEach(function (b) {
        b.addEventListener('click', function () { panel(b.dataset.tab); });
      });
      panel('jobs');
    } };
  }

  /* ---------------- Trade ---------------- */
  function trade() {
    var html =
      '<div class="page-head"><h1>Trade</h1><p>Indonesia exports coal, palm oil, steel and nickel to the world — and has run ' +
      'a goods surplus every year since 2020.</p></div>' +
      '<div class="grid kpis">' +
      kpiCard({ label: 'Exports 2024', value: 'US$264.7', unit: 'billion', delta: '+2.3% vs 2023', dir: 'up', src: 'BPS', year: 2024 }) +
      kpiCard({ label: 'Imports 2024', value: 'US$233.7', unit: 'billion', delta: '+5.3% vs 2023', dir: 'flat', src: 'BPS', year: 2024 }) +
      kpiCard({ label: 'Trade surplus', value: 'US$31.0', unit: 'billion', delta: '56th straight monthly surplus, Dec 2024', dir: 'up', src: 'BPS', year: 2024 }) +
      kpiCard({ label: 'Top partner', value: 'China', unit: '', delta: '24.6% of exports', dir: 'flat', src: 'BPS', year: 2024 }) +
      '</div>' +
      '<h2 class="section-title">What Indonesia sells, and to whom</h2>' +
      '<div class="grid two">' +
      chartCard('Top export commodities, 2024 (US$ billion)', 'tr-commodities', 'Coal remains the single biggest earner; downstream nickel and steel have surged since the ore-export bans.', 'BPS', 2024) +
      chartCard('Exports by destination, 2024', 'tr-partners', 'China buys a quarter of everything Indonesia exports.', 'BPS', 2024) +
      chartCard('Exports of goods, 2019–2024 (US$ billion)', 'tr-series', 'The 2022 commodity boom pushed exports to a record US$291.9B.', 'BPS', '2019–2024') +
      '<article class="card"><h3>Trade notes</h3><ul class="fact-list">' +
      '<li>Nickel downstreaming: Indonesia now makes <b>over half</b> the world’s nickel, much of it processed at home.<span class="src">Source: <b>USGS Mineral Summaries, 2024</b></span></li>' +
      '<li>Palm oil: Indonesia supplies about <b>59%</b> of global output.<span class="src">Source: <b>USDA, 2024</b></span></li>' +
      '<li>Oil & gas imports keep the energy balance negative even as the total balance stays in surplus.<span class="src">Source: <b>BPS, 2024</b></span></li>' +
      '</ul></article></div>';
    return { html: html, mount: function () {
      C.hbarChart(byId('tr-commodities'), D.trade.topExports.map(function (t) { return { name: t.name, value: t.value }; }),
        { fmt: function (v) { return v.toFixed(1); }, labelW: 190 });
      C.donutChart(byId('tr-partners'), D.trade.partners.map(function (p) { return { name: p.name, value: p.share }; }),
        { centerTop: 'US$264.7B', centerBottom: 'exports 2024', height: 250 });
      C.barChart(byId('tr-series'), D.years, D.series.exports.values, { fmt: function (v) { return Math.round(v); } });
    } };
  }

  return { overview: overview, economy: economy, population: population, regions: regions, labor: labor, trade: trade };
})();
