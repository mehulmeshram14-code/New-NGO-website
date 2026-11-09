export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Leave undefined until a real bio is written; the card hides it. */
  bio?: string;
  /** Real photo only. Without one, the card shows the member's initials. */
  image?: string;
}

export const team: TeamMember[] = [
  {
    id: "member-1",
    name: "Utkarsh Meshram",
    role: "Founder",
    bio: "He completed his graduation from TISS Mumbai with an MS in Regulatory Policy and Governance.",
    image: "/utkarsh-meshram.jpeg",
  },
  {
    id: "member-2",
    name: "Prayas Sarvadhikari",
    role: "Founder",
    image: "/prayas.jpeg",
  },
  {
    id: "member-3",
    name: "Mehul",
    role: "Technical Head",
  },
];
