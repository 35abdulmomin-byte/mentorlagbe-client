const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) {
    throw new Error("ImgBB API key সেট করা নেই");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("শুধু ছবি আপলোড করা যাবে");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("ছবির সাইজ ৫MB এর বেশি হবে না");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে");
  }

  return data.data.url as string;
}