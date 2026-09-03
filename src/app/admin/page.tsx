"use client";

import React, { useState, useEffect } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  answers: {
    turnover?: string;
    currentUsage?: string;
    listSize?: string;
    challenge?: string;
  };
  status: "qualified" | "disqualified";
  createdAt: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "qualified" | "disqualified">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Default fallback admin token matching the route.ts default
  const DEFAULT_TOKEN = "Tudasudaimillion28$";

  useEffect(() => {
    // Check if token is already saved in localStorage
    const savedToken = localStorage.getItem("emailflow_admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchLeads(savedToken);
    }
  }, []);

  const fetchLeads = async (authToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leads?token=${authToken}`);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Neteisingas slaptažodis.");
        }
        throw new Error("Nepavyko gauti užklausų.");
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Serverio klaida.");
      // Clear invalid token
      localStorage.removeItem("emailflow_admin_token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!passwordInput.trim()) {
      setAuthError("Įveskite slaptažodį.");
      return;
    }

    // Attempt auth with user input token
    localStorage.setItem("emailflow_admin_token", passwordInput);
    setToken(passwordInput);
    setIsAuthenticated(true);
    fetchLeads(passwordInput);
  };

  const handleLogout = () => {
    localStorage.removeItem("emailflow_admin_token");
    setToken("");
    setIsAuthenticated(false);
    setPasswordInput("");
    setLeads([]);
  };

  // Filter leads based on search term and qualified status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.website.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const qualifiedCount = leads.filter((l) => l.status === "qualified").length;
  const disqualifiedCount = leads.filter((l) => l.status === "disqualified").length;

  if (!isAuthenticated) {
    return (
      <div className="bg-[#0B0F14] text-white min-h-screen flex items-center justify-center font-sans px-margin-mobile">
        <div className="max-w-[400px] w-full bg-[#121824] border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <svg className="w-10 h-10 mx-auto text-emerald-growth mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">EmailFlow Admin</h1>
            <p className="text-xs text-white/50 mt-1">Prisijunkite prie administravimo skydelio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Slaptažodis (Token)</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Įveskite saugos raktą"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 focus:border-emerald-growth focus:ring-1 focus:ring-emerald-growth outline-none transition-all"
              />
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-growth text-deep-navy font-bold py-3 rounded-full hover:scale-95 transition-transform text-sm"
            >
              Prisijungti
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] text-white min-h-screen font-sans">
      {/* Admin Navbar */}
      <header className="border-b border-white/5 bg-[#121824]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 sm:w-6 h-6 text-emerald-growth" viewBox="0 0 100 100" fill="none">
              <path d="M15 15 h70 a10 10 0 0 1 10 10 v45 a10 10 0 0 1 -10 10 h-45 l-15 15 v-15 h-10 a10 10 0 0 1 -10 -10 v-45 a10 10 0 0 1 10 -10 z" 
                    stroke="currentColor" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
              <text x="50" y="52" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="currentColor" textAnchor="middle" dominantBaseline="middle">
                Email
              </text>
            </svg>
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-tight">
              EmailFlow Admin
            </span>
            <span className="bg-emerald-growth/10 text-emerald-growth text-[9px] font-bold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-xs font-bold px-4 py-2 rounded-full transition-all"
          >
            Atsijungti
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#121824] border border-white/5 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">
              Visos gautos užklausos
            </span>
            <p className="font-display text-4xl font-bold text-white">{leads.length}</p>
          </div>
          <div className="bg-[#121824] border border-white/5 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">
              Kvalifikuoti kontaktai
            </span>
            <p className="font-display text-4xl font-bold text-emerald-growth">{qualifiedCount}</p>
          </div>
          <div className="bg-[#121824] border border-white/5 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">
              Nekvalifikuoti
            </span>
            <p className="font-display text-4xl font-bold text-white/60">{disqualifiedCount}</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#121824] border border-white/5 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ieškoti pagal vardą, el. paštą, telefoną ar įmonę..."
              className="w-full bg-[#0B0F14] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs placeholder-white/30 focus:border-emerald-growth outline-none transition-all"
            />
            <svg className="w-4 h-4 text-white/30 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-semibold mr-1">Būsena:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-white text-deep-navy"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Visi
            </button>
            <button
              onClick={() => setStatusFilter("qualified")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === "qualified"
                  ? "bg-emerald-growth text-deep-navy shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Kvalifikuoti
            </button>
          </div>
        </div>

        {/* Leads Table Card */}
        <div className="bg-[#121824] border border-white/5 rounded-2xl overflow-hidden shadow-md">
          {isLoading ? (
            <div className="py-20 text-center text-white/50 text-sm font-semibold flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-growth border-t-transparent animate-spin"></div>
              Kraunamos užklausos...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center text-white/40 text-sm">
              Užklausų nerasta.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-white/40 font-bold uppercase tracking-wider bg-white/[0.02]">
                    <th className="py-4 px-6">Klientas</th>
                    <th className="py-4 px-6">Kontaktai</th>
                    <th className="py-4 px-6">Svetainė</th>
                    <th className="py-4 px-6">Apyvarta</th>
                    <th className="py-4 px-6">Pateikta</th>
                    <th className="py-4 px-6 text-right">Veiksmai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">ID: {lead.id}</div>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <div>
                          <a href={`mailto:${lead.email}`} className="text-emerald-growth hover:underline">
                            {lead.email}
                          </a>
                        </div>
                        <div className="text-white/60">
                          <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">
                            {lead.phone}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white/80">{lead.website}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#131B2E] text-white border border-white/5">
                          {lead.answers.turnover || "Nenurodyta"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white/60">
                        {new Date(lead.createdAt).toLocaleString("lt-LT", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white/5 hover:bg-white/10 text-white font-bold px-3 py-1.5 rounded-full text-[11px] transition-all"
                        >
                          Apžiūrėti anketą
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Leads survey response details overlay modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121824] border border-white/10 rounded-2xl w-full max-w-[600px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Užklausos detalės</h3>
                <p className="text-[10px] text-white/40 mt-0.5">ID: {selectedLead.id} | Pateikta: {new Date(selectedLead.createdAt).toLocaleString("lt-LT")}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Contact info grid */}
              <div className="grid grid-cols-2 gap-4 bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Vardas Pavardė</span>
                  <span className="text-sm text-white font-semibold">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Svetainė / Įmonė</span>
                  <span className="text-sm text-white font-semibold">{selectedLead.website}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">El. paštas</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-emerald-growth hover:underline font-semibold">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">Telefonas</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-white hover:text-emerald-growth transition-colors font-semibold">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              {/* Quiz answers detailed list */}
              <div>
                <h4 className="text-xs uppercase font-bold text-emerald-growth tracking-widest mb-3">Survey atsakymai</h4>
                <div className="space-y-4">
                  <div className="p-3.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-white/50 font-semibold mb-1">1. Mėnesinė apyvarta</p>
                    <p className="text-xs text-white font-medium">{selectedLead.answers?.turnover || "Nenurodyta"}</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-white/50 font-semibold mb-1">2. El. pašto rinkodara</p>
                    <p className="text-xs text-white font-medium">{selectedLead.answers?.currentUsage || "Nenurodyta"}</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-white/50 font-semibold mb-1">3. Kontaktų bazės dydis</p>
                    <p className="text-xs text-white font-medium">{selectedLead.answers?.listSize || "Nenurodyta"}</p>
                  </div>
                  <div className="p-3.5 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-white/50 font-semibold mb-1">4. Didžiausias iššūkis</p>
                    <p className="text-xs text-white font-medium">{selectedLead.answers?.challenge || "Nenurodyta"}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="bg-white text-deep-navy font-bold px-6 py-2 rounded-full text-xs hover:bg-white/90 transition-all"
              >
                Uždaryti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
