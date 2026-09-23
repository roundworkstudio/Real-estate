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

export const sampleProperties: Property[] = [
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
