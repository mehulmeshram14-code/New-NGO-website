/**
 * Resilient In-Memory Store for DeepRoots Foundation
 * Activated when MONGODB_URI is absent or unavailable in local development.
 * Provides unified data structures matching Mongoose models and full testability.
 */

export interface StoredDonation {
  _id: string;
  donationReference: string;
  internalId: string; // Synced alias
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
  amount: number;
  amountPaise: number;
  currency: string;
  frequency: "one_time" | "monthly";
  paymentProvider: "razorpay" | "upi_manual" | "bank_transfer" | "offline";
  razorpayOrderId?: string;
  providerOrderId?: string; // Synced alias
  razorpayPaymentId?: string;
  providerPaymentId?: string; // Synced alias
  transferReference?: string;
  status: "pending" | "authorized" | "captured" | "failed" | "refunded";
  paymentStatus: "pending" | "awaiting_verification" | "successful" | "failed" | "cancelled" | "refunded";
  campaign: string;
  isTaxReceiptRequested: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  capturedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface StoredVolunteer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  availability?: string;
  message?: string;
  status: "new" | "contacted" | "active";
  createdAt: string;
}

export interface StoredPartner {
  _id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message?: string;
  status: "new" | "in_discussion" | "partnered";
  createdAt: string;
}

export interface StoredContact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export interface StoredWebhookEvent {
  eventId: string;
  eventType: string;
  orderId?: string;
  paymentId?: string;
  processedAt: string;
}

class MemoryStore {
  donations: StoredDonation[] = [
    {
      _id: "seed_1",
      donationReference: "DRF-2026-1001",
      internalId: "DRF-2026-1001",
      donorName: "Rajesh Kulkarni",
      donorEmail: "rajesh.k@example.com",
      amount: 2000,
      amountPaise: 200000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "bank_transfer",
      transferReference: "SBI-UTR-90823411",
      status: "captured",
      paymentStatus: "successful",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      capturedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      verifiedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      verifiedBy: "Sadanand Shinde (Secretary)",
    },
    {
      _id: "seed_2",
      donationReference: "DRF-2026-1002",
      internalId: "DRF-2026-1002",
      donorName: "Ananya Sharma",
      donorEmail: "ananya.s@example.com",
      amount: 1000,
      amountPaise: 100000,
      currency: "INR",
      frequency: "monthly",
      paymentProvider: "upi_manual",
      transferReference: "UPI-429810238491",
      status: "captured",
      paymentStatus: "successful",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      capturedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      verifiedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      verifiedBy: "Utkarsh Meshram (Co-Founder)",
    },
    {
      _id: "seed_3",
      donationReference: "DRF-2026-1003",
      internalId: "DRF-2026-1003",
      donorName: "Mahesh Deshpande",
      donorEmail: "mahesh.d@example.com",
      amount: 5000,
      amountPaise: 500000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "bank_transfer",
      transferReference: "HDFC-UTR-77123901",
      status: "pending",
      paymentStatus: "awaiting_verification",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
      notes: "Transfer made via NEFT on 25 Oct",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  volunteers: StoredVolunteer[] = [];
  partners: StoredPartner[] = [];
  contacts: StoredContact[] = [];
  processedWebhookEvents: Map<string, StoredWebhookEvent> = new Map();

  addDonation(
    donation: Omit<StoredDonation, "_id" | "createdAt" | "updatedAt">
  ): StoredDonation {
    const reference = donation.donationReference || donation.internalId || `DRF-ORD-${Date.now().toString(36).toUpperCase()}`;
    const amountInPaise = donation.amountPaise || Math.round(donation.amount * 100);
    const amountInRupees = donation.amount || Math.round(amountInPaise / 100);
    const orderId = donation.razorpayOrderId || donation.providerOrderId;
    const paymentId = donation.razorpayPaymentId || donation.providerPaymentId;

    const record: StoredDonation = {
      ...donation,
      _id: "mem_" + Math.random().toString(36).substring(2, 10),
      donationReference: reference,
      internalId: reference,
      amount: amountInRupees,
      amountPaise: amountInPaise,
      razorpayOrderId: orderId,
      providerOrderId: orderId,
      razorpayPaymentId: paymentId,
      providerPaymentId: paymentId,
      status: donation.status || "pending",
      paymentStatus: donation.paymentStatus || (donation.status === "captured" ? "successful" : "pending"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.donations.unshift(record);
    return record;
  }

  getDonations(): StoredDonation[] {
    return this.donations;
  }

  findDonationByReference(ref: string): StoredDonation | undefined {
    return this.donations.find(
      (d) => d.donationReference === ref || d.internalId === ref
    );
  }

  findDonationByInternalId(internalId: string): StoredDonation | undefined {
    return this.findDonationByReference(internalId);
  }

  findDonationByOrderId(orderId: string): StoredDonation | undefined {
    return this.donations.find(
      (d) => d.razorpayOrderId === orderId || d.providerOrderId === orderId
    );
  }

  findDonationByPaymentId(paymentId: string): StoredDonation | undefined {
    return this.donations.find(
      (d) => d.razorpayPaymentId === paymentId || d.providerPaymentId === paymentId
    );
  }

  markPaymentCaptured(
    identifier: string,
    paymentId: string,
    verifierName: string
  ): StoredDonation | null {
    const item =
      this.findDonationByReference(identifier) ||
      this.findDonationByOrderId(identifier);
    if (!item) return null;

    item.status = "captured";
    item.paymentStatus = "successful";
    item.razorpayPaymentId = paymentId;
    item.providerPaymentId = paymentId;
    item.capturedAt = item.capturedAt || new Date().toISOString();
    item.verifiedAt = new Date().toISOString();
    item.verifiedBy = verifierName;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  verifyDonation(internalId: string, verifierName: string): StoredDonation | null {
    const item = this.findDonationByInternalId(internalId);
    if (!item) return null;
    item.status = "captured";
    item.paymentStatus = "successful";
    item.capturedAt = item.capturedAt || new Date().toISOString();
    item.verifiedAt = new Date().toISOString();
    item.verifiedBy = verifierName;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  updateDonationStatus(
    identifier: string,
    newStatus: StoredDonation["status"]
  ): StoredDonation | null {
    const item =
      this.findDonationByReference(identifier) ||
      this.findDonationByOrderId(identifier);
    if (!item) return null;

    // Safety: Do not overwrite an already captured payment with a delayed failure!
    if ((item.status === "captured" || item.paymentStatus === "successful") && newStatus === "failed") {
      return item;
    }

    item.status = newStatus;
    if (newStatus === "captured") {
      item.paymentStatus = "successful";
      item.capturedAt = item.capturedAt || new Date().toISOString();
    } else if (newStatus === "failed") {
      item.paymentStatus = "failed";
    }
    item.updatedAt = new Date().toISOString();
    return item;
  }

  updateDonorDetails(
    internalId: string,
    details: { donorName: string; donorEmail: string; donorPhone?: string; isTaxReceiptRequested?: boolean }
  ): StoredDonation | null {
    const item = this.findDonationByInternalId(internalId);
    if (!item) return null;
    item.donorName = details.donorName;
    item.donorEmail = details.donorEmail;
    if (details.donorPhone !== undefined) item.donorPhone = details.donorPhone;
    if (details.isTaxReceiptRequested !== undefined) item.isTaxReceiptRequested = details.isTaxReceiptRequested;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  isWebhookEventProcessed(eventId: string): boolean {
    return this.processedWebhookEvents.has(eventId);
  }

  recordWebhookEvent(eventId: string, details: Partial<StoredWebhookEvent>) {
    this.processedWebhookEvents.set(eventId, {
      eventId,
      eventType: details.eventType || "unknown",
      orderId: details.orderId,
      paymentId: details.paymentId,
      processedAt: new Date().toISOString(),
    });
  }

  addVolunteer(vol: Omit<StoredVolunteer, "_id" | "createdAt">): StoredVolunteer {
    const record: StoredVolunteer = {
      ...vol,
      _id: "vol_" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    };
    this.volunteers.unshift(record);
    return record;
  }

  addPartner(partner: Omit<StoredPartner, "_id" | "createdAt">): StoredPartner {
    const record: StoredPartner = {
      ...partner,
      _id: "prt_" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    };
    this.partners.unshift(record);
    return record;
  }

  addContact(contact: Omit<StoredContact, "_id" | "createdAt">): StoredContact {
    const record: StoredContact = {
      ...contact,
      _id: "cnt_" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    };
    this.contacts.unshift(record);
    return record;
  }

  getStats() {
    const verified = this.donations.filter(
      (d) => d.status === "captured" || d.paymentStatus === "successful"
    );
    const totalAmount = verified.reduce((sum, d) => sum + d.amount, 0);
    const pendingTransfers = this.donations.filter(
      (d) => d.paymentStatus === "awaiting_verification" || d.status === "pending"
    ).length;
    return {
      verifiedDonationsCount: verified.length,
      totalVerifiedAmount: totalAmount,
      totalPendingTransfers: pendingTransfers,
      totalVolunteers: this.volunteers.length,
      totalPartners: this.partners.length,
    };
  }
}

// Global singleton to persist across Next.js dev server reloads
declare global {
  // eslint-disable-next-line no-var
  var memoryStoreInstance: MemoryStore | undefined;
}

const memoryStore = global.memoryStoreInstance || new MemoryStore();
if (!global.memoryStoreInstance) {
  global.memoryStoreInstance = memoryStore;
}

export default memoryStore;
