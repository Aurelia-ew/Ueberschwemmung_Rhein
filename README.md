# Überschwemmung Rhein

Analyse potenzieller Überschwemmungsgebiete entlang des Rheins basierend auf einem digitalen Höhenmodell und einem
vereinfachten statischen Hochwassermodell.

## Projektbeschreibung

Der Rhein spielt eine zentrale Rolle für die Stadt Basel, stellt jedoch bei Hochwasser ein erhebliches Risiko dar. Ziel dieses
Projekts ist es, zu analysieren, welche Gebiete potenziell überflutet werden könnten, wenn der Wasserstand des Rheins um einen
definierten Wert ansteigt.

Dazu wird ein digitales Höhenmodell verwendet (swissALTI3D). Alle Flächen, deren Höhe unterhalb des angenommenen Wasserniveaus
liegt und räumlich mit dem Rhein verbunden sind, werden als potenziell gefährdet betrachtet.

Die Resultate werden als 2D-Karten visualisiert.

## Projektziel

- Simulation verschiedener Hochwasserszenarien
- Identifikation gefährdeter Gebiete inklusive wichtiger Infrastruktur
- Visualisierung der Überschwemmungsflächen
- Verständliche Darstellung für Planung und Kommunikation an Bevölkerung und Behörden

## Szenarien

- +1 m Rheinspiegel
- +2 m Rheinspiegel
- +3 m Rheinspiegel
- +4 m Rheinspiegel
- +5 m Rheinspiegel
- +10 m Rheinspiegel
- +15 m Rheinspiegel
- +20 m Rheinspiegel <------------------ evtl. zu viel

## Verwendete Technologien

- Python
- Jupyter Notebook
- GeoPandas
- Rasterio
- Matplotlib
- QGIS (Überprüfung)
- Folium

## Datenquellen

- Digitales Höhenmodell (DHM) | swissALTI3D
- Rhein-Geometrie
- Verwaltungsgrenzen
- OpenStreetMap (OSM)
- swisstopo

## Projektstruktur <------------------ Änderungen vorbehalten

```text
UEBERSCHWEMMUNG_RHEIN/
│
├── Backend/
│   │
│   ├── Berechnungen/
│   │   ├── Berechnung_Ueberschwemmung.ipynb
│   │   └── Filterung_Rhein.ipynb
│   │
│   └── Data/
│       └── Hoehenmodell/
│           ├── swissalti3d_2025_2610-1267_0.5_2056_5728.tif
│           ├── swissalti3d_2025_2610-1268_0.5_2056_5728.tif
│           ├── swissalti3d_2025_2610-1269_0.5_2056_5728.tif
│           └── ...
│
├── Frontend/
│   └── my-app/
│       │
│       ├── public/
│       │   ├── favicon.svg
│       │   └── icons.svg
│       │
│       ├── src/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── main.jsx
│       │   └── index.css
│       │
│       ├── package.json
│       ├── vite.config.js
│       └── README.md
│
├── test.py
└── README.md
```
