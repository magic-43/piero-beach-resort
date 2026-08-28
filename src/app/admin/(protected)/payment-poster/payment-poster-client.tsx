"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Download, Upload, CheckCircle2, RefreshCw } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { updatePaymentPosterSettings } from "@/lib/admin/actions";

export type PaymentPosterSettings = {
  id?: number;
  hotel_slug: string;
  hotel_name: string;
  address: string | null;
  contact_number: string | null;
  email: string | null;
  logo_url: string | null;
  gcash_entries: Array<{ number: string; name: string }> | null;
  bpi_account_name: string | null;
  bpi_account_number: string | null;
  notes: string[] | null;
  updated_at?: string;
  created_at?: string;
};

interface GcashEntry {
  number: string;
  name: string;
}

type FormState = {
  hotelSlug: string;
  hotelName: string;
  address: string;
  contactNumber: string;
  email: string;
  logoUrl: string;
  gcashEntries: GcashEntry[];
  bpiAccountName: string;
  bpiAccountNumber: string;
  notes: string[];
};

type StatusState = {
  loading: boolean;
  message: string;
  type: "success" | "error" | "";
};

export default function PaymentPosterClient({
  initialSettings,
  property = "piero",
}: {
  initialSettings: PaymentPosterSettings;
  property?: "piero" | "cielo";
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<StatusState>({ loading: false, message: "", type: "" });

  const initialForm: FormState = {
    hotelSlug: initialSettings.hotel_slug || property,
    hotelName: initialSettings.hotel_name || (property === "cielo" ? "Cielo Alto Place" : "Piero Beach Resort"),
    address: initialSettings.address || (property === "cielo" ? "Km 57 Marcos Highway, Sitio Mayagay, Tanay, Rizal" : "Sitio Aplaya, Cabangan, Zambales"),
    contactNumber: initialSettings.contact_number || (property === "cielo" ? "+63 995 385 5517" : "+63 917 123 4567"),
    email: initialSettings.email || (property === "cielo" ? "cieloaltoplaceph@gmail.com" : "pierobeachresort@gmail.com"),
    logoUrl: initialSettings.logo_url || "",
    gcashEntries: initialSettings.gcash_entries || [],
    bpiAccountName: initialSettings.bpi_account_name || "",
    bpiAccountNumber: initialSettings.bpi_account_number || "",
    notes: initialSettings.notes || [],
  };

  const [form, setForm] = useState<FormState>(initialForm);

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

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/payment-poster/logo-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.publicUrl) {
        setForm((prev) => ({ ...prev, logoUrl: result.publicUrl }));
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Logo upload failed:", error);
      alert("Failed to upload logo. Please try again.");
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveStatus({ loading: true, message: "", type: "" });

      try {
        const result = await updatePaymentPosterSettings({
          hotelSlug: form.hotelSlug,
          hotelName: form.hotelName,
          address: form.address,
          contactNumber: form.contactNumber,
          email: form.email,
          logoUrl: form.logoUrl,
          gcashEntries: form.gcashEntries,
          bpiAccountName: form.bpiAccountName,
          bpiAccountNumber: form.bpiAccountNumber,
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
    [form]
  );

  const handleDownloadPng = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#132c4a",
      });

      const link = document.createElement("a");
      link.download = `Payment_Poster_${form.hotelName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [form.hotelName]);

  const hasUnsavedChanges =
    form.hotelName !== initialSettings.hotel_name ||
    form.address !== initialSettings.address ||
    form.contactNumber !== initialSettings.contact_number ||
    form.email !== initialSettings.email ||
    form.logoUrl !== initialSettings.logo_url ||
    form.bpiAccountName !== initialSettings.bpi_account_name ||
    form.bpiAccountNumber !== initialSettings.bpi_account_number ||
    JSON.stringify(form.gcashEntries) !== JSON.stringify(initialSettings.gcash_entries) ||
    JSON.stringify(form.notes) !== JSON.stringify(initialSettings.notes);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-resort-cocoa/10 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-resort-cocoa">
            Payment Poster Generator
          </h1>
          <p className="text-sm text-resort-cocoa/70 mt-1">
            Generate and export official payment posters for {property === "cielo" ? "Cielo Alto Place" : "Piero Beach Resort"}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c4a47c] text-white font-bold rounded-xl shadow hover:bg-[#b0936e] transition-colors disabled:opacity-50 cursor-pointer text-sm"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Generating PNG..." : "Download Poster (PNG)"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls */}
        <div className="lg:col-span-6 bg-resort-white rounded-2xl p-6 sm:p-8 border border-resort-cocoa/10 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {saveStatus.message && (
              <div
                className={`p-4 text-sm rounded-xl flex items-center gap-2 ${
                  saveStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {saveStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : null}
                <span>{saveStatus.message}</span>
              </div>
            )}

            {/* Header Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-resort-cocoa text-xs uppercase tracking-wider">
                Resort Header & Branding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="hotelName"
                    value={form.hotelName}
                    onChange={handleChange}
                    className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                    placeholder="Resort Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Property Slug
                  </label>
                  <input
                    type="text"
                    name="hotelSlug"
                    value={form.hotelSlug}
                    readOnly
                    className="w-full p-3 bg-resort-offwhite/60 border border-resort-cocoa/10 rounded-xl text-sm font-mono text-resort-cocoa/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                  Resort Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                  placeholder="Sitio Aplaya, Cabangan, Zambales"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                    placeholder="resort@example.com"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1.5">
                  Poster Logo
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-resort-sand/20 border-2 border-dashed border-resort-cocoa/30 rounded-xl cursor-pointer hover:bg-resort-sand/30 transition-colors">
                    <Upload className="w-4 h-4 text-resort-cocoa/70" />
                    <span className="text-sm font-medium text-resort-cocoa/80">
                      {form.logoUrl ? "Replace Logo" : "Upload PNG/JPG Logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {form.logoUrl && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-resort-cocoa/20 bg-[#132c4a] p-1">
                      <Image
                        src={form.logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                        sizes="56px"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-bl flex items-center justify-center text-xs hover:bg-red-700"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GCash Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-resort-cocoa text-xs uppercase tracking-wider">
                  GCash Accounts
                </h3>
                <button
                  type="button"
                  onClick={addGcashEntry}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-resort-sand/30 text-resort-cocoa rounded-lg text-xs font-bold hover:bg-resort-sand/50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add GCash
                </button>
              </div>

              {form.gcashEntries.length === 0 ? (
                <p className="text-xs text-resort-cocoa/50 text-center py-3 bg-resort-offwhite rounded-xl">
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
                            className="w-full p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-sm font-medium focus:outline-none"
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
                            className="w-full p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-sm font-mono focus:outline-none"
                            placeholder="09XX XXX XXXX"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGcashEntry(index)}
                        className="p-2.5 text-resort-cocoa/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bank Transfer Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/10">
              <h3 className="font-bold text-resort-cocoa text-xs uppercase tracking-wider">
                Bank Details (BPI / Major Bank)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Bank Account Name
                  </label>
                  <input
                    type="text"
                    name="bpiAccountName"
                    value={form.bpiAccountName}
                    onChange={handleChange}
                    className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-resort-olive focus:outline-none"
                    placeholder="Piero Beach Resort Operations"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-resort-cocoa/70 mb-1">
                    Bank Account Number
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

            {/* Footer Notes Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-resort-cocoa text-xs uppercase tracking-wider">
                  Important Notes & Guidelines
                </h3>
                <button
                  type="button"
                  onClick={addNote}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-resort-sand/30 text-resort-cocoa rounded-lg text-xs font-bold hover:bg-resort-sand/50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Note
                </button>
              </div>

              {form.notes.length === 0 ? (
                <p className="text-xs text-resort-cocoa/50 text-center py-3 bg-resort-offwhite rounded-xl">
                  No footer notes added. Click &quot;Add Note&quot; above.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.notes.map((note, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-resort-offwhite rounded-xl border border-resort-cocoa/10">
                      <textarea
                        value={note}
                        onChange={(e) => updateNote(index, e.target.value)}
                        className="flex-1 p-2.5 bg-resort-white border border-resort-cocoa/20 rounded-lg text-xs font-medium focus:outline-none resize-none"
                        placeholder="Enter notice or payment instructions..."
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

            {/* Save Button */}
            <div className="pt-4 border-t border-resort-cocoa/10">
              <button
                type="submit"
                disabled={saveStatus.loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-resort-olive text-resort-white font-bold rounded-xl shadow-md hover:bg-resort-cocoa transition-colors disabled:opacity-50 cursor-pointer text-sm"
              >
                {saveStatus.loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Poster Settings</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Poster Preview */}
        <div className="lg:col-span-6 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-resort-cocoa/70">
              Live Poster Preview
            </span>
            <span className="text-[11px] text-resort-cocoa/50">
              High-DPI 2x Canvas
            </span>
          </div>

          <div
            ref={previewRef}
            className="bg-[#132c4a] text-white rounded-2xl p-8 shadow-2xl min-h-[580px] flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="text-center mb-6">
                {form.logoUrl && (
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={form.logoUrl}
                      alt={form.hotelName}
                      width={120}
                      height={60}
                      className="h-14 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                )}

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#B9CEC3] tracking-wide">
                  {form.hotelName || "Resort Name"}
                </h2>

                {form.address && (
                  <p className="text-xs text-white/80 mt-1.5">{form.address}</p>
                )}

                {(form.contactNumber || form.email) && (
                  <p className="text-xs text-white/70 mt-1">
                    {form.contactNumber}
                    {form.contactNumber && form.email && " · "}
                    {form.email}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="text-center my-6 py-2 border-y border-white/15">
                <h3 className="text-sm font-bold tracking-[0.25em] text-[#c4a47c] uppercase">
                  OFFICIAL PAYMENT DETAILS
                </h3>
              </div>

              {/* GCash Accounts */}
              {form.gcashEntries.length > 0 && (
                <div className="mb-6 space-y-2">
                  <div className="text-xs font-bold text-[#B9CEC3] uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>GCash Transfer</span>
                    <span className="text-[10px] text-[#c4a47c]">Verified Business</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {form.gcashEntries.map((entry, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{entry.name || "Account Name"}</p>
                          <p className="text-sm font-mono font-semibold text-[#c4a47c]">{entry.number || "09XX XXX XXXX"}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
                          GCash
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {(form.bpiAccountName || form.bpiAccountNumber) && (
                <div className="mb-6 space-y-2">
                  <div className="text-xs font-bold text-[#B9CEC3] uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>Online Bank Transfer</span>
                    <span className="text-[10px] text-[#c4a47c]">BPI / Direct Deposit</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-xl space-y-1 pt-2">
                    <p className="text-xs text-white/70">Account Name:</p>
                    <p className="text-sm font-bold text-white">{form.bpiAccountName || "Account Holder Name"}</p>
                    <p className="text-xs text-white/70 mt-2">Account Number:</p>
                    <p className="text-base font-mono font-bold text-[#c4a47c]">{form.bpiAccountNumber || "0000 0000 0000"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Notes */}
            {form.notes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/15 space-y-1.5">
                {form.notes.map((note, index) => (
                  <p key={index} className="text-[11px] text-amber-200/90 text-center leading-relaxed">
                    • {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

