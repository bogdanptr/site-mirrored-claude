import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "@sanity/types";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Image) {
  return builder.image(source);
}
