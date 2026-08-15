import { MapPin, Mail, Landmark } from 'lucide-react';

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Contact = () => {
  return (
    <section id="contact" className="py-10 sm:py-16 md:py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-14">
          <h6 className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
            Get in touch
          </h6>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-dark mb-3 sm:mb-4">
            Contact Us
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        {/* Contact Info Cards Grid — Fully Clickable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          
          {/* Visit Us Card */}
          <a
            href="https://maps.google.com/?q=Government+College+of+Engineering+Erode"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-3.5 sm:space-x-4 group no-underline cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-light/10 text-primary-light group-hover:bg-primary-light group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-sm sm:text-base mb-1">
                Visit Us ↗
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed m-0 font-medium">
                Government College of Engineering,<br />
                Erode - 638052, Tamil Nadu, India.
              </p>
            </div>
          </a>

          {/* Email Us Card */}
          <a
            href="mailto:civitasgcee.ac.in@gmail.com"
            className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-3.5 sm:space-x-4 group no-underline cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-light/10 text-primary-light group-hover:bg-primary-light group-hover:text-white rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-sm sm:text-base mb-1">
                Email Us ✉️
              </h4>
              <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-wider">Official Inquiries</p>
              <span className="text-slate-800 group-hover:text-primary-light text-xs sm:text-sm font-extrabold transition-colors m-0 block break-all">
                civitasgcee.ac.in@gmail.com
              </span>
            </div>
          </a>

          {/* Instagram Follow Us Card */}
          <a
            href="https://www.instagram.com/civil.association"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-3.5 sm:space-x-4 group no-underline cursor-pointer sm:col-span-2 lg:col-span-1"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-accent/15 text-primary-dark group-hover:bg-accent group-hover:text-primary-dark rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-sm sm:text-base mb-1">
                Instagram ↗
              </h4>
              <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-wider">Civil Association</p>
              <span className="text-slate-800 group-hover:text-primary-light text-xs sm:text-sm font-extrabold transition-colors m-0 block break-all">
                @civil.association
              </span>
            </div>
          </a>

        </div>

        {/* GCE Erode Institution Blurb */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary-dark to-[#0f2744] text-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 text-left">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5 mb-3 sm:mb-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/10 border border-white/10 text-accent rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Landmark className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.75]" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-accent/20 text-accent mb-1 sm:mb-1.5 border border-accent/30">
                Premier Government Institution • Est. 1984
              </div>
              <h3 className="font-extrabold text-accent text-base sm:text-xl md:text-2xl leading-snug">
                Government College of Engineering, Erode
              </h3>
            </div>
          </div>

          <p className="relative text-slate-200/90 text-xs sm:text-sm md:text-base leading-relaxed m-0 font-light max-w-4xl">
            The Department of Civil Engineering imparts quality technical training using state-of-the-art laboratory facilities and modern curriculum. Established in 1984 as IRTT and converted into a premier government institution, GCE Erode fosters academic excellence, innovation, and professional leadership.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Contact;
