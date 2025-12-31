"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Send, RefreshCcw } from "lucide-react";
import Image from "next/image";

const SUGGESTIONS = [
  "I will go to the gym 5 days a week.",
  "I will find the love of my life this year.",
  "I will buy an Iphone this year",
  "I will quit smoking this year.", 
  "I will quit drinking alcohol this year.",
  "I will lose 10kg by eating only salads.",
  "I will get a 6-pack by June.",
  "I will sleep for 8 hours every night.",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoast = async (text: string) => {
    setLoading(true);
    setVerdict("");
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolution: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerdict(`Error: ${data.error || "Even the model is cringing too hard at this."}`);
      } else {
        setVerdict(data.verdict);
      }
    } catch (err) {
      setVerdict("Error: Even the model is cringing too hard at this.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex flex-col items-center justify-center p-4 md:p-6 selection:bg-red-500 relative">
      {/* Marquee Header */}
      <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden animate-gradient-x" style={{
        background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 20%, #ec4899 40%, #a855f7 60%, #3b82f6 80%, #fbbf24 100%)',
        backgroundSize: '200% 100%'
      }}>
        <div className="marquee-container py-3.5 md:py-4">
          <div className="marquee-content flex items-center gap-8 whitespace-nowrap">
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              Jyotindra has created a blog explaining how he built this -{" "}
              <a
                href="#"
                className="text-black hover:text-blue-100 underline transition-colors"
              >
                Click here to read it !
              </a>
            </span>
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              Jyotindra has created a blog explaining how he built this -{" "}
              <a
                href="#"
                className="text-black hover:text-blue-100 underline transition-colors"
              >
                Click here to read it !
              </a>
            </span>
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              Jyotindra has created a blog explaining how he built this -{" "}
              <a
                href="#"
                className="text-black hover:text-yellow-100 underline transition-colors"
              >
                Click here to read it !
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full space-y-8 md:space-y-10 text-center mt-16 md:mt-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-orange-500 via-red-600 to-purple-600 bg-clip-text text-transparent italic underline decoration-red-500/30 mb-4">
            ROAST YOUR <br/>RESOLUTION
          </h1>
          <p className="text-gray-400 mt-6 text-base md:text-lg">
            Submit your weak New Year plans to the <span className="text-red-500 font-bold uppercase">Desi Executioner</span>. 
            Expect brutal Hinglish truths.
          </p>
        </motion.div>

        {/* Input Box */}
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && input.trim()) {
                handleRoast(input);
              }
            }}
            placeholder="Type your pathetic resolution here..."
            className="w-full bg-zinc-900 border-2 border-zinc-800 p-5 pr-16 rounded-2xl text-xl focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
          />
          <button 
            onClick={() => handleRoast(input)}
            disabled={loading || !input.trim()}
            className="absolute right-3 top-3 bg-red-600 p-3 rounded-xl hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <RefreshCcw className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider">Quick Suggestions</p>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {SUGGESTIONS.map((s, index) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className={`text-xs md:text-sm bg-zinc-800/50 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-red-500/50 transition-all border border-zinc-700/50 ${
                  index >= 4 ? 'hidden md:inline-block' : ''
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Output Area */}
        {verdict && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900/95 backdrop-blur-sm border-l-4 border-red-600 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl text-left relative overflow-hidden shadow-2xl shadow-red-900/20 w-full"
          >
            <Flame className="absolute -right-2 -top-2 md:-right-4 md:-top-4 text-red-900/20 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
            <div className="pr-8 md:pr-12">
              <h3 className="text-red-500 font-bold uppercase text-[10px] md:text-xs mb-2 md:mb-3 tracking-widest">Executioner's Verdict</h3>
              <p className="text-sm md:text-lg lg:text-xl font-medium leading-relaxed italic text-zinc-100">"{verdict}"</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* How I Made This Section */}
      <div className="max-w-4xl w-full mt-12 md:mt-16 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-300 mb-6">
            Here's how I made this from scratch - Jyotindra
          </h2>
          <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="/image.png"
              alt="How I made this from scratch"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 pb-4 text-center">
        <p className="text-sm md:text-base lg:text-lg text-zinc-400">
          Made with <span className="text-green-500">❤</span> by{" "}
          <a
            href="https://growthunger.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 transition-colors underline decoration-green-500/50 hover:decoration-green-400/50 font-medium"
          >
            Growthunger
          </a>
        </p>
      </footer>
    </main>
  );
}