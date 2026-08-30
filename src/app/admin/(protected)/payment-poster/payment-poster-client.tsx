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

function formatGcashNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function formatAccountNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

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
    bpiAccountNumber: formatAccountNumber(initialSettings.bpi_account_number || ""),
    gcashEntries:     (initialSettings.gcash_entries || []).map((e) => ({
      ...e,
      number: formatGcashNumber(e.number || ""),
    })),
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
    if (name === "bpiAccountNumber") {
      setForm((p) => ({ ...p, bpiAccountNumber: formatAccountNumber(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const addGcash    = () => setForm((p) => ({ ...p, gcashEntries: [...p.gcashEntries, { number: "", name: "" }] }));
  const removeGcash = (i: number) => setForm((p) => ({ ...p, gcashEntries: p.gcashEntries.filter((_, idx) => idx !== i) }));
  const updateGcash = (i: number, field: keyof GcashEntry, val: string) =>
    setForm((p) => ({
      ...p,
      gcashEntries: p.gcashEntries.map((e, idx) =>
        idx === i ? { ...e, [field]: field === "number" ? formatGcashNumber(val) : val } : e
      ),
    }));

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
  const dark   = isCielo ? "#14331e" : "#302720"; // Piero website cocoa brown
  const accent = isCielo ? "#c8922e" : "#B96D4C"; // Piero website terracotta
  const bg     = isCielo ? "#F5F1E6" : "#F8F4EE"; // Piero website offwhite
  const muted  = isCielo ? "#3a6b4a" : "#69745D"; // Piero website olive
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
        cacheBust: true,
      });

      const filename = `Payment_Poster_${branding.name.replace(/\s+/g, "_")}.png`;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });

      // Native mobile share sheet (iOS Save to Photos / Camera Roll, Android Save to Device, WhatsApp, etc.)
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${branding.name} - Official Payment Details`,
          });
          return;
        } catch (shareErr: unknown) {
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            return; // User cancelled share sheet
          }
        }
      }

      // Standard download fallback (Desktop & browsers without file sharing)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
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

              {/* Art Deco Gold Corner Frame */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }} viewBox="0 0 600 600">
                {/* Outer frame */}
                <rect x="18" y="18" width="564" height="564" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.8" />
                {/* Corner diagonals */}
                {/* Top-Left */}
                <line x1="12" y1="36" x2="36" y2="12" stroke={accent} strokeWidth="1.2" />
                <line x1="18" y1="44" x2="44" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                {/* Top-Right */}
                <line x1="588" y1="36" x2="564" y2="12" stroke={accent} strokeWidth="1.2" />
                <line x1="582" y1="44" x2="556" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                {/* Bottom-Left */}
                <line x1="12" y1="564" x2="36" y2="588" stroke={accent} strokeWidth="1.2" />
                <line x1="18" y1="556" x2="44" y2="582" stroke={accent} strokeWidth="0.8" opacity="0.6" />
                {/* Bottom-Right */}
                <line x1="588" y1="564" x2="564" y2="588" stroke={accent} strokeWidth="1.2" />
                <line x1="582" y1="556" x2="556" y2="582" stroke={accent} strokeWidth="0.8" opacity="0.6" />
              </svg>

              {/* ── CENTERED LUXURY HEADER ── */}
              <div style={{ textAlign: "center", paddingTop: "26px", paddingBottom: "6px", paddingLeft: "32px", paddingRight: "32px", zIndex: 2, position: "relative" }}>
                {/* Centered Logo */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "8px" }}>
                  {branding.slug === "piero" ? (
                    <div style={{ width: "74px", marginTop: "8px", marginBottom: "4px" }}>
                      <Logo className="w-full h-auto" />
                    </div>
                  ) : (
                    <div style={{ width: "56px", height: "56px", position: "relative" }}>
                      <Image src={branding.logo} alt={branding.name} fill style={{ objectFit: "contain" }} sizes="56px" unoptimized />
                    </div>
                  )}
                </div>

                {/* Property Name */}
                <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: dark, fontFamily: "Georgia, serif", lineHeight: 1.2, marginBottom: "3px" }}>
                  {branding.name}
                </div>

                {/* Subtitle / Tagline */}
                <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: accent, fontFamily: "Arial, sans-serif", marginBottom: "5px" }}>
                  {branding.slug === "cielo" ? "HOTEL & RESTAURANT · TANAY, RIZAL" : "BEACH RESORT · CABANGAN, ZAMBALES"}
                </div>

                {/* Address & Contact Details */}
                <div style={{ fontSize: "9.5px", color: muted, opacity: 0.85, fontFamily: "Arial, sans-serif", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
                  {branding.address && <span>{branding.address}</span>}
                  {branding.phone && <span>· {branding.phone}</span>}
                  {branding.email && <span>· {branding.email}</span>}
                </div>

                {/* ── OFFICIAL PAYMENT DETAILS BANNER ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "12px", marginBottom: "4px" }}>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${accent})`, opacity: 0.6 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: accent }}>
                    <span style={{ fontSize: "9px" }}>❖</span>
                    <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: dark, fontFamily: "Arial, sans-serif" }}>
                      OFFICIAL PAYMENT DETAILS
                    </span>
                    <span style={{ fontSize: "9px" }}>❖</span>
                  </div>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${accent})`, opacity: 0.6 }} />
                </div>
              </div>

              {/* ── MAIN BODY: CENTERED PAYMENT SECTIONS & NOTES ── */}
              <div style={{ padding: "14px 40px 4px", flex: 1, display: "flex", flexDirection: "column", zIndex: 2, position: "relative", gap: "18px", textAlign: "center" }}>
                
                {/* 1. GCash Section Header & Details */}
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: dark, fontFamily: "Georgia, serif", marginBottom: "8px", letterSpacing: "0.01em" }}>
                    Gcash
                  </div>
                  {form.gcashEntries.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {form.gcashEntries.map((entry, i) => (
                        <div key={i} style={{ fontSize: "15px", color: dark, lineHeight: 1.45, fontFamily: "Georgia, serif" }}>
                          <span style={{ fontFamily: "Courier New, monospace", fontWeight: 700, letterSpacing: "0.04em", fontSize: "15px" }}>
                            {formatGcashNumber(entry.number) || "09XX XXX XXXX"}
                          </span>
                          {entry.name && <span style={{ fontWeight: 600 }}> – {entry.name}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: `${dark}50`, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                      No GCash accounts added yet.
                    </div>
                  )}
                </div>

                {/* Subtle Diamond Divider between GCash & Bank */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "160px", margin: "0 auto", opacity: 0.4 }}>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${accent})` }} />
                  <span style={{ fontSize: "7px", color: accent }}>❖</span>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${accent})` }} />
                </div>

                {/* 2. Bank Transfer Section Header & Details */}
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: dark, fontFamily: "Georgia, serif", marginBottom: "8px", letterSpacing: "0.01em" }}>
                    {form.bankName ? form.bankName : "Bank Transfer"}
                  </div>
                  {form.bpiAccountName || form.bpiAccountNumber ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "15px", color: dark, fontFamily: "Georgia, serif" }}>
                      {form.bpiAccountName && (
                        <div style={{ fontWeight: 600 }}>{form.bpiAccountName}</div>
                      )}
                      {form.bpiAccountNumber && (
                        <div>
                          Account No.{" "}
                          <span style={{ fontFamily: "Courier New, monospace", fontWeight: 700, letterSpacing: "0.04em" }}>
                            {formatAccountNumber(form.bpiAccountNumber)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: `${dark}50`, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                      No bank transfer details added yet.
                    </div>
                  )}
                </div>

                {/* 3. Reservation Notes (Anchored above bottom landscape) */}
                {form.notes.length > 0 && (
                  <div style={{ textAlign: "center", padding: "4px 16px 2px", marginTop: "auto" }}>
                    {form.notes.map((note, i) => (
                      <div key={i} style={{ fontSize: "11px", color: "#b91c1c", lineHeight: 1.55, fontStyle: "italic", fontFamily: "Georgia, serif", fontWeight: 600, marginBottom: "3px" }}>
                        *{note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── MONOCHROME LANDSCAPE AT BOTTOM (Mountain for Cielo / Beach for Piero) ── */}
              <div style={{ position: "relative", width: "100%", marginTop: "auto", zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
                {isCielo ? (
                  /* Cielo Mountain View */
                  <svg viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "110px", display: "block" }} preserveAspectRatio="none">
                    {/* Background ridge */}
                    <path d="M0 120 L0 65 Q 90 35 180 58 Q 280 25 370 54 Q 470 20 540 50 Q 580 38 600 58 L600 120 Z" fill={dark} opacity="0.08" />
                    {/* Mid ridge with peak angles */}
                    <path d="M0 120 L0 80 L 80 48 L 160 76 L 240 38 L 320 72 L 410 32 L 490 68 L 560 44 L 600 75 L600 120 Z" fill={dark} opacity="0.14" />
                    {/* Ridge lines */}
                    <path d="M 240 38 L 275 72 M 410 32 L 438 68 M 80 48 L 118 76 M 560 44 L 582 75" stroke={dark} strokeWidth="1.2" opacity="0.22" />
                    {/* Foreground hills */}
                    <path d="M0 120 L0 92 Q 120 74 230 88 Q 350 72 470 90 Q 550 80 600 92 L600 120 Z" fill={dark} opacity="0.22" />
                    {/* Pine trees group left */}
                    <g fill={dark} opacity="0.42">
                      <polygon points="50,78 46,86 54,86" />
                      <polygon points="50,83 44,92 56,92" />
                      <polygon points="50,89 42,99 58,99" />
                      <rect x="49" y="99" width="2" height="5" />
                      <polygon points="68,72 64,81 72,81" />
                      <polygon points="68,78 62,88 74,88" />
                      <polygon points="68,85 60,95 76,95" />
                      <rect x="67" y="95" width="2" height="5" />
                      <polygon points="84,80 81,87 87,87" />
                      <polygon points="84,85 79,93 89,93" />
                      <rect x="83" y="93" width="2" height="4" />
                    </g>
                    {/* Pine trees group right */}
                    <g fill={dark} opacity="0.38">
                      <polygon points="440,74 436,83 444,83" />
                      <polygon points="440,80 434,90 446,90" />
                      <polygon points="440,87 432,97 448,97" />
                      <rect x="439" y="97" width="2" height="5" />
                      <polygon points="458,68 454,77 462,77" />
                      <polygon points="458,74 452,84 464,84" />
                      <polygon points="458,81 450,92 466,92" />
                      <rect x="457" y="92" width="2" height="5" />
                    </g>
                  </svg>
                ) : (
                  /* Piero Beach View */
                  <svg viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "110px", display: "block" }} preserveAspectRatio="none">
                    {/* Horizon */}
                    <rect x="0" y="55" width="600" height="65" fill={dark} opacity="0.06" />
                    <line x1="0" y1="55" x2="600" y2="55" stroke={dark} strokeWidth="1" opacity="0.2" />
                    {/* Distant wave lines */}
                    <path d="M 30 66 Q 70 63 110 66 M 200 66 Q 240 63 280 66 M 380 66 Q 420 63 460 66" stroke={dark} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
                    {/* Wave Layer 1 */}
                    <path d="M0 72 Q 70 65 140 72 T 280 72 T 420 72 T 560 72 L600 72 L600 120 L0 120 Z" fill={dark} opacity="0.10" />
                    {/* Wave Layer 2 */}
                    <path d="M0 88 Q 80 78 170 88 T 350 88 T 520 88 L600 88 L600 120 L0 120 Z" fill={dark} opacity="0.16" />
                    {/* Sandy Coastline */}
                    <path d="M0 120 L0 100 Q 140 92 270 100 Q 420 106 540 98 L600 100 L600 120 Z" fill={dark} opacity="0.25" />
                    {/* Left Palm Trees Silhouette */}
                    <g fill={dark} opacity="0.48">
                      <path d="M 42 118 Q 45 92 58 74 Q 56 92 45 118 Z" />
                      <path d="M 58 74 Q 36 64 26 76 Q 40 72 58 74 Z" />
                      <path d="M 58 74 Q 48 56 44 52 Q 52 60 58 74 Z" />
                      <path d="M 58 74 Q 64 52 72 54 Q 68 62 58 74 Z" />
                      <path d="M 58 74 Q 78 64 86 77 Q 74 72 58 74 Z" />
                      <path d="M 58 74 Q 71 82 78 90 Q 68 84 58 74 Z" />
                      {/* Secondary palm */}
                      <path d="M 26 118 Q 28 98 35 85 Q 33 98 28 118 Z" opacity="0.8" />
                      <path d="M 35 85 Q 20 77 14 87 Q 24 83 35 85 Z" opacity="0.8" />
                      <path d="M 35 85 Q 30 70 26 66 Q 32 74 35 85 Z" opacity="0.8" />
                      <path d="M 35 85 Q 43 70 49 74 Q 43 78 35 85 Z" opacity="0.8" />
                    </g>
                    {/* Right Palm Trees Silhouette */}
                    <g fill={dark} opacity="0.45">
                      <path d="M 560 118 Q 554 94 542 76 Q 548 94 557 118 Z" />
                      <path d="M 542 76 Q 564 66 574 78 Q 560 74 542 76 Z" />
                      <path d="M 542 76 Q 552 58 556 54 Q 548 62 542 76 Z" />
                      <path d="M 542 76 Q 536 54 528 56 Q 532 64 542 76 Z" />
                      <path d="M 542 76 Q 522 66 514 79 Q 526 74 542 76 Z" />
                    </g>
                    {/* Distant Sea Birds */}
                    <g stroke={dark} strokeWidth="1" fill="none" opacity="0.32">
                      <path d="M 280 50 Q 284 46 288 50 Q 292 46 296 50" />
                      <path d="M 312 44 Q 315 41 318 44 Q 321 41 324 44" />
                    </g>
                  </svg>
                )}
              </div>

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
