"use client";

import { useActionState, useState } from "react";
import { adminLogin } from "@/lib/admin/actions";
import { Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { siteImages } from "@/data/resort";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return await adminLogin(formData);
    },
    { error: "" }
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-resort-offwhite p-4">
      <div className="w-full max-w-md bg-resort-white rounded-xl shadow-xl overflow-hidden border border-resort-cocoa/5">
        <div className="h-32 bg-resort-cocoa relative flex items-center justify-center">
          <Image
            src={siteImages.homeHero}
            alt="Piero Beach Resort"
            fill
            className="object-cover opacity-20"
          />
          <div className="relative z-10 text-resort-white text-center">
            <Lock className="w-6 h-6 mx-auto mb-2 text-resort-seafoam" />
            <h1 className="font-serif text-xl tracking-widest uppercase">Admin Access</h1>
          </div>
        </div>

        <div className="p-8">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded border border-red-100 font-medium">
                {state.error}
              </div>
            )}

            <div>
              <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-[#c4a47c] transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full p-3 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-[#c4a47c] transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-resort-cocoa/50 hover:text-resort-cocoa transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#132c4a] text-white hover:bg-[#c4a47c] font-bold text-xs tracking-widest uppercase py-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 text-xs text-resort-cocoa/40 tracking-wider">
        Piero Beach Resort © {new Date().getFullYear()}
      </div>
    </div>
  );
}
