import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/admin/NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id }, include: { translations: true } });
  if (!post) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Modifica news</h1>
      <NewsForm newsId={post.id} initial={post} />
    </div>
  );
}
