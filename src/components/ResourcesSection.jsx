import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, FileText, Bookmark } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const ResourcesSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'library');

  useEffect(() => {
    if (tabFromUrl && ['library', 'downloads', 'curriculum'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const syllabusDownloads = [
    { title: "B.E. Civil Engineering Curriculum - Regulation 2021", size: "1.2 MB", type: "PDF" },
    { title: "M.E. Structural Engineering Syllabus - Regulation 2021", size: "850 KB", type: "PDF" },
    { title: "Ph.D. Course Work Guidelines", size: "450 KB", type: "PDF" }
  ];

  const manualDownloads = [
    { title: "Strength of Materials Laboratory Manual", size: "3.4 MB", type: "PDF" },
    { title: "Soil Mechanics Laboratory Manual", size: "4.1 MB", type: "PDF" },
    { title: "Surveying Laboratory Manual & Field Book Guidelines", size: "2.8 MB", type: "PDF" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <div>
        <Header />

        {/* Sub-Header Banner */}
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
            <h1 className="text-3xl md:text-5xl font-extrabold m-0 text-white font-serif">Academic Resources</h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl font-light">
              Access the digital repository for syllabi, lab manuals, department library inventory, and academic regulations.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm sticky top-[60px] sm:top-16 z-30">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto py-3 sm:py-4 scrollbar-none border-b border-slate-100 -mx-1 px-1">
              {[
                { id: 'library', label: 'Department Library', icon: BookOpen },
                { id: 'downloads', label: 'Downloads (Syllabus & Manuals)', icon: Download },
                { id: 'curriculum', label: 'Curriculum Regulations', icon: Bookmark }
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

          {/* Tab: Library */}
          {activeTab === 'library' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-fadeIn text-left space-y-6">
              <h3 className="text-xl font-bold text-primary-dark">Department Library Facility</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The Civil Engineering Department houses a dedicated library containing key reference books, project reports, and engineering journals to support students and research scholars in structural analysis, geotechnical works, and water resource engineering.
              </p>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <span className="text-4xl font-extrabold text-primary-light block mb-1">1200+</span>
                  <span className="text-slate-700 font-semibold text-sm">Reference Volumes</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <span className="text-4xl font-extrabold text-primary-light block mb-1">450+</span>
                  <span className="text-slate-700 font-semibold text-sm">Capstone Project Records</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <span className="text-4xl font-extrabold text-primary-light block mb-1">12</span>
                  <span className="text-slate-700 font-semibold text-sm">National Journals Subscribed</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Downloads */}
          {activeTab === 'downloads' && (
            <div className="grid md:grid-cols-2 gap-8 animate-fadeIn text-left">
              
              {/* Syllabi list */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-primary-dark border-b pb-2">Syllabi & Regulations</h3>
                <div className="space-y-4">
                  {syllabusDownloads.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-colors">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-tight">{doc.title}</h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">{doc.type} | {doc.size}</span>
                        </div>
                      </div>
                      <button className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-primary-light hover:text-white hover:border-primary-light rounded-xl transition-all duration-200 cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Manuals */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-primary-dark border-b pb-2">Lab Manuals</h3>
                <div className="space-y-4">
                  {manualDownloads.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-colors">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-tight">{doc.title}</h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">{doc.type} | {doc.size}</span>
                        </div>
                      </div>
                      <button className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-primary-light hover:text-white hover:border-primary-light rounded-xl transition-all duration-200 cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab: Curriculum */}
          {activeTab === 'curriculum' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-fadeIn text-left space-y-6">
              <h3 className="text-xl font-bold text-primary-dark">Academic Curriculum Regulations</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Affiliated to Anna University, Chennai, the Government College of Engineering, Erode follows the academic regulations, credit mappings, and assessment policies formulated under Anna University Guidelines. The curriculum integrates Outcome-Based Education (OBE) formats, emphasizing industrial projects and research internships.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3 text-xs md:text-sm font-semibold text-slate-700">
                <Bookmark className="w-5 h-5 text-accent flex-shrink-0" />
                <span>Current Regulations follow the Anna University R-2021 Choice Based Credit System (CBCS) framework.</span>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ResourcesSection;
