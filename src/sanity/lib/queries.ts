import groq from "groq";

// All posts, newest first — fields needed for cards/listing.
export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(date desc) {
    "slug": slug.current,
    title,
    date,
    author,
    category,
    excerpt,
    "image": mainImage.asset->url,
    "authorImage": authorImage.asset->url
  }
`;

// All slugs — used by getStaticPaths.
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

// A single post by slug, including Portable Text body.
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    date,
    author,
    category,
    excerpt,
    "image": mainImage.asset->url,
    "authorImage": authorImage.asset->url,
    body
  }
`;
