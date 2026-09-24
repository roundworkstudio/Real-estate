/**
 * SAMPLE DATA — not real listings.
 *
 * The photography is real (converted from client footage, see
 * directives/prepare_media.md — several are frame grabs from video, since
 * this client's shoot has far more video than stills; noted per image
 * below). The price, yield, rent, and
 * specs are placeholder figures for layout purposes only, invented to be
 * internally consistent (expectedAnnualRentAed / priceAed ≈ grossYield) and
 * plausible for the UAE market, but not sourced from any actual listing.
 * Replace via the data-access module once real listings exist — see
 * PROJECT-BRIEF.md.
 */
import type { Property } from "./types";

/**
 * Wadeem Gardens (MODON, Hudayriyat Island, Abu Dhabi) — real developer
 * brochure data, not placeholder, sourced from the client-supplied PDF
 * (`Wadeem Gardens.pdf`, EOI-stage sales pack). Sizes, prices, and the
 * payment plan are quoted exactly as shown in the pack (GSA converted
 * m²→sqft; ×10.7639). Bathroom count and rental/yield figures are NOT
 * stated anywhere in the pack, so grossYield/expectedAnnualRentAed stay
 * null and `baths` is omitted rather than guessed — same honesty rule as
 * the rest of this file, just applied to a real source instead of an
 * invented one. The pack's own payment-plan structure lives in
 * lib/paymentPlan.ts as the "wadeem-adib" structure.
 */
const wadeemGardensVillas: Property[] = [
  {
    slug: "wadeem-gardens-4br",
    title: "Wadeem Gardens Villa — 4 Bedroom",
    community: "Wadeem Gardens",
    city: "Abu Dhabi",
    priceAed: 8_700_000,
    beds: 4,
    sqft: 4629, // GSA 430 m²
    plotSqft: 5726, // Plot area 532 m²
    status: "off-plan",
    strategy: "off-plan",
    grossYield: null,
    expectedAnnualRentAed: null,
    image: {
      src: "/media/wadeem-gardens/villa-4br.jpg",
      alt: "Wadeem Gardens 4-bedroom villa exterior, Hudayriyat Island",
    },
    gallery: [
      { src: "/media/wadeem-gardens/hero.jpg", alt: "Aerial view of Wadeem Gardens villas on the coastline" },
      { src: "/media/wadeem-gardens/villa-4br.jpg", alt: "Wadeem Gardens 4-bedroom villa exterior" },
      { src: "/media/wadeem-gardens/interior-living.jpg", alt: "Living room, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-kitchen.jpg", alt: "Kitchen and dining, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-bedroom.jpg", alt: "Bedroom suite, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/floorplan-4br.jpg", alt: "4-bedroom floor plan, Layout A & B" },
    ],
  },
  {
    slug: "wadeem-gardens-5br",
    title: "Wadeem Gardens Villa — 5 Bedroom",
    community: "Wadeem Gardens",
    city: "Abu Dhabi",
    priceAed: 10_200_000,
    beds: 5,
    sqft: 5490, // GSA 510 m²
    plotSqft: 6781, // Plot area 630 m²
    status: "off-plan",
    strategy: "off-plan",
    grossYield: null,
    expectedAnnualRentAed: null,
    image: {
      src: "/media/wadeem-gardens/villa-5br.jpg",
      alt: "Wadeem Gardens 5-bedroom villa exterior, Hudayriyat Island",
    },
    gallery: [
      { src: "/media/wadeem-gardens/hero.jpg", alt: "Aerial view of Wadeem Gardens villas on the coastline" },
      { src: "/media/wadeem-gardens/villa-5br.jpg", alt: "Wadeem Gardens 5-bedroom villa exterior" },
      { src: "/media/wadeem-gardens/interior-living.jpg", alt: "Living room, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-kitchen.jpg", alt: "Kitchen and dining, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-bedroom.jpg", alt: "Bedroom suite, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/floorplan-5br.jpg", alt: "5-bedroom floor plan, Layout A & B" },
    ],
  },
  {
    slug: "wadeem-gardens-6br",
    title: "Wadeem Gardens Villa — 6 Bedroom",
    community: "Wadeem Gardens",
    city: "Abu Dhabi",
    priceAed: 11_600_000,
    beds: 6,
    sqft: 6362, // GSA 591 m²
    plotSqft: 7750, // Plot area 720 m²
    status: "off-plan",
    strategy: "off-plan",
    grossYield: null,
    expectedAnnualRentAed: null,
    image: {
      src: "/media/wadeem-gardens/villa-6br.jpg",
      alt: "Wadeem Gardens 6-bedroom villa exterior, Hudayriyat Island",
    },
    gallery: [
      { src: "/media/wadeem-gardens/hero.jpg", alt: "Aerial view of Wadeem Gardens villas on the coastline" },
      { src: "/media/wadeem-gardens/villa-6br.jpg", alt: "Wadeem Gardens 6-bedroom villa exterior" },
      { src: "/media/wadeem-gardens/interior-living.jpg", alt: "Living room, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-kitchen.jpg", alt: "Kitchen and dining, Wadeem Gardens villa" },
      { src: "/media/wadeem-gardens/interior-bedroom.jpg", alt: "Bedroom suite, Wadeem Gardens villa" },
      // No 6-bedroom floor plan page was located in the pack — 4BR/5BR
      // shown instead, not fabricated.
    ],
  },
];

export const sampleProperties: Property[] = [
  ...wadeemGardensVillas,
  {
    slug: "ramhan-villa-1",
    title: "Villa on Ramhan Island",
    community: "Ramhan Island",
    city: "Abu Dhabi",
    priceAed: 8_200_000,
    beds: 5,
    baths: 6,
    sqft: 6200,
    status: "off-plan",
    strategy: "off-plan",
    grossYield: 0.058,
    expectedAnnualRentAed: 475_600,
    image: {
      src: "/media/listings/ramhan-villa-1.jpg",
      alt: "Villa on Ramhan Island, Abu Dhabi",
    },
    gallery: [
      { src: "/media/hero/ramhan-villa-hero.jpg", alt: "Exterior, Villa on Ramhan Island" },
      { src: "/media/listings/ramhan-villa-1.jpg", alt: "Living area, Villa on Ramhan Island" },
      // Frame grab from video (IMG_1838.mov) — see directives/prepare_media.md.
      { src: "/media/listings/ramhan-villa-4.jpg", alt: "Waterfront terrace at sunset, Villa on Ramhan Island" },
      // Frame grab from video (IMG_1830.mov).
      { src: "/media/listings/ramhan-villa-3.jpg", alt: "Dining area, Villa on Ramhan Island" },
    ],
  },
  {
    slug: "ramhan-villa-2",
    title: "Waterfront Villa, Ramhan Island",
    community: "Ramhan Island",
    city: "Abu Dhabi",
    priceAed: 9_650_000,
    beds: 6,
    baths: 7,
    sqft: 7100,
    status: "new",
    strategy: "yield",
    grossYield: 0.052,
    expectedAnnualRentAed: 501_800,
    image: {
      src: "/media/listings/ramhan-villa-2.jpg",
      alt: "Waterfront villa on Ramhan Island, Abu Dhabi",
    },
    gallery: [
      { src: "/media/hero/ramhan-villa-hero.jpg", alt: "Exterior, Waterfront Villa, Ramhan Island" },
      { src: "/media/listings/ramhan-villa-2.jpg", alt: "Living area, Waterfront Villa, Ramhan Island" },
      // Frame grab from video (IMG_8220.mov).
      { src: "/media/listings/ramhan-villa-5.jpg", alt: "Kitchen, Waterfront Villa, Ramhan Island" },
      { src: "/media/listings/ramhan-villa-1.jpg", alt: "Interior detail, Waterfront Villa, Ramhan Island" },
    ],
  },
];
