"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

interface StickyProduct {
  id: string;
  title: string;
  price: number;
  slug: string;
  image: string;
  categoryName: string;
}

const StickyCartBar = dynamic(
  () => import("@/components/product/StickyCartBar"),
  { ssr: false },
);

interface ClientProductLayoutProps extends PropsWithChildren {
  product: StickyProduct;
}

export default function ClientProductLayout({
  children,
  product,
}: ClientProductLayoutProps) {
  return (
    <>
      {children}
      <StickyCartBar product={product} />
    </>
  );
}

