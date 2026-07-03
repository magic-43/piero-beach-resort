"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { updateRoom } from "@/lib/admin/actions";
import { formatPHPCurrency } from "@/lib/currency";

type RoomEditFormProps = {
  room: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    short_description: string;
    image: string;
    gallery: string[];
    beds: string;
    standard_guests: number;
    max_extra_guests: number;
    breakfast_guests: number;
    capacity_label: string;
    amenities: string[];
    size: string;
    view: string;
    regular_rate: number;
    discounted_rate: number;
    is_active: boolean;
    details_href: string;
  };
  globalDiscountPercentage: number;
};

function normalizeList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

type FormState = {
  name: string;
  category: string;
  description: string;
  short_description: string;
  image: string;
  gallery: string[];
  beds: string;
  standard_guests: string;
  max_extra_guests: string;
  breakfast_guests: string;
  capacity_label: string;
  amenities: string[];
  size: string;
  view: string;
  regular_rate: string;
  is_active: boolean;
};

function buildSnapshot(form: FormState) {
  return JSON.stringify({
    ...form,
    gallery: normalizeList(form.gallery),
    amenities: normalizeList(form.amenities),
  });
}

export function RoomEditForm({ room, globalDiscountPercentage }: RoomEditFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<{ loading: boolean; message: string; type: "success" | "error" | "" }>({
    loading: false,
    message: "",
    type: "",
  });
  const [uploadStatus, setUploadStatus] = useState<{ loading: boolean; message: string; type: "success" | "error" | "" }>({
    loading: false,
    message: "",
    type: "",
  });
  const [amenityInput, setAmenityInput] = useState("");

  const [form, setForm] = useState<FormState>({
    name: room.name,
    category: room.category,
    description: room.description,
    short_description: room.short_description,
    image: room.image,
    gallery: room.gallery,
    beds: room.beds,
    standard_guests: String(room.standard_guests),
    max_extra_guests: String(room.max_extra_guests),
    breakfast_guests: String(room.breakfast_guests),
    capacity_label: room.capacity_label,
    amenities: room.amenities,
    size: room.size,
    view: room.view,
    regular_rate: String(room.regular_rate),
    is_active: room.is_active,
  });

  const [initialSnapshot, setInitialSnapshot] = useState(() =>
    buildSnapshot({
      name: room.name,
      category: room.category,
      description: room.description,
      short_description: room.short_description,
      image: room.image,
      gallery: room.gallery,
      beds: room.beds,
      standard_guests: String(room.standard_guests),
      max_extra_guests: String(room.max_extra_guests),
      breakfast_guests: String(room.breakfast_guests),
      capacity_label: room.capacity_label,
      amenities: room.amenities,
      size: room.size,
      view: room.view,
      regular_rate: String(room.regular_rate),
      is_active: room.is_active,
    })
  );

  const standardGuests = Number(form.standard_guests) || 0;
  const regularRate = Number(form.regular_rate) || 0;
  const discountedPreview = Math.round(regularRate * (1 - globalDiscountPercentage / 100));
  const isDirty = buildSnapshot(form) !== initialSnapshot;

  const galleryPreview = useMemo(() => normalizeList(form.gallery), [form.gallery]);
  const amenityPreview = useMemo(() => normalizeList(form.amenities), [form.amenities]);

  useEffect(() => {
    if (!status.message || status.loading) return;

    const timeout = window.setTimeout(
      () => setStatus((prev) => ({ ...prev, message: "", type: "" })),
      status.type === "error" ? 6000 : 3500
    );

    return () => window.clearTimeout(timeout);
  }, [status]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleAmenityAdd = () => {
    const trimmed = amenityInput.trim();
    if (!trimmed) return;
    if (form.amenities.includes(trimmed)) {
      setAmenityInput("");
      return;
    }
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
    setAmenityInput("");
  };

  const handleAmenityRemove = (amenity: string) => {
    setForm((prev) => ({ ...prev, amenities: prev.amenities.filter((item) => item !== amenity) }));
  };

  const handleGalleryRemove = (imageUrl: string) => {
    setForm((prev) => {
      const nextGallery = prev.gallery.filter((item) => item !== imageUrl);
      const nextPrimary = prev.image === imageUrl ? nextGallery[0] || "" : prev.image;
      return {
        ...prev,
        image: nextPrimary,
        gallery: nextGallery,
      };
    });
  };

  const handleSetPrimary = (imageUrl: string) => {
    setForm((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus({ loading: true, message: "", type: "" });

    const body = new FormData();
    body.append("file", file);
    body.append("roomId", room.id);
    body.append("roomSlug", room.slug);

    try {
      const response = await fetch("/api/admin/rooms/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      const publicUrl = data.publicUrl as string;
      setForm((prev) => {
        const nextGallery = prev.gallery.includes(publicUrl) ? prev.gallery : [...prev.gallery, publicUrl];
        return {
          ...prev,
          image: prev.image || publicUrl,
          gallery: nextGallery,
        };
      });
      setUploadStatus({ loading: false, message: "Image uploaded and added to gallery.", type: "success" });
    } catch (error) {
      setUploadStatus({
        loading: false,
        message: error instanceof Error ? error.message : "Failed to upload image.",
        type: "error",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty) return;

    setStatus({ loading: true, message: "", type: "" });

    const capacityLabel = form.capacity_label.trim() || `Good for ${standardGuests} guest${standardGuests === 1 ? "" : "s"}`;

    const result = await updateRoom({
      id: room.id,
      name: form.name,
      category: form.category,
      description: form.description,
      short_description: form.short_description,
      image: form.image,
      gallery: galleryPreview,
      beds: form.beds,
      standard_guests: Number(form.standard_guests),
      max_extra_guests: Number(form.max_extra_guests),
      breakfast_guests: Number(form.breakfast_guests),
      capacity_label: capacityLabel,
      amenities: amenityPreview,
      size: form.size,
      view: form.view,
      regular_rate: Number(form.regular_rate),
      is_active: form.is_active,
    });

    if (result?.error) {
      setStatus({ loading: false, message: result.error, type: "error" });
      return;
    }

    const nextForm = { ...form, capacity_label: capacityLabel };
    setForm(nextForm);
    setInitialSnapshot(buildSnapshot(nextForm));
    setStatus({ loading: false, message: "Room updated successfully.", type: "success" });
    router.refresh();
  };

  return (
    <div className="space-y-8 overflow-x-hidden pb-24 sm:pb-8">
      {status.message && (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex justify-center sm:inset-x-auto sm:right-6 sm:top-6">
          <div
            className={`pointer-events-auto w-full max-w-md rounded-xl px-4 py-3 text-sm shadow-lg ${
              status.type === "error"
                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                : "bg-green-50 text-green-700 ring-1 ring-green-200"
            }`}
          >
            {status.message}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/admin/rooms"
            className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-resort-cocoa/60 hover:text-[#132c4a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Link>
          <h1 className="mt-4 font-serif text-4xl text-[#132c4a]">{room.name}</h1>
          <p className="mt-2 text-sm text-resort-cocoa/65">
            Editing live room content for the public site and reservation flow.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 overflow-x-hidden">
        <section className="rounded-3xl border border-resort-cocoa/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-[#132c4a]">Basic Info</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Room Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]">
                <option value="Suite">Suite</option>
                <option value="Villa">Villa</option>
                <option value="Room">Room</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Short Description</label>
              <textarea name="short_description" value={form.short_description} onChange={handleChange} rows={3} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Full Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-resort-cocoa/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-[#132c4a]">Pricing & Capacity</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Regular Rate</label>
              <input type="number" min="0" name="regular_rate" value={form.regular_rate} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div className="rounded-md border border-resort-cocoa/15 bg-resort-offwhite px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Discounted Preview</p>
              <p className="mt-2 font-serif text-2xl text-[#132c4a]">{formatPHPCurrency(discountedPreview)}</p>
              <p className="mt-1 text-xs text-resort-cocoa/60">Calculated from the current global discount setting.</p>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-3 rounded-md border border-resort-cocoa/20 bg-resort-offwhite px-4 py-3 text-sm text-resort-cocoa">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="h-4 w-4 accent-[#132c4a]" />
                Active and bookable
              </label>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Standard Guests</label>
              <input type="number" min="1" name="standard_guests" value={form.standard_guests} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Max Extra Guests</label>
              <input type="number" min="0" name="max_extra_guests" value={form.max_extra_guests} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Breakfast Guests</label>
              <input type="number" min="0" name="breakfast_guests" value={form.breakfast_guests} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div className="lg:col-span-3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Capacity Label</label>
              <input name="capacity_label" value={form.capacity_label} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-resort-cocoa/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-[#132c4a]">Room Content</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Beds</label>
              <input name="beds" value={form.beds} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Size</label>
              <input name="size" value={form.size} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">View</label>
              <input name="view" value={form.view} onChange={handleChange} className="w-full rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-resort-cocoa/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl text-[#132c4a]">Media & Amenities</h2>
          <div className="mt-6 grid gap-6">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Primary Image</label>
              <div className="flex items-start gap-4 rounded-xl border border-resort-cocoa/10 bg-resort-offwhite/40 p-4">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-resort-cocoa/10 bg-white">
                  {form.image ? (
                    <Image
                      src={form.image}
                      alt={`${room.name} primary image`}
                      fill
                      unoptimized={form.image.startsWith("http")}
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-resort-cocoa">Current primary image</p>
                  <p className="mt-1 text-xs text-resort-cocoa/60">Shown first on cards and room detail pages.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Gallery Images</label>
              <div className="space-y-3">
                {galleryPreview.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-resort-cocoa/15 px-4 py-5 text-sm text-resort-cocoa/55">
                    No gallery images yet.
                  </div>
                ) : (
                  galleryPreview.map((imageUrl) => (
                    <div key={imageUrl} className="flex flex-col gap-4 overflow-hidden rounded-xl border border-resort-cocoa/10 bg-resort-offwhite/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-resort-cocoa/10 bg-white">
                          <Image
                            src={imageUrl}
                            alt={`${room.name} gallery preview`}
                            fill
                            unoptimized={imageUrl.startsWith("http")}
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-resort-cocoa">
                            {form.image === imageUrl ? "Primary image" : "Gallery image"}
                          </p>
                          {form.image === imageUrl && (
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-resort-olive">
                              Shown on cards and room detail hero
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(imageUrl)}
                          disabled={form.image === imageUrl}
                          className="rounded-lg border border-resort-cocoa/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-resort-cocoa hover:bg-white disabled:opacity-50"
                        >
                          Set Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGalleryRemove(imageUrl)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#132c4a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a3a61] transition-colors">
                  {uploadStatus.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
                  Upload Image
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} />
                </label>
                {uploadStatus.message && (
                  <p className={`mt-3 text-sm ${uploadStatus.type === "error" ? "text-red-700" : "text-green-700"}`}>
                    {uploadStatus.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-resort-cocoa/55">Amenities</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={amenityInput}
                  onChange={(event) => setAmenityInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      handleAmenityAdd();
                    }
                  }}
                  placeholder="Add an amenity"
                  className="flex-1 rounded-md border border-resort-cocoa/20 bg-white p-3 outline-none focus:border-[#c4a47c]"
                />
                <button
                  type="button"
                  onClick={handleAmenityAdd}
                  className="inline-flex items-center justify-center rounded-lg bg-[#c4a47c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b0936e] transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {amenityPreview.length === 0 ? (
                  <p className="text-sm text-resort-cocoa/55">No amenities added yet.</p>
                ) : (
                  amenityPreview.map((amenity) => (
                    <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full border border-resort-cocoa/10 bg-resort-offwhite px-2.5 py-1.5 text-xs text-resort-cocoa sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                      {amenity}
                      <button type="button" onClick={() => handleAmenityRemove(amenity)} className="text-resort-cocoa/55 hover:text-red-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-resort-cocoa/10 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0">
          <div className="flex gap-3 sm:justify-end">
            <Link
              href="/admin/rooms"
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border border-resort-cocoa/15 px-6 py-3 text-sm font-semibold text-resort-cocoa hover:bg-resort-offwhite transition-colors sm:flex-none"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={status.loading || !isDirty}
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg bg-[#132c4a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a3a61] disabled:cursor-not-allowed disabled:opacity-50 transition-colors sm:flex-none"
            >
              {status.loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
