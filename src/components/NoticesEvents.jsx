import React, { useState } from 'react';
import { Bell, Calendar, MapPin, Clock, ExternalLink, Globe, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed) return '';

  try {
    // 1. Bing Image Search URLs (extract mediaurl query parameter)
    if (trimmed.includes('bing.com/images/search')) {
      const parsedUrl = new URL(trimmed);
      const mediaUrl = parsedUrl.searchParams.get('mediaurl');
      if (mediaUrl) return decodeURIComponent(mediaUrl);
    }

    // 2. Google Image Search URLs (extract imgurl query parameter)
    if (trimmed.includes('google.com/imgres') || trimmed.includes('google.com/search')) {
      const parsedUrl = new URL(trimmed);
      const imgUrl = parsedUrl.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    }

    // 3. Google Drive file links (convert sharing link to direct embeddable image URL)
    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
      // Format A: /file/d/FILE_ID/view?usp=sharing
      const fileIdMatch = trimmed.match(/\/file\/d\/([^/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
      }
      // Format B: uc?export=view&id=FILE_ID or open?id=FILE_ID
      const idParamMatch = trimmed.match(/[?&]id=([^&]+)/);
      if (idParamMatch && idParamMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
      }
    }
  } catch (e) {
    // Fallback if URL parsing fails
  }

  return trimmed;
};

const isValidImageUrl = (rawUrl) => {
  const url = sanitizeImageUrl(rawUrl);
  if (!url || typeof url !== 'string') return false;
  if (url.length < 5) return false;
  return /^(https?:\/\/|data:image\/|blob:|\/|\.\/)/i.test(url);
};

const ImageWithFallback = ({ src, alt = '', className, icon: Icon = Bell }) => {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = sanitizeImageUrl(src);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!isValidImageUrl(cleanSrc) || hasError) {
    return (
      <div className={`bg-primary-light/10 text-primary-light rounded-xl flex items-center justify-center font-bold text-xs ${className}`}>
        <Icon className="w-5 h-5 text-primary-light" />
      </div>
    );
  }

  return (
    <img 
      src={cleanSrc} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

const NoticesEvents = () => {
  const { notices, events, loading } = useData();
  const [modalState, setModalState] = useState({ isOpen: false, url: '', title: '' });
  
  // Event Popup state
  const [eventModalData, setEventModalData] = useState(null);
  const [isClosingEventModal, setIsClosingEventModal] = useState(false);
  const [eventImageType, setEventImageType] = useState('none'); // 'portrait' | 'landscape' | 'square' | 'extreme-tall' | 'none'

  // Notice Popup state
  const [noticeModalData, setNoticeModalData] = useState(null);
  const [isClosingNoticeModal, setIsClosingNoticeModal] = useState(false);
  const [noticeImageType, setNoticeImageType] = useState('none'); // 'portrait' | 'landscape' | 'square' | 'extreme-tall' | 'none'

  // Format date helper (e.g. "2026-08-05" -> "Aug 05, 2026")
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleWebsiteClick = (e, url, title) => {
    e.stopPropagation(); // prevent opening card modal when clicking website link
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    
    // On Mobile screen (< 768px): redirect / open directly in new tab
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    } else {
      // On Laptop / Desktop screen (>= 768px): open clean preview modal
      setModalState({ isOpen: true, url: formattedUrl, title });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, url: '', title: '' });
  };

  // Event modal handlers
  const openEventPopup = (event) => {
    setIsClosingEventModal(false);
    setEventImageType(isValidImageUrl(event.picture_link) ? 'loading' : 'none');
    setEventModalData(event);
  };

  const closeEventPopup = () => {
    setIsClosingEventModal(true);
    setTimeout(() => {
      setEventModalData(null);
      setIsClosingEventModal(false);
      setEventImageType('none');
    }, 200);
  };

  // Detect image aspect ratio on load
  const handleEventImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const ratio = naturalWidth / naturalHeight;

    if (ratio < 0.55) {
      setEventImageType('extreme-tall');
    } else if (ratio < 0.75) {
      setEventImageType('portrait');
    } else if (ratio > 1.4) {
      setEventImageType('landscape');
    } else {
      setEventImageType('square');
    }
  };

  // Compute adaptive modal classes
  const getEventModalWidthClass = () => {
    switch (eventImageType) {
      case 'landscape': return 'max-w-2xl';
      case 'portrait': return 'max-w-md sm:max-w-lg';
      case 'extreme-tall': return 'max-w-md sm:max-w-lg';
      case 'square': return 'max-w-lg sm:max-w-xl';
      default: return 'max-w-lg';
    }
  };

  const getEventImageMaxHeight = () => {
    switch (eventImageType) {
      case 'portrait': return 'max-h-[420px]';
      case 'square': return 'max-h-[350px]';
      case 'landscape': return 'max-h-[280px]';
      case 'extreme-tall': return 'max-h-[400px]';
      default: return 'max-h-[350px]';
    }
  };

  // Notice modal handlers
  const openNoticePopup = (notice) => {
    setIsClosingNoticeModal(false);
    setNoticeImageType(isValidImageUrl(notice.picture_link) ? 'loading' : 'none');
    setNoticeModalData(notice);
  };

  const closeNoticePopup = () => {
    setIsClosingNoticeModal(true);
    setTimeout(() => {
      setNoticeModalData(null);
      setIsClosingNoticeModal(false);
      setNoticeImageType('none');
    }, 200);
  };

  // Detect notice image aspect ratio on load
  const handleNoticeImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const ratio = naturalWidth / naturalHeight;

    if (ratio < 0.55) {
      setNoticeImageType('extreme-tall');
    } else if (ratio < 0.75) {
      setNoticeImageType('portrait');
    } else if (ratio > 1.4) {
      setNoticeImageType('landscape');
    } else {
      setNoticeImageType('square');
    }
  };

  // Compute adaptive notice modal classes
  const getNoticeModalWidthClass = () => {
    switch (noticeImageType) {
      case 'landscape': return 'max-w-2xl';
      case 'portrait': return 'max-w-md sm:max-w-lg';
      case 'extreme-tall': return 'max-w-md sm:max-w-lg';
      case 'square': return 'max-w-lg sm:max-w-xl';
      default: return 'max-w-lg';
    }
  };

  const getNoticeImageMaxHeight = () => {
    switch (noticeImageType) {
      case 'portrait': return 'max-h-[420px]';
      case 'square': return 'max-h-[350px]';
      case 'landscape': return 'max-h-[280px]';
      case 'extreme-tall': return 'max-h-[400px]';
      default: return 'max-h-[350px]';
    }
  };

  return (
    <section id="news" className="py-12 sm:py-20 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Notices Column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-primary-dark text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Bell className="w-6 h-6 animate-swing text-accent" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-primary-dark tracking-tight">Recent Notices</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-0.5">Click notice card to view details</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex-grow flex flex-col min-h-[300px] sm:min-h-[400px]">
              {/* Notice Header Banner */}
              <div className="bg-primary-dark px-6 py-4 flex justify-between items-center">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" />
                  NOTICE BOARD
                </span>
                <span className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </span>
              </div>

              {/* Notice List */}
              <div className="flex-grow p-4 sm:p-6 overflow-y-auto max-h-[500px] sm:max-h-[600px] overflow-custom">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-primary-light rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 text-sm font-medium">Loading notices...</p>
                  </div>
                ) : notices.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <Bell className="w-12 h-12 mb-3 stroke-[1]" />
                    <p className="font-medium">No recent notices available.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {notices.map((notice) => {
                      const hasValidImage = isValidImageUrl(notice.picture_link);
                      
                      return (
                        <div 
                          key={notice.id} 
                          onClick={() => openNoticePopup(notice)}
                          className="p-5 bg-slate-50 hover:bg-slate-100/90 border-l-4 border-accent rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col gap-3 group cursor-pointer relative overflow-hidden text-left"
                        >
                          <div className="absolute top-0 right-0 bg-primary-light/10 text-primary-dark font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for details ↗
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="text-lg">📝</span>
                            <div className="flex-grow">
                              <h4 className="font-bold text-slate-800 text-base leading-snug group-hover:text-primary-light transition-colors">
                                {notice.title}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                Posted {formatDate(notice.date)}
                              </p>
                            </div>
                          </div>

                          {/* NOTICE IMAGE Container */}
                          {hasValidImage && (
                            <div className="w-full h-[180px] bg-[#f1f5f9] rounded-[12px] overflow-hidden border border-slate-200/80 shadow-sm flex items-center justify-center relative group-hover:border-primary-light/40 transition-colors">
                              <ImageWithFallback 
                                src={notice.picture_link} 
                                alt={notice.title} 
                                className="notice-image w-full h-[180px] object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                                icon={Bell}
                              />
                              <div className="absolute bottom-2 right-2 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10">
                                🖼 NOTICE IMAGE
                              </div>
                            </div>
                          )}

                          {notice.website_link && (
                            <div className="flex items-center justify-end pt-1">
                              <button 
                                onClick={(e) => handleWebsiteClick(e, notice.website_link, notice.title)}
                                className="inline-flex items-center text-xs font-extrabold text-white bg-primary-light hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-all border-0 cursor-pointer shadow-sm"
                              >
                                <Globe className="w-3.5 h-3.5 mr-1.5 text-accent" />
                                Visit Link ↗
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Events Column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-accent text-primary-dark rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-primary-dark tracking-tight">Upcoming Events</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-0.5">Click event for details</p>
              </div>
            </div>

            <div className="space-y-5 flex-grow overflow-y-auto max-h-[520px] sm:max-h-[620px] pr-1 sm:pr-2 overflow-custom">
              {loading ? (
                // Skeletons
                [1, 2, 3].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse-custom flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex-shrink-0"></div>
                    <div className="flex-grow space-y-3 pt-1">
                      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center text-slate-400 flex flex-col items-center justify-center">
                  <Calendar className="w-12 h-12 mb-3 stroke-[1]" />
                  <p className="font-medium">No upcoming events listed.</p>
                </div>
              ) : (
                events.map((event) => {
                  const evDate = new Date(event.date);
                  const day = evDate.getDate();
                  const month = evDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  const hasValidImage = isValidImageUrl(event.picture_link);
                  
                  return (
                    <div 
                      key={event.id}
                      onClick={() => openEventPopup(event)}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-light/30 transition-all duration-300 flex flex-row items-stretch group gap-4 cursor-pointer relative overflow-hidden text-left"
                    >
                      {/* EVENT POSTER */}
                      <div className="w-[100px] sm:w-[120px] min-h-[120px] rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0 bg-[#f1f5f9] relative flex items-center justify-center">
                        {hasValidImage ? (
                          <ImageWithFallback 
                            src={event.picture_link} 
                            alt={event.title} 
                            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                            icon={Calendar}
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-light/10 text-primary-light group-hover:bg-primary-light group-hover:text-white flex flex-col items-center justify-center transition-colors duration-300">
                            <span className="text-2xl font-extrabold leading-none">{isNaN(day) ? '??' : day}</span>
                            <span className="text-xs font-bold uppercase tracking-wider mt-1">{month === 'INVALID DATE' ? 'EV' : month}</span>
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-grow w-full">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-snug group-hover:text-primary-light transition-colors">
                            {event.title}
                          </h4>
                          <span className="inline-block text-[11px] font-extrabold text-primary-dark bg-accent/20 px-2.5 py-0.5 rounded-full">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600 font-semibold">
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-primary-light" />
                            {event.time || '09:00 AM'}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-accent" />
                            {event.venue || 'DEPT'}
                          </span>
                        </div>

                        {/* Action Buttons: [Register] and [Details] */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                          {event.website_link ? (
                            <button 
                              onClick={(e) => handleWebsiteClick(e, event.website_link, event.title)}
                              className="inline-flex items-center justify-center text-xs font-extrabold text-primary-dark bg-accent hover:bg-primary-dark hover:text-white px-3.5 py-1.5 rounded-xl transition-all border-0 cursor-pointer shadow-sm"
                            >
                              Register
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openEventPopup(event);
                              }}
                              className="inline-flex items-center justify-center text-xs font-extrabold text-primary-dark bg-accent/30 hover:bg-accent px-3.5 py-1.5 rounded-xl transition-all border-0 cursor-pointer"
                            >
                              Register
                            </button>
                          )}

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openEventPopup(event);
                            }}
                            className="inline-flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors border-0 cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>


      {/* NOTICE DETAILS POPUP MODAL — Adaptive Layout */}
      {noticeModalData && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
            isClosingNoticeModal ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeNoticePopup();
          }}
        >
          <div 
            className={`bg-white w-full ${getNoticeModalWidthClass()} rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transform transition-all duration-300 max-h-[92vh] sm:max-h-[90vh] ${
              isClosingNoticeModal ? 'animate-scaleDown' : 'animate-scaleUp'
            }`}
          >
            {/* Modal Top Header */}
            <div className="bg-primary-dark px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-accent animate-swing" />
                <h3 className="font-bold text-sm sm:text-base md:text-lg tracking-wide">Notice Details</h3>
              </div>
              <button
                onClick={closeNoticePopup}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0"
                aria-label="Close notice popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body Container */}
            <div className="overflow-y-auto overflow-custom">

              {/* Adaptive Attached Picture / Document Display */}
              {isValidImageUrl(noticeModalData.picture_link) && (
                <div className={`w-full bg-[#f1f5f9] flex items-center justify-center p-3 sm:p-4 flex-shrink-0 relative ${
                  noticeImageType === 'loading' ? 'min-h-[120px]' : ''
                }`}>
                  {noticeImageType === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-light rounded-full animate-spin"></div>
                      <p className="mt-3 text-slate-400 text-xs font-medium">Loading notice image...</p>
                    </div>
                  )}
                  <img
                    src={sanitizeImageUrl(noticeModalData.picture_link)}
                    alt={noticeModalData.title || 'Notice Attachment'}
                    className={`w-full object-contain object-center rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 ${
                      getNoticeImageMaxHeight()
                    } ${
                      noticeImageType === 'loading' ? 'opacity-0 h-0' : 'opacity-100'
                    }`}
                    onLoad={handleNoticeImageLoad}
                    onError={() => setNoticeImageType('none')}
                  />
                  {noticeImageType === 'extreme-tall' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(sanitizeImageUrl(noticeModalData.picture_link), '_blank', 'noopener,noreferrer');
                      }}
                      className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer hover:bg-slate-800 transition-colors border-0"
                    >
                      🖼 View Full Document
                    </button>
                  )}
                </div>
              )}

              {/* Notice Body Information */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-left">
                <div>
                  <span className="inline-block bg-primary-light/10 text-primary-dark text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    Department Announcement
                  </span>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-primary-dark leading-snug">
                    {noticeModalData.title}
                  </h2>
                </div>

                {/* Meta Info Box */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Posted Date:</span>
                    <span className="font-bold text-slate-800 bg-slate-200/60 px-3 py-1 rounded-lg">
                      {formatDate(noticeModalData.date)}
                    </span>
                  </div>

                  {noticeModalData.website_link && (
                    <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Attached Website:</span>
                      <a
                        href={noticeModalData.website_link.startsWith('http') ? noticeModalData.website_link : `https://${noticeModalData.website_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-primary-light font-bold hover:underline truncate max-w-[180px] sm:max-w-[240px] text-[11px] sm:text-xs"
                      >
                        {noticeModalData.website_link}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                  {noticeModalData.website_link && (
                    <button
                      onClick={(e) => handleWebsiteClick(e, noticeModalData.website_link, noticeModalData.title)}
                      className="flex-1 inline-flex items-center justify-center bg-accent text-primary-dark hover:bg-primary-dark hover:text-white font-extrabold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-colors shadow-md border-0 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 mr-2 text-primary-dark hover:text-accent" />
                      Open Website View ↗
                    </button>
                  )}
                  <button
                    onClick={closeNoticePopup}
                    className="flex-1 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-colors border-0 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAILS POPUP MODAL — Adaptive Layout */}
      {eventModalData && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${
            isClosingEventModal ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEventPopup();
          }}
        >
          <div 
            className={`bg-white w-full ${getEventModalWidthClass()} rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transform transition-all duration-300 max-h-[92vh] sm:max-h-[90vh] ${
              isClosingEventModal ? 'animate-scaleDown' : 'animate-scaleUp'
            }`}
          >
            
            {/* Top Modal Header */}
            <div className="bg-primary-dark px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-sm sm:text-base md:text-lg tracking-wide">Event Information</h3>
              </div>
              <div className="flex items-center space-x-2">
                {eventModalData.website_link && (
                  <button
                    onClick={(e) => handleWebsiteClick(e, eventModalData.website_link, eventModalData.title)}
                    className="inline-flex items-center px-3 py-1 bg-accent text-primary-dark hover:bg-white hover:text-primary-dark text-xs font-extrabold rounded-lg transition-colors border-0 cursor-pointer shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    Visit Website ↗
                  </button>
                )}
                <button
                  onClick={closeEventPopup}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0"
                  aria-label="Close event popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto overflow-custom">

              {/* Adaptive Poster / Picture Preview */}
              {isValidImageUrl(eventModalData.picture_link) && (
                <div className={`w-full bg-[#f1f5f9] flex items-center justify-center p-3 sm:p-4 flex-shrink-0 ${
                  eventImageType === 'loading' ? 'min-h-[120px]' : ''
                }`}>
                  {eventImageType === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-light rounded-full animate-spin"></div>
                      <p className="mt-3 text-slate-400 text-xs font-medium">Loading poster...</p>
                    </div>
                  )}
                  <img
                    src={sanitizeImageUrl(eventModalData.picture_link)}
                    alt={eventModalData.title || 'Event Poster'}
                    className={`w-full object-contain object-center rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 ${
                      getEventImageMaxHeight()
                    } ${
                      eventImageType === 'loading' ? 'opacity-0 h-0' : 'opacity-100'
                    }`}
                    onLoad={handleEventImageLoad}
                    onError={() => setEventImageType('none')}
                  />
                  {eventImageType === 'extreme-tall' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(sanitizeImageUrl(eventModalData.picture_link), '_blank', 'noopener,noreferrer');
                      }}
                      className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer hover:bg-slate-800 transition-colors border-0"
                    >
                      🖼 View Full Poster
                    </button>
                  )}
                </div>
              )}

              {/* Event Details Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-left">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-block bg-accent/20 text-primary-dark text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      Civil Engineering Event
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-primary-dark leading-tight">
                      {eventModalData.title}
                    </h2>
                  </div>
                  {eventModalData.website_link && (
                    <button
                      onClick={(e) => handleWebsiteClick(e, eventModalData.website_link, eventModalData.title)}
                      className="inline-flex items-center text-xs font-extrabold text-primary-dark bg-accent hover:bg-primary-dark hover:text-white px-3.5 py-2 rounded-xl transition-all border-0 cursor-pointer shadow-sm mt-1"
                    >
                      <Globe className="w-4 h-4 mr-1.5" />
                      Visit Website ↗
                    </button>
                  )}
                </div>

                {/* Event Attributes — Inline for compact layouts */}
                <div className={`bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 ${
                  eventImageType === 'landscape' ? 'flex flex-wrap items-center gap-x-6 gap-y-2' : 'grid sm:grid-cols-2 gap-2 sm:gap-3'
                }`}>
                  <div className={eventImageType === 'landscape' ? 'flex items-center gap-2' : 'space-y-1'}>
                    {eventImageType !== 'landscape' && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Date</span>
                    )}
                    <div className="flex items-center text-sm font-bold text-slate-800">
                      <Calendar className="w-4 h-4 mr-2 text-accent" />
                      {formatDate(eventModalData.date)}
                    </div>
                  </div>

                  {eventModalData.time && (
                    <div className={eventImageType === 'landscape' ? 'flex items-center gap-2' : 'space-y-1'}>
                      {eventImageType !== 'landscape' && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Time</span>
                      )}
                      <div className="flex items-center text-sm font-bold text-slate-800">
                        <Clock className="w-4 h-4 mr-2 text-accent" />
                        {eventModalData.time}
                      </div>
                    </div>
                  )}

                  {eventModalData.venue && (
                    <div className={eventImageType === 'landscape' ? 'flex items-center gap-2' : 'space-y-1 sm:col-span-2'}>
                      {eventImageType !== 'landscape' && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Venue / Location</span>
                      )}
                      <div className="flex items-center text-sm font-bold text-slate-800">
                        <MapPin className="w-4 h-4 mr-2 text-accent" />
                        {eventModalData.venue}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                  {eventModalData.website_link && (
                    <button
                      onClick={(e) => handleWebsiteClick(e, eventModalData.website_link, eventModalData.title)}
                      className="flex-1 inline-flex items-center justify-center bg-accent text-primary-dark hover:bg-primary-dark hover:text-white font-extrabold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-colors shadow-md border-0 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website ↗
                    </button>
                  )}
                  <button
                    onClick={closeEventPopup}
                    className="flex-1 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs transition-colors border-0 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* LAPTOP / DESKTOP WEBSITE PREVIEW MODAL OVERLAY */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[85vh]">
            
            {/* Modal Header Bar */}
            <div className="bg-primary-dark px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <h3 className="font-bold text-base md:text-lg truncate max-w-lg ml-2">{modalState.title}</h3>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href={modalState.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Open in New Tab
                </a>
                <button 
                  onClick={closeModal}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0"
                  aria-label="Close website preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Sub-Header (URL Bar) */}
            <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2 truncate font-mono">
                <Globe className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="truncate">{modalState.url}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">Website Live View</span>
            </div>

            {/* Modal Window Frame */}
            <div className="flex-grow bg-slate-50 relative overflow-hidden">
              <iframe 
                src={modalState.url} 
                title={`Website view - ${modalState.title}`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NoticesEvents;
