import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Info, 
  ShoppingBag, 
  ChevronRight, 
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { PriceItem } from './types';
import { cn } from './lib/utils';

const CATEGORIES = [
  "All",
  "Canned Fish",
  "Processed Milk",
  "Coffee",
  "Bread",
  "Instant Noodles",
  "Detergent Soap",
  "Bottled Water",
  "Candles"
];

export default function App() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prices');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPrices(data);
      } else {
        console.error("Received non-array data:", data);
        setPrices([]);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = useMemo(() => {
    return prices.filter(item => {
      const matchesSearch = 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [prices, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0038A8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-900 leading-tight">Bantay Presyo</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#CE1126] font-bold">DTI SRP Tracker</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0038A8] transition-colors">Dashboard</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0038A8] transition-colors">Trends</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0038A8] transition-colors">About SRP</a>
              <button className="bg-[#0038A8] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-all shadow-md active:scale-95">
                Get Alerts
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4"
          >
            <a href="#" className="block text-lg font-medium text-slate-900">Dashboard</a>
            <a href="#" className="block text-lg font-medium text-slate-900">Trends</a>
            <a href="#" className="block text-lg font-medium text-slate-900">About SRP</a>
            <button className="w-full bg-[#0038A8] text-white py-3 rounded-xl font-bold">
              Get Alerts
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#0038A8] to-[#002878] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight"
              >
                Protect your budget with real-time SRP tracking.
              </motion.h2>
              <p className="text-blue-100 text-lg mb-8 opacity-90">
                Monitor the latest Suggested Retail Prices from DTI to ensure you're paying the right price for basic goods.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Updates</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-[#FCD116]" />
                  <span className="text-sm font-medium">Price Trends</span>
                </div>
              </div>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#FCD116]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-[#CE1126]/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Controls */}
        <section className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search brands, products, or categories..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0038A8] focus:border-transparent transition-all shadow-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button 
                onClick={fetchPrices}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-[#0038A8] text-white shadow-lg shadow-blue-200" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Price Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
                  <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-slate-200 rounded mb-6" />
                  <div className="h-12 w-full bg-slate-200 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredPrices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrices.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id}
                  className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <ArrowDownRight className="w-3 h-3" />
                      Stable
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-1 group-hover:text-[#0038A8] transition-colors">
                    {item.brand}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    {item.variant} • {item.size}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Suggested Retail Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-display font-black text-slate-900">₱{item.srp.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <ChevronRight className="text-slate-400 group-hover:text-[#0038A8] transition-colors" />
                    </div>
                  </div>

                  {/* Subtle Background Pattern */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <ShoppingBag size={120} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Info className="text-[#0038A8] w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">What is SRP?</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              The Suggested Retail Price (SRP) is a price ceiling set by the Department of Trade and Industry (DTI) for basic necessities and prime commodities.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Retailers are expected to follow these prices to protect consumers from profiteering and ensure fair pricing in the market.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertCircle className="text-[#CE1126] w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Report Overpricing</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Found a store selling above SRP? You can report them to the DTI Consumer Protection Group.
            </p>
            <a 
              href="tel:1384" 
              className="inline-flex items-center gap-2 text-[#0038A8] font-bold hover:underline"
            >
              Call DTI Hotline (1-DTI) 1384
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-slate-900 w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold">Bantay Presyo</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering Filipino consumers with transparent and accessible price information. Data sourced directly from DTI Philippines.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Latest SRP Bulletin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consumer Rights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DTI Official Website</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Price Monitoring App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Stay Informed</h4>
              <p className="text-sm text-slate-400 mb-4">Get weekly price alerts and consumer tips.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 Bantay Presyo PH. Not an official government application.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Data Sources</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
