"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { updatePaymentPosterSettings } from "@/lib/admin/actions";
import type { PaymentPosterSettings } from "./page";

// GCash entry type
interface GcashEntry {
  number: string;
  name: string;
}

// Form state type
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

// Status type for form submissions and exports
type StatusState = {
  loading: boolean;
  message: string;
  type: "success" | "error" | "";
};

export default function PaymentPosterClient({
  initialSettings,
}: {
  initialSettings: PaymentPosterSettings;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<StatusState>({ loading: false, message: "", type: "" });

  // Initialize form state from props
  const initialForm: FormState = {
    hotelSlug: initialSettings.hotel_slug || "cielo",
    hotelName: initialSettings.hotel_name || "Cielo Alto Place",
    address: initialSettings.address || "",
    contactNumber: initialSettings.contact_number || "",
    email: initialSettings.email || "",
    logoUrl: initialSettings.logo_url || "",
    gcashEntries: initialSettings.gcash_entries || [],
    bpiAccountName: initialSettings.bpi_account_name || "",
    bpiAccountNumber: initialSettings.bpi_account_number || "",
    notes: initialSettings.notes || [],
  };

  const [form, setForm] = useState<FormState>(initialForm);

  // Handle form field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Add a new GCash entry
  const addGcashEntry = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: [...prev.gcashEntries, { number: "", name: "" }],
    }));
  }, []);

  // Remove a GCash entry by index
  const removeGcashEntry = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: prev.gcashEntries.filter((_, i) => i !== index),
    }));
  }, []);

  // Update a specific GCash entry
  const updateGcashEntry = useCallback((index: number, field: keyof GcashEntry, value: string) => {
    setForm((prev) => ({
      ...prev,
      gcashEntries: prev.gcashEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  }, []);

  // Add a new note
  const addNote = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      notes: [...prev.notes, ""],
    }));
  }, []);

  // Remove a note by index
  const removeNote = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  }, []);

  // Update a specific note
  const updateNote = useCallback((index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? value : note)),
    }));
  }, []);

  // Handle logo upload
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

  // Handle form submission (save to database)
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

        setSaveStatus({ loading: false, message: "Settings saved successfully!", type: "success" });
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

  // Handle PNG download
  const handleDownloadPng = useCallback(async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution output
        backgroundColor: "#132c4a", // Match the dark green card background
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

  // Check if form has unsaved changes compared to initial settings
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
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl">
      {/* Form Section */}
      <div className="w-full lg:w-1/2">
        <div className="bg-resort-white rounded-2xl p-6 shadow-sm border border-resort-cocoa/10">
          <div className="mb-6 border-b border-resort-cocoa/10 pb-4">
            <h2 className="font-serif text-2xl text-[#132c4a]">Payment Poster Generator</h2>
            <p className="text-sm text-resort-cocoa/70 mt-1">
              Edit the details below to update the payment poster preview. Download as PNG when ready.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {saveStatus.message && (
              <div
                className={`p-4 text-sm rounded-lg ${
                  saveStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}
              >
                {saveStatus.message}
              </div>
            )}

            {/* Header Info Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#132c4a] text-sm uppercase tracking-wider">Header Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    value={form.hotelName}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder="Cielo Alto Place"
                  />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Hotel Slug</label>
                  <input
                    type="text"
                    name="hotelSlug"
                    value={form.hotelSlug}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-resort-offwhite border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none text-sm"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder="Full address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder="resort@example.com"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs text-resort-cocoa/70 mb-1">Logo</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-resort-sand/20 border-2 border-dashed border-resort-cocoa/30 rounded-md cursor-pointer hover:bg-resort-sand/30 transition-colors">
                    <Upload className="w-4 h-4 text-resort-cocoa/70" />
                    <span className="text-sm text-resort-cocoa/70">
                      {form.logoUrl ? "Change Logo" : "Upload Logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {form.logoUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-resort-cocoa/20">
                      <Image
                        src={form.logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white rounded-bl-lg flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-resort-cocoa/50 mt-1">PNG, JPG, or WEBP. Max 10MB.</p>
              </div>
            </div>

            {/* GCash Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#132c4a] text-sm uppercase tracking-wider">GCash Entries</h3>
                <button
                  type="button"
                  onClick={addGcashEntry}
                  className="flex items-center gap-1 px-3 py-1.5 bg-resort-sand/20 text-resort-cocoa rounded text-xs hover:bg-resort-sand/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {form.gcashEntries.length === 0 ? (
                <p className="text-sm text-resort-cocoa/50 text-center py-4">No GCash entries. Click &quot;Add&quot; to add one.</p>
              ) : (
                <div className="space-y-3">
                  {form.gcashEntries.map((entry, index) => (
                    <div key={index} className="flex items-end gap-3 p-3 bg-white rounded-lg border border-resort-cocoa/10">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-resort-cocoa/70 mb-1">Account Name</label>
                          <input
                            type="text"
                            value={entry.name}
                            onChange={(e) => updateGcashEntry(index, "name", e.target.value)}
                            className="w-full p-2 bg-resort-offwhite border border-resort-cocoa/20 rounded focus:border-[#c4a47c] outline-none"
                            placeholder='Account holder name'
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-resort-cocoa/70 mb-1">GCash Number</label>
                          <input
                            type="text"
                            value={entry.number}
                            onChange={(e) => updateGcashEntry(index, "number", e.target.value)}
                            className="w-full p-2 bg-resort-offwhite border border-resort-cocoa/20 rounded focus:border-[#c4a47c] outline-none"
                            placeholder='09XX XXX XXXX'
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGcashEntry(index)}
                        className="p-2 text-resort-cocoa/50 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BPI Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/5">
              <h3 className="font-bold text-[#132c4a] text-sm uppercase tracking-wider">BPI Account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Account Name</label>
                  <input
                    type="text"
                    name="bpiAccountName"
                    value={form.bpiAccountName}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder='Account holder name'
                  />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="bpiAccountNumber"
                    value={form.bpiAccountNumber}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none"
                    placeholder='1234 5678 9012 3456'
                  />
                </div>
              </div>
            </div>

            {/* Footer Notes Section */}
            <div className="space-y-4 pt-4 border-t border-resort-cocoa/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#132c4a] text-sm uppercase tracking-wider">Footer Notes</h3>
                <button
                  type="button"
                  onClick={addNote}
                  className="flex items-center gap-1 px-3 py-1.5 bg-resort-sand/20 text-resort-cocoa rounded text-xs hover:bg-resort-sand/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {form.notes.length === 0 ? (
                <p className="text-sm text-resort-cocoa/50 text-center py-4">No notes. Click &quot;Add&quot; to add one.</p>
              ) : (
                <div className="space-y-3">
                  {form.notes.map((note, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-resort-cocoa/10">
                      <textarea
                        value={note}
                        onChange={(e) => updateNote(index, e.target.value)}
                        className="flex-1 p-2 bg-resort-offwhite border border-resort-cocoa/20 rounded focus:border-[#c4a47c] outline-none resize-none min-h-[80px]"
                        placeholder="Enter a footer note..."
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => removeNote(index)}
                        className="p-2 text-resort-cocoa/50 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-resort-cocoa/10">
              <button
                type="submit"
                disabled={saveStatus.loading || !hasUnsavedChanges}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#132c4a] text-white rounded-md text-sm font-medium hover:bg-[#1a3a61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saveStatus.loading ? "Saving..." : "Save Settings"}
              </button>

              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c4a47c] text-white rounded-md text-sm font-medium hover:bg-[#b0936e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Download PNG"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-1/2">
        <div className="bg-resort-white rounded-2xl p-6 shadow-sm border border-resort-cocoa/10 sticky top-8">
          <div className="mb-4 border-b border-resort-cocoa/10 pb-3">
            <h2 className="font-serif text-xl text-[#132c4a]">Live Preview</h2>
            <p className="text-sm text-resort-cocoa/70 mt-1">
              Updates automatically as you edit the form.
            </p>
          </div>

          {/* Preview Container - styled to match the existing poster */}
          <div
            ref={previewRef}
            className="bg-[#132c4a] text-white rounded-xl p-6 min-h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="text-center mb-6">
              {/* Logo */}
              {form.logoUrl && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={form.logoUrl}
                    alt={form.hotelName}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain"
                    unoptimized
                  />
                </div>
              )}
              
              {/* Hotel Name */}
              <h1 className="text-2xl font-bold text-[#B9CEC3] tracking-wider">
                {form.hotelName || "Hotel Name"}
              </h1>
              
              {/* Address */}
              {form.address && (
                <p className="text-sm text-white/80 mt-2">{form.address}</p>
              )}
              
              {/* Contact Info */}
              {(form.contactNumber || form.email) && (
                <p className="text-sm text-white/80 mt-1">
                  {form.contactNumber}
                  {form.contactNumber && form.email && " | "}
                  {form.email}
                </p>
              )}
            </div>

            {/* Mode of Payment Title */}
            <h2 className="text-lg font-bold text-center mb-5 text-[#B9CEC3] tracking-[0.2em] uppercase">
              MODE OF PAYMENT
            </h2>

            {/* GCash Section */}
            {form.gcashEntries.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#c4a47c] mb-3 border-b border-white/20 pb-2">
                  GCash
                </h3>
                <div className="space-y-2">
                  {form.gcashEntries.map((entry, index) => (
                    <div key={index} className="bg-white/5 p-2 rounded">
                      <p className="font-semibold text-white text-sm">{entry.name || "Account Name"}</p>
                      <p className="text-white/80 text-xs">{entry.number || "0000 0000 0000"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BPI Section */}
            {(form.bpiAccountName || form.bpiAccountNumber) && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#c4a47c] mb-3 border-b border-white/20 pb-2">
                  BPI
                </h3>
                <div className="bg-white/5 p-2 rounded">
                  <p className="font-semibold text-white text-sm">{form.bpiAccountName || "Account Name"}</p>
                  <p className="text-white/80 text-xs">{form.bpiAccountNumber || "0000 0000 0000 0000"}</p>
                </div>
              </div>
            )}

            {/* Footer Notes */}
            {form.notes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/20">
                {form.notes.map((note, index) => (
                  <p key={index} className="text-sm text-red-400 mb-2 text-center italic">
                    {note || "Footer note"}
                  </p>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-resort-cocoa/50 text-center mt-4">
            Preview renders at 2x resolution when downloaded
          </p>
        </div>
      </div>
    </div>
  );
}
