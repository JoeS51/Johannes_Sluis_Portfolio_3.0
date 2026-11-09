import { ogCard, ogContentType, ogSize } from "../_og/card";

export const alt = "Projects by Joe Sluis";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ eyebrow: "JOE SLUIS", title: "Projects", subtitle: "Side projects and open source contributions." });
}
