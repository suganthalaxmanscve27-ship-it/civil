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
    <section id="contact" className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h6 className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
            Get in touch
          </h6>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
        </div>

        {/* Contact Info Cards Grid — Fully Clickable Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          
          {/* Visit Us Card */}
          <a
            href="https://maps.google.com/?q=Government+College+of+Engineering+Erode"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-4 group no-underline cursor-pointer block"
          >
            <div className="w-12 h-12 bg-primary-light/10 text-primary-light group-hover:bg-primary-light group-hover:text-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <MapPin className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-base mb-1">
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
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-4 group no-underline cursor-pointer block"
          >
            <div className="w-12 h-12 bg-primary-light/10 text-primary-light group-hover:bg-primary-light group-hover:text-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Mail className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-base mb-1">
                Email Us ✉️
              </h4>
              <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-wider">Official Inquiries</p>
              <span className="text-slate-800 group-hover:text-primary-light text-xs sm:text-sm font-extrabold transition-colors m-0 block truncate max-w-[170px]">
                civitasgcee.ac.in@gmail.com
              </span>
            </div>
          </a>

          {/* Instagram Follow Us Card */}
          <a
            href="https://www.instagram.com/civil.association"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/40 hover:-translate-y-1 transition-all duration-300 text-left flex items-start space-x-4 group no-underline cursor-pointer block"
          >
            <div className="w-12 h-12 bg-accent/15 text-primary-dark group-hover:bg-accent group-hover:text-primary-dark rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <InstagramIcon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-primary-dark group-hover:text-primary-light transition-colors text-base mb-1">
                Instagram ↗
              </h4>
              <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-wider">Civil Association</p>
              <span className="text-slate-800 group-hover:text-primary-light text-xs sm:text-sm font-extrabold transition-colors m-0 block truncate max-w-[170px]">
                @civil.association
              </span>
            </div>
          </a>

        </div>

        {/* GCE Erode Institution Blurb */}
        <div className="bg-primary-dark text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-white/5 text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-5">
            <div className="w-14 h-14 bg-white/10 text-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <Landmark className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-accent text-xl sm:text-2xl">
                Government College of Engineering, Erode
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed m-0 font-light max-w-4xl">
                The Department of Civil Engineering imparts quality technical training using state-of-the-art laboratory facilities and modern curriculum. Established in 1984 as IRTT and converted into a premier government institution, GCE Erode fosters academic excellence, innovation, and professional leadership.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
