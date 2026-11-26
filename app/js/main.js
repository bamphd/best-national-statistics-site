/* AngkaNusa boot + router. Hash routes (#/economy etc.) swap the view without
   a page load; the header search filters the overview's indicator cards and
   jumps to the matching section when used from another page. */
(function () {
  var VIEWS = window.ANGKA_VIEWS;
  var ROUTES = ['overview', 'economy', 'population', 'regions', 'labor', 'trade'];
  var viewEl = document.getElementById('view');

  function currentRoute() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return ROUTES.indexOf(h) >= 0 ? h : 'overview';
  }

  function render() {
    var route = currentRoute();
    var view = VIEWS[route]();
    viewEl.innerHTML = view.html;
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.route === route);
    });
    document.title = 'AngkaNusa — ' + route.charAt(0).toUpperCase() + route.slice(1);
    view.mount();
    applySearch();
  }

  function applySearch() {
    var box = document.getElementById('site-search');
    var q = box ? box.value.trim().toLowerCase() : '';
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;
    var visible = 0;
    grid.querySelectorAll('.kpi').forEach(function (card) {
      var hit = !q || (card.dataset.search || '').indexOf(q) >= 0;
      card.style.display = hit ? '' : 'none';
      if (hit) visible++;
    });
    var empty = document.getElementById('kpi-empty');
    if (empty) empty.hidden = visible > 0;
  }

  var SEARCH_ROUTES = [
    { words: ['inflation', 'gdp', 'growth', 'economy', 'sector'], route: 'economy' },
    { words: ['population', 'age', 'religion', 'fertility', 'life'], route: 'population' },
    { words: ['province', 'region', 'island', 'java', 'papua', 'jakarta'], route: 'regions' },
    { words: ['job', 'work', 'unemployment', 'wage', 'labor', 'poverty'], route: 'labor' },
    { words: ['export', 'import', 'trade', 'coal', 'palm', 'nickel'], route: 'trade' }
  ];

  function wireSearch() {
    var box = document.getElementById('site-search');
    if (!box) return;
    box.addEventListener('input', function () {
      if (currentRoute() !== 'overview' && box.value.trim()) {
        var q = box.value.trim().toLowerCase();
        for (var i = 0; i < SEARCH_ROUTES.length; i++) {
          var hit = SEARCH_ROUTES[i].words.some(function (w) { return q.indexOf(w) >= 0; });
          if (hit) { location.hash = '#/' + SEARCH_ROUTES[i].route; return; }
        }
        location.hash = '#/overview';
        return;
      }
      applySearch();
    });
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('resize', function () {
    clearTimeout(window.__angkaResize);
    window.__angkaResize = setTimeout(render, 180);
  });
  wireSearch();
  render();
})();
