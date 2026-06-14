import { redirect } from "next/navigation";

export default async function QrRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/comercio/${slug}?via_qr=1`);
}
