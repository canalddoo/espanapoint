import { PRODUCTS_DATA } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ProductActions from "./ProductActions";
import "./product.css";

export function generateStaticParams() {
  return PRODUCTS_DATA.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS_DATA.find((item) => item.id === Number(id));

  return product
    ? {
        title: product.name,
        description: `${product.name}. Disponible en la categoría ${product.category} en Espanapoint.`,
        alternates: { canonical: `/produits/${product.id}` },
      }
    : { title: "Producto no encontrado" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = PRODUCTS_DATA.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  const description = `${product.name}. Producto seleccionado para nuestra categoría ${product.category}, con compra segura, envío rápido y atención al cliente de Espanapoint.`;

  return (
    <main className="product-detail">
      <Link href="/produits" className="product-detail-back">
        <i className="fas fa-arrow-left"></i> Ver todos los productos
      </Link>

      <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-detail-info">
        <span className="product-detail-cat">{product.category}</span>

        <h1>{product.name}</h1>

        <p className="product-detail-price">
          {product.price.toLocaleString()} €
        </p>

        <p className="product-detail-description">{description}</p>

        <ul className="product-detail-benefits">
          <li>Compra segura</li>
          <li>Envío rápido</li>
          <li>Atención al cliente disponible</li>
        </ul>

        <ProductActions product={product} />
      </div>
    </main>
  );
}
