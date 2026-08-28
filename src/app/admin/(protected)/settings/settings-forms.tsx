"use client";

import { useState } from "react";
import { updatePaymentSettings, updateBookingSettings, updateDiscountSetting, updateSiteDetails } from "@/lib/admin/actions";
import { cieloUpdatePaymentSettings, cieloUpdateBookingSettings, cieloUpdateSiteDetails } from "@/lib/admin/cielo-actions";

export default function SettingsForms({ 
  initialSettings, 
  rooms,
  property = "piero",
}: { 
  initialSettings: Record<string, unknown>, 
  rooms: { id: string, name: string, discounted_rate: number, regular_rate: number }[],
  property?: "piero" | "cielo",
}) {
  const initialDiscount = (initialSettings.global_discount_percentage as number) || 0;
  const [discount, setDiscount] = useState(initialDiscount);

  const [paymentStatus, setPaymentStatus] = useState({ loading: false, message: "", type: "" });
  const [bookingStatus, setBookingStatus] = useState({ loading: false, message: "", type: "" });
  const [pricingStatus, setPricingStatus] = useState({ loading: false, message: "", type: "" });
  const [siteDetailsStatus, setSiteDetailsStatus] = useState({ loading: false, message: "", type: "" });

  type TabType = "payment" | "booking" | "marketing" | "site_details";
  const [activeTab, setActiveTab] = useState<TabType>("payment");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentStatus({ loading: true, message: "", type: "" });
    const formData = new FormData(e.currentTarget);
    const data = {
      bank_transfer_enabled: true,
      bank_name: formData.get("bank_name"),
      bank_account_name: formData.get("bank_account_name"),
      bank_account_number: formData.get("bank_account_number"),
      gcash_enabled: true,
      gcash_name: formData.get("gcash_name"),
      gcash_number: formData.get("gcash_number"),
    };

    try {
      const result = property === "cielo" 
        ? await cieloUpdatePaymentSettings(data)
        : await updatePaymentSettings(data);

      if (result?.error) throw new Error(result.error);
      setPaymentStatus({ loading: false, message: "Payment settings saved.", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPaymentStatus({ loading: false, message: err.message, type: "error" });
      } else {
        setPaymentStatus({ loading: false, message: "Error", type: "error" });
      }
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus({ loading: true, message: "", type: "" });
    const formData = new FormData(e.currentTarget);
    const data = {
      extra_person_fee: parseFloat(formData.get("extra_person_fee") as string),
      security_deposit: parseFloat(formData.get("security_deposit") as string) || 0,
      check_in_time: formData.get("check_in_time"),
      check_out_time: formData.get("check_out_time"),
    };

    try {
      const result = property === "cielo"
        ? await cieloUpdateBookingSettings(data)
        : await updateBookingSettings(data);

      if (result?.error) throw new Error(result.error);
      setBookingStatus({ loading: false, message: "Booking settings saved.", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBookingStatus({ loading: false, message: err.message, type: "error" });
      } else {
        setBookingStatus({ loading: false, message: "Error", type: "error" });
      }
    }
  };

  const handleSiteDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSiteDetailsStatus({ loading: true, message: "", type: "" });
    const formData = new FormData(e.currentTarget);
    const data = {
      site_email: formData.get("site_email") as string,
      site_phone: formData.get("site_phone") as string,
      site_whatsapp: formData.get("site_whatsapp") as string,
      site_facebook: formData.get("site_facebook") as string,
      site_google_maps: formData.get("site_google_maps") as string,
    };

    try {
      const result = property === "cielo"
        ? await cieloUpdateSiteDetails(data)
        : await updateSiteDetails(data);

      if (result?.error) throw new Error(result.error);
      setSiteDetailsStatus({ loading: false, message: "Site details saved.", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSiteDetailsStatus({ loading: false, message: err.message, type: "error" });
      } else {
        setSiteDetailsStatus({ loading: false, message: "Error", type: "error" });
      }
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPricingStatus({ loading: true, message: "", type: "" });
    
    try {
      const result = await updateDiscountSetting(discount);
      if (result?.error) throw new Error(result.error);
      setPricingStatus({ loading: false, message: "Pricing updated across all rooms.", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPricingStatus({ loading: false, message: err.message, type: "error" });
      } else {
        setPricingStatus({ loading: false, message: "Error", type: "error" });
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl">
      <div className={`w-full md:w-64 flex-col shrink-0 md:pr-6 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        {/* Menu Card */}
        <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-resort-cocoa/5 md:border-none md:border-r md:border-resort-cocoa/10 overflow-hidden flex flex-col md:gap-2">
          <button 
            onClick={() => handleTabClick("payment")} 
            className={`text-left px-4 py-4 md:py-3 md:rounded-md text-sm font-medium transition-colors border-b border-gray-50 md:border-none flex justify-between items-center ${activeTab === "payment" ? "md:bg-[#132c4a] md:text-white" : "text-resort-cocoa hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Payment Methods</span>
            </div>
            <svg className="w-4 h-4 text-gray-300 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {property === "piero" && (
            <button 
              onClick={() => handleTabClick("marketing")} 
              className={`text-left px-4 py-4 md:py-3 md:rounded-md text-sm font-medium transition-colors border-b border-gray-50 md:border-none flex justify-between items-center ${activeTab === "marketing" ? "md:bg-[#132c4a] md:text-white" : "text-resort-cocoa hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Marketing Discount</span>
              </div>
              <svg className="w-4 h-4 text-gray-300 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <button 
            onClick={() => handleTabClick("booking")} 
            className={`text-left px-4 py-4 md:py-3 md:rounded-md text-sm font-medium transition-colors md:border-none flex justify-between items-center ${activeTab === "booking" ? "md:bg-[#132c4a] md:text-white" : "text-resort-cocoa hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Booking Details</span>
            </div>
            <svg className="w-4 h-4 text-gray-300 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button 
            onClick={() => handleTabClick("site_details")} 
            className={`text-left px-4 py-4 md:py-3 md:rounded-md text-sm font-medium transition-colors md:border-none flex justify-between items-center ${activeTab === "site_details" ? "md:bg-[#132c4a] md:text-white" : "text-resort-cocoa hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Site Details</span>
            </div>
            <svg className="w-4 h-4 text-gray-300 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ${!mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <button 
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden mb-6 flex items-center text-sm font-medium text-resort-cocoa hover:text-[#132c4a] transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Settings
        </button>

        {activeTab === "payment" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 border-b border-resort-cocoa/10 pb-2">
              <h2 className="font-serif text-2xl text-[#132c4a]">Payment Methods</h2>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-8 max-w-2xl">
              {paymentStatus.message && (
                <div className={`p-4 text-sm rounded-lg ${paymentStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {paymentStatus.message}
                </div>
              )}
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#132c4a]">GCash</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-resort-cocoa/70 mb-1">Account Name</label>
                      <input type="text" name="gcash_name" defaultValue={(initialSettings.gcash_name as string) || ""} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-resort-cocoa/70 mb-1">Account Number</label>
                      <input type="text" name="gcash_number" defaultValue={(initialSettings.gcash_number as string) || ""} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-resort-cocoa/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#132c4a]">Bank Transfer</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-resort-cocoa/70 mb-1">Bank Name</label>
                      <input type="text" name="bank_name" defaultValue={(initialSettings.bank_name as string) || ""} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-resort-cocoa/70 mb-1">Account Name</label>
                      <input type="text" name="bank_account_name" defaultValue={(initialSettings.bank_account_name as string) || ""} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-resort-cocoa/70 mb-1">Account Number</label>
                      <input type="text" name="bank_account_number" defaultValue={(initialSettings.bank_account_number as string) || ""} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={paymentStatus.loading} className="px-6 py-2.5 bg-[#132c4a] text-white rounded-md text-sm hover:bg-[#1a3a61] disabled:opacity-50 transition-colors">
                {paymentStatus.loading ? "Saving..." : "Save Payment Methods"}
              </button>
            </form>
          </section>
        )}

        {activeTab === "booking" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 border-b border-resort-cocoa/10 pb-2">
              <h2 className="font-serif text-2xl text-[#132c4a]">Booking Details</h2>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6 max-w-2xl">
              {bookingStatus.message && (
                <div className={`p-4 text-sm rounded-lg ${bookingStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {bookingStatus.message}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Extra Person Fee (₱)</label>
                  <input type="number" step="0.01" name="extra_person_fee" defaultValue={initialSettings.extra_person_fee as number} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Security Deposit (₱)</label>
                  <input type="number" step="0.01" name="security_deposit" defaultValue={initialSettings.security_deposit as number} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Check-in Time</label>
                  <input type="text" name="check_in_time" defaultValue={(initialSettings.check_in_time as string) || ""} placeholder="e.g. 2:00 PM" className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Check-out Time</label>
                  <input type="text" name="check_out_time" defaultValue={(initialSettings.check_out_time as string) || ""} placeholder="e.g. 12:00 NN" className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
              </div>

              <button type="submit" disabled={bookingStatus.loading} className="px-6 py-2.5 bg-[#132c4a] text-white rounded-md text-sm hover:bg-[#1a3a61] disabled:opacity-50 transition-colors">
                {bookingStatus.loading ? "Saving..." : "Save Booking Details"}
              </button>
            </form>
          </section>
        )}

        {activeTab === "marketing" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 border-b border-resort-cocoa/10 pb-2">
              <h2 className="font-serif text-2xl text-[#132c4a]">Marketing Discount</h2>
            </div>
            
            <p className="text-sm text-resort-cocoa/70 mb-6 max-w-2xl">
              This controls the <strong>&quot;crossed out&quot;</strong> regular rate shown to customers.
            </p>
            
            <form onSubmit={handlePricingSubmit} className="space-y-6 max-w-2xl">
              {pricingStatus.message && (
                <div className={`p-4 text-sm rounded-lg ${pricingStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {pricingStatus.message}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-4">Display Discount Percentage: {discount}%</label>
                <input 
                  type="range" 
                  name="discount" 
                  min="0" 
                  max="80" 
                  step="5"
                  value={discount}
                  className="w-full accent-[#132c4a] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
                  onChange={(e) => setDiscount(parseInt(e.target.value, 10))}
                />
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-semibold mb-3">Room Price Preview</h3>
                  <ul className="space-y-2">
                    {rooms.map(room => {
                      const newDiscountedRate = room.regular_rate * (1 - discount / 100);
                      return (
                        <li key={room.id} className="flex justify-between items-center text-sm">
                          <span className="text-[#132c4a]">{room.name}</span>
                          <span>
                            <span className="line-through text-gray-400 mr-2">₱{room.regular_rate.toLocaleString()}</span>
                            <span className="font-medium text-[#132c4a]">₱{newDiscountedRate.toLocaleString()}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <button type="submit" disabled={pricingStatus.loading} className="px-6 py-2.5 bg-[#c4a47c] text-white rounded-md text-sm hover:bg-[#b0936e] disabled:opacity-50 transition-colors">
                {pricingStatus.loading ? "Updating..." : "Update Live Pricing"}
              </button>
            </form>
          </section>
        )}

        {activeTab === "site_details" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 border-b border-resort-cocoa/10 pb-2">
              <h2 className="font-serif text-2xl text-[#132c4a]">Site Details</h2>
            </div>
            
            <form onSubmit={handleSiteDetailsSubmit} className="space-y-6 max-w-2xl">
              {siteDetailsStatus.message && (
                <div className={`p-4 text-sm rounded-lg ${siteDetailsStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {siteDetailsStatus.message}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Email Address</label>
                  <input type="email" name="site_email" defaultValue={(initialSettings.site_email as string) || "pierobeachresortph@gmail.com"} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Phone Number</label>
                  <input type="text" name="site_phone" defaultValue={(initialSettings.site_phone as string) || "+63 995 385 5517"} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-resort-cocoa/70 mb-1">WhatsApp Number</label>
                  <input type="text" name="site_whatsapp" defaultValue={(initialSettings.site_whatsapp as string) || "+63 955 318 2012"} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Facebook Link</label>
                  <input type="url" name="site_facebook" defaultValue={(initialSettings.site_facebook as string) || "https://www.facebook.com/"} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-resort-cocoa/70 mb-1">Google Maps Link</label>
                  <input type="url" name="site_google_maps" defaultValue={(initialSettings.site_google_maps as string) || "https://maps.google.com/"} className="w-full p-2.5 bg-white border border-resort-cocoa/20 rounded-md focus:border-[#c4a47c] outline-none" />
                </div>
              </div>

              <button type="submit" disabled={siteDetailsStatus.loading} className="px-6 py-2.5 bg-[#132c4a] text-white rounded-md text-sm hover:bg-[#1a3a61] disabled:opacity-50 transition-colors">
                {siteDetailsStatus.loading ? "Saving..." : "Save Site Details"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
