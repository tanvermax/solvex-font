// src/components/seo/SEO.tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article" | "category";
  price?: number;
  currency?: string;
  productName?: string;
  availability?: "in stock" | "out of stock";
  brand?: string;
  sku?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

const BASE_URL = "https://solvexsupply.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = "SolveX Supply";

export default function SEO({
  title,
  description = "Enterprise Industrial B2B Supplies & Corporate Procurement Platform in Bangladesh",
  keywords = "B2B, industrial supplies, corporate procurement, bulk order, RFQ, wholesale",
  image = DEFAULT_IMAGE,
  url = "/",
  type = "website",
  price,
  currency = "BDT",
  productName,
  availability,
  brand,
  sku,
  publishedAt,
  modifiedAt,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  return (
    <Helmet>
      {/* 🔥 Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* 🔥 Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* 🔥 Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 🔥 Product Schema */}
      {type === "product" && productName && price && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: productName,
            image: image,
            description: description,
            sku: sku,
            brand: {
              "@type": "Brand",
              name: brand || SITE_NAME,
            },
            offers: {
              "@type": "Offer",
              url: fullUrl,
              priceCurrency: currency,
              price: price,
              availability: `https://schema.org/${
                availability === "in stock" ? "InStock" : "OutOfStock"
              }`,
              seller: {
                "@type": "Organization",
                name: SITE_NAME,
              },
            },
          })}
        </script>
      )}

      {/* 🔥 Article Schema */}
      {type === "article" && publishedAt && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            image: image,
            datePublished: publishedAt,
            dateModified: modifiedAt || publishedAt,
            author: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          })}
        </script>
      )}
    </Helmet>
  );
}