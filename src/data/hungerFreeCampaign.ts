export const HUNGER_FREE_PATH = "/campaign/hunger-free";
const IMAGE_BASE = "/campaign/hunger-free";

export interface Beneficiary {
  id: string;
  src: string;
  name?: string;
  age?: number;
  label: string;
}

export const hungerFreeCampaign = {
  // Sent to Razorpay / stored on the donation record.
  campaignName: "Hunger Free - Vidarbha",

  hero: {
    eyebrow: "Hunger Free Vidarbha",
    titleLead: "No one should",
    titleAccent: "sleep hungry.",
    description:
      "Helping underserved communities across Vidarbha access food, nutrition, education, and opportunities for a better future.",
    image: `${IMAGE_BASE}/hero.jpg`,
    imageAlt: "DeepRoots Foundation volunteers serving hot meals to community members in Vidarbha",
  },

  donation: {
    purpose: "Hunger relief in Vidarbha",
    eyebrow: "Sponsor a meal",
    title: "Your contribution can become someone's next meal.",
    description:
      "Choose an amount, pay securely through Razorpay, and get an on-screen receipt you can print or save.",
  },

  beneficiaries: {
    eyebrow: "From the field",
    title: "Every meal reaches a real person.",
    description:
      "Photographs from our community kitchen and rural food distribution drives across Vidarbha.",
    rowOne: [
      { id: "bp-3", src: `${IMAGE_BASE}/beneficiaries/image3.jpeg`, name: "Saraswati Shantaram Maske", age: 80, label: "Elder Daily Food Seva" },
      { id: "bp-drive", src: `${IMAGE_BASE}/beneficiaries/image-drive.jpeg`, label: "Meal Seva Beneficiary" },
      { id: "bp-4", src: `${IMAGE_BASE}/beneficiaries/image4.jpeg`, name: "Sunita Rajendra Ghadge", age: 60, label: "Warm Meal Seva" },
      { id: "bp-6", src: `${IMAGE_BASE}/beneficiaries/image6.jpeg`, name: "Savita Bhalchandra Kulkarni", age: 64, label: "Elder Nutrition Seva" },
      { id: "bp-9", src: `${IMAGE_BASE}/beneficiaries/image9.jpeg`, name: "Urmila Daulatrao Kukade", age: 70, label: "Nutritious Food Seva" },
      { id: "bp-11", src: `${IMAGE_BASE}/beneficiaries/image11.jpeg`, name: "Nirmala Kisanrao Patil", age: 65, label: "Community Food Seva" },
      { id: "bp-14", src: `${IMAGE_BASE}/beneficiaries/image14.jpeg`, name: "Mangla Ganesh Vijaykar", age: 57, label: "Fresh Meal Kit" },
      { id: "bp-15", src: `${IMAGE_BASE}/beneficiaries/image15.jpeg`, name: "Varsha Sunil Dhotre", age: 43, label: "Doorstep Nutrition Seva" },
    ] satisfies Beneficiary[],
    rowTwo: [
      { id: "bp-8", src: `${IMAGE_BASE}/beneficiaries/image8.jpeg`, name: "Lilabai Kisanrao Tambatkar", age: 80, label: "Elder Food Nutrition" },
      { id: "bp-12", src: `${IMAGE_BASE}/beneficiaries/image12.jpeg`, name: "Godavari Prabhakar Gadave", age: 75, label: "Elder Nutrition Seva" },
      { id: "bp-16", src: `${IMAGE_BASE}/beneficiaries/image16.jpeg`, name: "Geeta Damuji Yadav", age: 52, label: "Nutrition Meal Kit" },
      { id: "bp-17", src: `${IMAGE_BASE}/beneficiaries/image17.jpeg`, name: "Sahebrao Wathodkar", age: 75, label: "Community Seva" },
      { id: "bp-18", src: `${IMAGE_BASE}/beneficiaries/image18.jpeg`, name: "Ishwardas Kodumal Gangwani", age: 64, label: "Hot Meal Seva" },
      { id: "bp-19", src: `${IMAGE_BASE}/beneficiaries/image19.jpeg`, name: "Mangla Bana Bakode", age: 74, label: "Village Outreach Seva" },
      { id: "bp-20", src: `${IMAGE_BASE}/beneficiaries/image20.jpeg`, name: "Sudhakar Kapse", age: 75, label: "Grassroots Relief Seva" },
      { id: "bp-21", src: `${IMAGE_BASE}/beneficiaries/image21.jpeg`, name: "Vinod Wante", age: 55, label: "Daily Food Seva" },
    ] satisfies Beneficiary[],
  },

  trust: {
    eyebrow: "Transparency & governance",
    title: "Your trust makes our mission possible.",
    description:
      "DeepRoots Foundation operates with clear governance, accountability, and statutory compliance across all of its work.",
    items: [
      {
        label: "Donation receipts",
        title: "A digital receipt for every contribution",
        description: "An on-screen receipt with a unique reference ID, ready to print or save.",
      },
      {
        label: "Fund utilisation",
        title: "Contributions go to field nutrition work",
        description: "Public contributions directly sustain our food and nutrition initiatives.",
      },
      {
        label: "Registered office",
        title: "Amravati, Vidarbha, Maharashtra",
        description: "24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Join the cause",
    titleLead: "Be the reason",
    titleAccent: "someone finds hope.",
    description:
      "Your support helps DeepRoots Foundation work towards a future where food security, education, and dignity are within everyone's reach.",
  },
};
