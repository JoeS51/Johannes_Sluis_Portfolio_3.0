import { ogCard, ogContentType, ogSize } from "../_og/card";

export const alt = "Writing by Joe Sluis";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ eyebrow: "JOE SLUIS", title: "Writing", subtitle: "Articles about databases, software internals, and side projects." });
}
