/**
 * The "Contact Us" Google Form that our custom form submits to from the server.
 *
 * Entry IDs come from the live form (view source → FB_PUBLIC_LOAD_DATA_). If a
 * question is added, removed or recreated in Google Forms, its entry ID changes
 * and must be updated here, otherwise submissions will be rejected by Google.
 */
export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Volunteering",
  "Donation",
  "Inquiry",
  "Partnership",
  "Other",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const googleContactForm = {
  formResponseUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScwT8k43VzTdVyDvaU_QEbojMrdNwP9qKzk1zSdoDog92jppQ/formResponse",
  entries: {
    name: "entry.1889649387",
    email: "entry.1494938410",
    subject: "entry.1749040447", // dropdown: value must exactly match one of CONTACT_SUBJECTS
    message: "entry.1404385190",
  },
};
