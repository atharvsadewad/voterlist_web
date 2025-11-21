"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Voter {
  serial_no: number;
  voter_id: string;
  name_marathi: string;
  relation_name_marathi: string;
  relation_type: string;
  house_no: string;
  age: number;
  gender: string;
  source_page?: number;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selected, setSelected] = useState<Voter | null>(null);

  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setVoters(data));
  }, []);

  // SEARCH FIXED → WORKS ON MOBILE & DESKTOP
  useEffect(() => {
    if (!query.trim()) return setFiltered([]);

    const q = query.trim().toLowerCase();

    const results = voters.filter((v) =>
      v.name_marathi.toLowerCase().includes(q)
    );

    setFiltered(results);
  }, [query, voters]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        🗳️ Ward No. 8 — Voter Search
      </h1>

      {/* SEARCH BAR */}
      <motion.input
        layout
        type="text"
        placeholder="Search नाव / आडनाव…"
        className="w-full p-4 mb-6 rounded-xl bg-white shadow focus:ring-2 
                   focus:ring-blue-500 outline-none text-gray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      />

      {/* PRINT BUTTON */}
      {filtered.length > 0 && (
        <button
          onClick={handlePrint}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow 
                     hover:bg-green-700 print:hidden"
        >
          Print Results
        </button>
      )}

      {/* SEARCH RESULTS */}
      <AnimatePresence>
        {filtered.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 print:grid print:grid-cols-2 print:gap-4"
          >
            {filtered.map((voter) => (
              <motion.div
                key={voter.voter_id}
                layout
                className="p-4 bg-white rounded-xl shadow border cursor-pointer 
                           hover:bg-blue-50 transition-all print:shadow-none print:border print:text-sm"
                onClick={() => setSelected(voter)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* NORMAL SCREEN VIEW */}
                <div className="print:hidden">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {voter.name_marathi}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    घर क्रमांक: {voter.house_no} • वय: {voter.age}
                  </p>
                </div>

                {/* FULL PRINT DETAILS */}
                <div className="hidden print:block leading-5">
                  <p><b>नाव:</b> {voter.name_marathi}</p>
                  <p><b>घर क्रमांक:</b> {voter.house_no}</p>
                  <p><b>नाते:</b> {voter.relation_type}</p>
                  <p><b>नाव (नाते):</b> {voter.relation_name_marathi}</p>
                  <p><b>वय:</b> {voter.age}</p>
                  <p><b>लिंग:</b> {voter.gender}</p>
                  <p><b>EPIC:</b> {voter.voter_id}</p>
                  <p><b>अनुक्रमांक:</b> {voter.serial_no}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50 print:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selected.name_marathi}
              </h2>

              <div className="space-y-2 text-gray-700">
                <p><b>घर क्रमांक:</b> {selected.house_no}</p>
                <p><b>नाते:</b> {selected.relation_type}</p>
                <p><b>नाव (नाते):</b> {selected.relation_name_marathi}</p>
                <p><b>वय:</b> {selected.age}</p>
                <p><b>लिंग:</b> {selected.gender}</p>
                <p><b>EPIC:</b> {selected.voter_id}</p>
                <p><b>अनुक्रमांक:</b> {selected.serial_no}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
