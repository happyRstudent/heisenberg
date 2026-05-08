import { NextResponse } from "next/server";
import { saveImageFile } from "@/lib/upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files");

  if (files.length > 0) {
    const uploaded: string[] = [];
    for (const item of files) {
      if (!(item instanceof File) || !item.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
      }
      uploaded.push(await saveImageFile(item));
    }
    return NextResponse.json({ imagePaths: uploaded });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
  }

  const imagePath = await saveImageFile(file);
  return NextResponse.json({ imagePath });
}
