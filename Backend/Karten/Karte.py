# die Karte wurde ursprünglich in einem JupyterNoteboock gemacht. 
# Dies ist allerdings zu gross um es auf GitHub zu pushen, also ist hier der reine Code augeführt.

import folium
import rasterio
from folium.raster_layers import ImageOverlay
import osmnx as ox

# Gebiet
ort = "Basel, Switzerland"

# Gebäude laden
gebaeude = ox.features_from_place(
    ort,
    tags={"building": True}
)

# Gebäude die als Geometrie Polygon und Multipolygon haben herausfiltern
gebaeude = gebaeude[
    gebaeude.geom_type.isin([
        "Polygon",
        "MultiPolygon"
    ])
]

# Wichtige bzw. öffentliche Gebäude herausfiltern
wichtige = gebaeude[
    (gebaeude["amenity"].isin([
            "hospital",
            "school",
            "fire_station",
            "police",
            "place_of_worship"   # ALLE religiösen Gebäude
        ])
    )
    |
    (
        gebaeude["building"].isin([
            "hospital",
            "church",
            "mosque",
            "synagogue",
            "temple",
            "chapel",
            "cathedral",
            "shrine"
        ])
    )
]

# Normale Genäude behalten und alle wichtigen Gebäude entfernen
normale = gebaeude.drop(
    wichtige.index,
    errors="ignore"
)

# Karte
m = folium.Map(location=[47.56240, 7.59661], zoom_start=15, control_scale=True)

# Wasserlevel
levels = [20,15,10,5,4,3,2,1]

for level in levels:

    png = f"../Data/Hoehenmodell/Berechnung/wasserstandplus{level}m.png"
    tiff = f"../Data/Hoehenmodell/Berechnung/veraenderte_hoehen_{level}m_4326.tif"

    # Bounds holen
    with rasterio.open(tiff) as src:
        bounds = [
            [src.bounds.bottom, src.bounds.left],
            [src.bounds.top, src.bounds.right]
        ]

    # Layer erstellen
    fg = folium.FeatureGroup(
        name=f"Wasserstand +{level}m",
        show=True
    ).add_to(m)

    # Overlay hinzufügen
    ImageOverlay(
        image=png,
        bounds=bounds,
        opacity=0.8
    ).add_to(fg)

folium.GeoJson(
    normale,
    style_function=lambda x: {
        "fillColor": "grey",
        "color": "grey",
        "weight": 0.3,
        "fillOpacity": 0.8
    },
    name="Gebäude",
    show=False
).add_to(m)

folium.GeoJson(
    wichtige,
    style_function=lambda x: {
        "fillColor": "red",
        "color": "darkred",
        "weight": 1,
        "fillOpacity": 0.8
    },

    popup=folium.GeoJsonPopup(
        fields=[
            "name",
            "building",
            "amenity"
        ],

        aliases=[
            "Name",
            "Gebäude",
            "Typ"
        ]
    ),

    name="Wichtige Gebäude"

).add_to(m)

folium.LayerControl().add_to(m)

m.save("../Karten/Karte_ueberflutungsgebiet.html")