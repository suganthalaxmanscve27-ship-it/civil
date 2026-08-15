import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Globe, X, Megaphone, ChevronRight, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';

const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed) return '';

  try {
    if (trimmed.includes('bing.com/images/search')) {
      const parsedUrl = new URL(trimmed);
      const mediaUrl = parsedUrl.searchParams.get('mediaurl');
      if (mediaUrl) return decodeURIComponent(mediaUrl);
    }
    if (trimmed.includes('google.com/imgres') || trimmed.includes('google.com/search')) {
      const parsedUrl = new URL(trimmed);
      const imgUrl = parsedUrl.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    }
    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
      const fileIdMatch = trimmed.match(/\/file\/d\/([^/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
      }
      const idParamMatch = trimmed.match(/[?&]id=([^&]+)/);
      if (idParamMatch && idParamMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
      }
    }
  } catch (e) {}

  return trimmed;
};

const EventAnnouncementPopup = ({ showIntro = false }) => {
  const { events, loading } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Automatically trigger popup after intro animation completes
  useEffect(() => {
    if (!loading && events && events.length > 0 && !hasBeenDismissed && !showIntro) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsClosing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [events, loading, hasBeenDismissed, showIntro]);

  if (loading || !events || events.length === 0) return null;

  const currentEvent = events[currentEventIndex] || events[0];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setHasBeenDismissed(true);
    }, 250);
  };

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const changeEventIndex = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentEventIndex(newIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const handleNextEvent = () => {
    changeEventIndex((currentEventIndex + 1) % events.length);
  };

  const handlePrevEvent = () => {
    changeEventIndex((currentEventIndex - 1 + events.length) % events.length);
  };

  const scrollToEvents = () => {
    handleClose();
    const el = document.getElementById('news');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BADGE (Fixed at bottom right) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white h-11 sm:h-12 px-4 sm:px-5 rounded-full shadow-2xl flex flex-row items-center justify-center space-x-2.5 border-2 border-accent transition-all duration-300 hover:scale-105 cursor-pointer animate-bounce-subtle group leading-none box-border"
          title="Click to view upcoming events popup"
        >
          <div className="relative flex items-center justify-center flex-shrink-0 self-center">
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-accent group-hover:rotate-12 transition-transform block" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="font-extrabold text-xs tracking-wide leading-none select-none self-center flex items-center">
            Upcoming Events ({events.length})
          </span>
        </button>
      )}

      {/* EVENT POPUP MODAL OVERLAY */}
      {isOpen && currentEvent && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div 
            className={`bg-white w-full max-w-lg rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transform transition-all duration-300 max-h-[95vh] sm:max-h-[90vh] ${
              isClosing ? 'animate-scaleDown' : 'animate-scaleUp'
            }`}
          >
            
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-primary-dark via-primary-light to-primary-dark px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-accent/20 rounded-xl text-accent">
                  <Megaphone className="w-4 h-4" />
                </span>
                <span className="font-extrabold text-[10px] sm:text-xs uppercase tracking-widest text-accent">
                  Event Announcement {events.length > 1 ? `(${currentEventIndex + 1}/${events.length})` : ''}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content Container with smooth crossfade */}
            <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
              
              {/* Event Picture / Banner Header */}
              {currentEvent.picture_link ? (
                <div className="relative h-28 sm:h-48 w-full bg-slate-900 overflow-hidden flex-shrink-0">
                  <img
                    src={sanitizeImageUrl(currentEvent.picture_link)}
                    alt={currentEvent.title || "Event Image"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="inline-block bg-accent text-primary-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      Upcoming Feature
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Event Content Body */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-5 text-left overflow-y-auto">
                <div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-primary-dark leading-snug">
                    {currentEvent.title}
                  </h3>
                </div>

                {/* Event Details Grid */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-700 font-medium">
                  <div className="flex items-center space-x-2.5">
                    <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                    <span><strong className="text-slate-900">Date:</strong> {formatDate(currentEvent.date)}</span>
                  </div>
                  {currentEvent.time && (
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                      <span><strong className="text-slate-900">Time:</strong> {currentEvent.time}</span>
                    </div>
                  )}
                  {currentEvent.venue && (
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                      <span><strong className="text-slate-900">Venue:</strong> {currentEvent.venue}</span>
                    </div>
                  )}
                </div>

                {/* Multiple Events Navigator (if > 1 event) */}
                {events.length > 1 && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                    <button
                      onClick={handlePrevEvent}
                      className="text-primary-light hover:text-primary-dark hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 transition-colors"
                    >
                      ← Previous Event
                    </button>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">
                      {currentEventIndex + 1} of {events.length}
                    </span>
                    <button
                      onClick={handleNextEvent}
                      className="text-primary-light hover:text-primary-dark hover:underline font-bold bg-transparent border-0 cursor-pointer p-0 transition-colors"
                    >
                      Next Event →
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                  {currentEvent.website_link && (
                    <a
                      href={currentEvent.website_link.startsWith('http') ? currentEvent.website_link : `https://${currentEvent.website_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center bg-accent text-primary-dark hover:bg-primary-dark hover:text-white font-extrabold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-all duration-200 shadow-md text-center no-underline hover:scale-[1.02]"
                    >
                      <Globe className="w-4 h-4 mr-1.5" />
                      Event Link
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}
                  <button
                    onClick={scrollToEvents}
                    className="flex-1 inline-flex items-center justify-center bg-primary-light hover:bg-primary-dark text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-all duration-200 shadow-md border-0 cursor-pointer hover:scale-[1.02]"
                  >
                    View All Events
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer Note */}
            <div className="bg-slate-50 px-4 sm:px-6 py-2 sm:py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 flex-shrink-0">
              <span>Department of Civil Engineering</span>
              <button
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-800 font-bold bg-transparent border-0 cursor-pointer"
              >
                Dismiss Popup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default EventAnnouncementPopup;
