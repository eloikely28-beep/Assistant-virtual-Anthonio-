/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  Mail, 
  Calendar, 
  UserPlus, 
  CheckCircle, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  Globe,
  Database,
  Inbox,
  Clock,
  MoreHorizontal,
  Menu,
  X,
  Euro,
  CreditCard,
  Zap,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const services = [
  {
    title: "Recherche d'informations",
    description: "Recherche rapide et efficace sur Internet pour collecter, vérifier et synthétiser des données précieuses.",
    items: ["Recherche ciblée", "Collecte de données", "Vérification & Synthèse"],
    icon: <Search className="w-8 h-8 text-blue-600" />,
    detailIcon: <Globe className="w-5 h-5" />
  },
  {
    title: "Gestion Excel",
    description: "Création et gestion de bases de données Excel professionnelles avec automatisation simple.",
    items: ["Tableaux professionnels", "Organisation de données", "Suivi et automatisation"],
    icon: <FileSpreadsheet className="w-8 h-8 text-green-600" />,
    detailIcon: <Database className="w-5 h-5" />
  },
  {
    title: "Gestion des emails",
    description: "Tri, réponses professionnelles et organisation complète de votre boîte de réception.",
    items: ["Réception et tri", "Réponses professionnelles", "Assistance administrative"],
    icon: <Mail className="w-8 h-8 text-purple-600" />,
    detailIcon: <Inbox className="w-5 h-5" />
  },
  {
    title: "Gestion d'agenda",
    description: "Organisation de rendez-vous et planification rigoureuse de vos tâches et rappels.",
    items: ["Organisation RDV", "Gestion calendrier", "Planification de tâches"],
    icon: <Calendar className="w-8 h-8 text-orange-600" />,
    detailIcon: <Clock className="w-5 h-5" />
  },
  {
    title: "Assistance personnalisée",
    description: "Support digital et bureautique sur mesure selon vos besoins spécifiques.",
    items: ["Support bureautique", "Gestion administrative", "Assistance virtuelle"],
    icon: <UserPlus className="w-8 h-8 text-pink-600" />,
    detailIcon: <MoreHorizontal className="w-5 h-5" />
  }
];

const whyMe = [
  "Professionnel et réactif",
  "Travail organisé et confidentiel",
  "Disponible selon vos besoins",
  "Assistance flexible à distance"
];

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalButton = ({ planName }: { planName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const retryCount = useRef(0);

  useEffect(() => {
    let timer: any;
    
    const initPayPal = () => {
      // Check if PayPal is available, wait more if not (max 10 seconds)
      if (!window.paypal) {
        if (retryCount.current < 20) {
          retryCount.current++;
          timer = setTimeout(initPayPal, 500);
          return;
        }
        setError("Impossible de charger le service de paiement. Veuillez rafraîchir la page.");
        return;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        
        try {
          if (window.paypal.HostedButtons && typeof window.paypal.HostedButtons === 'function') {
            window.paypal.HostedButtons({
              hostedButtonId: "KBWPWXHAYLHXW",
            }).render(containerRef.current).then(() => {
              if (containerRef.current) setIsRendered(true);
            }).catch((err: any) => {
              console.error("PayPal Hosted Error:", err);
              renderStandardButtons();
            });
          } else if (window.paypal.HostedButtons && typeof window.paypal.HostedButtons.render === 'function') {
             // Handle case where HostedButtons is already an instance or needs different access
             window.paypal.HostedButtons({
              hostedButtonId: "KBWPWXHAYLHXW",
            }).render(containerRef.current).then(() => {
              if (containerRef.current) setIsRendered(true);
            }).catch(() => renderStandardButtons());
          } else {
            renderStandardButtons();
          }
        } catch (err) {
          console.error("PayPal Init Error:", err);
          renderStandardButtons();
        }
      }
    };

    const renderStandardButtons = () => {
      if (window.paypal && typeof window.paypal.Buttons === 'function' && containerRef.current) {
        containerRef.current.innerHTML = '';
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: planName,
                amount: { currency_code: "EUR", value: planName.includes("Horaire") ? "10.00" : "25.00" }
              }]
            });
          }
        }).render(containerRef.current).then(() => setIsRendered(true)).catch(() => {
          setError("Erreur technique de paiement.");
        });
      } else {
        setError("Service de paiement temporairement indisponible.");
      }
    };

    timer = setTimeout(initPayPal, 800);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [planName]);

  return (
    <div className="w-full">
      {error && !isRendered && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 text-center mb-4">
          {error}
        </div>
      )}
      <div ref={containerRef} className={`w-full min-h-[50px] ${!isRendered && !error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {!isRendered && !error && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const LogoContainer = ({ size = "md", showText = true, onClick }: { size?: "sm" | "md", showText?: boolean, onClick?: () => void }) => (
  <div className={`flex items-center ${size === "md" ? "gap-3" : "gap-2"} group cursor-pointer`} onClick={onClick}>
    <div className={`relative ${size === "md" ? "w-12 h-12" : "w-10 h-10"} bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden shadow-xl ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <span className={`text-white font-display font-black tracking-tighter ${size === "md" ? "text-xl" : "text-base"}`}>AR</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent mix-blend-overlay"></div>
    </div>
    {showText && (
      <div className="flex flex-col">
        <span className={`${size === "md" ? "text-lg" : "text-sm"} font-display font-bold leading-tight tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors`}>
          Anthonio Randrianaivo
        </span>
        <span className={`${size === "md" ? "text-[10px]" : "text-[8px]"} font-black uppercase tracking-[0.2em] text-blue-600 leading-none`}>
          Expert Assistance Virtuelle
        </span>
      </div>
    )}
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);

  const handleOrder = (e: React.MouseEvent, name: string, price: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedPlan({ name, price });
    setShowCheckout(true);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (showCheckout || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCheckout, isMenuOpen]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <LogoContainer onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('services')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Services</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Tarifs</button>
            <button onClick={() => scrollTo('why-me')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Expertise</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Contact</button>
            <button 
              onClick={() => scrollTo('contact')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2"
            >
              Me Contacter <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              <button onClick={() => scrollTo('services')} className="text-left py-2 border-b border-slate-100">Services</button>
              <button onClick={() => scrollTo('pricing')} className="text-left py-2 border-b border-slate-100">Tarifs</button>
              <button onClick={() => scrollTo('why-me')} className="text-left py-2 border-b border-slate-100">Pourquoi me choisir</button>
              <button onClick={() => scrollTo('contact')} className="text-left py-2 border-b border-slate-100">Contact</button>
              <button 
                onClick={() => scrollTo('contact')}
                className="mt-4 bg-blue-600 text-white p-4 rounded-xl text-center"
              >
                Commencer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 opacity-10 pointer-events-none">
          <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="400" fill="url(#paint0_radial)" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Disponible pour de nouveaux projets
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[1.1] mb-8 tracking-tighter">
              L'Assistance <br className="hidden sm:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">Virtuelle PRO</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-2xl mb-12 font-medium">
              Je propose des services d'assistance à distance premium pour particuliers, entrepreneurs et entreprises. Externalisez vos tâches chronophages et concentrez-vous sur l'essentiel.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button 
                onClick={() => scrollTo('contact')}
                className="w-full sm:w-auto bg-slate-950 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group"
              >
                Commencer maintenant <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollTo('services')}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-center text-slate-600"
              >
                Découvrir mes services
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Clients Section */}
      <section className="py-16 md:py-20 border-y border-slate-100 bg-white/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Ils me font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24 opacity-80">
            <a href="https://www.blue-berry.eu/fr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group transition-all hover:scale-105 active:scale-95 grayscale hover:grayscale-0">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">BB</div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-black tracking-tight text-slate-800 leading-none">Blue Berry</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Eyewear Group</span>
              </div>
            </a>
            <div className="flex items-center gap-3 group transition-all hover:scale-105 active:scale-95 grayscale hover:grayscale-0">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-black group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm border border-red-100">R</div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-black tracking-tight text-slate-800 leading-none">Recoveo</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Data Recovery</span>
              </div>
            </div>
            <a href="https://www.silvr.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group transition-all hover:scale-105 active:scale-95 grayscale hover:grayscale-0">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm border border-indigo-100">S</div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-black tracking-tight text-slate-800 leading-none">Silvr</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fintech Startup</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Expertise 360°</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black leading-none tracking-tighter">Mes Services</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 md:p-10 rounded-[2.5rem] border-2 border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 translate-y-0 hover:-translate-y-2"
              >
                <div className="mb-8 p-5 bg-white rounded-2xl w-fit shadow-lg shadow-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white">
                  {React.cloneElement(service.icon as React.ReactElement, { 
                    className: "w-8 h-8 group-hover:text-white transition-colors duration-500" 
                  })}
                </div>
                <h4 className="text-2xl md:text-3xl font-display font-black mb-4 tracking-tight">{service.title}</h4>
                <p className="text-slate-500 leading-relaxed mb-10 flex-grow font-medium">
                  {service.description}
                </p>
                <ul className="space-y-4 border-t border-slate-50 pt-8">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                      <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                        {service.detailIcon}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section id="why-me" className="py-24 md:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-10 pointer-events-none">
          <div className="w-[1000px] h-[1000px] bg-blue-600 rounded-full blur-[200px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-6">Expertise & Valeurs</h2>
              <h3 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight tracking-tighter">Pourquoi me choisir ?</h3>
              <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-medium">
                Mon objectif est de devenir le levier de croissance de votre activité. Je m'engage sur la qualité et la discrétion totale.
              </p>
              
              <div className="grid gap-4">
                {whyMe.map((reason, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-5 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-blue-400 shrink-0" />
                    </div>
                    <span className="text-lg md:text-xl font-bold tracking-tight text-slate-100 underline decoration-blue-500/30 underline-offset-4">{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/10 rounded-[2.5rem] p-10 md:p-16 border border-white/10 text-center shadow-inner">
                <div className="text-7xl md:text-9xl font-display font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-none">100%</div>
                <div className="text-xl md:text-2xl font-black text-blue-400 uppercase tracking-widest mb-10">Confidentialité</div>
                <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/10 rounded-2xl border border-white/10 text-left">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">AR</div>
                  <div className="flex flex-col">
                    <div className="font-black text-lg text-white tracking-tight">Anthonio Randrianaivo</div>
                    <div className="text-xs text-blue-300 font-bold uppercase tracking-widest">Votre Partenaire de confiance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20 text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Investissement & Collaboration</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black leading-none tracking-tighter mb-8">Tarifs Transparents</h3>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Des tarifs simples et sans frais cachés pour booster votre productivité dès aujourd'hui.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hourly Rate */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 md:p-12 border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Clock className="w-24 h-24 text-blue-600" />
              </div>
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
                  <Zap className="w-3 h-3" /> Flexibilité Maximale
                </div>
                <h4 className="text-3xl font-display font-black mb-2">Tarif Horaire</h4>
                <p className="text-slate-500 font-medium">Idéal pour l'assistance variée et ponctuelle.</p>
              </div>

              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-display font-black tracking-tight text-slate-900">10€</span>
                <span className="text-xl font-bold text-slate-400">/ heure</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {["Gestion d'emails & Tri", "Organisation d'agenda", "Support administratif", "Recherche ponctuelle"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                type="button"
                onClick={(e) => handleOrder(e, "Tarif Horaire", "10€/h")}
                className="w-full bg-slate-950 text-white py-5 rounded-2xl text-lg font-black hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group/btn"
              >
                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /> Commander maintenant
              </button>
            </motion.div>

            {/* Per Project Rate */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-blue-600 rounded-[2.5rem] p-10 md:p-12 border-2 border-blue-500 shadow-2xl shadow-blue-600/20 flex flex-col relative overflow-hidden group text-white"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-white">
                <Database className="w-24 h-24" />
              </div>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/30">
                  <TrendingUp className="w-3 h-3" /> Performance Data
                </div>
                <h4 className="text-3xl font-display font-black mb-2 text-white">Collecte de Données</h4>
                <p className="text-blue-100 font-medium">Idéal pour le scraping et enrichissement Excel.</p>
              </div>

              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-display font-black tracking-tight text-white">0,25€</span>
                <span className="text-xl font-bold text-blue-200">/ ligne</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {["Minimum 100 lignes", "Nettoyage de données inclus", "Format Excel / CSV / JSON", "Vérification manuelle"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-bold">
                    <CheckCircle className="w-5 h-5 text-blue-200" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                type="button"
                onClick={(e) => handleOrder(e, "Collecte de Données", "0,25€/ligne")}
                className="w-full bg-white text-blue-600 py-5 rounded-2xl text-lg font-black hover:bg-slate-100 hover:shadow-2xl hover:shadow-white/20 transition-all flex items-center justify-center gap-3 group/btn"
              >
                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /> Lancer le projet
              </button>
            </motion.div>
          </div>

          {/* Payment Methods */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <CreditCard className="w-6 h-6 text-slate-400" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Paiement sécurisé via</span>
              <div className="px-3 py-1 bg-[#003087] text-white rounded-md text-xs font-black italic">PayPal</div>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse transition-all">Paiement automatique & facturation immédiate</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 relative overflow-hidden ring-1 ring-slate-100 shadow-2xl shadow-blue-500/5">
            <div className="max-w-3xl relative z-10">
              <h3 className="text-4xl md:text-7xl font-display font-black mb-8 tracking-tighter leading-none">Prêt à simplifier <br />votre quotidien ?</h3>
              <p className="text-lg md:text-2xl text-slate-600 mb-12 font-medium leading-relaxed">
                Contactez-moi pour discuter de vos besoins. Je réponds sous 24h pour vous proposer une solution adaptée.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <a 
                  href="https://wa.me/261327236068" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-5 p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</div>
                    <div className="text-xl md:text-2xl font-black text-slate-900">+261 32 723 60 68</div>
                  </div>
                </a>

                <a 
                  href="mailto:deraantonio43@gmail.com"
                  className="flex-1 flex items-center gap-5 p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email direct</div>
                    <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Contactez-moi</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full translate-x-20">
               <div className="w-full h-full bg-slate-200 overflow-hidden rounded-l-[4rem] group relative">
                 <img 
                   src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" 
                   alt="Professional Interaction" 
                   className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <LogoContainer size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          
          <div className="text-sm text-slate-500 font-medium text-center order-3 md:order-2">
            &copy; {new Date().getFullYear()} Anthonio Randrianaivo. <span className="hidden sm:inline">Expert en Assistance Virtuelle.</span>
          </div>

          <div className="flex items-center gap-6 order-2 md:order-3">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">Haut de page</button>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div 
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-slate-950/80 backdrop-blur-sm"
          >
            <div 
              className="absolute inset-0"
              onClick={() => setShowCheckout(false)}
            ></div>
            
            <motion.div 
              key="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowCheckout(false)}
                className="absolute top-8 right-8 p-2 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/10">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-display font-black mb-4">Récapitulatif</h3>
                <p className="text-slate-500 font-medium tracking-tight">Finalisez votre commande en toute sécurité</p>
              </div>

              <div className="space-y-4 mb-10 py-6 border-y border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Service</span>
                  <span className="text-slate-950 font-black">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Tarif</span>
                  <span className="text-slate-950 font-black">{selectedPlan?.price}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Statut</span>
                  <span className="inline-flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Paiement Automatique
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <PayPalButton planName={selectedPlan?.name || ""} />
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Ou via email</span></div>
                </div>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const email = "deraantonio43@gmail.com";
                    const subject = `Commande Immediate: ${selectedPlan?.name}`;
                    const body = `Bonjour Anthonio,\n\nJe souhaite commander le service ${selectedPlan?.name} au tarif de ${selectedPlan?.price}.\n\nMerci de m'envoyer le lien de paiement PayPal correspondant.`;
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    setShowCheckout(false);
                  }}
                  className="w-full bg-[#0070BA] text-white py-5 rounded-2xl text-lg font-black hover:bg-[#003087] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                >
                  <CreditCard className="w-6 h-6" /> Payer avec PayPal
                </button>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Annuler la commande
                </button>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg">
                  <X className="w-3 h-3 text-red-400" /> Sécurisé par chiffrement SSL
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

