import { useState, useEffect } from "react";
import "./App.css";
import Testkarte from "./components/testkarte";

const API_BASE = "/api";

async function fetchJson(url, timeoutMs = 120000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} bei ${url}`);
    }

    return await res.json();
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error(`Timeout nach ${timeoutMs}ms bei ${url}`, { cause: e });
    }

    throw e;
  } finally {
    clearTimeout(t);
  }
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activatePage, setActivatePage] = useState("uebersicht");

  const [standorte, setStandorte] = useState([]);
  const [selectedStandort, setSelectedStandort] = useState("");
  const [analyseResult, setAnalyseResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJson(`${API_BASE}/daten/preview`, 30000);

        if (cancelled) return;

        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;

        console.error("Fehler beim Laden der Daten:", e);
        setError(e.message || "Fehler beim Laden");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStandorte() {
      setAnalysisError(null);

      try {
        const data = await fetchJson(`${API_BASE}/analysis/standorte`, 30000);

        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setStandorte(list);

        if (list.length > 0) {
          setSelectedStandort(list[0]);
        }
      } catch (e) {
        if (cancelled) return;

        console.error("Fehler beim Laden der Standorte:", e);
        setStandorte([]);
        setSelectedStandort("");
        setAnalysisError(e.message || "Standorte konnten nicht geladen werden");
      }
    }

    loadStandorte();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedStandort) return;

    let cancelled = false;

    async function loadAnalyse() {
      setAnalysisLoading(true);
      setAnalysisError(null);
      setAnalyseResult(null);

      const url = `${API_BASE}/analysis/erwachsene/${encodeURIComponent(
        selectedStandort,
      )}`;

      try {
        const data = await fetchJson(url, 120000);

        if (cancelled) return;

        setAnalyseResult(data);
      } catch (e) {
        if (cancelled) return;

        setAnalysisError(e.message || "Analyse konnte nicht geladen werden");
      } finally {
        if (!cancelled) {
          setAnalysisLoading(false);
        }
      }
    }

    loadAnalyse();

    return () => {
      cancelled = true;
    };
  }, [selectedStandort]);

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
            onClick={() => setActivatePage("daten")}
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
          <h1>Wer ist betroffen, wenn der Rheinpegel steigt?</h1>
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
                    Nutzung für Gebäude, Strassen, Infrastruktur und
                    Gewässergeometrien.
                  </p>
                </li>

                <li>
                  <strong>swisstopo swissALTI3D</strong>
                  <p>
                    Digitales Höhenmodell der Schweiz zur Berechnung
                    potenzieller Überflutungsflächen.
                  </p>
                </li>

                <li>
                  <strong>Rhein-Geometrie</strong>
                  <p>
                    Nutzung als Ausgangsfläche für die Hochwassersimulation.
                  </p>
                </li>

                <li>
                  <strong>Verwaltungsgrenzen und Hintergrundkarten</strong>
                  <p>Zur Orientierung und Visualisierung der Resultate.</p>
                </li>
              </ul>

              <h3>Datenverarbeitung</h3>

              <p>
                Die Daten werden in einem GIS verarbeitet und analysiert. Dabei
                werden Flächen identifiziert, die unterhalb des definierten
                Wasserstands liegen und räumlich mit dem Rhein verbunden sind.
              </p>

              <p style={{ marginTop: "10px", opacity: 0.9 }}>Datenquellen:</p>
            </>
          )}

          {activatePage === "daten" && (
            <>
              <p>
                Die Ergebnisse der Analyse werden als 2D-Karten visualisiert
              </p>
              <Testkarte />
            </>
          )}

          {activatePage === "historie" && (
            <>
              <strong>2021 - Hochwasser am Rhein in Basel</strong>
              <p>
                Im Juli 2021 führte der Rhein nach tagelangem Starkregen
                deutlich Hochwasser. In Basel wurden Rheinufer gesperrt, die
                Schifffahrt teilweise eingestellt und die Strömung war extrem
                stark. Der Pegel erreichte einen der höchsten Werte der letzten
                Jahrzehnte.
              </p>
              <strong>1999 - Jahrhunderthochwasser in Basel</strong>
              <p>
                Das Hochwasser vom Mai 1999 zählt zu den bedeutendsten modernen
                Rhein-Hochwassern in Basel. Feuerwehr, Polizei und Zivilschutz
                standen während rund zwei Wochen im Dauereinsatz. Der Rhein
                überschritt kritische Marken deutlich.
              </p>
              <strong>1994 - Sehr grosses Rheinhochwasser</strong>
              <p>
                1994 wurde das damals angenommene 100-jährliche Hochwasser am
                Rhein in Basel überschritten. Dieses Ereignis zeigte, dass die
                bisherigen Hochwassermodelle teilweise zu tief angesetzt waren.
              </p>

              <strong>1978 - Starkes Hochwasser</strong>
              <p>
                1978 kam es zu einem grossen Rheinhochwasser in Basel. Das
                Ereignis wird oft zusammen mit 1994 und 1999 als Referenz für
                moderne Hochwasseranalysen verwendet.
              </p>
              <strong>1910 - Rhein tritt in Basel über die Ufer</strong>
              <p>
                Am 16. Juni 1910 trat der Rhein in Basel über die Ufer.
                Besonders das Kleinbasel war betroffen, wo Wasser bis auf die
                Strassen gelangte. Historische Bilder zeigen überflutete
                Rheinwege und Brückenbereiche
              </p>
              <strong>1882 / 1883 - Grosses Oberrhein-Hochwasser</strong>
              <p>
                Die Hochwasser von 1882 und 1883 verursachten grosse Schäden
                entlang des Oberrheins und beeinflussten später den Ausbau des
                Hochwasserschutzes auch in Basel und Umgebung.
              </p>
              <strong>1852 - Höchststand des Rheins in Basel</strong>
              <p>
                1852 erreichte der Rhein in Basel laut historischen
                Rekonstruktionen einen extrem hohen Pegel. Dieses Ereignis gilt
                als eines der stärksten bekannten Hochwasser der letzten rund
                500 Jahre am Basler Rhein.
              </p>
              <strong>1817 - Schweres Hochwasser am Rhein</strong>
              <p>
                1817 wurde in Basel ein aussergewöhnlich hoher Rheinstand
                registriert. Das Ereignis gehört zu den wichtigsten historischen
                Hochwassern des Oberrheins.
              </p>
              <strong>1784 - Extremes Hochwasser nach Schneeschmelze</strong>
              <p>
                Nach einem sehr kalten Winter führte rasche Schneeschmelze 1784
                zu schweren Überschwemmungen entlang des Rheins. Auch Basel war
                betroffen.
              </p>
              <strong>1566 - Rhein- und Bodenseehochwasser</strong>
              <p>
                1566 kam es zu einem grossen Hochwasserereignis im gesamten
                Oberrheinraum. Historische Berichte erwähnen zerstörte Brücken
                und Überschwemmungen entlang des Rheins bis Basel.
              </p>
              <strong>1480 - Magdalenenhochwasser</strong>
              <p>
                Das Magdalenenhochwasser von 1480 gilt als eine der grössten
                Hochwasserkatastrophen der Schweizer Geschichte. In Basel lag
                der Höhepunkt des Hochwassers am 24. Juli. Zahlreiche
                Rheinbrücken zwischen Bern und Strassburg wurden zerstört.
              </p>
              <strong>1342 - Mittelalterliche «Jahrtausendflut»</strong>
              <p>
                Das Hochwasser von 1342 zählt zu den extremsten bekannten
                Überschwemmungen Mitteleuropas. Auch der Rhein bei Basel war
                betroffen. Historiker sprechen teilweise von einer
                «Jahrtausendflut».
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
