import React from 'react';
import { Wrench, HardHat, Tv, Microscope, Award, Lightbulb, BookOpen, TrendingUp } from 'lucide-react';

const ActivityCard = ({ title, desc, icon: Icon }) => (
  <div className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-md border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center group">
    <div className="w-16 h-16 flex items-center justify-center text-primary-dark rounded-full bg-primary-light/10 mb-6 group-hover:bg-primary-dark group-hover:text-white transition-all duration-300">
      <Icon className="w-7 h-7 stroke-[1.5]" />
    </div>
    <h6 className="font-extrabold text-primary-dark text-lg mb-3 tracking-wide">{title}</h6>
    <p className="text-slate-500 text-sm leading-relaxed m-0">{desc}</p>
  </div>
);

const Activities = () => {
  const activities = [
    {
      title: "Technical Workshops",
      desc: "Hands-on training sessions to build industry-relevant technical skills and software competencies.",
      icon: Wrench
    },
    {
      title: "Industrial Visits",
      desc: "Practical exposure to ongoing real-world civil engineering projects, tunnels, dams, and construction sites.",
      icon: HardHat
    },
    {
      title: "Guest Lectures",
      desc: "Interactive sessions led by experienced industry professionals, consultants, and veteran academicians.",
      icon: Tv
    },
    {
      title: "Research Activities",
      desc: "Innovative research programs focusing on modern engineering challenges, concrete mixes, and seismology.",
      icon: Microscope
    },
    {
      title: "Technical Symposium",
      desc: "ADAGE - Annual national-level department fest bringing students together for paper presentations and design challenges.",
      icon: Award
    },
    {
      title: "Student Projects",
      desc: "Exhibitions showcasing innovative structural models, environmental prototypes, and working designs.",
      icon: Lightbulb
    },
    {
      title: "Seminars & Conferences",
      desc: "Value-packed research paper presentations and open forum discussions on structural and material trends.",
      icon: BookOpen
    },
    {
      title: "Skill Development",
      desc: "Value added courses, software training modules, and soft skill camps to bridge academic-industry gaps.",
      icon: TrendingUp
    }
  ];

  return (
    <section id="activities" className="py-12 sm:py-20 bg-white relative overflow-hidden">
      {/* Visual background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(#0A2647 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h6 className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
            Student Life & Growth
          </h6>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4">
            Department Activities
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activities.map((act, index) => (
            <ActivityCard 
              key={index}
              title={act.title}
              desc={act.desc}
              icon={act.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Activities;
