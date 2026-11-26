# best-national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/bamphd/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/bamphd/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**AngkaNusa — Indonesia in Numbers**: an original national statistics site for Indonesia that runs entirely from its own static files, on desktop and phone, with no network requests. Six linked sections (Overview, Economy, Population, Regions, Labor, Trade), hand-drawn canvas charts, working controls (year selector, province filter/sort, tabs, indicator search), and every figure labelled with its source agency and year (BPS, Bank Indonesia, World Bank, UN, APJII).

## Run it

```sh
# open the site (any static server works; app/ is the root)
python3 -m http.server 8080 --directory app
# then visit http://localhost:8080

# hand it in (copies app/ + screenshots/ to the output dir and writes dossier.json)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=3r8va27c&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
