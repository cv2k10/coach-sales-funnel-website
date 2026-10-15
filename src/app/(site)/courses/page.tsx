import Link from "next/link";
import { COURSES } from "@/lib/catalog";
import { CourseCard } from "@/components/course-card";

export const metadata = { title: "Courses — Elevate Academy" };

export default function CoursesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="container-x text-center">
          <p className="eyebrow">All programs</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Choose your next breakthrough</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Self-paced courses with lifetime access, templates and a supportive community. Every program is backed by a 30-day guarantee.
          </p>
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((p) => <CourseCard key={p.sku} p={p} />)}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-bold">Not sure where to start?</h3>
            <p className="mt-1 text-slate-600">Book a free 30-minute strategy call and get a personalized roadmap.</p>
          </div>
          <Link href="/book-call" className="btn-primary shrink-0">Book my free call</Link>
        </div>
      </section>
    </>
  );
}
