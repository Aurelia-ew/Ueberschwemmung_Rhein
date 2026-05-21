import folium

m = folium.Map(
    location=[47.56, 7.59],
    zoom_start=12
)

folium.Marker(
    [47.56, 7.59],
    popup="Basel"
).add_to(m)

m.save("../../Frontend/my-app/public/testkarte.html")