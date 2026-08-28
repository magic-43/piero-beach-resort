import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const LOGO_BUCKET = "payment-poster-logos";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    const fileExt = allowedTypes[file.type];
    if (!fileExt) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP are allowed." }, { status: 400 });
    }

    const fileName = `logo-${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo to storage bucket." }, { status: 500 });
    }

    const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      bucket: LOGO_BUCKET,
      filePath,
      publicUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Admin logo upload failed:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

