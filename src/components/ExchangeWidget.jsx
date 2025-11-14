import React, { useEffect, useState, useCallback } from "react";
import styles from "./ExchangeWidget.module.css";

function CurrencyDropdown({ value, onChange, rates }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", width: "100px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: "#fff",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {value} ▼
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          {Object.keys(rates).map((c) => (
            <div
              key={c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              style={{
                padding: "6px 8px",
                cursor: "pointer",
                background: c === value ? "#eef" : "white",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#eef")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  c === value ? "#eef" : "white")
              }
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExchangeWidget() {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("VND");
  const [loading, setLoading] = useState("Loading...");
  const [lastUpdate, setLastUpdate] = useState("");
  const [amount, setAmount] = useState(1);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 250);
    return () => clearTimeout(t);
  }, [amount]);
  const [result, setResult] = useState(null);

  const loadExchangeRate = useCallback(async () => {
    try {
      setLoading("Loading...");
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${base}`
      );
      const data = await res.json();

      if (!data.rates) throw new Error("No rates found");
      setRates(data.rates);
      setLoading("");
      setLastUpdate(
        new Date(data.time_last_updated * 1000).toLocaleString()
      );
    } catch {
      setLoading("Error loading exchange rate.");
    }
  }, [base]);

  useEffect(() => {
    loadExchangeRate();
  }, [loadExchangeRate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConvert();
  };

  const handleConvert = () => {
    if (!rates[target] || isNaN(amount)) return;
    const converted = amount * rates[target];
    setResult(converted);
  };

  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      handleConvert();
    }
  })

  const handleIncrement = (delta) => {
    setAmount((prev) => Math.max(0, prev + delta));
  };

  return (
    <div
      className={`${styles.card} ${styles.rateWidget}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2>💱 Currency Converter</h2>
      <p className={styles.muted}>Convert between global currencies.</p>

      {loading ? (
        <p className={styles.exchangeLoading}>{loading}</p>
      ) : (
        <>
          <p className={styles.lastUpdate}>Last updated: {lastUpdate}</p>

          <div className={styles.converterBox}>
            <div className={styles.converterRow}>
              <button
                className={styles.adjustBtn}
                onClick={() => handleIncrement(-1)}
              >
                −
              </button>
              <input
                type="number"
                value={amount === 0 ? "" : amount}
                min="0"
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "") {
                    setAmount(0);
                    return
                  } 

                  if (/^0\d+/.test(val)) {
                    val = val.replace(/^0+/, '');
                  }
                  setAmount(Number(val));
                }}
                className={`${styles.amountInput} ${animate ? styles.changed : ""}`}
              />
              <button
                className={styles.adjustBtn}
                onClick={() => handleIncrement(1)}
              >
                +
              </button>
            </div>
            <p className={styles.inputHint}>
              Tip: You can type decimals using “.” (e.g. enter .3 instead of 0.3)
            </p>
            <div
              className={styles.selectRow}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <CurrencyDropdown value={base} onChange={setBase} rates={rates} />

              <span className={styles.swapBtn}>→</span>

              <CurrencyDropdown
                value={target}
                onChange={setTarget}
                rates={rates}
              />
            </div>

            <button onClick={handleConvert} className={styles.convertBtn}>
              Convert
            </button>

            {result !== null && (
              <p className={styles.resultText}>
                💰 {amount.toLocaleString()} {base} ={" "}
                <strong>
                  {result.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {target}
                </strong>
              </p>
            )}
          </div>
        </>
      )}

      <button onClick={loadExchangeRate}>Refresh</button>
      <p className={`${styles.muted} ${styles.smallText}`}>
        Press Enter to convert
      </p>
    </div>
  );
}
















