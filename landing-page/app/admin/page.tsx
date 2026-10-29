"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Clock, RefreshCw, LogOut, ArrowLeft, Check, Users, Building2 } from "lucide-react";

interface AdminSummary {
  totalVerifiedAmount: number;
  verifiedDonationsCount: number;
  pendingTransfersCount: number;
  failedPaymentsCount: number;
  volunteersCount: number;
  partnersCount: number;
  databaseMode: string;
}

interface DonationRecord {
  _id: string;
  internalId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  paymentProvider: string;
  transferReference?: string;
  paymentStatus: "pending" | "awaiting_verification" | "successful" | "failed";
  campaign: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface VolunteerRecord {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  availability?: string;
  createdAt: string;
}

interface PartnerRecord {
  _id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  createdAt: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  const [partners, setPartners] = useState<PartnerRecord[]>([]);

  const [activeTab, setActiveTab] = useState<"donations" | "volunteers" | "partners">("donations");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Check saved key on mount
  useEffect(() => {
    const saved = localStorage.getItem("deeproots_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchAdminData(saved);
    }
  }, []);

  const fetchAdminData = async (key: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/overview", {
        headers: {
          "x-admin-key": key,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Invalid key.");
      }

      setIsAuthenticated(true);
      setSummary(data.summary);
      setDonations(data.donations || []);
      setVolunteers(data.volunteers || []);
      setPartners(data.partners || []);
      localStorage.setItem("deeproots_admin_key", key);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
      setIsAuthenticated(false);
      localStorage.removeItem("deeproots_admin_key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    fetchAdminData(adminKey.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("deeproots_admin_key");
    setIsAuthenticated(false);
    setAdminKey("");
    setSummary(null);
  };

  // One-click Verify Transfer Action
  const handleVerifyTransfer = async (internalId: string) => {
    setVerifyingId(internalId);
    try {
      const res = await fetch("/api/admin/verify-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          internalId,
          verifiedBy: "Accounts Officer (Admin Portal)",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not verify transfer.");

      // Refresh data
      await fetchAdminData(adminKey);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error verifying transfer");
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredDonations =
    filterStatus === "all"
      ? donations
      : donations.filter((d) => d.paymentStatus === filterStatus);

  if (!isAuthenticated) {
    return (
      <div className="pt-36 pb-24 bg-cream min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-forest/15 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-forest-subtle text-forest flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-forest">
              DeepRoots Staff Portal
            </h1>
            <p className="text-xs text-charcoal-muted">
              Secure administrative access for financial verification and records.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter ADMIN_SECRET_KEY"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-forest/20 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-cream-light/40"
              />
              <span className="text-[10px] text-charcoal-muted mt-1 block">
                Default local passkey: <code className="bg-cream-dark px-1 py-0.5 rounded">deeproots_admin_2026</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-forest hover:bg-forest-dark text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? <span>Authenticating...</span> : <span>Access Staff Portal</span>}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-forest hover:underline">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forest/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-forest">
                DeepRoots Foundation Administration
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-subtle text-forest font-semibold">
                {summary?.databaseMode}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted">
              CIN: U88900ME2026NPL476439 · Amravati Headquarters
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAdminData(adminKey)}
              className="p-2 text-forest hover:bg-forest/10 rounded-full transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest/20 text-xs font-semibold text-charcoal hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
              Verified Donations Total
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-forest">
              ₹{summary?.totalVerifiedAmount.toLocaleString("en-IN") || 0}
            </div>
            <span className="text-[10px] text-forest font-semibold block">Authoritative received funds</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
              Verified Donors Count
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-forest">
              {summary?.verifiedDonationsCount || 0}
            </div>
            <span className="text-[10px] text-charcoal-muted block">Confirmed records</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
              Pending Bank Transfers
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-terracotta">
              {summary?.pendingTransfersCount || 0}
            </div>
            <span className="text-[10px] text-terracotta font-semibold block">Awaiting accounts confirmation</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-forest/15 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
              Volunteers &amp; Partners
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-charcoal">
              {(summary?.volunteersCount || 0) + (summary?.partnersCount || 0)}
            </div>
            <span className="text-[10px] text-charcoal-muted block">Ground engagement</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-forest/15 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("donations")}
            className={`pb-3 transition-colors border-b-2 -mb-[2px] ${
              activeTab === "donations" ? "border-forest text-forest" : "border-transparent text-charcoal-muted"
            }`}
          >
            Donations &amp; Transfers ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab("volunteers")}
            className={`pb-3 transition-colors border-b-2 -mb-[2px] ${
              activeTab === "volunteers" ? "border-forest text-forest" : "border-transparent text-charcoal-muted"
            }`}
          >
            Volunteer Applications ({volunteers.length})
          </button>
          <button
            onClick={() => setActiveTab("partners")}
            className={`pb-3 transition-colors border-b-2 -mb-[2px] ${
              activeTab === "partners" ? "border-forest text-forest" : "border-transparent text-charcoal-muted"
            }`}
          >
            CSR &amp; Partners ({partners.length})
          </button>
        </div>

        {/* Tab 1: Donations */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-muted">Filter Status:</span>
                {["all", "awaiting_verification", "successful", "pending", "failed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                      filterStatus === st
                        ? "bg-forest text-white"
                        : "bg-white text-charcoal border border-forest/15 hover:border-forest/40"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-forest/15 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-light border-b border-forest/10 uppercase text-[10px] text-charcoal-muted font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5">Reference ID</th>
                    <th className="p-3.5">Donor</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Provider / UTR</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/10 font-sans">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-charcoal-muted">
                        No donation records match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d._id} className="hover:bg-cream-light/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-forest">{d.internalId}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-charcoal">{d.donorName}</div>
                          <div className="text-[11px] text-charcoal-muted">{d.donorEmail}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-charcoal">
                          ₹{d.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3.5">
                          <div className="capitalize font-medium text-charcoal">{d.paymentProvider.replace("_", " ")}</div>
                          {d.transferReference && (
                            <div className="font-mono text-[10px] text-terracotta">{d.transferReference}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          {d.paymentStatus === "successful" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-subtle text-forest font-bold text-[10px] uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                          {d.paymentStatus === "awaiting_verification" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/20 text-earth font-bold text-[10px] uppercase">
                              <Clock className="w-3 h-3" />
                              <span>Awaiting Verification</span>
                            </span>
                          )}
                          {d.paymentStatus === "pending" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px] uppercase">
                              Pending
                            </span>
                          )}
                          {d.paymentStatus === "failed" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] uppercase">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-charcoal-muted whitespace-nowrap">
                          {new Date(d.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="p-3.5 text-right">
                          {d.paymentStatus === "awaiting_verification" ? (
                            <button
                              onClick={() => handleVerifyTransfer(d.internalId)}
                              disabled={verifyingId === d.internalId}
                              className="px-3 py-1 rounded-full bg-forest text-white text-[11px] font-bold uppercase tracking-wider hover:bg-forest-dark transition-all disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>{verifyingId === d.internalId ? "Verifying..." : "Verify Transfer"}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-charcoal-muted italic">
                              {d.verifiedBy || "No action"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Volunteers */}
        {activeTab === "volunteers" && (
          <div className="bg-white rounded-2xl border border-forest/15 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-light border-b border-forest/10 uppercase text-[10px] text-charcoal-muted font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Interest</th>
                  <th className="p-3.5">Availability</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10 font-sans">
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-charcoal-muted">
                      No volunteer applications recorded yet.
                    </td>
                  </tr>
                ) : (
                  volunteers.map((v) => (
                    <tr key={v._id} className="hover:bg-cream-light/40">
                      <td className="p-3.5 font-bold text-forest">{v.fullName}</td>
                      <td className="p-3.5">{v.email}</td>
                      <td className="p-3.5 font-mono">{v.phone}</td>
                      <td className="p-3.5">{v.city}</td>
                      <td className="p-3.5 font-semibold text-charcoal">{v.interest}</td>
                      <td className="p-3.5">{v.availability || "N/A"}</td>
                      <td className="p-3.5 text-charcoal-muted">{new Date(v.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Partners */}
        {activeTab === "partners" && (
          <div className="bg-white rounded-2xl border border-forest/15 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-light border-b border-forest/10 uppercase text-[10px] text-charcoal-muted font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Company / Org</th>
                  <th className="p-3.5">Contact Person</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Partnership Type</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10 font-sans">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-charcoal-muted">
                      No partner inquiries submitted yet.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p._id} className="hover:bg-cream-light/40">
                      <td className="p-3.5 font-bold text-forest">{p.organizationName}</td>
                      <td className="p-3.5 font-medium">{p.contactName}</td>
                      <td className="p-3.5">{p.email}</td>
                      <td className="p-3.5 font-mono">{p.phone || "N/A"}</td>
                      <td className="p-3.5 text-charcoal font-semibold">{p.partnershipType}</td>
                      <td className="p-3.5 text-charcoal-muted">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
