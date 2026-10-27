import { ogCard, ogContentType, ogSize } from "./_og/card";

export const alt = "Joe Sluis, software engineer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ eyebrow: "SOFTWARE ENGINEER", title: "JOE SLUIS", subtitle: "Azure HorizonDB · databases & systems" });
}
