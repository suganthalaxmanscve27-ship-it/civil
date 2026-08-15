import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Code, Trophy, BookOpen, ExternalLink } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const StudentsSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'placements');

  useEffect(() => {
    if (tabFromUrl && ['placements', 'projects', 'research', 'symposium'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const placementStats = [
    { title: "Placement Rate", value: "85%", desc: "Batch of 2024-25 placed in core & IT firms" },
    { title: "Highest Package", value: "8.5 LPA", desc: "Offered by top engineering consultancy" },
    { title: "Average Package", value: "4.5 LPA", desc: "Core civil structural engineering roles" }
  ];

  const recruiters = ["L&T Construction", "Shobha Developers", "ACC Cements", "Cognizant", "TCS", "Wipro", "EGIS India", "Afcons Infrastructure"];

  const projects = [
    { title: "Experimental Investigation on Self-Healing Concrete", students: "K. R. Hari, R. Sanjay", guide: "Dr. K. Murugesan" },
    { title: "Seismic Performance Assessment of RC Frames with Infill Walls", students: "M. Deepika, S. Vignesh", guide: "Dr. S. Anitha" },
    { title: "Design of Low-Cost Decentralized Wastewater Treatment Plant", students: "S. Monica, A. Gokul", guide: "Mr. P. Ravichandran" }
  ];

  const symposiumDetails = {
    name: "ADAGE '26",
    tagline: "National Level Technical Symposium",
    events: ["Paper Presentation (Constructo)", "Code Cracking (Strucrex)", "Brick Bonding (Cemesta)", "Model Making (Design-o-Mania)", "CADD Modelling (Draftify)"],
    date: "September 03, 2026",
    registrationLink: "https://adage26.vercel.app/"
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <div>
        <Header />
        
        {/* Sub-Header banner */}
        <div className="bg-primary-dark text-white py-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
          <div className="container mx-auto max-w-7xl relative z-10 text-left">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center text-accent hover:text-white mb-4 bg-transparent border-0 cursor-pointer font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl md:text-5xl font-extrabold m-0 text-white font-serif">Students Corner</h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl font-light">
              Explore placement records, student research projects, academic achievements, and department symposiums.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm sticky top-[60px] sm:top-16 z-30">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto py-3 sm:py-4 scrollbar-none border-b border-slate-100 -mx-1 px-1">
              {[
                { id: 'placements', label: 'Placements', icon: GraduationCap },
                { id: 'projects', label: 'Student Projects', icon: Code },
                { id: 'research', label: 'Research Works', icon: BookOpen },
                { id: 'symposium', label: 'ADAGE Symposium', icon: Trophy }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 pb-2 border-b-2 px-1 text-sm font-semibold transition-colors bg-transparent cursor-pointer whitespace-nowrap
                      ${isActive 
                        ? 'border-accent text-primary-light font-bold' 
                        : 'border-transparent text-slate-500 hover:text-primary-light'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <main className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
          
          {/* Tab: Placements */}
          {activeTab === 'placements' && (
            <div className="space-y-12 animate-fadeIn text-left">
              <div className="grid md:grid-cols-3 gap-6">
                {placementStats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-3xl font-extrabold text-primary-light block mb-2">{stat.value}</span>
                    <h4 className="font-bold text-slate-800 text-base mb-1">{stat.title}</h4>
                    <p className="text-slate-500 text-xs md:text-sm m-0 leading-relaxed font-light">{stat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-primary-dark mb-6">Our Top Recruiters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recruiters.map((recruiter, i) => (
                    <div key={i} className="py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-center font-bold text-slate-700 text-sm border border-slate-100 transition-colors">
                      {recruiter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Student Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <h3 className="text-xl font-bold text-primary-dark mb-6">Final Year Capstone Projects</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                    <div>
                      <span className="inline-block bg-accent/20 text-primary-dark font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-3">
                        Project ID: CP0{i+1}
                      </span>
                      <h4 className="font-bold text-slate-800 text-base mb-3 leading-snug">{proj.title}</h4>
                    </div>
                    <div className="border-t border-slate-100 pt-3 mt-4 text-xs space-y-1.5 text-slate-600">
                      <p><strong>Students:</strong> {proj.students}</p>
                      <p><strong>Project Guide:</strong> {proj.guide}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Research */}
          {activeTab === 'research' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-fadeIn text-left">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Department Research Focus</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                The Department of Civil Engineering encourages students to engage in research and publish findings under the guidance of our doctorates. Key research thrust areas include:
              </p>
              <ul className="grid md:grid-cols-2 gap-4 list-none p-0 text-sm text-slate-700">
                <li className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></span>
                  <span>Geopolymer Concrete & Supplementary Cementitious Materials</span>
                </li>
                <li className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></span>
                  <span>GIS & Remote Sensing Application in Watershed Management</span>
                </li>
                <li className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></span>
                  <span>Soil Stabilization using Bio-enzymes & Plastic Fibres</span>
                </li>
                <li className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></span>
                  <span>Structural Retrofitting & Seismic Infill Analysis</span>
                </li>
              </ul>
            </div>
          )}

          {/* Tab: Symposium */}
          {activeTab === 'symposium' && (
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm animate-fadeIn flex flex-col md:flex-row gap-8 items-center text-left">
              <div className="md:w-2/3 space-y-4">
                <span className="inline-block bg-accent text-primary-dark font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Upcoming Tech Fest
                </span>
                <h2 className="text-3xl font-extrabold text-primary-dark m-0 font-serif">{symposiumDetails.name}</h2>
                <h5 className="text-slate-500 font-bold text-sm tracking-wide m-0">{symposiumDetails.tagline}</h5>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ADAGE is the department's annual flagship national-level technical symposium. It serves as an arena for civil engineering students from nationwide colleges to showcase technical competence, build structures, and network with industrial sponsors.
                </p>
                <div className="pt-2 text-xs md:text-sm">
                  <p className="m-0"><strong>Event Date:</strong> {symposiumDetails.date}</p>
                </div>
              </div>
              
              <div className="md:w-1/3 w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-3">Event Categories</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-inside list-decimal p-0 mb-5">
                  {symposiumDetails.events.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
                <a
                  href={symposiumDetails.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-primary-light hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer no-underline shadow-sm"
                >
                  Registration Form
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentsSection;
