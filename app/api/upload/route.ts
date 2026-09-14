import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const { data: { user }, error: authError } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null }, error: null };

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileName = `projects/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2.send(command);

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}