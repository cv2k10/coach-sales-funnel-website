import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getProduct, getProductBySlug } from "@/lib/catalog";

export const metadata = { title: "Secure Checkout — Elevate Academy" };

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || (product.kind !== "course" && product.kind !== "tripwire")) notFound();
  const bump = getProduct("vault")!;
  return (
    <section className="container-x py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">You&apos;re one step away from {product.name}</h1>
        <p className="mt-2 text-slate-600">Complete your enrollment below — instant access after purchase.</p>
      </div>
      <CheckoutForm product={product} bump={bump} />
    </section>
  );
}
