import { useState, useEffect } from "react";
import VegaTimeseries from "./components/VegaTimeseries";
import VegaFokusLast7All from "./components/VegaFokusLast7All";
import "./App.css";

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

  // Standorte + Auswahl + Analyse-Ergebnis
  const [standorte, setStandorte] = useState([]);
  const [selectedStandort, setSelectedStandort] = useState("");
  const [analyseResult, setAnalyseResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Daten Preview
  useEffect(() => {
    let cancelled = false;

    (async () => {
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
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Standorte laden
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setAnalysisError(null);
      try {
        const data = await fetchJson(`${API_BASE}/analysis/standorte`, 30000);
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setStandorte(list);
        if (list.length > 0) setSelectedStandort(list[0]);
      } catch (e) {
        if (cancelled) return;
        console.error("Fehler beim Laden der Standorte:", e);
        setStandorte([]);
        setSelectedStandort("");
        setAnalysisError(e.message || "Standorte konnten nicht geladen werden");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Analyse fuer Standort laden
  useEffect(() => {
    if (!selectedStandort) return;

    let cancelled = false;

    (async () => {
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
        if (!cancelled) setAnalysisLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedStandort]);

  return (
    <div className="app">
      <aside className="sidebar">
        <img src="/logo-fhnw.png" className="sidebar-logo" />

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
            Daten
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivatePage("visualisierungen")}
          >
            Visualisierungen
          </button>
        </div>
      </aside>

      <div className="right-side">
        <header className="page-header">
          <h1>Hackathon 2026 - Wer ist betroffen wenn der Rheinpegel steig?</h1>
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
                betrachtet. Die Resultate werden als 2D-Karten visualisiert
              </p>

              <h3>Übersichtskarte des Untersuchungsgebiets</h3>
              <VegaFokusLast7All />

              <p style={{ marginTop: "10px", opacity: 0.9 }}>Datenquellen:</p>
            </>
          )}

          {activatePage === "daten" && (
            <>
              <h2>Daten</h2>
              <p>Ein kleiner Ausschnitt der Daten:</p>

              {loading && <p>Daten werden geladen...</p>}

              {error && (
                <p style={{ color: "red" }}>
                  Fehler beim Laden der Daten: {error}
                </p>
              )}

              {!loading && !error && (
                <>
                  <p>Zeilen im Preview: {rows.length}</p>

                  {rows.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(rows[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={index}>
                            {Object.keys(rows[0]).map((key) => (
                              <td key={key}>{row[key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Keine Daten gefunden.</p>
                  )}
                </>
              )}
            </>
          )}

          {activatePage === "visualisierungen" && <></>}
        </main>
      </div>
    </div>
  );
}
