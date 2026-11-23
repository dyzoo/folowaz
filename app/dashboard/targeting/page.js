"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const emptyForm = {
  niche: "",
  locations: "Kenya, Tanzania",
  ageMin: "18",
  ageMax: "45",
  genders: [],
  languages: ["Kiswahili"],
  interests: "",
  hashtags: "",
  dailyLimit: "100",
  status: "paused",
};

const toList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

export default function TargetingPage() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/growth-settings");
        const { settings: data } = await response.json();
        if (!data) return;
        setForm({
          niche: data.niche || "",
          locations: (data.target_locations || []).join(", "),
          ageMin: String(data.age_min),
          ageMax: String(data.age_max),
          genders: data.genders || [],
          languages: data.languages || [],
          interests: (data.interests || []).join(", "),
          hashtags: (data.hashtags || []).join(", "),
          dailyLimit: String(data.daily_limit),
          status: data.status,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggle(field, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value],
    }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = {
      niche: form.niche,
      target_locations: toList(form.locations),
      age_min: Number(form.ageMin),
      age_max: Number(form.ageMax),
      genders: form.genders,
      languages: form.languages,
      interests: toList(form.interests),
      hashtags: toList(form.hashtags),
      daily_limit: Number(form.dailyLimit),
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/growth-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setMessage(response.ok ? "Mipangilio imehifadhiwa kikamilifu." : data.error);
    } catch {
      setMessage("Hitilafu ya mtandao. Tafadhali jaribu tena.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="content-head"><h1>Mipangilio ya ulengaji</h1><p>Chagua watu unaotaka kuwafikia. Mabadiliko yote yanahifadhiwa kwenye akaunti yako.</p></div>
      {message && <div className="auth-success">{message}</div>}
      {loading && <div className="hint"><Loader2 size={13} className="spin" /> Inapakia mipangilio...</div>}
      <form onSubmit={save}>
        <fieldset disabled={loading || saving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <div className="panel">
            <h3>Maeneo na niche</h3>
            <div className="field"><label>Niche ya akaunti</label><input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} placeholder="mf. Mazoezi, Chakula, Mitindo" /></div>
            <div className="field"><label>Mahali (vitenganishwe na koma)</label><input value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} placeholder="Kenya, Tanzania, Uganda" /></div>
            <div className="field"><label>Maslahi</label><input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Yoga, Chakula bora, Kusafiri" /></div>
            <div className="field"><label>Vitambulisho (hashtags)</label><input value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} placeholder="#fitness, #wellness" /></div>
          </div>

          <div className="panel">
            <h3>Idadi na lugha</h3>
            <div className="range-row">
              <div className="field"><label>Umri wa chini</label><input type="number" min="13" max="99" value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value })} /></div>
              <div className="field"><label>Umri wa juu</label><input type="number" min="13" max="99" value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value })} /></div>
            </div>
            <div className="field"><label>Kikomo cha kila siku</label><input type="number" min="10" max="500" value={form.dailyLimit} onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })} /></div>
            <label style={{ fontSize: ".8rem", fontWeight: 800 }}>Jinsia</label>
            <div className="checkbox-grid" style={{ marginBottom: 18 }}>
              {["Wanawake", "Wanaume", "Zote"].map((value) => <label key={value}><input type="checkbox" checked={form.genders.includes(value)} onChange={() => toggle("genders", value)} />{value}</label>)}
            </div>
            <label style={{ fontSize: ".8rem", fontWeight: 800 }}>Lugha</label>
            <div className="checkbox-grid">
              {["Kiswahili", "English", "Français", "العربية"].map((value) => <label key={value}><input type="checkbox" checked={form.languages.includes(value)} onChange={() => toggle("languages", value)} />{value}</label>)}
            </div>
          </div>

          <div className="panel">
            <div className="field"><label>Hali ya ukuaji</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Inafanya kazi</option><option value="paused">Imesitishwa</option></select></div>
            <div className="action-row"><button className="btn btn-primary" type="submit">{saving ? <><Loader2 size={17} className="spin" /> Inahifadhi...</> : "Hifadhi mipangilio"}</button><a href="/dashboard" className="btn btn-outline">Ghairi</a></div>
          </div>
        </fieldset>
      </form>
    </>
  );
}
