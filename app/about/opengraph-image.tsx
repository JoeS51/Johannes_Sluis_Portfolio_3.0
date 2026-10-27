import { ogCard, ogContentType, ogSize } from "../_og/card";

export const alt = "About Joe Sluis";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ eyebrow: "JOE SLUIS", title: "About", subtitle: "Software engineer on the Azure HorizonDB engine team." });
}
