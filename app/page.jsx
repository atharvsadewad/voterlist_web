"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);

  const printRef = useRef(null);

  // Load JSON
  useEffect(() => {
    fetch("/voters.json")
      .then((res) => res.json())
      .then((data) => setVoters(data));
  }, []);

  // Filter list
  useEffect(() => {
    if (!query) return setFiltered([]);

    const q = query.trim().toLowerCase();

    const results = voters.filter(
      (v) =>
        v.surname.toLowerCase().includes(q) ||
        v.fullname.toLowerCase().includes(q)
    );

    setFiltered(results);
  }, [query, voters]);

  // PRINT HANDLER
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Voter Search</h1>

      {/* SEARCH BAR */}
      <motion.input
        layout
        type="text"
        placeholder="Search surname…"
        className="w-full p-4 mb-4 rounded-xl bg-white shadow focus:ring-2
                   focus:ring-blue-500 outline-none text-gray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      />

      {/* PRINT BUTTON (only when results visible) */}
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
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.map((voter) => (
              <motion.div
                key={voter.epic}
                layout
                className="p-4 bg-white rounded-xl shadow cursor-pointer border
                           hover:bg-blue-50 transition-all print:shadow-none print:border print:bg-white"
                onClick={() => setSelected(voter)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Visible on screen */}
                <div className="print:hidden">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {voter.fullname}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    House: {voter.house} • Age: {voter.age}
                  </p>
                </div>

                {/* FULL DETAILS ONLY WHEN PRINTING */}
                <div className="hidden print:block text-sm">
                  <p><b>Name:</b> {voter.fullname}</p>
                  <p><b>House No:</b> {voter.house}</p>
                  <p><b>Relation:</b> {voter.relation}</p>
                  <p><b>Relative Name:</b> {voter.relation_name}</p>
                  <p><b>Age:</b> {voter.age}</p>
                  <p><b>Gender:</b> {voter.gender}</p>
                  <p><b>EPIC:</b> {voter.epic}</p>
                  <p><b>Serial No:</b> {voter.serial_no}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL — unchanged */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
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
                {selected.fullname}
              </h2>

              <div className="space-y-2 text-gray-700">
                <p><b>House:</b> {selected.house}</p>
                <p><b>Relation:</b> {selected.relation}</p>
                <p><b>Age:</b> {selected.age}</p>
                <p><b>EPIC:</b> {selected.epic}</p>
                <p><b>Serial:</b> {selected.serial_no}</p>
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
