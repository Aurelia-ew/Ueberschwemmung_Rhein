import { useEffect, useMemo, useRef, useState } from "react";
import vegaEmbed from "vega-embed";

const API_BASE = "/api";

const VISUALISIERUNGEN = [
  { key: "direction", label: "Links / Rechts", fields: ["ltr", "rtl"] },
  { key: "age", label: "Erwachsene / Kinder", fields: ["adult", "child"] },
  { key: "total", label: "Total Fussgänger", fields: ["total"] },
  { key: "zones", label: "Zonen 1-3", fields: ["zone1", "zone2", "zone3"] },
];

export default function VegaTimeseries({ standort }) {
  const [rows, setRows] = useState([]);
  const [visKey, setVisKey] = useState("direction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartMode, setChartMode] = useState("line");

  const chartRef = useRef(null);

  useEffect(() => {
    if (!standort) return;

    let cancelled = false;

    const url = `${API_BASE}/timeseries/${encodeURIComponent(standort)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const resetState = setTimeout(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
        setRows([]);
      }
    }, 0);

    fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} bei ${url}`);
        }

        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;

        const msg =
          err?.name === "AbortError"
            ? `Timeout nach 20000ms bei ${url}`
            : err?.message || `Fehler beim Laden (${url})`;

        setError(msg);
        setLoading(false);
      })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(resetState);
      controller.abort();
    };
  }, [standort]);

  const selectedVis = useMemo(() => {
    return (
      VISUALISIERUNGEN.find((v) => v.key === visKey) ?? VISUALISIERUNGEN[0]
    );
  }, [visKey]);

  const spec = useMemo(() => {
    const fields = selectedVis.fields;
    const multipleSeries = fields.length > 1;
    const useBars = chartMode === "bar";

    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 720,
      height: 320,
      background: "transparent",
      data: { values: rows },

      params: [
        {
          name: "zoom",
          select: { type: "interval", encodings: ["x"] },
          bind: "scales",
        },
      ],

      transform: multipleSeries
        ? [
            { fold: fields, as: ["serie", "value"] },
            {
              calculate:
                "datum.serie === 'ltr' ? 'Nach links' :" +
                "datum.serie === 'rtl' ? 'Nach rechts' :" +
                "datum.serie === 'adult' ? 'Erwachsene' :" +
                "datum.serie === 'child' ? 'Kinder' :" +
                "datum.serie === 'zone1' ? 'Zone 1' :" +
                "datum.serie === 'zone2' ? 'Zone 2' :" +
                "datum.serie === 'zone3' ? 'Zone 3' :" +
                "datum.serie === 'total' ? 'Total' : datum.serie",
              as: "serie_label",
            },
          ]
        : [],

      mark: useBars
        ? { type: "bar", stroke: null, size: 10, opacity: 1 }
        : { type: "line", interpolate: "monotone", strokeWidth: 1.6 },

      encoding: {
        x: {
          field: "timestamp",
          type: "temporal",
          title: "Zeit",
          axis: { labelOverlap: true },
        },

        y: {
          field: multipleSeries ? "value" : fields[0],
          type: "quantitative",
          title: "Anzahl Fussgänger",
          axis: { format: ",.0f" },
          stack: null,
        },

        ...(multipleSeries
          ? {
              color: {
                field: "serie_label",
                type: "nominal",
                title: "Kategorie",
              },
              order: useBars
                ? { field: "value", type: "quantitative", sort: "descending" }
                : undefined,
              tooltip: [
                { field: "timestamp", type: "temporal", title: "Zeit" },
                { field: "serie_label", type: "nominal", title: "Kategorie" },
                {
                  field: "value",
                  type: "quantitative",
                  title: "Anzahl",
                  format: ",.0f",
                },
              ],
            }
          : {
              tooltip: [
                { field: "timestamp", type: "temporal", title: "Zeit" },
                {
                  field: fields[0],
                  type: "quantitative",
                  title: "Anzahl",
                  format: ",.0f",
                },
              ],
            }),
      },

      config: {
        background: "transparent",
        view: { stroke: "transparent" },
        line: { strokeWidth: 1.6 },
        bar: { stroke: null, strokeWidth: 0 },
      },
    };
  }, [rows, selectedVis, chartMode]);

  useEffect(() => {
    if (!chartRef.current) return;

    let view;

    vegaEmbed(chartRef.current, spec, { actions: true })
      .then((result) => {
        view = result.view;
      })
      .catch(console.error);

    return () => {
      if (view) {
        view.finalize();
      }
    };
  }, [spec]);

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Interaktive Zeitreihe</h3>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div>
            Visualisierung:&nbsp;
            <select value={visKey} onChange={(e) => setVisKey(e.target.value)}>
              {VISUALISIERUNGEN.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ opacity: 0.85, fontWeight: 600 }}>
            Hinweis: Bitte hineinzoomen, damit die Vergleiche sichtbar werden.
          </div>
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button
          type="button"
          onClick={() => setChartMode((m) => (m === "line" ? "bar" : "line"))}
          title="Diagrammtyp wechseln"
          style={{
            padding: "7px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {chartMode === "line"
            ? "Zu Balkendiagramm wechseln"
            : "Zu Liniendiagramm wechseln"}
        </button>
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          opacity: 0.8,
        }}
      >
        <span>
          Tipp: Mausrad = Zoomen, Ziehen = Verschieben, Doppelklick =
          Zurücksetzen
        </span>

        {loading && <span>Daten werden geladen...</span>}

        {error && <span style={{ color: "red", opacity: 1 }}>{error}</span>}

        {!loading && !error && rows.length > 0 && (
          <span>Messpunkte: {rows.length}</span>
        )}
      </div>

      <div ref={chartRef} style={{ marginTop: "12px" }} />
    </div>
  );
}
