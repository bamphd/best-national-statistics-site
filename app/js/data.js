/* AngkaNusa data layer — every figure the site shows lives here, each with its
   source agency and reference year. Values are the widely published official
   figures (BPS, Bank Indonesia, World Bank, UN, APJII). */
window.ANGKA = (function () {
  var years = [2019, 2020, 2021, 2022, 2023, 2024];

  var headline = [
    { id: 'population', label: 'Population', value: '283.5', unit: 'million', delta: '+0.8% a year', dir: 'up', src: 'BPS projection', year: 2024 },
    { id: 'gdp', label: 'GDP (nominal)', value: 'US$1.40', unit: 'trillion', delta: '16th largest economy', dir: 'flat', src: 'World Bank', year: 2024 },
    { id: 'growth', label: 'GDP growth', value: '5.03', unit: '%', delta: 'vs 5.05% in 2023', dir: 'flat', src: 'BPS', year: 2024 },
    { id: 'gdp-pc', label: 'GDP per capita', value: 'US$4,925', unit: '', delta: 'upper-middle income', dir: 'flat', src: 'World Bank', year: 2024 },
    { id: 'inflation', label: 'Inflation (Dec, y/y)', value: '1.57', unit: '%', delta: 'lowest since 2020', dir: 'down', src: 'BPS', year: 2024 },
    { id: 'unemployment', label: 'Unemployment rate', value: '4.91', unit: '%', delta: 'from 5.32% a year earlier', dir: 'down', src: 'BPS Sakernas, Aug', year: 2024 },
    { id: 'poverty', label: 'Poverty rate', value: '8.57', unit: '%', delta: '24.1M people, record low', dir: 'down', src: 'BPS, Sep', year: 2024 },
    { id: 'life-exp', label: 'Life expectancy', value: '71.1', unit: 'years', delta: 'from 66.6 in 2000', dir: 'up', src: 'World Bank', year: 2023 },
    { id: 'hdi', label: 'Human Development Index', value: '74.39', unit: '', delta: 'high-HDI band', dir: 'up', src: 'BPS', year: 2024 },
    { id: 'exports', label: 'Exports of goods', value: 'US$264.7', unit: 'billion', delta: 'surplus US$31.0B', dir: 'up', src: 'BPS', year: 2024 },
    { id: 'internet', label: 'Internet users', value: '221.5', unit: 'million', delta: '79.5% of population', dir: 'up', src: 'APJII', year: 2024 },
    { id: 'gini', label: 'Gini ratio', value: '0.379', unit: '', delta: 'from 0.388 in 2023', dir: 'down', src: 'BPS, Sep', year: 2024 }
  ];

  var series = {
    gdpGrowth:  { label: 'Real GDP growth (%)', src: 'BPS', values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03] },
    inflation:  { label: 'Inflation, Dec y/y (%)', src: 'BPS', values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57] },
    unemployment:{ label: 'Open unemployment, Aug (%)', src: 'BPS Sakernas', values: [5.23, 7.07, 6.49, 5.86, 5.32, 4.91] },
    poverty:    { label: 'Poverty rate, Sep (%)', src: 'BPS', values: [9.22, 10.19, 9.71, 9.57, 9.36, 8.57] },
    gdpNominal: { label: 'GDP, current US$ (billion)', src: 'World Bank', values: [1119, 1059, 1186, 1319, 1371, 1402] },
    exports:    { label: 'Exports of goods (US$ billion)', src: 'BPS', values: [167.7, 163.3, 231.6, 291.9, 258.8, 264.7] }
  };

  var sectors = [
    { name: 'Manufacturing', share: 19.0 },
    { name: 'Agriculture, forestry & fishing', share: 12.6 },
    { name: 'Wholesale & retail trade', share: 12.5 },
    { name: 'Construction', share: 9.8 },
    { name: 'Mining & quarrying', share: 8.4 },
    { name: 'Transport & storage', share: 6.2 },
    { name: 'Information & communication', share: 4.4 },
    { name: 'Financial services', share: 4.2 },
    { name: 'All other sectors', share: 22.9 }
  ]; // BPS, GDP by industry 2024

  var islands = [
    { name: 'Java', pop: 151.6, share: 56.1, gdpShare: 57.0 },
    { name: 'Sumatra', pop: 58.6, share: 21.7, gdpShare: 22.1 },
    { name: 'Sulawesi', pop: 19.9, share: 7.4, gdpShare: 7.0 },
    { name: 'Kalimantan', pop: 16.6, share: 6.1, gdpShare: 8.2 },
    { name: 'Bali & Nusa Tenggara', pop: 15.0, share: 5.5, gdpShare: 3.0 },
    { name: 'Maluku & Papua', pop: 8.6, share: 3.2, gdpShare: 2.7 }
  ]; // population: BPS Census 2020 (270.2M total); GDP share: BPS 2024

  var provinces = [
    { name: 'West Java', capital: 'Bandung', pop: 48.27, area: 35378 },
    { name: 'East Java', capital: 'Surabaya', pop: 40.67, area: 47700 },
    { name: 'Central Java', capital: 'Semarang', pop: 36.52, area: 32801 },
    { name: 'North Sumatra', capital: 'Medan', pop: 14.80, area: 72981 },
    { name: 'Banten', capital: 'Serang', pop: 11.90, area: 9663 },
    { name: 'DKI Jakarta', capital: 'Jakarta', pop: 10.56, area: 664 },
    { name: 'South Sulawesi', capital: 'Makassar', pop: 9.07, area: 46717 },
    { name: 'Lampung', capital: 'Bandar Lampung', pop: 9.01, area: 34624 },
    { name: 'South Sumatra', capital: 'Palembang', pop: 8.47, area: 91592 },
    { name: 'Riau', capital: 'Pekanbaru', pop: 6.39, area: 87024 },
    { name: 'West Sumatra', capital: 'Padang', pop: 5.53, area: 42013 },
    { name: 'East Kalimantan', capital: 'Samarinda', pop: 3.77, area: 127347 },
    { name: 'Bali', capital: 'Denpasar', pop: 4.32, area: 5780 },
    { name: 'Papua', capital: 'Jayapura', pop: 4.30, area: 319036 },
    { name: 'Aceh', capital: 'Banda Aceh', pop: 5.27, area: 57956 },
    { name: 'Yogyakarta', capital: 'Yogyakarta', pop: 3.67, area: 3186 }
  ]; // BPS Census 2020; area in km² (BIG)

  var ageGroups = [
    { name: '0–14 years', share: 23.7 },
    { name: '15–64 years', share: 69.3 },
    { name: '65+ years', share: 7.0 }
  ]; // BPS projection 2024

  var religions = [
    { name: 'Islam', share: 87.2 },
    { name: 'Protestant', share: 6.9 },
    { name: 'Catholic', share: 2.9 },
    { name: 'Hindu', share: 1.7 },
    { name: 'Buddhist', share: 0.7 },
    { name: 'Confucian & others', share: 0.6 }
  ]; // BPS Census 2020

  var labor = {
    workforce: { value: '152.1M', label: 'Labor force', src: 'BPS Sakernas, Aug 2024' },
    employed: { value: '144.6M', label: 'Employed', src: 'BPS Sakernas, Aug 2024' },
    informal: { value: '57.9%', label: 'Informal workers', src: 'BPS Sakernas, Aug 2024' },
    youthNeet: { value: '21.4%', label: 'Youth NEET (15–24)', src: 'BPS Sakernas, 2024' },
    bySector: [
      { name: 'Agriculture', share: 28.2 },
      { name: 'Trade', share: 19.1 },
      { name: 'Manufacturing', share: 13.8 },
      { name: 'Services', share: 12.4 },
      { name: 'Construction', share: 6.4 },
      { name: 'Transport', share: 5.0 },
      { name: 'Other', share: 15.1 }
    ],
    wageNote: 'Jakarta provincial minimum wage 2025: Rp5,396,761 a month (Jakarta provincial government decree, Dec 2024). National average net wage of employees: about Rp3.1M a month (BPS Sakernas, Aug 2024).'
  };

  var trade = {
    exports2024: 264.7, imports2024: 233.7, surplus2024: 31.0, src: 'BPS 2024',
    topExports: [
      { name: 'Coal & lignite', value: 34.1 },
      { name: 'Palm oil (CPO & derivatives)', value: 24.5 },
      { name: 'Iron & steel', value: 27.0 },
      { name: 'Electrical machinery', value: 15.6 },
      { name: 'Motor vehicles & parts', value: 9.8 },
      { name: 'Nickel & articles', value: 8.9 }
    ],
    partners: [
      { name: 'China', share: 24.6 },
      { name: 'United States', share: 10.2 },
      { name: 'Japan', share: 7.9 },
      { name: 'India', share: 7.1 },
      { name: 'Malaysia', share: 5.3 },
      { name: 'All others', share: 44.9 }
    ]
  };

  var quickFacts = [
    { text: 'World’s largest archipelago: <b>17,000+ islands</b>, about 6,000 inhabited.', src: 'BIG (Geospatial Agency), 2023' },
    { text: '<b>38 provinces</b> since Papua’s split into six provinces (2022).', src: 'Law 29/2022 & related laws' },
    { text: 'Capital moving from Jakarta to <b>Nusantara (IKN)</b> in East Kalimantan; first phase inaugurated 2024.', src: 'IKN Authority, 2024' },
    { text: 'Median age <b>30.9 years</b> — a young workforce entering its demographic bonus window.', src: 'UN World Population Prospects, 2024' },
    { text: 'Literacy rate about <b>96%</b> of people aged 15+.', src: 'BPS Susenas, 2023' },
    { text: 'Total fertility rate <b>2.2 children</b> per woman, near replacement level.', src: 'World Bank, 2023' },
    { text: 'Policy rate (BI-Rate) <b>6.00%</b> at end-2024, cut to 5.75% in Jan 2025.', src: 'Bank Indonesia, 2024–2025' },
    { text: 'Rice production <b>53.1M tons</b> of milled rice (GKG paddy 53.14M tons) in 2024.', src: 'BPS, 2024' }
  ];

  return {
    years: years, headline: headline, series: series, sectors: sectors,
    islands: islands, provinces: provinces, ageGroups: ageGroups,
    religions: religions, labor: labor, trade: trade, quickFacts: quickFacts
  };
})();
