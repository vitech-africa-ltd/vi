import { ScriptProduct, INITIAL_SCRIPTS } from '../data/scriptsData';

export interface JsonLdProductSchema {
  '@type': string[];
  '@id': string;
  name: string;
  description: string;
  image: string[];
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  softwareVersion: string;
  programmingLanguage: string;
  fileSize: string;
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: string;
    worstRating: string;
  };
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    priceValidUntil: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
      url: string;
    };
    acceptedPaymentMethod: string[];
  };
  author: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

const BASE_URL = 'https://vitechafrica.vercel.app';

/**
 * Generates Schema.org SoftwareApplication / Product structured JSON-LD for a single script product
 */
export function generateProductJsonLd(product: ScriptProduct): JsonLdProductSchema {
  return {
    '@type': ['SoftwareApplication', 'Product'],
    '@id': `${BASE_URL}/#scripts/${product.slug}`,
    name: product.title,
    description: product.description,
    image: [product.previewImage, ...(product.screenshots || [])],
    url: `${BASE_URL}/#scripts/${product.slug}`,
    applicationCategory: product.categoryLabel,
    operatingSystem: 'Cross-platform (Linux, Cloud, Docker, Android, iOS, Windows, macOS)',
    softwareVersion: product.analysis.version,
    programmingLanguage: product.analysis.language,
    fileSize: product.analysis.fileSize,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: product.isFree ? 0 : product.priceUSD,
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'V&I TECH AFRICA LTD',
        url: BASE_URL,
      },
      acceptedPaymentMethod: [
        'MTN Mobile Money Rwanda (*182#)',
        'Airtel Money Rwanda (*500#)',
        'Stripe Credit Card',
        'Bank Transfer',
      ],
    },
    author: {
      '@type': 'Organization',
      name: 'V&I TECH AFRICA LTD',
      url: BASE_URL,
    },
  };
}

/**
 * Generates Schema.org ItemList with SoftwareApplication/Product items for the whole marketplace
 */
export function generateMarketplaceJsonLd(products: ScriptProduct[] = INITIAL_SCRIPTS) {
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#scripts-catalog`,
    name: 'Vitech Scripts & Source Codes Marketplace Catalog',
    description:
      'Collection de codes sources audités OWASP, passerelles Mobile Money MTN/Airtel, architectures SaaS Laravel 11, apps Flutter et starter kits d’administration.',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductJsonLd(product),
    })),
  };
}
