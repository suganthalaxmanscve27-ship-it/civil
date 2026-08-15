import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, LogOut, Plus, Trash2, Pencil, Save, X, Bell, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from './Header';
import Footer from './Footer';

const AdminHub = () => {
  const navigate = useNavigate();
  const { 
    notices, addNotice, deleteNotice, updateNotice,
    events, addEvent, deleteEvent, updateEvent,
    faculty, addFacultyMember, deleteFacultyMember, updateFacultyMember
  } = useData();

  // Authentication states
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dashboard states
  const [activeTab, setActiveTab] = useState('notices');
  const [successToast, setSuccessToast] = useState('');

  // Editing item IDs
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingFacultyId, setEditingFacultyId] = useState(null);

  // Form states
  const [newNoticeData, setNewNoticeData] = useState({ title: '', date: '', website_link: '', picture_link: '' });
  
  const [newEventData, setNewEventData] = useState({ 
    title: '', date: '', venue: '', time: '', website_link: '', picture_link: '' 
  });
  
  const [newFacultyData, setNewFacultyData] = useState({
    name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience: '', email: '', website_link: '', picture_link: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setErrorMsg('');
      triggerToast('Logged in successfully!');
    } else {
      setErrorMsg('Incorrect Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    triggerToast('Logged out successfully.');
  };

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const resetAllForms = () => {
    setEditingNoticeId(null);
    setEditingEventId(null);
    setEditingFacultyId(null);
    setNewNoticeData({ title: '', date: '', website_link: '', picture_link: '' });
    setNewEventData({ title: '', date: '', venue: '', time: '', website_link: '', picture_link: '' });
    setNewFacultyData({ name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience: '', email: '', website_link: '', picture_link: '' });
  };

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    resetAllForms();
  };

  // --- Notice operations ---
  const handleSaveNotice = (e) => {
    e.preventDefault();
    if (!newNoticeData.title.trim()) return;
    
    if (editingNoticeId) {
      updateNotice(editingNoticeId, newNoticeData);
      setEditingNoticeId(null);
      setNewNoticeData({ title: '', date: '', website_link: '', picture_link: '' });
      triggerToast('Notice updated successfully!');
    } else {
      addNotice(newNoticeData);
      setNewNoticeData({ title: '', date: '', website_link: '', picture_link: '' });
      triggerToast('Notice added successfully!');
    }
  };

  const handleStartEditNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNewNoticeData({
      title: notice.title || '',
      date: notice.date || '',
      website_link: notice.website_link || '',
      picture_link: notice.picture_link || ''
    });
  };

  const handleCancelNoticeEdit = () => {
    setEditingNoticeId(null);
    setNewNoticeData({ title: '', date: '', website_link: '', picture_link: '' });
  };

  // --- Event operations ---
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newEventData.title.trim() || !newEventData.date) return;

    if (editingEventId) {
      updateEvent(editingEventId, newEventData);
      setEditingEventId(null);
      setNewEventData({ title: '', date: '', venue: '', time: '', website_link: '', picture_link: '' });
      triggerToast('Event updated successfully!');
    } else {
      addEvent(newEventData);
      setNewEventData({ title: '', date: '', venue: '', time: '', website_link: '', picture_link: '' });
      triggerToast('Event added successfully!');
    }
  };

  const handleStartEditEvent = (event) => {
    setEditingEventId(event.id);
    setNewEventData({
      title: event.title || '',
      date: event.date || '',
      venue: event.venue || '',
      time: event.time || '',
      website_link: event.website_link || '',
      picture_link: event.picture_link || ''
    });
  };

  const handleCancelEventEdit = () => {
    setEditingEventId(null);
    setNewEventData({ title: '', date: '', venue: '', time: '', website_link: '', picture_link: '' });
  };

  // --- Faculty operations ---
  const handleSaveFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyData.name.trim() || !newFacultyData.qualification.trim()) return;

    if (editingFacultyId) {
      updateFacultyMember(editingFacultyId, newFacultyData);
      setEditingFacultyId(null);
      setNewFacultyData({
        name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience: '', email: '', website_link: '', picture_link: ''
      });
      triggerToast('Faculty profile updated successfully!');
    } else {
      addFacultyMember(newFacultyData);
      setNewFacultyData({
        name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience: '', email: '', website_link: '', picture_link: ''
      });
      triggerToast('Faculty profile added successfully!');
    }
  };

  const handleStartEditFaculty = (member) => {
    setEditingFacultyId(member.id);
    setNewFacultyData({
      name: member.name || '',
      designation: member.designation || 'Assistant Professor',
      qualification: member.qualification || '',
      specialization: member.specialization || '',
      experience: member.experience || '',
      email: member.email || '',
      website_link: member.website_link || '',
      picture_link: member.picture_link || ''
    });
  };

  const handleCancelFacultyEdit = () => {
    setEditingFacultyId(null);
    setNewFacultyData({
      name: '', designation: 'Assistant Professor', qualification: '', specialization: '', experience: '', email: '', website_link: '', picture_link: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-left">
      <div>
        <Header />

        {/* Success Toast Notification */}
        {successToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-950 text-white px-5 py-3 rounded-2xl flex items-center space-x-2.5 shadow-xl border border-green-800 animate-fadeIn select-none">
            <CheckCircle className="w-5 h-5 text-accent" />
            <span className="font-semibold text-sm">{successToast}</span>
          </div>
        )}

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <main className="container mx-auto px-4 max-w-lg py-20 flex-grow flex flex-col justify-center">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-primary-light/10 text-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-extrabold text-primary-dark">Admin Portal Gateway</h2>
                <p className="text-slate-400 text-xs md:text-sm font-light">
                  Provide credentials to access GCEE Civil Administration Dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800 text-center tracking-widest font-mono"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full inline-flex items-center justify-center bg-primary-light hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow transition-colors border-0 cursor-pointer text-sm"
                >
                  Access Dashboard
                </button>
              </form>

              <div className="text-center pt-2">
                <button 
                  onClick={() => navigate('/')} 
                  className="inline-flex items-center text-slate-400 hover:text-slate-600 text-xs bg-transparent border-0 cursor-pointer font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Cancel & Back
                </button>
              </div>
            </div>
          </main>
        ) : (
          /* Dashboard View */
          <div>
            {/* Dashboard Header banner */}
            <div className="bg-primary-dark text-white py-10 px-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
              <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold m-0 text-white font-serif">Admin Control Centre</h1>
                  <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl font-light">
                    Add, edit, or delete notices, calendar events, and faculty listings.
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-red-500 hover:text-white text-accent font-bold px-5 py-2.5 rounded-xl text-xs transition-colors border border-white/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Dashboard Tabs navigation */}
            <div className="bg-white shadow-sm sticky top-16 z-30">
              <div className="container mx-auto max-w-7xl px-4">
                <div className="flex space-x-8 overflow-x-auto py-4 scrollbar-none border-b border-slate-100">
                  {[
                    { id: 'notices', label: 'Manage Notices', icon: Bell },
                    { id: 'events', label: 'Manage Events', icon: Calendar },
                    { id: 'faculty', label: 'Manage Faculty', icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabSwitch(tab.id)}
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

            {/* Content Container */}
            <main className="container mx-auto max-w-7xl px-4 py-12">
              
              {/* TAB 1: NOTICES PANEL */}
              {activeTab === 'notices' && (
                <div className="grid md:grid-cols-12 gap-8 items-start animate-fadeIn">
                  
                  {/* Left Column: Form to Add / Edit Notice */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-bold text-primary-dark">
                        {editingNoticeId ? 'Edit Notice' : 'Publish New Notice'}
                      </h3>
                      {editingNoticeId && (
                        <button
                          type="button"
                          onClick={handleCancelNoticeEdit}
                          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors border-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveNotice} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Notice Title</label>
                        <textarea
                          rows="3"
                          required
                          value={newNoticeData.title}
                          onChange={(e) => setNewNoticeData({ ...newNoticeData, title: e.target.value })}
                          placeholder="e.g. End Semester Lab Exams schedule released..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800 resize-none"
                        ></textarea>
                      </div>

                      {editingNoticeId && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Notice Date</label>
                          <input
                            type="date"
                            value={newNoticeData.date}
                            onChange={(e) => setNewNoticeData({ ...newNoticeData, date: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Website Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={newNoticeData.website_link}
                          onChange={(e) => setNewNoticeData({ ...newNoticeData, website_link: e.target.value })}
                          placeholder="https://example.com/notice-details"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Picture Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={newNoticeData.picture_link}
                          onChange={(e) => setNewNoticeData({ ...newNoticeData, picture_link: e.target.value })}
                          placeholder="https://example.com/notice-banner.jpg"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center flex-1 bg-primary-light hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer shadow-md"
                        >
                          {editingNoticeId ? (
                            <>
                              <Save className="w-4 h-4 mr-1.5" />
                              Update Notice
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1.5" />
                              Publish Notice
                            </>
                          )}
                        </button>
                        {editingNoticeId && (
                          <button
                            type="button"
                            onClick={handleCancelNoticeEdit}
                            className="inline-flex items-center justify-center px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: List of Current Notices */}
                  <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-primary-dark border-b pb-2">Active Notices</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 overflow-custom">
                      {notices.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-6">No notices registered yet.</p>
                      ) : (
                        notices.map((notice) => (
                          <div 
                            key={notice.id} 
                            className={`flex justify-between items-center p-4 border rounded-2xl transition-all ${
                              editingNoticeId === notice.id 
                                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' 
                                : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div className="pr-4">
                              <h4 className="font-semibold text-slate-800 text-sm">{notice.title}</h4>
                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 mt-1 font-semibold">
                                <span>Date: {notice.date}</span>
                                {notice.website_link && <span className="text-primary-light">Link attached</span>}
                                {notice.picture_link && <span className="text-primary-light">Image attached</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStartEditNotice(notice)}
                                className={`p-2.5 bg-white border border-slate-100 hover:bg-blue-50 text-blue-600 hover:border-blue-100 rounded-xl transition-all duration-200 cursor-pointer ${
                                  editingNoticeId === notice.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                title="Edit Notice"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (editingNoticeId === notice.id) handleCancelNoticeEdit();
                                  deleteNotice(notice.id);
                                }}
                                className="p-2.5 bg-white border border-slate-100 hover:bg-red-50 text-red-500 hover:border-red-100 rounded-xl transition-all duration-200 cursor-pointer"
                                title="Delete Notice"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: EVENTS PANEL */}
              {activeTab === 'events' && (
                <div className="grid md:grid-cols-12 gap-8 items-start animate-fadeIn">
                  
                  {/* Add / Edit Event Form */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-bold text-primary-dark">
                        {editingEventId ? 'Edit Event' : 'Schedule New Event'}
                      </h3>
                      {editingEventId && (
                        <button
                          type="button"
                          onClick={handleCancelEventEdit}
                          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors border-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Event Title</label>
                        <input
                          type="text"
                          required
                          value={newEventData.title}
                          onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                          placeholder="e.g. Modern Concrete Workshop"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Date</label>
                          <input
                            type="date"
                            required
                            value={newEventData.date}
                            onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Time</label>
                          <input
                            type="text"
                            value={newEventData.time}
                            onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
                            placeholder="e.g. 09:30 AM"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Venue</label>
                        <input
                          type="text"
                          value={newEventData.venue}
                          onChange={(e) => setNewEventData({ ...newEventData, venue: e.target.value })}
                          placeholder="e.g. Seminar Hall"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Website Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={newEventData.website_link}
                          onChange={(e) => setNewEventData({ ...newEventData, website_link: e.target.value })}
                          placeholder="https://example.com/event-page"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Picture Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                        </label>
                        <input
                          type="url"
                          value={newEventData.picture_link}
                          onChange={(e) => setNewEventData({ ...newEventData, picture_link: e.target.value })}
                          placeholder="https://example.com/event-banner.jpg"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center flex-1 bg-primary-light hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer shadow-md"
                        >
                          {editingEventId ? (
                            <>
                              <Save className="w-4 h-4 mr-1.5" />
                              Update Event
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1.5" />
                              Schedule Event
                            </>
                          )}
                        </button>
                        {editingEventId && (
                          <button
                            type="button"
                            onClick={handleCancelEventEdit}
                            className="inline-flex items-center justify-center px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Active Events List */}
                  <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-primary-dark border-b pb-2">Active Calendar Events</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 overflow-custom">
                      {events.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-6">No events scheduled yet.</p>
                      ) : (
                        events.map((event) => (
                          <div 
                            key={event.id} 
                            className={`flex justify-between items-center p-4 border rounded-2xl transition-all ${
                              editingEventId === event.id 
                                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' 
                                : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-slate-800 text-sm">{event.title}</h4>
                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 mt-1 font-semibold">
                                <span>Date: {event.date}</span>
                                {event.time && <span>Time: {event.time}</span>}
                                {event.venue && <span>Venue: {event.venue}</span>}
                                {event.website_link && <span className="text-primary-light">Link attached</span>}
                                {event.picture_link && <span className="text-primary-light">Image attached</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStartEditEvent(event)}
                                className={`p-2.5 bg-white border border-slate-100 hover:bg-blue-50 text-blue-600 hover:border-blue-100 rounded-xl transition-all duration-200 cursor-pointer ${
                                  editingEventId === event.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                title="Edit Event"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (editingEventId === event.id) handleCancelEventEdit();
                                  deleteEvent(event.id);
                                }}
                                className="p-2.5 bg-white border border-slate-100 hover:bg-red-50 text-red-500 hover:border-red-100 rounded-xl transition-all duration-200 cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: FACULTY PANEL */}
              {activeTab === 'faculty' && (
                <div className="grid md:grid-cols-12 gap-8 items-start animate-fadeIn">
                  
                  {/* Add / Edit Faculty Form */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-bold text-primary-dark">
                        {editingFacultyId ? 'Edit Faculty Profile' : 'Register Faculty Profile'}
                      </h3>
                      {editingFacultyId && (
                        <button
                          type="button"
                          onClick={handleCancelFacultyEdit}
                          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors border-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveFaculty} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newFacultyData.name}
                          onChange={(e) => setNewFacultyData({ ...newFacultyData, name: e.target.value })}
                          placeholder="e.g. Dr. A. Rajan"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Designation</label>
                          <select
                            value={newFacultyData.designation}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, designation: e.target.value })}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800 font-semibold"
                          >
                            <option value="Head of the Department">Head of the Department</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Guest Lecturer">Guest Lecturer</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Qualification</label>
                          <input
                            type="text"
                            required
                            value={newFacultyData.qualification}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, qualification: e.target.value })}
                            placeholder="e.g. M.E., Ph.D."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Specialization / Expertise</label>
                        <input
                          type="text"
                          value={newFacultyData.specialization}
                          onChange={(e) => setNewFacultyData({ ...newFacultyData, specialization: e.target.value })}
                          placeholder="e.g. Structural Engineering"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Experience</label>
                          <input
                            type="text"
                            value={newFacultyData.experience}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, experience: e.target.value })}
                            placeholder="e.g. 15 Years"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
                          <input
                            type="email"
                            value={newFacultyData.email}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, email: e.target.value })}
                            placeholder="rajan@gcee.ac.in"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Website Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                          </label>
                          <input
                            type="url"
                            value={newFacultyData.website_link}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, website_link: e.target.value })}
                            placeholder="https://faculty-profile.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Picture Link <span className="text-slate-400 font-normal text-[11px] font-sans capitalize">(optional)</span>
                          </label>
                          <input
                            type="url"
                            value={newFacultyData.picture_link}
                            onChange={(e) => setNewFacultyData({ ...newFacultyData, picture_link: e.target.value })}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-light transition-colors text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center flex-1 bg-primary-light hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer shadow-md"
                        >
                          {editingFacultyId ? (
                            <>
                              <Save className="w-4 h-4 mr-1.5" />
                              Update Profile
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1.5" />
                              Register Profile
                            </>
                          )}
                        </button>
                        {editingFacultyId && (
                          <button
                            type="button"
                            onClick={handleCancelFacultyEdit}
                            className="inline-flex items-center justify-center px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Registered Faculty Profiles List */}
                  <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-primary-dark border-b pb-2">Registered Faculty Profiles</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 overflow-custom">
                      {faculty.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-6">No educators registered yet.</p>
                      ) : (
                        faculty.map((member) => (
                          <div 
                            key={member.id} 
                            className={`flex justify-between items-center p-4 border rounded-2xl transition-all ${
                              editingFacultyId === member.id 
                                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' 
                                : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-slate-800 text-sm">{member.name}</h4>
                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 mt-1 font-semibold">
                                <span>Designation: {member.designation}</span>
                                <span>Qualification: {member.qualification}</span>
                                {member.email && <span>Email: {member.email}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStartEditFaculty(member)}
                                className={`p-2.5 bg-white border border-slate-100 hover:bg-blue-50 text-blue-600 hover:border-blue-100 rounded-xl transition-all duration-200 cursor-pointer ${
                                  editingFacultyId === member.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                title="Edit Faculty Profile"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (editingFacultyId === member.id) handleCancelFacultyEdit();
                                  deleteFacultyMember(member.id);
                                }}
                                className="p-2.5 bg-white border border-slate-100 hover:bg-red-50 text-red-500 hover:border-red-100 rounded-xl transition-all duration-200 cursor-pointer"
                                title="Delete Faculty Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminHub;
