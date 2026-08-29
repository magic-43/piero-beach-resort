"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Download, CheckCircle2, RefreshCw, RotateCcw, MapPin, Phone, Mail, Info, ShieldCheck, Building2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { updatePaymentPosterSettings } from "@/lib/admin/actions";

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

type StatusState = {
  loading: boolean;
  message: string;
  type: "success" | "error" | "";
};

export default function PaymentPosterClient({
  initialSettings,
  branding,
}: {
  initialSettings: PaymentPosterSettings;
  branding: PropertyBranding;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [scale, setScale] = useState(1);
  const [posterHeight, setPosterHeight] = useState(650);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<StatusState>({ loading: false, message: "", type: "" });

  const initialForm: FormState = {
    bankName: initialSettings.bank_name || "BPI",
    bpiAccountName: initialSettings.bpi_account_name || "",
    bpiAccountNumber: initialSettings.bpi_account_number || "",
    gcashEntries: initialSettings.gcash_entries || [],
    notes: initialSettings.notes || [],
  };

  const [form, setForm] = useState<FormState>(initialForm);

  // ResizeObserver to scale down the 600px canvas to fit on mobile/smaller screens seamlessly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        if (availableWidth > 0) {
          // Canvas is fixed at 600px width with 24px safe padding margin
          const targetScale = Math.min((availableWidth - 24) / 600, 1.0);
          setScale(Math.max(targetScale, 0.35));
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Measure dynamic height of poster to collapse unused container space
  useEffect(() => {
    const poster = previewRef.current;
    if (!poster) return;

    const heightObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPosterHeight(entry.contentRect.height);
      }
    });

    heightObserver.observe(poster);
    return () => heightObserver.disconnect();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addGcashEntry = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: [...prev.gcashEntries, { number: "", name: "" }],
    }));
  }, []);

  const removeGcashEntry = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: prev.gcashEntries.filter((_, i) => i !== index),
    }));
  }, []);

  const updateGcashEntry = useCallback((index: number, field: keyof GcashEntry, value: string) => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: prev.gcashEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  }, []);

  const addNote = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      notes: [...prev.notes, ""],
    }));
  }, []);

  const removeNote = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  }, []);

  const updateNote = useCallback((index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? value : note)),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setForm(initialForm);
    setSaveStatus({ loading: false, message: "", type: "" });
  }, [initialForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveStatus({ loading: true, message: "", type: "" });

      try {
        const result = await updatePaymentPosterSettings({
          hotelSlug: branding.slug,
          bankName: form.bankName,
          bpiAccountName: form.bpiAccountName,
          bpiAccountNumber: form.bpiAccountNumber,
          gcashEntries: form.gcashEntries,
          notes: form.notes,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        setSaveStatus({ loading: false, message: "Poster settings saved successfully!", type: "success" });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setSaveStatus({ loading: false, message: err.message, type: "error" });
        } else {
          setSaveStatus({ loading: false, message: "Failed to save settings.", type: "error" });
        }
      }
    },
    [branding.slug, form]
  );

  const handleDownloadPng = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const bgColor = branding.slug === "cielo" ? "#14331e" : "#132c4a";
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution output
        backgroundColor: bgColor,
      });

      const link = document.createElement("a");
      link.download = `Payment_Poster_${branding.name.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [branding.name, branding.slug]);

  const isCielo = branding.slug === "cielo";
  const themeBg = isCielo ? "bg-[#14331e]" : "bg-[#132c4a]";
  const themeAccent = isCielo ? "text-[#d1a877]" : "text-[#c4a47c]";
  const themeHeader = isCielo ? "text-[#CDE3D5]" : "text-[#B9CEC3]";

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start relative lg:max-h-[calc(100vh-8rem)]">
      {/* Mobile Tabs Toggle */}
      <div className="w-full sticky top-0 z-50 bg-resort-offwhite/95 backdrop-blur-sm pt-2 pb-3 mb-2 lg:hidden print:hidden">
        <div className="flex bg-resort-sand/30 rounded-lg p-1.5 gap-1 shadow-sm">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMobileTab("form");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
              mobileTab === "form" ? "bg-white shadow-sm text-resort-cocoa" : "text-resort-cocoa/60 hover:text-resort-cocoa"
            }`}
          >
            Edit Accounts &amp; Notes
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMobileTab("preview");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
              mobileTab === "preview" ? "bg-white shadow-sm text-resort-cocoa" : "text-resort-cocoa/60 hover:text-resort-cocoa"
            }`}
          >
            View Poster Preview
          </button>
        </div>
      </div>

      {/* ─────────────────────── LEFT: FORM SETTINGS COLUMN ─────────────────────── */}
      <div
        className={`w-full lg:w-1/2 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto bg-resort-white rounded-xl p-6 sm:p-8 shadow-sm border border-resort-cocoa/10 print:hidden lg:pr-6 ${
          mobileTab === "form" ? "block" : "hidden lg:block"
        }`}
      >
        <div className="border-b border-resort-cocoa/10 pb-4 mb-6 sticky top-0 bg-resort-white z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold text-resort-cocoa">
              Poster Payment Accounts
            </h2>
            <p className="text-xs text-resort-cocoa/70 mt-1">
              Configure official GCash and Bank accounts displayed on the download poster.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-resort-cocoa/20 text-resort-cocoa rounded-lg text-xs hover:bg-resort-sand/20 transition font-medium shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Auto-Connected Site Info Banner */}
        <div className="mb-6 p-4 rounded-xl bg-resort-offwhite border border-resort-cocoa/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-resort-cocoa">
            <Info className="w-4 h-4 text-resort-olive shrink-0" />
            <span>Synced with {branding.name} Settings</span>
          </div>
          <p className="text-xs text-resort-cocoa/70 leading-relaxed">
            Resort Name, Address, Contact Phone, and Email are automatically pulled from your site settings.
          </p>
          <div className="pt-2 border-t border-resort-cocoa/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-resort-cocoa/80">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-resort-cocoa/50 shrink-0" />
              <span className="truncate">{branding.address}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="w-3 h-3 text-resort-cocoa/50 shrink-0" />
              <span>{branding.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:col-span-2 truncate">
              <Mail className="w-3 h-3 text-resort-cocoa/50 shrink-0" />
              <span>{branding.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveStatus.message && (
            <div
              className={`p-4 text-sm rounded-xl flex items-center gap-2 ${
                saveStatus.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {saveStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" /> : null}
              <span>{saveStatus.message}</span>
            </div>
          )}

          {/* GCash Accounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-resort-cocoa">
                  GCash Accounts
                </h3>
              </div>
              <button
                type="button"
                onClick={addGcashEntry}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-resort-sand/30 text-resort-cocoa rounded-lg text-xs font-bold hover:bg-resort-sand/50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add GCash
              </button>
            </div>

            {form.gcashEntries.length === 0 ? (
              <p className="text-xs text-resort-cocoa/50 text-center py-4 bg-resort-offwhite rounded-xl border border-dashed border-resort-cocoa/20">
                No GCash accounts added yet. Click &quot;Add GCash&quot; above.
              </p>
            ) : (
              <div className="space-y-3">
                {form.gcashEntries.map((entry, index) => (
                  <div key={index} className="flex items-end gap-3 p-3.5 bg-resort-offwhite rounded-xl border border-resort-cocoa/10">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-resort-cocoa/70 mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={entry.name}
                          onChange={(e) => updateGcashEntry(index, "name", e.target.value)}
                          className="w-full p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-resort-olive"
                          placeholder="e.g. Maria S."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-resort-cocoa/70 mb-1">
                          GCash Number
                        </label>
                        <input
                          type="text"
                          value={entry.number}
                          onChange={(e) => updateGcashEntry(index, "number", e.target.value)}
                          className="w-full p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-resort-olive"
                          placeholder="09XX XXX XXXX"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGcashEntry(index)}
                      className="p-2.5 text-resort-cocoa/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove GCash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bank Transfer Details */}
          <div className="space-y-4 pt-4 border-t border-resort-cocoa/10">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-resort-olive" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-resort-cocoa">
                Bank Transfer Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                  placeholder="e.g. BPI, BDO, UnionBank"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  name="bpiAccountName"
                  value={form.bpiAccountName}
                  onChange={handleChange}
                  className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                  placeholder="Account Holder Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bpiAccountNumber"
                  value={form.bpiAccountNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-mono focus:ring-2 focus:ring-resort-olive focus:outline-none"
                  placeholder="1234 5678 9012"
                />
              </div>
            </div>
          </div>

          {/* Important Notices & Guidelines */}
          <div className="space-y-4 pt-4 border-t border-resort-cocoa/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-resort-olive" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-resort-cocoa">
                  Payment Notices &amp; Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={addNote}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-resort-sand/30 text-resort-cocoa rounded-lg text-xs font-bold hover:bg-resort-sand/50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>

            {form.notes.length === 0 ? (
              <p className="text-xs text-resort-cocoa/50 text-center py-4 bg-resort-offwhite rounded-xl border border-dashed border-resort-cocoa/20">
                No notes added. Click &quot;Add Note&quot; above.
              </p>
            ) : (
              <div className="space-y-3">
                {form.notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-resort-offwhite rounded-xl border border-resort-cocoa/10">
                    <textarea
                      value={note}
                      onChange={(e) => updateNote(index, e.target.value)}
                      className="flex-1 p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-xs font-medium focus:outline-none resize-none"
                      placeholder="Enter guest instructions or payment notices..."
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="p-2.5 text-resort-cocoa/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-resort-cocoa/10">
            <button
              type="submit"
              disabled={saveStatus.loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-resort-olive text-resort-white font-bold rounded-xl shadow-md hover:bg-resort-cocoa transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              {saveStatus.loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Poster Accounts...</span>
                </>
              ) : (
                <span>Save Poster Accounts</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ─────────────────────── RIGHT: PREVIEW COLUMN (MATCHING MANUAL CONFIRMATION) ─────────────────────── */}
      <div
        className={`w-full lg:w-1/2 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto flex flex-col items-center bg-resort-white rounded-xl p-6 sm:p-8 shadow-sm border border-resort-cocoa/10 print:border-none print:p-0 ${
          mobileTab === "preview" ? "block" : "hidden lg:block"
        }`}
      >
        {/* Action Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-resort-cocoa/10 mb-6 print:hidden">
          <div>
            <h2 className="text-xl font-serif font-bold text-resort-cocoa">Live Poster Preview</h2>
            <span className="text-xs text-resort-cocoa/60">
              Fixed 600px canvas &middot; 2x Ultra-Crisp PNG Download
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#c4a47c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-[#b0936e] transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Exporting..." : "Download PNG"}</span>
          </button>
        </div>

        {/* Scaling Container Wrapper (Identical to Manual Confirmation) */}
        <div
          ref={containerRef}
          className="w-full flex justify-center overflow-hidden transition-all duration-200"
          style={{ height: `${posterHeight * scale}px` }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "600px", height: "fit-content" }}>
            {/* Printable Canvas Area (Always exactly 600px wide) */}
            <div
              id="printable-payment-poster"
              ref={previewRef}
              className={`${themeBg} text-white w-[600px] min-h-[620px] shadow-2xl p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden`}
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {/* Header */}
              <div>
                <div className="text-center mb-6">
                  {branding.logo && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden p-1 flex items-center justify-center">
                        <Image
                          src={branding.logo}
                          alt={branding.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  <h1 className={`font-serif text-3xl font-bold ${themeHeader} tracking-wider uppercase`}>
                    {branding.name}
                  </h1>

                  {branding.address && (
                    <p className="text-xs text-white/80 mt-1.5">{branding.address}</p>
                  )}

                  {(branding.phone || branding.email) && (
                    <p className="text-xs text-white/70 mt-1">
                      {branding.phone}
                      {branding.phone && branding.email && " \u00b7 "}
                      {branding.email}
                    </p>
                  )}
                </div>

                {/* Section Title */}
                <div className="text-center my-6 py-2 border-y border-white/15">
                  <h2 className={`text-xs font-bold tracking-[0.25em] ${themeAccent} uppercase`}>
                    OFFICIAL PAYMENT DETAILS
                  </h2>
                </div>

                {/* GCash Section */}
                {form.gcashEntries.length > 0 && (
                  <div className="mb-5 space-y-2">
                    <div className="text-xs font-bold text-white/90 uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>GCash Transfer</span>
                      </div>
                      <span className="text-[10px] text-amber-200">Verified Account</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {form.gcashEntries.map((entry, index) => (
                        <div key={index} className="bg-white/10 p-3.5 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{entry.name || "Account Name"}</p>
                            <p className={`text-base font-mono font-bold ${themeAccent}`}>{entry.number || "09XX XXX XXXX"}</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-blue-500/30 text-blue-200">
                            GCash
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bank Transfer Section */}
                {(form.bpiAccountName || form.bpiAccountNumber) && (
                  <div className="mb-5 space-y-2">
                    <div className="text-xs font-bold text-white/90 uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-amber-200" />
                        <span>Online Bank Transfer ({form.bankName || "Bank"})</span>
                      </div>
                      <span className="text-[10px] text-amber-200">Direct Deposit</span>
                    </div>

                    <div className="bg-white/10 p-3.5 rounded-xl space-y-1">
                      <p className="text-[11px] text-white/70">Account Name:</p>
                      <p className="text-sm font-bold text-white">{form.bpiAccountName || "Account Holder Name"}</p>
                      <p className="text-[11px] text-white/70 mt-2">Account Number:</p>
                      <p className={`text-base font-mono font-bold ${themeAccent}`}>{form.bpiAccountNumber || "0000 0000 0000"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Notes Section */}
              {form.notes.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/15 space-y-1.5">
                  {form.notes.map((note, index) => (
                    <p key={index} className="text-[11px] text-amber-200/90 text-center leading-relaxed">
                      &bull; {note}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

