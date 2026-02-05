
// --- INICIO: Vista avanzada de registro proporcionada por el usuario ---
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import AnimatedLogo from '../../components/ui/AnimatedLogo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import { useIsMobile } from '../../hooks/use-mobile';
import { Eye, EyeOff, Link2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '../../components/ui/dialog';

// Cambiar el tipo de BusinessType a '' | '1' | '2'
type BusinessType = '' | '1' | '2';
type BusinessSubtype = 'barberia' | 'salon' | 'spa' | 'consultorio_medico' | 'consultorio_odontologico';

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  email: string;
  password: string;
  companyName: string;
  subdomain: string;
  businessType: BusinessType | '';
  businessSubtype: BusinessSubtype | '';
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    password: '',
    companyName: '',
    subdomain: '',
    businessType: '',
    businessSubtype: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const loaderMessages = [
    'Configurando tu entorno personalizado...',
    'Creando módulos de agenda y clientes...',
    'Activando módulo de facturación y reportes...',
    'Personalizando tu panel de control...',
    'Habilitando notificaciones inteligentes...',
    'Preparando herramientas de marketing...',
    'Optimizando inventarios y productos...',
    'Configurando seguridad y permisos...',
    '¡Finalizando tu espacio de trabajo!'
  ];
  const [loaderStep, setLoaderStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showLoader) {
      setLoaderProgress(0);
      setLoaderStep(0);
      let step = 0;
      interval = setInterval(() => {
        step++;
        setLoaderProgress((step / loaderMessages.length) * 100);
        setLoaderStep(step);
        if (step >= loaderMessages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setShowLoader(false);
            setLoading(false);
            const subdomain = formData.subdomain?.trim();
            let baseDomain = window.location.hostname;
            let protocol = window.location.protocol;
            let port = window.location.port ? `:${window.location.port}` : '';
            if (baseDomain === 'localhost' || baseDomain.endsWith('.localhost')) {
              window.location.href = `${protocol}//${subdomain}.localhost${port}/login`;
            } else {
              const domainParts = baseDomain.split('.');
              if (domainParts.length > 2) {
                domainParts[0] = subdomain;
                baseDomain = domainParts.join('.');
              } else {
                baseDomain = `${subdomain}.${baseDomain}`;
              }
              window.location.href = `${protocol}//${baseDomain}${port}/login`;
            }
          }, 1800);
        }
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [showLoader, formData.subdomain]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleNext = async () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      setError('Por favor completa todos los campos obligatorios de información personal.');
      return;
    }
    if (step === 2 && (!formData.email || !formData.password)) {
      setError('Por favor completa tu correo y contraseña.');
      return;
    }
    if (step === 3 && (!formData.companyName || !formData.subdomain)) {
      setError('Por favor completa los datos de empresa.');
      return;
    }
    if (step === 4 && !formData.businessSubtype) {
      setError('Por favor selecciona una especialidad.');
      return;
    }
    if (step === 3) {
      setLoading(true);
      setShowLoader(true);
      setError(null);
      const success = await register({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        secondLastName: formData.secondLastName,
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.secondLastName}`.replace(/ +/g, ' ').trim(),
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        subdomain: formData.subdomain,
        businessType: formData.businessType,
        businessSubtype: formData.businessSubtype,
      });
      if (!success) {
        setShowLoader(false);
        setLoading(false);
        setError('No se pudo completar el registro. Intenta nuevamente.');
        return;
      }
    } else {
      setStep(prev => prev + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowLoader(true);
    setError(null);
  };

  const steps = [
    { number: 1, title: 'Información Personal' },
    { number: 2, title: 'Credenciales de Acceso' },
    { number: 3, title: 'Datos de Empresa' },
  ];

  const [subdomainSuggestions, setSubdomainSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const generateSubdomainSuggestions = (companyName: string): string[] => {
    if (!companyName) return [];
    const words = companyName.trim().toLowerCase().replace(/[^a-z0-9 ]/gi, '').split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    const joinedDash = words.join('-');
    const joinedNoDash = words.join('');
    return [joinedDash, joinedNoDash];
  };

  React.useEffect(() => {
    const suggestions = generateSubdomainSuggestions(formData.companyName);
    setSubdomainSuggestions(suggestions);
    setSuggestionIndex(0);
    if (suggestions.length > 0) {
      setFormData(prev => ({ ...prev, subdomain: suggestions[0] }));
    }
  }, [formData.companyName]);

  const handleNextSuggestion = () => {
    if (subdomainSuggestions.length === 0) return;
    const nextIndex = (suggestionIndex + 1) % subdomainSuggestions.length;
    setSuggestionIndex(nextIndex);
    setFormData(prev => ({ ...prev, subdomain: subdomainSuggestions[nextIndex] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex flex-col lg:flex-row">
      {/* Mobile Steps Progress (visible solo en mobile) */}
      <div className="hidden w-full justify-center pt-6 pb-2">
        <div className="flex gap-2 items-center">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold border-2 transition-all duration-300 ${step > s.number
                  ? 'bg-green-500 border-green-500 text-white shadow-lg'
                  : step === s.number
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md scale-110'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                  }`}
              >
                {step > s.number ? <Check size={14} /> : s.number}
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-6 rounded-full ${step > s.number ? 'bg-green-400' : 'bg-gray-700'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Left Panel - Progress (desktop only) */}
      <div className="hidden lg:flex w-full lg:w-1/4 bg-white p-8 flex-col shadow-2xl min-h-[220px]">
        <AnimatedLogo />
        <div className="mt-8">
          {steps.map((s, index) => (
            <motion.div
              key={s.number}
              className="flex items-center mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${step > s.number
                  ? 'bg-green-500 border-green-500 text-white shadow-lg'
                  : step === s.number
                    ? 'bg-purple-500 border-purple-400 text-white shadow-md scale-110'
                    : 'bg-gray-200 border-gray-300 text-gray-400'
                  }`}
              >
                {step > s.number ? <Check size={18} /> : s.number}
              </div>
              <div className="ml-4">
                <p
                  className={`font-semibold text-base transition-colors duration-300 ${step >= s.number ? 'text-gray-900' : 'text-gray-400'
                    }`}
                >
                  {s.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-auto pt-8">
          <Link href="/login" className="inline-flex items-center text-purple-500 hover:text-purple-800 transition-colors text-sm group">
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
            Volver al Login
          </Link>
        </div>
      </div>

      {/* Right Panel - Form (full width on mobile) */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center w-full min-h-screen bg-white lg:bg-transparent">
        {/* Loader Overlay */}
        <AnimatePresence>
          {showLoader && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl shadow-2xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center border border-purple-700 w-[90vw] max-w-md"
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-8 tracking-wide text-center">Bivoo</h2>
                <div className="w-full max-w-xs h-3 bg-gray-800 rounded-full overflow-hidden mb-4 flex items-center relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-green-400 rounded-full absolute left-0 top-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${loaderProgress}%` }}
                    transition={{ duration: 1.8 }}
                  />
                  <span className="relative z-10 w-full text-xs text-white font-bold text-center mx-auto" style={{ width: '100%' }}>
                    {Math.min(Math.round(loaderProgress), 100)}%
                  </span>
                </div>
                <div className="text-base sm:text-lg md:text-xl text-white font-semibold min-h-[40px] text-center drop-shadow-lg transition-colors duration-300">
                  {loaderMessages[Math.min(loaderStep, loaderMessages.length - 1)]}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border border-gray-200">
          <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm md:text-3xl font-extrabold text-gray-900 mb-2 text-center">Información Personal</h2>
                  <p className="text-gray-500 mb-4 text-sm md:text-md text-center">Ingresa tus datos personales para comenzar.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 text-base"
                      placeholder="Ej: Juan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 text-base"
                      placeholder="Ej: Pérez"
                      required
                    />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm md:text-3xl font-extrabold text-gray-900 mb-2 text-center">Credenciales de Acceso</h2>
                  <p className="text-gray-500 text-xs md:text-md text-md mb-4 text-center">
                    {isMobile ? "Ingresa tu email y contraseña para registrarte." : "Elige tu correo y contraseña para acceder a la plataforma."}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 text-base"
                      placeholder="ejemplo@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 text-base pr-10"
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm md:text-3xl font-extrabold text-gray-900 mb-2 text-center">Datos de Empresa</h2>
                  <p className="text-gray-500 mb-4 text-sm md:text-md text-center">Cuéntanos sobre tu empresa.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 text-base"
                      placeholder="Ej: Peluquería Bella"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Definir Nombre SubDominio</label>
                    <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
                      <span className="pl-3 pr-2 text-gray-400 flex items-center">
                        <Link2 size={18} />
                      </span>
                      <input
                        type="text"
                        value={formData.subdomain}
                        readOnly
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base py-2 px-0 min-w-0 cursor-default select-all"
                        placeholder="subdominio"
                        required
                        tabIndex={-1}
                        aria-readonly="true"
                      />
                      {subdomainSuggestions.length > 1 && (
                        <button
                          type="button"
                          className="px-2 text-gray-400 cursor-pointer hover:text-purple-500 focus:outline-none"
                          onClick={handleNextSuggestion}
                          title="Otra sugerencia de subdominio"
                          tabIndex={0}
                        >
                          <RefreshCw size={20} />
                        </button>
                      )}
                      <span className="pr-3 pl-2 text-gray-400 select-none text-base">.Bi-voo.com</span>
                    </div>
                    <button
                      type="button"
                      className="flex items-center mt-2 cursor-pointer text-xs text-gray-400 gap-1 hover:text-purple-500 focus:outline-none"
                      onClick={() => setShowDomainModal(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" /></svg>
                      ¿Cuál es mi dominio?
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {error && (
              <div className="mt-4 text-[#7E22CE] text-sm text-center animate-pulse">{error}</div>
            )}
            <div className="mt-auto flex justify-center md:hidden pt-8">
              <Link href="/login" className="inline-flex items-center text-purple-500 hover:text-purple-800 transition-colors text-sm group">
                <ArrowLeft className="mr-2  group-hover:-translate-x-1 transition-transform" size={18} />
                Volver al Login
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {step > 1 && (
                <motion.button type="button" onClick={handleBack} className="flex cursor-pointer items-center px-6 py-3 bg-[#F4F7FA] text-[#7E22CE] rounded-lg hover:bg-[#A259FF] hover:text-white shadow-md w-full justify-center border border-[#A259FF] font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><ArrowLeft size={16} className="mr-2" />Anterior</motion.button>
              )}
              <motion.button type="submit" className={`flex items-center cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md w-full justify-center border border-[#A259FF] bg-gradient-to-r from-[#A259FF] to-[#7E22CE] text-white ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} disabled={loading}>{loading ? (<span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>) : step === 3 ? ('Completar Registro') : (<>Siguiente<ArrowRight size={16} className="ml-2" /></>)}</motion.button>
              {/* Barra de progreso mobile */}
              <div className="flex lg:hidden justify-center items-center gap-4 mt-6">
                {steps.map((s, idx) => (
                  <React.Fragment key={s.number}>
                    <div className={`h-2 w-16 rounded-full ${step === s.number ? 'bg-[#A259FF]' : 'bg-[#E5E7EB]'}`}></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Modal de ayuda de dominio usando sistema custom */}
      <Dialog open={showDomainModal} onOpenChange={setShowDomainModal}>
        <DialogContent className="max-w-lg w-full p-0 bg-[#f4f7fa]  rounded-2xl shadow-2xl flex flex-col ">
          {/* DialogTitle para accesibilidad, oculto visualmente */}
          <DialogHeader>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3a4663] mb-6 text-center mt-8">¿Cuál es mi dominio Bi-voo?</h2>
          </DialogHeader>
          <div className="flex flex-col items-center mb-4 w-full px-8">
            <div className="bg-white border border-[#dbe3ea] rounded-lg px-4 py-2 flex items-center gap-2 mb-2 shadow-sm relative" style={{ minWidth: 'auto' }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='#b0b8c1' strokeWidth='2'>
                <circle cx='12' cy='12' r='10'/>
                <path d='M2 12h20M12 2v20'/>
              </svg>
              <span className="text-[#b0b8c1] font-mono text-sm">https://</span>
              <span className="bg-[#eaf3ff] border border-[#7db4f7] rounded px-2 py-1 text-[#2563eb] font-mono text-sm">nombredetunegocio</span>
              <span className="text-[#b0b8c1] font-mono text-sm">.bi-voo.com</span>
            </div>
            <div className="absolute left-[250px] top-[70px] flex flex-col items-center">
              <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 30C10 10 50 10 60 0" stroke="#2563eb" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-[#2563eb] text-xs font-semibold -mt-2">¡Es este!</span>
            </div>
          </div>
          <div className="text-[#3a4663] text-center  px-8 text-base">
            Revisa la barra de direcciones de tu navegador cuando estés conectado a Bi-voo, o pregunta a un colega. El texto justo antes de <span className="font-mono mr-1 text-[#3a4663]">.bi-voo.com</span> o <span className="font-mono text-[#3a4663]">.bi-voo.co</span> es tu dominio.
          </div>
          <button
            className=" m-10 bg-[#3a4663] cursor-pointer text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#2d3650] transition-colors mb-8"
            onClick={() => setShowDomainModal(false)}
          >
            Entendido, ¡gracias!
          </button>
          <button onClick={() => setShowDomainModal(false)} className="absolute right-4 top-4 text-[#b0b8c1] hover:text-[#3a4663] text-2xl font-bold">×</button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// --- FIN: Vista avanzada de registro ---
