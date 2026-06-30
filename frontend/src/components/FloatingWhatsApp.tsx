'use client';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/917710966660?text=Hi!%20I%20want%20to%20rent%20a%20car.%20Please%20share%20your%20fleet%20and%20best%20rates.`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Outer Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping z-[-1]" />
      
      {/* WhatsApp SVG Icon */}
      <svg 
        className="w-7 h-7 fill-current" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.628 3.973 14.162 2.95 11.535 2.95c-5.445 0-9.87 4.372-9.874 9.799-.001 1.738.463 3.435 1.341 4.93L2.02 21.55l3.96-1.037.667.363zM16.918 13.91c-.29-.145-1.716-.848-1.982-.945-.267-.097-.461-.146-.656.146-.194.29-.754.945-.924 1.14-.17.193-.34.217-.63.072-1.127-.564-1.88-.934-2.614-2.193-.193-.33.193-.307.553-1.025.06-.12.03-.225-.015-.321-.045-.096-.461-1.112-.632-1.524-.167-.401-.351-.346-.482-.352-.125-.006-.268-.007-.411-.007-.143 0-.376.054-.572.268-.196.214-.748.73-.748 1.78 0 1.05.764 2.06.87 2.2.106.14 1.504 2.296 3.644 3.218.509.219.907.35 1.218.448.512.162.977.139 1.345.084.41-.06 1.716-.701 1.958-1.378.24-.678.24-1.258.17-1.378-.072-.12-.266-.194-.556-.34z" />
      </svg>

      {/* Hover tooltip */}
      <span className="absolute right-16 scale-0 transition-all rounded bg-white/90 p-2 text-xs text-[#0B0F19] font-bold shadow-md group-hover:scale-100 whitespace-nowrap">
        Chat with Suman Travels
      </span>
    </a>
  );
}
