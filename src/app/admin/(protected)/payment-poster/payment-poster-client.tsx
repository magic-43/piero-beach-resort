"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Download, Building2, Smartphone } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { updatePaymentPosterSettings } from "@/lib/admin/actions";
import { Logo } from "@/components/ui/logo";

const POSTER_W = 600;
const POSTER_H = 600;

export interface PropertyBranding {
  slug: "piero" | "cielo";
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
}

export interface PaymentPosterSettings {
  id?: number;
  hotel_slug: string;
  bank_name?: string | null;
  bpi_account_name?: string | null;
  bpi_account_number?: string | null;
  gcash_entries?: Array<{ number: string; name: string }> | null;
  notes?: string[] | null;
}

interface GcashEntry {
  number: string;
  name: string;
}

type FormState = {
  bankName: string;
  bpiAccountName: string;
  bpiAccountNumber: string;
  gcashEntries: GcashEntry[];
  notes: string[];
};

export default function PaymentPosterClient({
  initialSettings,
  branding,
}: {
  initialSettings: PaymentPosterSettings;
  branding: PropertyBranding;
}) {
  const previewRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale]             = useState(0.85);
  const [mobileTab, setMobileTab]     = useState<"form" | "preview">("form");
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus]   = useState<{
    loading: boolean; message: string; type: "success" | "error" | "";
  }>({ loading: false, message: "", type: "" });

  const [form, setForm] = useState<FormState>({
    bankName:         initialSettings.bank_name         || "BPI",
    bpiAccountName:   initialSettings.bpi_account_name   || "",
    bpiAccountNumber: initialSettings.bpi_account_number || "",
    gcashEntries:     initialSettings.gcash_entries     || [],
    notes:            initialSettings.notes             || [],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setScale(Math.max(Math.min((w - 32) / POSTER_W, 0.85), 0.35));
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const addGcash    = () => setForm((p) => ({ ...p, gcashEntries: [...p.gcashEntries, { number: "", name: "" }] }));
  const removeGcash = (i: number) => setForm((p) => ({ ...p, gcashEntries: p.gcashEntries.filter((_, idx) => idx !== i) }));
  const updateGcash = (i: number, field: keyof GcashEntry, val: string) =>
    setForm((p) => ({ ...p, gcashEntries: p.gcashEntries.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  const addNote    = () => setForm((p) => ({ ...p, notes: [...p.notes, ""] }));
  const removeNote = (i: number) => setForm((p) => ({ ...p, notes: p.notes.filter((_, idx) => idx !== i) }));
  const updateNote = (i: number, val: string) =>
    setForm((p) => ({ ...p, notes: p.notes.map((n, idx) => idx === i ? val : n) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ loading: true, message: "", type: "" });
    try {
      const result = await updatePaymentPosterSettings({
        hotelSlug: branding.slug,
        bankName:  form.bankName,
        bpiAccountName:   form.bpiAccountName,
        bpiAccountNumber: form.bpiAccountNumber,
        gcashEntries: form.gcashEntries,
        notes: form.notes,
      });
      if (result?.error) throw new Error(result.error);
      setSaveStatus({ loading: false, message: "Settings saved successfully.", type: "success" });
    } catch (err: unknown) {
      setSaveStatus({ loading: false, message: err instanceof Error ? err.message : "Failed to save.", type: "error" });
    }
  };

  const isCielo = branding.slug === "cielo";
  const dark   = isCielo ? "#14331e" : "#132c4a";
  const accent = isCielo ? "#c8922e" : "#c4a47c";
  const bg     = isCielo ? "#F5F1E6" : "#F3EFE4";
  const muted  = isCielo ? "#3a6b4a" : "#3a5278";
  const slug   = branding.slug;

  const handleDownloadPng = useCallback(async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: bg,
        width: POSTER_W,
        height: POSTER_H,
      });
      const link = document.createElement("a");
      link.download = `Payment_Poster_${branding.name.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to export PNG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [branding.name, bg]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start relative lg:max-h-[calc(100vh-8rem)]">

      {/* Mobile Tabs */}
      <div className="w-full sticky top-0 z-50 bg-resort-offwhite/95 backdrop-blur-sm pt-2 pb-3 mb-2 lg:hidden print:hidden">
        <div className="flex bg-resort-sand/30 rounded-lg p-1.5 gap-1 shadow-sm">
          {(["form", "preview"] as const).map((tab) => (
            <button key={tab} onClick={(e) => { e.preventDefault(); setMobileTab(tab); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${mobileTab === tab ? "bg-white shadow-sm text-resort-terracotta" : "text-resort-cocoa/60 hover:text-resort-cocoa/80"}`}>
              {tab === "form" ? "Edit Details" : "View Preview"}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className={`w-full lg:w-1/2 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto bg-resort-white rounded-lg p-6 shadow-sm border border-resort-cocoa/10 print:hidden lg:pr-4 ${mobileTab === "form" ? "block" : "hidden lg:block"}`}>
        <div className="border-b border-resort-cocoa/10 pb-4 mb-6 sticky top-0 bg-resort-white z-10">
          <h2 className="text-xl font-serif text-resort-cocoa">Payment Poster Settings</h2>
          <p className="text-sm text-resort-cocoa/60 mt-1">Update payment account details for {branding.name}.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {saveStatus.message && (
            <div className={`p-3.5 text-sm rounded-lg ${saveStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
              {saveStatus.message}
            </div>
          )}

          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> GCash Accounts
            </h3>
            <div className="space-y-2">
              {form.gcashEntries.length === 0 && <p className="text-xs text-resort-cocoa/50 py-2">No GCash accounts added yet.</p>}
              {form.gcashEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={entry.name} onChange={(e) => updateGcash(i, "name", e.target.value)} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border text-sm" placeholder="Account Name" />
                  <input type="text" value={entry.number} onChange={(e) => updateGcash(i, "number", e.target.value)} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border text-sm font-mono" placeholder="09XX XXX XXXX" />
                  <button type="button" onClick={() => removeGcash(i)} className="p-1.5 text-resort-cocoa/40 hover:text-red-600 rounded transition cursor-pointer shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={addGcash} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-resort-sand/30 text-resort-cocoa hover:bg-resort-sand/60 rounded transition cursor-pointer mt-2">
                <Plus className="w-3.5 h-3.5" /> Add GCash
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Bank Transfer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="text-sm text-resort-cocoa/70">Bank Name</span>
                <input type="text" name="bankName" value={form.bankName} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" placeholder="BPI, BDO, UnionBank..." />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Account Name</span>
                <input type="text" name="bpiAccountName" value={form.bpiAccountName} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" placeholder="Account Holder Name" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Account Number</span>
                <input type="text" name="bpiAccountNumber" value={form.bpiAccountNumber} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border font-mono" placeholder="1234 5678 9012" />
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider">Poster Notes</h3>
            <div className="space-y-2">
              {form.notes.length === 0 && <p className="text-xs text-resort-cocoa/50 py-2">No notes added yet.</p>}
              {form.notes.map((note, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={note} onChange={(e) => updateNote(i, e.target.value)} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border text-sm" placeholder="e.g. Full payment required upon reservation." />
                  <button type="button" onClick={() => removeNote(i)} className="p-1.5 text-resort-cocoa/40 hover:text-red-600 rounded transition cursor-pointer shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={addNote} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-resort-sand/30 text-resort-cocoa hover:bg-resort-sand/60 rounded transition cursor-pointer mt-2">
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-resort-cocoa/10">
            <button type="submit" disabled={saveStatus.loading} className="w-full py-2.5 bg-resort-cocoa text-white font-medium rounded text-sm hover:bg-resort-cocoa/90 transition disabled:opacity-50 cursor-pointer">
              {saveStatus.loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className={`w-full lg:w-1/2 flex-col items-center print:block lg:sticky lg:top-0 ${mobileTab === "preview" ? "flex" : "hidden lg:flex"}`}>
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden transition-all duration-200" style={{ height: `${POSTER_H * scale}px` }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: `${POSTER_W}px`, height: `${POSTER_H}px`, flexShrink: 0 }}>

            {/* ═══ POSTER 600x600 ═══ */}
            <div ref={previewRef} style={{ fontFamily: "Arial, sans-serif", width: `${POSTER_W}px`, height: `${POSTER_H}px`, background: bg, color: dark, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

              {/* Dot grid background */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} viewBox="0 0 600 600">
                {Array.from({ length: 9 }).flatMap((_, row) =>
                  Array.from({ length: 14 }).map((_, col) => (
                    <circle key={`${row}-${col}`} cx={col * 44 + 10} cy={row * 44 + 10} r="1.3" fill={dark} opacity="0.045" />
                  ))
                )}
                <path d="M0 0 L160 0 C90 18 18 90 0 160 Z" fill={dark} opacity="0.03" />
                <path d="M0 0 L110 0 C60 12 12 60 0 110 Z" fill={accent} opacity="0.055" />
                <path d="M600 600 L440 600 C510 582 582 510 600 440 Z" fill={dark} opacity="0.025" />
                <path d="M600 600 L490 600 C545 588 588 545 600 490 Z" fill={accent} opacity="0.045" />
              </svg>

              {/* ── HEADER ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 22px 13px", borderBottom: `1.5px solid ${dark}18`, zIndex: 1, position: "relative" }}>
                {branding.slug === "piero" ? (
                  <div style={{ width: "72px", flexShrink: 0 }}>
                    <Logo className="w-full h-auto" />
                  </div>
                ) : (
                  <div style={{ width: "66px", height: "66px", flexShrink: 0, position: "relative", borderRadius: "10px", overflow: "hidden", border: `1.5px solid ${dark}20` }}>
                    <Image src={branding.logo} alt={branding.name} fill style={{ objectFit: "contain" }} sizes="66px" unoptimized />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", color: dark, lineHeight: 1.1, marginBottom: "4px" }}>
                    {branding.name}
                  </div>
                  {branding.address && <div style={{ fontSize: "10px", color: muted, fontWeight: 500, marginBottom: "2px" }}>{branding.address}</div>}
                  <div style={{ fontSize: "10px", color: muted, opacity: 0.82 }}>
                    {branding.phone && `Contact No.: ${branding.phone}`}
                    {branding.phone && branding.email && "  |  "}
                    {branding.email && `Email: ${branding.email}`}
                  </div>
                </div>
                <div style={{ width: "3px", height: "52px", borderRadius: "2px", background: `linear-gradient(to bottom, ${accent}, ${accent}33)`, flexShrink: 0 }} />
              </div>

              {/* ── TITLE ── */}
              <div style={{ textAlign: "center", padding: "9px 24px 11px", background: `${dark}06`, borderBottom: `1px solid ${dark}10`, zIndex: 1, position: "relative" }}>
                <div style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase", color: dark }}>Mode of Payment</div>
                <div style={{ width: "40px", height: "2.5px", background: accent, margin: "5px auto 0", borderRadius: "2px" }} />
              </div>

              {/* ── BODY ── */}
              {/* The outer body is position:relative overflow:hidden — clips the phone bleed */}
              <div style={{ display: "flex", flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>

                {/* 
                  PHONE — positioned absolutely so we control exactly how much bleeds off left.
                  Left edge of phone sits at x=-48 (48px off-screen left = dramatic slide-in effect).
                  Phone itself is 140px wide in SVG space, so ~66px of visible phone shows.
                */}
                <div style={{ position: "absolute", left: "-48px", top: 0, bottom: 0, width: "310px", display: "flex", alignItems: "center" }}>
                  <svg
                    width="310"
                    height="410"
                    viewBox="0 0 310 410"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <linearGradient id={`pg${slug}`} x1="0" y1="0" x2="0.4" y2="1">
                        <stop offset="0%" stopColor={dark} />
                        <stop offset="100%" stopColor={dark} stopOpacity="0.75" />
                      </linearGradient>
                      <linearGradient id={`cg${slug}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity="0.98" />
                        <stop offset="100%" stopColor={dark} stopOpacity="0.9" />
                      </linearGradient>
                      <filter id={`sh${slug}`} x="-30%" y="-15%" width="160%" height="140%">
                        <feDropShadow dx="8" dy="14" stdDeviation="14" floodColor={dark} floodOpacity="0.22" />
                      </filter>
                    </defs>

                    {/* ── PHONE — starts at x=5, takes up x=5..155 (150px wide, 360px tall) ── */}
                    <rect x="5" y="15" width="150" height="360" rx="26" ry="26" fill={`url(#pg${slug})`} filter={`url(#sh${slug})`} />
                    {/* Shine half */}
                    <rect x="5" y="15" width="75"  height="360" rx="26" ry="26" fill="white" opacity="0.04" />
                    {/* Screen */}
                    <rect x="18" y="38" width="124" height="292" rx="10" ry="10" fill="#eaf1f8" />
                    {/* Notch */}
                    <rect x="56" y="22" width="48" height="11" rx="5.5" ry="5.5" fill={dark} opacity="0.55" />
                    {/* Home bar */}
                    <rect x="58" y="370" width="44" height="6" rx="3" ry="3" fill="white" opacity="0.2" />

                    {/* ── Card on screen ── */}
                    <g transform="translate(22,50) rotate(-6)">
                      <rect width="112" height="72" rx="11" ry="11" fill={`url(#cg${slug})`} />
                      <rect width="56"  height="72" rx="11" ry="11" fill="white" opacity="0.05" />
                      {/* Chip */}
                      <rect x="11" y="16" width="22" height="17" rx="3.5" ry="3.5" fill={accent} />
                      <line x1="16" y1="16" x2="16" y2="33" stroke={dark} strokeWidth="1" opacity="0.35" />
                      <line x1="11" y1="24.5" x2="33" y2="24.5" stroke={dark} strokeWidth="1" opacity="0.35" />
                      {/* Number dots */}
                      <g fill="white" opacity="0.5">
                        <circle cx="11" cy="55" r="2.5"/><circle cx="19" cy="55" r="2.5"/><circle cx="27" cy="55" r="2.5"/>
                        <circle cx="39" cy="55" r="2.5"/><circle cx="47" cy="55" r="2.5"/>
                        <circle cx="59" cy="55" r="2.5"/><circle cx="67" cy="55" r="2.5"/>
                        <circle cx="79" cy="55" r="2.5"/><circle cx="87" cy="55" r="2.5"/>
                      </g>
                      {/* NFC */}
                      <path d="M90 12 Q101 21 101 33 M93 16 Q101 24 101 33 M97 21 Q101 26 101 33" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
                    </g>

                    {/* ── Success button ── */}
                    <rect x="28" y="236" width="104" height="28" rx="14" ry="14" fill={dark} opacity="0.78" />
                    <path d="M 52 250 L 63 261 L 84 239" stroke={accent} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                    {/* ── Floating coin (overlaps right edge of phone) — peso as paths ── */}
                    <circle cx="195" cy="260" r="40" fill={`url(#cg${slug})`} filter={`url(#sh${slug})`} />
                    <circle cx="195" cy="260" r="34" fill="none" stroke="white" strokeWidth="1.8" opacity="0.2" />
                    {/* Peso P vertical stroke */}
                    <line   x1="191" y1="242" x2="191" y2="280" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    {/* Peso P bowl */}
                    <path   d="M191 242 Q206 242 210 251 Q214 260 207 266 Q201 270 191 269" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Peso horizontal bars */}
                    <line   x1="183" y1="254" x2="210" y2="254" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <line   x1="183" y1="262" x2="210" y2="262" stroke="white" strokeWidth="3" strokeLinecap="round" />

                    {/* ── GCash badge (overlapping phone's right edge) ── */}
                    <rect x="108" y="188" width="76" height="30" rx="15" ry="15" fill={accent} />
                    <text x="146" y="208" textAnchor="middle" fill="white" fontSize="12.5" fontWeight="800" letterSpacing="0.5" fontFamily="Arial, sans-serif">GCash</text>

                    {/* Accent dots */}
                    <rect x="230" y="152" width="11" height="11" transform="rotate(45 235.5 157.5)" fill={accent} opacity="0.45" />
                    <rect x="236" y="315" width="9"  height="9"  transform="rotate(45 240.5 319.5)" fill={dark}  opacity="0.1" />
                    <circle cx="255" cy="192" r="5"   fill={accent} opacity="0.45" />
                    <circle cx="264" cy="178" r="3"   fill={dark}  opacity="0.1" />
                    <circle cx="272" cy="350" r="4"   fill={accent} opacity="0.25" />

                    {/* Flow curves */}
                    <path d="M 5 390 Q 100 360 190 385 Q 250 400 305 375" fill="none" stroke={accent} strokeWidth="1.8" opacity="0.2" />
                    <path d="M 5 400 Q 100 372 190 397 Q 250 410 305 385" fill="none" stroke={dark}   strokeWidth="1"   opacity="0.06" />
                  </svg>
                </div>

                {/* ── Payment Details (right column) ── */}
                <div style={{ marginLeft: "272px", flex: 1, display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center", paddingRight: "26px" }}>

                  {form.gcashEntries.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 3px 8px ${dark}30` }}>
                          <span style={{ color: accent, fontSize: "15px", fontWeight: 900 }}>G</span>
                        </div>
                        <span style={{ fontSize: "22px", fontWeight: 800, color: dark, letterSpacing: "-0.01em" }}>Gcash</span>
                      </div>
                      <div style={{ paddingLeft: "10px", borderLeft: `3px solid ${accent}`, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {form.gcashEntries.map((entry, i) => (
                          <div key={i} style={{ fontSize: "12px", color: dark, lineHeight: 1.5 }}>
                            <span style={{ fontFamily: "Courier New, monospace", letterSpacing: "0.04em" }}>{entry.number || "09XX XXX XXXX"}</span>
                            {entry.name && <span style={{ fontWeight: 700 }}> - {entry.name}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(form.bpiAccountName || form.bpiAccountNumber) && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 3px 8px ${dark}30` }}>
                          <span style={{ color: accent, fontSize: "12px", fontWeight: 900 }}>B</span>
                        </div>
                        <span style={{ fontSize: "22px", fontWeight: 800, color: dark, letterSpacing: "-0.01em" }}>{form.bankName || "BPI"}</span>
                      </div>
                      <div style={{ paddingLeft: "10px", borderLeft: `3px solid ${accent}`, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {form.bpiAccountName && <div style={{ fontSize: "12px", color: dark }}>{form.bpiAccountName}</div>}
                        {form.bpiAccountNumber && (
                          <div style={{ fontSize: "12px", color: dark }}>
                            Account No. <span style={{ fontFamily: "Courier New, monospace", fontWeight: 700, letterSpacing: "0.04em" }}>{form.bpiAccountNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.gcashEntries.length === 0 && !form.bpiAccountName && !form.bpiAccountNumber && (
                    <div style={{ color: `${dark}40`, fontSize: "11px", fontStyle: "italic" }}>Fill in payment details on the left.</div>
                  )}
                </div>
              </div>

              {/* ── NOTES — centred ── */}
              {form.notes.length > 0 && (
                <div style={{ padding: "9px 32px 13px", borderTop: `1px solid ${dark}12`, zIndex: 1, position: "relative", textAlign: "center" }}>
                  <div style={{ width: "30px", height: "2px", background: accent, margin: "0 auto 6px", borderRadius: "1px", opacity: 0.55 }} />
                  {form.notes.map((note, i) => (
                    <div key={i} style={{ fontSize: "9.5px", color: "#c0392b", lineHeight: 1.7, fontStyle: "italic" }}>
                      *{note}
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom fintech bar */}
              <div style={{ height: "4px", background: `linear-gradient(to right, ${dark}18, ${accent}99, ${dark}18)`, zIndex: 1, position: "relative" }} />

            </div>
            {/* ═══ END POSTER ═══ */}
          </div>
        </div>

        <div className="mt-6 flex justify-center w-full max-w-[520px] print:hidden">
          <button onClick={handleDownloadPng} disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-resort-olive text-resort-white rounded shadow hover:bg-resort-olive/90 transition disabled:opacity-50 font-bold">
            <Download className="w-5 h-5" />
            {isExporting ? "Exporting..." : "Download Poster as PNG"}
          </button>
        </div>
      </div>

    </div>
  );
}
