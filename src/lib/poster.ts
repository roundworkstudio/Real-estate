import { getImageProps } from "next/image";

/** Resized, re-encoded URL for a <video poster>, which next/image can't
 * wrap directly. Honours next.config's `images` settings (including the
 * dev-only `unoptimized` flag). Defaults suit the 9:16 portrait footage. */
export function posterSrc(src: string, width = 540, height = 960): string {
  return getImageProps({ src, alt: "", width, height }).props.src;
}
