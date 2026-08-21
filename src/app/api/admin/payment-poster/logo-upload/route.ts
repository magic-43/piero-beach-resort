import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/auth";

const LOGO_BUCKET = "payment-poster-logos";

export async function POST(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const allowedTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

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
