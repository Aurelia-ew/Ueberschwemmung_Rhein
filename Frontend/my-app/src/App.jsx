import { useState } from "react";
import "./App.css";
import Karte from "./components/karte";
import Hochwasser1910 from "./assets/Hochwasser_1910.jpg";
import Hochwasser2021 from "./assets/Hochwasser_2021.jpg";

export default function App() {
  const [activatePage, setActivatePage] = useState("uebersicht");

  return (
    <div className="app">
      <aside className="sidebar">
        <img
          src="/Logo_Projekt_Hackaton.png"
          className="sidebar-logo"
          alt="Logo Überschwemmung Simulation"
        />

        <h1 className="sidebar-title">Menü:</h1>

        <div className="sidebar-menu">
          <button
            className="sidebar-button"
            onClick={() => setActivatePage("uebersicht")}
          >
            Übersicht
          </button>

          <button
            className="sidebar-button"
            onClick={() => setActivatePage("visualisierungen")}
          >
            Visualisierungen
          </button>

          <button
            className="sidebar-button"
            onClick={() => setActivatePage("historie")}
          >
            Historie
          </button>
        </div>
      </aside>

      <div className="right-side">
        <header className="page-header">
          <h1>Wer und Was ist betroffen, wenn der Rheinpegel steigt?</h1>
        </header>

        <main className="main">
          {activatePage === "uebersicht" && (
            <>
              <h2>Projektübersicht</h2>

              <p>
                Der Rhein spielt eine zentrale Rolle für die Stadt Basel, stellt
                jedoch bei Hochwasser ein erhebliches Risiko dar. Ziel dieses
                Projekts ist es, zu analysieren, welche Gebiete potenziell
                überflutet werden könnten, wenn der Wasserstand des Rheins um
                einen definierten Wert ansteigt. Dazu wird ein digitales
                Höhenmodell verwendet (swissALTI3D). Alle Flächen, deren Höhe
                unterhalb des angenommenen Wasserniveaus liegt und räumlich mit
                dem Rhein verbunden sind, werden als potenziell gefährdet
                betrachtet. Die Resultate werden als 2D-Karten visualisiert.
              </p>

              <h2>Datengrundlagen</h2>

              <p>
                Für die Analyse der potenziellen Überschwemmungsgebiete werden
                verschiedene Geodaten verwendet.
              </p>

              <ul>
                <li>
                  <strong>OpenStreetMap (OSM)</strong>
                  <p>
                    Dient als Hintergrundkarte. Zusätzlich werden die Gebäude für die Karte extrahiert und als separate Layer dargestellt.
                  </p>
                  <p>
                    <a
                        href="https://www.openstreetmap.org/#map=8/46.825/8.224"
                        target="_blank"
                        rel="noopener noreferrer">
                        Hier gehts zu OpenStreetMap
                    </a>
                  </p>
                </li>

                <li>
                  <strong>swisstopo swissALTI3D</strong>
                  <p>
                    Ist die Grundlage zur Berechnung des Überschwemmungsgebiet. Auf diesen Daten werden die Berechnungen anhand des Bathtub Models druchgeführt.
                  </p>
                  <p>
                    <a
                        href="https://www.swisstopo.admin.ch/de/hoehenmodell-swissalti3d"
                        target="_blank"
                        rel="noopener noreferrer">
                        Hier gehts zu swissALTI3D
                    </a>
                  </p>
                </li>
                <li>
                  <strong>swisstopo swissTLM3D</strong>
                  <p>
                    Aus diesem Datensatz wird die Rheingeometie (Polygon) extrahiert. 
                    Diese dient als Perimeter für die Hochwassersimulation
                  </p>
                  <p>
                    <a
                        href="https://www.swisstopo.admin.ch/de/landschaftsmodell-swisstlm3d"
                        target="_blank"
                        rel="noopener noreferrer">
                        Hier gehts zu swissTLM3D
                    </a>
                  </p>
                </li>
              </ul>

              <h3>Datenverarbeitung</h3>

              <p>
                Die potenziellen Überschwemmungsflächen werden in einem Jupyter
                Notebook berechnet und definiert. Dabei werden Flächen
                identifiziert, die unterhalb des festgelegten Wasserstands
                liegen und räumlich mit dem Rhein verbunden sind. Anschliessend
                werden die Ergebnisse als Layer auf einer OpenStreetMap-Karte
                überlagert und visualisiert.
                Für die Datenverabeitung wurden die Bibliotheken rasterio, Geopandas, und numpy verwendet.
              </p>
            </>
          )}

          {activatePage === "visualisierungen" && (
            <>
              <h2>Visualisierungen</h2>

              <p>
                Die Ergebnisse der Analyse werden als 2D-Karten visualisiert.
              </p>

              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.75,
                  marginTop: "10px",
                }}
              >
                * Die Wasserhöhe bezieht sich auf die Wasseroberfläche im Höhenmodell swissALTI3D. Normalerweise beträgt der Rheinpegel 2 - 4 Meter (Wassertiefe vom Grund bis zur Wasseroberfläche).
              </p>

              <Karte />
            </>
          )}

          {activatePage === "historie" && (
            <>
              <h2>Historische Hochwasserereignisse am Rhein in Basel</h2>

              <p>
                Der Rhein prägt Basel seit Jahrhunderten. Gleichzeitig stellt er
                bei Hochwasser eine potenzielle Gefahr dar. Die folgende
                Übersicht zeigt bedeutende historische Hochwasserereignisse in
                Basel und entlang des Oberrheins.
              </p>

              <strong>2021 - Hochwasser am Rhein in Basel</strong>

              <p>
                Im Juli 2021 führte der Rhein nach tagelangem Starkregen
                deutlich Hochwasser. In Basel wurden Rheinufer gesperrt, die
                Schifffahrt teilweise eingestellt und die Strömung war extrem
                stark. Der Pegel lag bei gut 8 Metern und damit rund 5 Meter
                über dem üblichen Normalpegel von etwa 2 bis 4 Metern.
              </p>

              <div
                style={{
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={Hochwasser2021}
                  alt="Hochwasser Basel 2021"
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    borderRadius: "10px",
                    display: "block",
                  }}
                />

                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.75,
                    marginTop: "6px",
                  }}
                >
                  Hochwasser am Rhein in Basel im Juli 2021.
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    opacity: 0.65,
                    marginTop: "4px",
                  }}
                >
                  Bildquelle:{" "}
                  <a
                    href="https://www.bazonline.ch/immense-wassermassen-stroemen-durch-die-region-243725433523"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BAZ Online - Immense Wassermassen strömen durch die Region
                  </a>
                </p>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.srf.ch/play/tv/news-clip/video/basel-der-rhein-fuehrt-hochwasser-16-07-21?urn=urn:srf:video:d4c6126a-0573-4b9d-80a6-a1022408d1eb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SRF - Hochwasser Basel (16.07.2021)
                </a>
              </div>

              <strong>1999 - Jahrhunderthochwasser in Basel</strong>

              <p>
                Das Hochwasser vom Mai 1999 zählt zu den bedeutendsten modernen
                Rhein-Hochwassern in Basel. Der Pegel erreichte rund 8.9 Meter
                und lag damit etwa 5 bis 7 Meter über dem üblichen Normalpegel
                des Rheins. Feuerwehr, Polizei, Zivilschutz und weitere
                Einsatzkräfte standen während rund zwei Wochen im Dauereinsatz.
                Uferbereiche wurden gesperrt, Schutzmassnahmen aufgebaut und die
                Bevölkerung laufend informiert.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.bs.ch/medienmitteilungen/1999-hochwasserbilanz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kanton Basel-Stadt - Hochwasserbilanz 1999
                </a>
              </div>

              <strong>1994 - Sehr grosses Rheinhochwasser</strong>

              <p>
                1994 wurde das damals angenommene 100-jährliche Hochwasser am
                Rhein in Basel überschritten. Der Pegel erreichte rund 7 bis 8
                Meter und lag damit mehrere Meter über dem normalen Rheinstand.
                Das Ereignis zeigte, dass die bisherigen Hochwassermodelle
                teilweise zu tief angesetzt waren und der Rhein deutlich höhere
                Wasserstände erreichen kann als zuvor angenommen.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.hochwasserrisiko.bs.ch/schutz-vor-hochwasser/hochwasser-am-rhein.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kanton Basel-Stadt - Hochwasser am Rhein
                </a>
              </div>

              <strong>1978 - Starkes Hochwasser</strong>

              <p>
                1978 kam es zu einem grossen Rheinhochwasser in Basel. Der Pegel
                erreichte deutlich erhöhte Werte und lag mehrere Meter über dem
                normalen Rheinstand. Uferbereiche entlang des Rheins wurden
                teilweise gesperrt und die starke Strömung stellte eine Gefahr
                für die Schifffahrt dar. Das Ereignis wird bis heute zusammen
                mit den Hochwassern von 1994 und 1999 als Referenz für moderne
                Hochwasseranalysen verwendet.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.hochwasserrisiko.bs.ch/schutz-vor-hochwasser/hochwasser-am-rhein.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kanton Basel-Stadt - Hochwasser am Rhein
                </a>
              </div>

              <strong>1910 - Rhein tritt in Basel über die Ufer</strong>

              <p>
                Am 16. Juni 1910 trat der Rhein in Basel über die Ufer.
                Besonders das Kleinbasel war betroffen, wo Wasser bis auf die
                Strassen und Promenaden gelangte. Historische Bilder zeigen
                überflutete Rheinwege, Brückenbereiche und zahlreiche
                Schaulustige entlang des Flusses. Der Rhein erreichte einen
                aussergewöhnlich hohen Wasserstand und lag mehrere Meter über
                dem normalen Rheinpegel.
              </p>

              <div
                style={{
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={Hochwasser1910}
                  alt="Hochwasser Basel 1910"
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    borderRadius: "10px",
                    display: "block",
                  }}
                />

                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.75,
                    marginTop: "6px",
                  }}
                >
                  Historische Aufnahme des Hochwassers in Basel im Jahr 1910.
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    opacity: 0.65,
                    marginTop: "4px",
                  }}
                >
                  Bildquelle:{" "}
                  <a
                    href="https://primenews.ch/news/2019/02/die-hochwasser-des-rheins-den-letzten-jahrhunderten"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Prime News - Die Hochwasser des Rheins in den letzten
                    Jahrhunderten
                  </a>
                </p>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.baslerstadtbuch.ch/.permalink/stadtbuch/c11eaf97-6a47-43f8-b425-2f0fb4e20b88.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Basler Stadtbuch - Historische Hochwasserereignisse
                </a>
              </div>

              <strong>1882 / 1883 - Grosses Oberrhein-Hochwasser</strong>

              <p>
                Die Hochwasser von 1882 und 1883 verursachten grosse Schäden
                entlang des Oberrheins und beeinflussten später den Ausbau des
                Hochwasserschutzes auch in Basel und Umgebung. Zahlreiche
                Uferbereiche, Brücken und Verkehrswege wurden beschädigt oder
                überflutet. Die Ereignisse zeigten, wie stark extreme
                Rhein-Hochwasser ganze Regionen entlang des Oberrheins
                beeinflussen können.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://de.wikipedia.org/wiki/Hochwasser_am_Oberrhein_1882/1883"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia - Hochwasser am Oberrhein 1882/1883
                </a>
              </div>

              <strong>1852 - Höchststand des Rheins in Basel</strong>

              <p>
                1852 erreichte der Rhein in Basel laut historischen
                Rekonstruktionen einen extrem hohen Pegel. Dieses Ereignis gilt
                als eines der stärksten bekannten Hochwasser der letzten rund
                500 Jahre am Basler Rhein.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.hochwasserrisiko.bs.ch/schutz-vor-hochwasser/hochwasser-am-rhein.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kanton Basel-Stadt - Hochwasser am Rhein
                </a>
              </div>

              <strong>1817 - Schweres Hochwasser am Rhein</strong>

              <p>
                1817 wurde in Basel ein aussergewöhnlich hoher Rheinstand
                registriert. Das Ereignis gehört zu den wichtigsten historischen
                Hochwassern des Oberrheins.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://www.hochwasserrisiko.bs.ch/schutz-vor-hochwasser/hochwasser-am-rhein.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kanton Basel-Stadt - Hochwasser am Rhein
                </a>
              </div>

              <strong>1784 - Extremes Hochwasser nach Schneeschmelze</strong>

              <p>
                Nach einem sehr kalten Winter führte rasche Schneeschmelze 1784
                zu schweren Überschwemmungen entlang des Rheins. Auch Basel war
                betroffen.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://de.wikipedia.org/wiki/Hochwasser_von_1784"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia - Hochwasser von 1784
                </a>
              </div>

              <strong>1566 - Rhein- und Bodenseehochwasser</strong>

              <p>
                1566 kam es zu einem grossen Hochwasserereignis im gesamten
                Oberrheinraum. Historische Berichte erwähnen zerstörte Brücken
                und Überschwemmungen entlang des Rheins bis Basel.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://hwb.geschichte.uni-freiburg.de/ereignisse/id/1566-06-01_1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Historisches Wasserbauarchiv - Hochwasser 1566
                </a>
              </div>

              <strong>1480 - Magdalenenhochwasser</strong>

              <p>
                Das Magdalenenhochwasser von 1480 gilt als eine der grössten
                Hochwasserkatastrophen der Schweizer Geschichte. In Basel lag
                der Höhepunkt des Hochwassers am 24. Juli. Zahlreiche
                Rheinbrücken zwischen Bern und Strassburg wurden zerstört.
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://de.wikipedia.org/wiki/Magdalenenhochwasser_1480"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia - Magdalenenhochwasser 1480
                </a>
              </div>

              <strong>1342 - Mittelalterliche «Jahrtausendflut»</strong>

              <p>
                Das Hochwasser von 1342 zählt zu den extremsten bekannten
                Überschwemmungen Mitteleuropas. Auch der Rhein bei Basel war
                betroffen. Historiker sprechen teilweise von einer
                «Jahrtausendflut».
              </p>

              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                Quelle:{" "}
                <a
                  href="https://de.wikipedia.org/wiki/Magdalenenhochwasser_1342"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia - Magdalenenhochwasser 1342
                </a>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
