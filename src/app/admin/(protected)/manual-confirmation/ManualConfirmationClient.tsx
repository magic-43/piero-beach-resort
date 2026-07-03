"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, RotateCcw, MapPin, Phone, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { format } from "date-fns";
import * as htmlToImage from "html-to-image";
import { AdminDateRangePicker } from "./AdminDateRangePicker";

export function ManualConfirmationClient({ rooms }: { rooms: Array<{ id?: string; slug?: string; name?: string }> }) {
  const previewRef = useRef<HTMLDivElement>(null);

  const getToday = () => format(new Date(), "yyyy-MM-dd");

  const initialFormState = {
    guestName: "",
    address: "",
    contactNumber: "",
    email: "",
    dateIssued: getToday(),
    roomId: rooms?.[0]?.slug || "",
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "02:00 PM",
    checkOutTime: "12:30 NN",
    adults: 2,
    children: 0,
    promoNote: "50% promotional rate",
    rentalFee: 0,
    downPayment: 0,
    additionalPersonsFee: 0,
    corkageFee: 0,
    extendedHourFee: 0,
    entertainmentFee: 0,
    otherCharges: 0,
    assistedBy: "Piero Beach Resort",
  };

  const [form, setForm] = useState(initialFormState);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [scale, setScale] = useState(1);
  const [receiptHeight, setReceiptHeight] = useState(550);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        if (availableWidth > 0) {
          // Scale down the receipt to fit nicely on desktop too (max 85% scale)
          // Subtract 32px for safe padding margin
          const targetScale = Math.min((availableWidth - 32) / 650, 0.85);
          setScale(targetScale);
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    // Observe the receipt's actual height so we can collapse the empty whitespace
    const receipt = previewRef.current;
    if (!receipt) return;
    
    const heightObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setReceiptHeight(entry.contentRect.height);
      }
    });
    
    heightObserver.observe(receipt);
    return () => heightObserver.disconnect();
  }, []);

  const grandTotal =
    Number(form.rentalFee) +
    Number(form.additionalPersonsFee) +
    Number(form.corkageFee) +
    Number(form.extendedHourFee) +
    Number(form.entertainmentFee) +
    Number(form.otherCharges);
    
  const balance = grandTotal - Number(form.downPayment);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm(initialFormState);
  };



  const handleDownloadPng = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { 
        quality: 1.0,
        pixelRatio: 2 // High resolution output
      });
      const link = document.createElement("a");
      link.download = `Booking_Confirmation_${form.guestName || "Guest"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Try printing to PDF instead.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const getRoomName = (id: string) => {
    const room = rooms?.find((r) => r.slug === id || r.id === id);
    return room ? room.name : id;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start relative lg:max-h-[calc(100vh-8rem)]">
      
      {/* Mobile Tabs */}
      <div className="w-full sticky top-0 z-50 bg-resort-offwhite/95 backdrop-blur-sm pt-2 pb-3 mb-2 lg:hidden print:hidden">
        <div className="flex bg-resort-sand/30 rounded-lg p-1.5 gap-1 shadow-sm">
          <button 
            onClick={(e) => { e.preventDefault(); setMobileTab('form'); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${mobileTab === 'form' ? 'bg-white shadow-sm text-resort-terracotta' : 'text-resort-cocoa/60 hover:text-resort-cocoa/80'}`}
          >
            Edit Details
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setMobileTab('preview'); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white shadow-sm text-resort-terracotta' : 'text-resort-cocoa/60 hover:text-resort-cocoa/80'}`}
          >
            View Preview
          </button>
        </div>
      </div>

      {/* Form Section - Scrollable on desktop */}
      <div className={`w-full lg:w-1/2 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto bg-resort-white rounded-lg p-6 shadow-sm border border-resort-cocoa/10 print:hidden lg:pr-4 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
        <div className="border-b border-resort-cocoa/10 pb-4 mb-6 sticky top-0 bg-resort-white z-10 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-serif text-resort-cocoa">Generator Settings</h2>
            <p className="text-sm text-resort-cocoa/60 mt-1">Fill out details below to update the preview.</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-3 py-1.5 border border-resort-cocoa/20 text-resort-cocoa rounded text-xs hover:bg-resort-sand/20 transition font-medium shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <form className="space-y-8">
          {/* Guest Details */}
          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider">Guest Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Guest Name</span>
                <input type="text" name="guestName" value={form.guestName} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Contact Number</span>
                <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm text-resort-cocoa/70">Address</span>
                <input type="text" name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm text-resort-cocoa/70">Email (Optional)</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider">Booking Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Date Issued</span>
                <input type="date" name="dateIssued" value={form.dateIssued} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Room / Accommodation</span>
                <select name="roomId" value={form.roomId} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border bg-white">
                  {rooms?.map((r) => (
                    <option key={r.slug || r.id} value={r.slug || r.id}>
                      {r.name}
                    </option>
                  ))}
                  <option value="custom">Custom (Write in remarks)</option>
                </select>
              </label>
              <div className="block sm:col-span-2 mt-2">
                <AdminDateRangePicker 
                  checkInDate={form.checkInDate} 
                  checkOutDate={form.checkOutDate} 
                  onChange={(checkIn, checkOut) => setForm(p => ({ ...p, checkInDate: checkIn, checkOutDate: checkOut }))} 
                />
              </div>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Check-in Time</span>
                <input type="text" name="checkInTime" value={form.checkInTime} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Check-out Time</span>
                <input type="text" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Number of Adults</span>
                <input type="number" name="adults" value={form.adults} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Number of Children</span>
                <input type="number" name="children" value={form.children} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm text-resort-cocoa/70">Booking/Promo Note</span>
                <input type="text" name="promoNote" value={form.promoNote} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
            </div>
          </div>

          {/* Payment & Charges */}
          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider">Payment & Charges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Rental Fee</span>
                <input type="number" name="rentalFee" value={form.rentalFee} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Down Payment</span>
                <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Additional Persons Fee</span>
                <input type="number" name="additionalPersonsFee" value={form.additionalPersonsFee} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Corkage Fee</span>
                <input type="number" name="corkageFee" value={form.corkageFee} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Extended Hour Fee</span>
                <input type="number" name="extendedHourFee" value={form.extendedHourFee} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Entertainment / Amenities</span>
                <input type="number" name="entertainmentFee" value={form.entertainmentFee} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Other Charges</span>
                <input type="number" name="otherCharges" value={form.otherCharges} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
            </div>
          </div>

          {/* Footer Details */}
          <div>
            <h3 className="font-medium text-resort-terracotta mb-4 uppercase text-sm tracking-wider">Footer</h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm text-resort-cocoa/70">Assisted By</span>
                <input type="text" name="assistedBy" value={form.assistedBy} onChange={handleChange} className="mt-1 block w-full rounded border-resort-cocoa/20 p-2 border" />
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Section - Sticky on desktop */}
      <div className={`w-full lg:w-1/2 flex-col items-center print:block lg:sticky lg:top-0 ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
        
        {/* Style to force background colors in print */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: 8in 10in;
              margin: 0.35in;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}} />
        
        {/* Scaling Wrapper for Mobile Support & Desktop PDF View */}
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden transition-all duration-200" style={{ height: `${receiptHeight * scale}px` }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '650px', height: 'fit-content' }}>
            {/* Printable Area (Always exactly 650px wide) */}
            <div
              id="printable-confirmation"
              ref={previewRef}
              className="bg-white w-[650px] min-h-[550px] shadow-md print:shadow-none p-6 text-resort-cocoa flex flex-col text-[11px] border border-resort-cocoa/10 relative overflow-hidden"
              style={{ fontFamily: 'var(--font-sans), sans-serif' }}
            >
          {/* Top Left Decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-0">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
              <path d="M 0,0 L 200,0 C 120,20 20,120 0,200 Z" fill="#302720" />
              <path d="M 0,0 L 160,0 C 90,10 10,90 0,160 Z" fill="#E8DDCF" />
            </svg>
          </div>

          {/* Bottom Right Decoration */}
          <div className="absolute bottom-0 right-0 w-[280px] pointer-events-none z-0 flex items-end justify-end">
            <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
              <path d="M 0,150 C 50,110 150,130 300,60 L 300,150 Z" fill="#E8DDCF" opacity="0.8" />
              <path d="M 80,150 C 130,120 200,140 300,80 L 300,150 Z" fill="#B9CEC3" opacity="0.8" />
              <path d="M 150,150 C 180,135 250,145 300,100 L 300,150 Z" fill="#302720" opacity="0.9" />
              
              <g fill="#302720" transform="translate(230, 30) scale(0.65)">
                <path d="M 45,150 Q 55,100 65,50 Q 55,100 52,150 Z" />
                <path d="M 65,50 Q 30,30 10,60 Q 40,40 65,50 Z" />
                <path d="M 65,50 Q 50,10 30,20 Q 55,30 65,50 Z" />
                <path d="M 65,50 Q 80,10 100,20 Q 75,30 65,50 Z" />
                <path d="M 65,50 Q 100,30 120,60 Q 90,40 65,50 Z" />
                <path d="M 65,50 Q 80,60 90,90 Q 75,60 65,50 Z" />
                <path d="M 65,50 Q 50,60 40,90 Q 55,60 65,50 Z" />
              </g>
              <g fill="#302720" transform="translate(190, 60) scale(0.45)">
                <path d="M 45,150 Q 55,100 65,50 Q 55,100 52,150 Z" />
                <path d="M 65,50 Q 30,30 10,60 Q 40,40 65,50 Z" />
                <path d="M 65,50 Q 50,10 30,20 Q 55,30 65,50 Z" />
                <path d="M 65,50 Q 80,10 100,20 Q 75,30 65,50 Z" />
                <path d="M 65,50 Q 100,30 120,60 Q 90,40 65,50 Z" />
                <path d="M 65,50 Q 80,60 90,90 Q 75,60 65,50 Z" />
                <path d="M 65,50 Q 50,60 40,90 Q 55,60 65,50 Z" />
              </g>
            </svg>
          </div>
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
            <Logo className="w-[85%] h-auto grayscale" />
          </div>

          {/* Wrapper for relative z-10 */}
          <div className="relative z-10 flex flex-col flex-grow">
            {/* Header */}
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-center gap-6 pt-2 pb-4">
                <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                  <Logo className="w-full h-auto text-resort-cocoa" />
                </div>
                <div className="flex flex-col items-start mt-1">
                  <h1 className="text-3xl font-serif font-bold tracking-widest text-resort-cocoa uppercase leading-none">Piero Beach</h1>
                  <h2 className="text-sm font-sans tracking-[0.25em] text-resort-cocoa/70 uppercase mt-1">Resort</h2>
                </div>
              </div>
              
              {/* Contact Bar */}
              <div className="border-t border-b border-resort-cocoa/10 py-1.5 mb-5 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10px] text-resort-cocoa/80">
                <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>Cabangan, Zambales</span>
                </div>
                <span className="opacity-50">|</span>
                <div className="flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" />
                  <span>+63 995 385 5517</span>
                </div>
                <span className="opacity-50">|</span>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-2.5 h-2.5" />
                  <span>+63 955 318 2012</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <h2 className="text-base font-bold uppercase tracking-widest bg-resort-sand/30 py-1">Booking Confirmation</h2>
            </div>

            {/* Guest Block */}
            <div className="grid grid-cols-[80px_1fr] gap-y-1 mt-3">
              <div className="font-semibold">Date:</div>
              <div>{form.dateIssued || "-"}</div>
              <div className="font-semibold">Name:</div>
              <div className="font-bold line-clamp-1">{form.guestName || "-"}</div>
              <div className="font-semibold">Address:</div>
              <div className="line-clamp-1">{form.address || "-"}</div>
              <div className="font-semibold">Contact No.:</div>
              <div>{form.contactNumber || "-"}</div>
              <div className="font-semibold">Email:</div>
              <div className="truncate">{form.email || "-"}</div>
            </div>

            {/* Booking Details */}
            <div className="mt-3 border-t border-resort-cocoa/10 pt-2">
              <h3 className="font-serif font-bold text-sm mb-1.5">Booking Details</h3>
              <div className="grid grid-cols-[100px_1fr] gap-y-1">
                <div className="font-semibold">Stay Dates:</div>
                <div>{form.checkInDate || "-"} to {form.checkOutDate || "-"}</div>
                
                <div className="font-semibold">Check in:</div>
                <div>{form.checkInTime}</div>
                
                <div className="font-semibold">Check out:</div>
                <div>{form.checkOutTime}</div>
                
                <div className="font-semibold">Room:</div>
                <div>{getRoomName(form.roomId)}</div>
                
                <div className="font-semibold">Guests:</div>
                <div>{form.adults} Adults, {form.children} Children</div>
                
                <div className="font-semibold">Booking rate:</div>
                <div className="line-clamp-1">{form.promoNote || "-"}</div>
              </div>
            </div>

            {/* Charges Table */}
            <div className="mt-3 flex-grow flex flex-col">
              <table className="w-full text-left border-collapse border border-resort-cocoa">
                <thead className="bg-resort-cocoa text-white">
                  <tr>
                    <th className="py-1 px-2 font-bold w-2/3 border border-resort-cocoa">Description</th>
                    <th className="py-1 px-2 font-bold text-right w-1/3 border border-resort-cocoa">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Rental Fee</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.rentalFee))}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Additional Persons</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.additionalPersonsFee))}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Corkage Fee</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.corkageFee))}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Extended Hour</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.extendedHourFee))}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Entertainment / Amenities</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.entertainmentFee))}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border border-resort-cocoa">Other Charges</td>
                    <td className="py-1 px-2 text-right border border-resort-cocoa">{formatCurrency(Number(form.otherCharges))}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-auto pt-2 flex flex-col items-end gap-0.5">
                <div className="flex w-2/3 justify-between font-bold border-t border-resort-cocoa pt-1">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
                <div className="flex w-2/3 justify-between text-resort-cocoa/80">
                  <span>Down Payment:</span>
                  <span className="text-red-600/90">- {formatCurrency(Number(form.downPayment))}</span>
                </div>
                <div className="flex w-2/3 justify-between font-bold text-sm text-resort-terracotta border-t border-resort-cocoa/20 pt-1 mt-1">
                  <span>Balance:</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-resort-cocoa/10 flex flex-col items-start justify-end text-[11px] min-h-[80px]">
              <p className="mb-2 font-semibold">Assisted by:</p>
              <div className="flex flex-col items-start w-full max-w-[200px]">
                {/* Signature sits naturally above the text */}
                <Image
                  src="/images/signature.svg"
                  alt="Signature"
                  width={96}
                  height={32}
                  className="h-8 w-auto opacity-80 -mb-1 ml-4 pointer-events-none"
                />
                <div className="border-b border-resort-cocoa/40 w-full pb-1 text-resort-cocoa font-bold pl-2">
                  <span>{form.assistedBy || "Piero Beach Resort"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center w-full max-w-[520px] print:hidden">
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-resort-olive text-resort-white rounded shadow hover:bg-resort-olive/90 transition disabled:opacity-50 font-bold"
          >
            <ImageIcon className="w-5 h-5" /> {isExporting ? "Exporting..." : "Download Confirmation as PNG"}
          </button>
        </div>
      </div>

    </div>
  );
}
