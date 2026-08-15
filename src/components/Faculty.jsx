import React from 'react';
import { Mail, Briefcase, GraduationCap, Award, Globe, Crown } from 'lucide-react';
import { useData } from '../context/DataContext';

// Hierarchy rank helper for faculty sorting (HOD always 1st)
const getFacultyRank = (designation = '') => {
  const d = designation.toLowerCase().trim();
  if (d.includes('head') || d.includes('hod') || d.includes('h.o.d') || d.includes('professor & head') || d.includes('principal') || d.includes('director')) {
    return 1;
  }
  if (d === 'professor' || (d.includes('professor') && !d.includes('associate') && !d.includes('assistant'))) {
    return 2;
  }
  if (d.includes('associate')) {
    return 3;
  }
  if (d.includes('assistant')) {
    return 4;
  }
  if (d.includes('lecturer') || d.includes('guest')) {
    return 5;
  }
  return 6;
};

const FacultyCard = ({ member }) => {
  const isHOD = getFacultyRank(member.designation) === 1;

  // Get initials of faculty member (e.g. "Dr. K. Murugesan" -> "KM", "Mr. P. Ravichandran" -> "PR")
  const getInitials = (name) => {
    const parts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'FC';
  };

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border transition-all duration-300 flex flex-col group h-full ${
      isHOD ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-100'
    }`}>
      {/* Profile Header Background with guaranteed consistent height */}
      <div className="bg-gradient-to-br from-primary-dark via-primary-dark to-primary-light p-6 text-center relative flex-shrink-0 flex flex-col items-center justify-between min-h-[220px]">
        {/* Avatar or Picture */}
        <div className="relative">
          {member.picture_link ? (
            <img 
              src={member.picture_link} 
              alt={member.name} 
              className={`w-20 h-20 sm:w-22 sm:h-22 mx-auto rounded-full object-cover object-top border-4 shadow-md group-hover:scale-105 transition-transform duration-300 ${
                isHOD ? 'border-amber-400' : 'border-accent'
              }`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className={`w-20 h-20 sm:w-22 sm:h-22 mx-auto rounded-full bg-white text-primary-dark font-extrabold text-2xl flex items-center justify-center border-4 shadow-md select-none group-hover:scale-105 transition-transform duration-300 ${
              isHOD ? 'border-amber-400' : 'border-accent'
            }`}>
              {getInitials(member.name)}
            </div>
          )}
          {isHOD && (
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-primary-dark p-1 rounded-full shadow" title="Head of the Department">
              <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          )}
        </div>

        {/* Name with fixed double-line vertical rhythm for 100% alignment */}
        <div className="w-full h-14 sm:h-16 flex items-center justify-center mt-2 px-1">
          <h4 className="text-white font-extrabold text-base sm:text-lg leading-snug tracking-wide text-center m-0 line-clamp-2">
            {member.name}
          </h4>
        </div>

        {/* Designation badge in fixed height container */}
        <div className="h-7 flex items-center justify-center">
          <span className={`inline-flex items-center text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            isHOD 
              ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-sm' 
              : 'bg-accent/20 text-accent'
          }`}>
            {member.designation}
          </span>
        </div>
      </div>

      {/* Profile Body with uniform structure */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between text-left">
        <div className="space-y-3">
          {/* Qualification */}
          <div className="flex items-start text-xs sm:text-sm">
            <GraduationCap className="w-4 h-4 text-accent mr-2.5 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-800">Degree:</strong> {member.qualification || 'M.E., Ph.D.'}
            </span>
          </div>

          {/* Specialization */}
          <div className="flex items-start text-xs sm:text-sm">
            <Award className="w-4 h-4 text-accent mr-2.5 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-800">Expertise:</strong> {member.specialization || 'Civil Engineering'}
            </span>
          </div>

          {/* Experience */}
          <div className="flex items-start text-xs sm:text-sm">
            <Briefcase className="w-4 h-4 text-accent mr-2.5 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-800">Experience:</strong> {member.experience || 'N/A'}
            </span>
          </div>
        </div>

        {/* Action Links (Email / Website) */}
        <div className="space-y-2 pt-4 mt-4 border-t border-slate-100">
          {member.email ? (
            <a 
              href={`mailto:${member.email}`}
              className="flex items-center justify-center w-full py-2.5 px-3 bg-slate-50 border border-slate-200/80 hover:bg-primary-light hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-all duration-200 overflow-hidden no-underline"
              title={member.email}
            >
              <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-primary-light group-hover:text-white" />
              <span className="truncate">{member.email}</span>
            </a>
          ) : (
            <div className="h-[38px]"></div>
          )}

          {member.website_link && (
            <a 
              href={member.website_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 bg-accent/10 hover:bg-accent text-primary-dark rounded-xl text-xs font-bold transition-all duration-200 no-underline"
            >
              <Globe className="w-3.5 h-3.5 mr-2" />
              Faculty Profile Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Faculty = () => {
  const { faculty, loading } = useData();

  // Always sort Head of the Department first, then by academic hierarchy
  const sortedFaculty = [...faculty].sort((a, b) => {
    const rankA = getFacultyRank(a.designation);
    const rankB = getFacultyRank(b.designation);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <section id="faculty" className="py-12 sm:py-20 bg-slate-50 text-center border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h6 className="text-accent font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
            Renowned Educators
          </h6>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4">
            Faculty Members
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto"></div>
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-primary-light rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 text-sm font-medium">Loading faculty profiles...</p>
          </div>
        ) : sortedFaculty.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-medium">No faculty members registered.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch justify-center">
            {sortedFaculty.map((member) => (
              <div key={member.id} className="flex flex-col">
                <FacultyCard member={member} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Faculty;
