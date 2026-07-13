import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadFile, UploadError } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const saved = await saveUploadFile(file);
    return NextResponse.json(saved);
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
