import Image from "next/image";
import Link from "next/link";
import { money, type Product } from "@/lib/catalog";

export function CourseCard({ p }: { p: Product }) {
  const lessons = p.modules?.reduce((s, m) => s + m.lessons, 0) ?? 0;
  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={p.image ?? "/images/course-accelerator.jpg"} alt={p.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">{p.badge}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-slate-500">
          {p.modules?.length} modules · {lessons} lessons
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-600">{p.tagline}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            {p.compareAt && <span className="mr-2 text-sm text-slate-400 line-through">{money(p.compareAt)}</span>}
            <span className="text-2xl font-extrabold text-slate-900">{money(p.price)}</span>
          </div>
          <Link href={`/courses/${p.slug}`} className="btn-primary px-4 py-2 text-sm">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
