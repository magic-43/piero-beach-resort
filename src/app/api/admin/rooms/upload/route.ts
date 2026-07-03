import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/auth";

const ROOM_IMAGES_BUCKET = "room-images";

export async function POST(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const roomId = String(formData.get("roomId") || "");
    const roomSlug = String(formData.get("roomSlug") || roomId || "room");

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

    const safeSlug = roomSlug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const fileName = `${safeSlug}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `rooms/${safeSlug}/${fileName}`;

    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(ROOM_IMAGES_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload image to storage bucket." }, { status: 500 });
    }

    const { data } = supabase.storage.from(ROOM_IMAGES_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      bucket: ROOM_IMAGES_BUCKET,
      filePath,
      publicUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Admin room image upload failed:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
