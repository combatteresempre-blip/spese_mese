import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Plus, Trash2, TrendingUp, Wallet, Tag, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { name: "Casa",          color: "#F4C542", emoji: "🏠" },
  { name: "Cibo",          color: "#F47C42", emoji: "🍕" },
  { name: "Trasporti",     color: "#42B4F4", emoji: "🚗" },
  { name: "Salute",        color: "#72E85A", emoji: "💊" },
  { name: "Svago",         color: "#F442C8", emoji: "🎬" },
  { name: "Abbigliamento", color: "#A142F4", emoji: "👗" },
  { name: "Tecnologia",    color: "#42F4C8", emoji: "💻" },
  { name: "Altro",         color: "#F4A442", emoji: "📦" },
];

const MONTHS       = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const MONTHS_SHORT = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

const fmt = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div style={{ background: "#161628", border: "1px solid #2a2a50", borderRadius: 10, padding: "8px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <p style={{ color: "#888", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>{d.name}</p>
        <p style={{ color: "#F4C542", fontWeight: 700, margin: 0, fontFamily: "monospace", fontSize: 15 }}>{fmt(d.value)}</p>
      </div>
    );
  }
  return null;
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a18; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a50; border-radius: 4px; }

  .glass {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    backdrop-filter: blur(12px);
  }
  .inp {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: #f0f0f0;
    padding: 11px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
  }
  .inp:focus { border-color: #F4C542; background: rgba(244,197,66,0.05); }
  .inp::placeholder { color: #444; }
  select.inp option { background: #161628; }

  .btn-primary {
    background: #F4C542; color: #0a0a18; border: none; border-radius: 12px;
    padding: 11px 22px; font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: 14px; cursor: pointer; display: flex; align-items: center;
    gap: 6px; transition: all 0.2s; white-space: nowrap;
  }
  .btn-primary:hover { background: #f5d060; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(244,197,66,0.3); }
  .btn-primary:active { transform: translateY(0); }

  .nav-btn {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #888; width: 36px; height: 36px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .nav-btn:hover { background: rgba(244,197,66,0.1); border-color: #F4C542; color: #F4C542; }

  .vtab {
    background: transparent; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9px; padding: 7px 16px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; cursor: pointer; color: #555; transition: all 0.2s;
  }
  .vtab.on { background: rgba(244,197,66,0.12); border-color: rgba(244,197,66,0.4); color: #F4C542; }

  .expense-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 12px; transition: background 0.15s;
  }
  .expense-row:hover { background: rgba(255,255,255,0.04); }

  .del-btn {
    background: transparent; border: none; color: #333; cursor: pointer;
    padding: 5px; border-radius: 7px; display: flex; transition: color 0.2s, background 0.2s;
  }
  .del-btn:hover { color: #F47C42; background: rgba(244,124,66,0.1); }

  .stat {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 18px 20px; position: relative; overflow: hidden;
  }
  .stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent, #F4C542), transparent); opacity: 0.6;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fadein { animation: fadeUp 0.35s ease both; }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .grid-stats  { grid-template-columns: 1fr 1fr !important; }
    .grid-main   { grid-template-columns: 1fr !important; }
    .form-grid   { grid-template-columns: 1fr 1fr !important; }
    .form-grid .full { grid-column: 1 / -1; }
  }
  @media (max-width: 480px) {
    .grid-stats  { grid-template-columns: 1fr !important; }
    .form-grid   { grid-template-columns: 1fr !important; }
  }
`;

// Salva le spese nel localStorage così persistono al ricaricamento
const STORAGE_KEY = "spesemese_v1";
const loadExpenses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};
const saveExpenses = (list) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
};

export default function SpeseMese() {
  const [expenses, setExpensesRaw] = useState(loadExpenses);
  const [form, setForm]            = useState({ desc: "", amount: "", category: "Casa" });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [view, setView]            = useState("pie");
  const [error, setError]          = useState("");

  const setExpenses = (updater) => {
    setExpensesRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveExpenses(next);
      return next;
    });
  };

  const filtered   = useMemo(() => expenses.filter(e => e.month === selectedMonth), [expenses, selectedMonth]);
  const total      = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const topCat     = useMemo(() => {
    const map = {};
    filtered.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = {};
    filtered.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, ...CATEGORIES.find(c => c.name === name) }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const addExpense = () => {
    if (!form.desc.trim())                                       return setError("Inserisci una descrizione.");
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError("Importo non valido.");
    setExpenses(prev => [...prev, { id: Date.now(), desc: form.desc.trim(), amount: +form.amount, category: form.category, month: selectedMonth }]);
    setForm(f => ({ ...f, desc: "", amount: "" }));
    setError("");
  };

  const del       = (id) => setExpenses(prev => prev.filter(e => e.id !== id));
  const prevMonth = () => setSelectedMonth(m => (m - 1 + 12) % 12);
  const nextMonth = () => setSelectedMonth(m => (m + 1) % 12);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 0%, #1a1040 0%, #0a0a18 55%, #0d1a0a 100%)", fontFamily: "'DM Sans', sans-serif", color: "#f0f0f0", padding: "28px 20px" }}>
      <style>{CSS}</style>

      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Header ── */}
        <div className="fadein" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, background: "linear-gradient(135deg, #F4C542, #F47C42)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(244,197,66,0.35)", flexShrink: 0 }}>
              <Wallet size={22} color="#0a0a18" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.2 }}>
                Spese<span style={{ color: "#F4C542" }}>Mese</span>
              </h1>
              <p style={{ color: "#444", fontSize: 12 }}>Gestione spese mensili</p>
            </div>
          </div>

          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <div style={{ textAlign: "center", minWidth: 100 }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500, color: "#F4C542" }}>{MONTHS[selectedMonth]}</p>
              <p style={{ fontSize: 11, color: "#444" }}>2026</p>
            </div>
            <button className="nav-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid-stats fadein" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div className="stat" style={{ "--accent": "#F4C542" }}>
            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Totale mese</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 500, color: "#F4C542" }}>{fmt(total)}</p>
          </div>
          <div className="stat" style={{ "--accent": "#42B4F4" }}>
            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Spese registrate</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 500, color: "#42B4F4" }}>{filtered.length}</p>
          </div>
          <div className="stat" style={{ "--accent": "#72E85A" }}>
            <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Categoria top</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: "#72E85A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {CATEGORIES.find(c => c.name === topCat)?.emoji || ""} {topCat}
            </p>
          </div>
        </div>

        {/* ── Add form ── */}
        <div className="glass fadein" style={{ padding: "20px 22px" }}>
          <p style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
            <Plus size={13} /> Nuova spesa — {MONTHS_SHORT[selectedMonth]}
          </p>
          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 130px 160px auto", gap: 10, alignItems: "end" }}>
            <div className="full">
              <label style={{ display: "block", fontSize: 11, color: "#444", marginBottom: 6 }}>Descrizione</label>
              <input className="inp" placeholder="es. Bolletta luce…" value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addExpense()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#444", marginBottom: 6 }}>Importo (€)</label>
              <input className="inp" type="number" min="0" placeholder="0.00" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addExpense()} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#444", marginBottom: 6 }}>Categoria</label>
              <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
            <div className="full">
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={addExpense}>
                <Plus size={16} /> Aggiungi
              </button>
            </div>
          </div>
          {error && <p style={{ marginTop: 10, color: "#F47C42", fontSize: 12 }}>⚠ {error}</p>}
        </div>

        {/* ── Charts + List ── */}
        <div className="grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Chart */}
          <div className="glass fadein" style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 7 }}>
                <TrendingUp size={13} /> Ripartizione
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`vtab ${view === "pie" ? "on" : ""}`} onClick={() => setView("pie")}>Torta</button>
                <button className={`vtab ${view === "bar" ? "on" : ""}`} onClick={() => setView("bar")}>Barre</button>
              </div>
            </div>

            {byCategory.length === 0 ? (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 32 }}>📭</span>
                <p style={{ color: "#333", fontSize: 13 }}>Nessuna spesa per {MONTHS[selectedMonth]}</p>
              </div>
            ) : view === "pie" ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byCategory} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#444", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(244,197,66,0.04)" }} />
                  <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                    {byCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              {byCategory.map((c) => {
                const pct = total > 0 ? ((c.value / total) * 100).toFixed(0) : 0;
                return (
                  <div key={c.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, display: "inline-block" }} />
                        {c.emoji} {c.name}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#ccc" }}>
                        {fmt(c.value)} <span style={{ color: "#444" }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 4, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="glass fadein" style={{ padding: "22px" }}>
            <p style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
              <Tag size={13} /> Lista spese — {MONTHS_SHORT[selectedMonth]}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 420, overflowY: "auto", paddingRight: 2 }}>
              {filtered.length === 0 ? (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 32 }}>✨</span>
                  <p style={{ color: "#333", fontSize: 13 }}>Nessuna spesa registrata</p>
                </div>
              ) : [...filtered].sort((a, b) => b.amount - a.amount).map(e => {
                const cat = CATEGORIES.find(c => c.name === e.category);
                return (
                  <div key={e.id} className="expense-row">
                    <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: cat.color + "18", border: `1px solid ${cat.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                      {cat.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{e.desc}</p>
                      <span style={{ fontSize: 11, color: cat.color, background: cat.color + "18", borderRadius: 6, padding: "1px 7px" }}>{e.category}</span>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: cat.color, fontWeight: 500, flexShrink: 0 }}>{fmt(e.amount)}</span>
                    <button className="del-btn" onClick={() => del(e.id)}><Trash2 size={14} /></button>
                  </div>
                );
              })}
            </div>
            {filtered.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#444" }}>{filtered.length} voc{filtered.length === 1 ? "e" : "i"}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: "#F4C542" }}>{fmt(total)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
