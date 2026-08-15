import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const DataContext = createContext(null);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const DataProvider = ({ children }) => {
  const [notices, setNoticesState] = useState([]);
  const [events, setEventsState] = useState([]);
  const [faculty, setFacultyState] = useState([]);
  const [loading, setLoading] = useState(true);

  // State update helpers
  const setNotices = (updater) => {
    setNoticesState(prev => typeof updater === 'function' ? updater(prev) : updater);
  };

  const setEvents = (updater) => {
    setEventsState(prev => typeof updater === 'function' ? updater(prev) : updater);
  };

  const setFaculty = (updater) => {
    setFacultyState(prev => typeof updater === 'function' ? updater(prev) : updater);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch notices, events, and faculty directly and strictly from Supabase DB
        const [noticesRes, eventsRes, facultyRes] = await Promise.all([
          supabase.from('notices').select('*').order('created_at', { ascending: false }),
          supabase.from('events').select('*').order('created_at', { ascending: false }),
          supabase.from('faculty').select('*').order('created_at', { ascending: true })
        ]);

        if (noticesRes.error) console.error('Error fetching notices:', noticesRes.error.message);
        if (eventsRes.error) console.error('Error fetching events:', eventsRes.error.message);
        if (facultyRes.error) console.error('Error fetching faculty:', facultyRes.error.message);

        if (noticesRes.data) {
          setNotices(noticesRes.data.map(item => ({
            ...item,
            picture_link: sanitizeImageUrl(item.picture_link),
            website_link: item.website_link || ''
          })));
        }
        if (eventsRes.data) {
          setEvents(eventsRes.data.map(item => ({
            ...item,
            picture_link: sanitizeImageUrl(item.picture_link),
            website_link: item.website_link || ''
          })));
        }
        if (facultyRes.data) {
          setFaculty(facultyRes.data.map(item => ({
            ...item,
            picture_link: sanitizeImageUrl(item.picture_link),
            website_link: item.website_link || ''
          })));
        }
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  // Notice operations
  const addNotice = async (noticePayload) => {
    const payload = typeof noticePayload === 'string' 
      ? { title: noticePayload, date: new Date().toISOString().split('T')[0] }
      : { 
          title: noticePayload.title || '',
          date: noticePayload.date || new Date().toISOString().split('T')[0],
          website_link: noticePayload.website_link || '',
          picture_link: noticePayload.picture_link || ''
        };

    const newItem = { id: Date.now().toString(), ...payload };
    setNotices(prev => [newItem, ...prev.filter(n => String(n.id) !== String(newItem.id))]);

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      const { data, error } = await supabase
        .from('notices')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Notice insert with optional fields failed, retrying basic fields:', error.message);
        const basicPayload = { title: payload.title };
        const basicRes = await supabase.from('notices').insert([basicPayload]).select();
        if (basicRes.data && basicRes.data[0]) {
          setNotices(prev => prev.map(item => String(item.id) === String(newItem.id) ? { ...basicRes.data[0], date: payload.date, website_link: payload.website_link, picture_link: payload.picture_link } : item));
        }
      } else if (data && data[0]) {
        setNotices(prev => prev.map(item => String(item.id) === String(newItem.id) ? { ...data[0], picture_link: payload.picture_link || data[0].picture_link, website_link: payload.website_link || data[0].website_link } : item));
      }
    } catch (error) {
      console.error('Error inserting notice:', error);
    }
  };

  const deleteNotice = async (id) => {
    setNotices(prev => prev.filter(n => String(n.id) !== String(id)));
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) console.error('Error deleting notice:', error.message);
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const updateNotice = async (id, noticePayload) => {
    const payload = {
      title: noticePayload.title || '',
      date: noticePayload.date || new Date().toISOString().split('T')[0],
      website_link: noticePayload.website_link || '',
      picture_link: noticePayload.picture_link || ''
    };

    setNotices(prev => prev.map(n => String(n.id) === String(id) ? { ...n, ...payload, picture_link: sanitizeImageUrl(payload.picture_link) } : n));

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      let { data, error } = await supabase
        .from('notices')
        .update(payload)
        .eq('id', id)
        .select();

      if (error || !data || data.length === 0) {
        await supabase.from('notices').delete().eq('id', id);
        const insRes = await supabase.from('notices').insert([{ id, ...payload }]).select();
        data = insRes.data;
      }

      if (data && data[0]) {
        setNotices(prev => prev.map(item => String(item.id) === String(id) ? { ...data[0], picture_link: sanitizeImageUrl(data[0].picture_link || payload.picture_link) } : item));
      }
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  // Event operations
  const addEvent = async (eventData) => {
    const payload = {
      title: eventData.title || '',
      date: eventData.date || new Date().toISOString().split('T')[0],
      venue: eventData.venue || '',
      time: eventData.time || '',
      website_link: eventData.website_link || '',
      picture_link: eventData.picture_link || ''
    };

    const newItem = { id: Date.now().toString(), ...payload, picture_link: sanitizeImageUrl(eventData.picture_link) };
    setEvents(prev => [newItem, ...prev.filter(e => String(e.id) !== String(newItem.id))]);

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Event insert with optional fields failed, retrying basic fields:', error.message);
        const basicPayload = {
          title: payload.title,
          date: payload.date,
          venue: payload.venue,
          time: payload.time
        };
        const basicRes = await supabase.from('events').insert([basicPayload]).select();
        if (basicRes.data && basicRes.data[0]) {
          setEvents(prev => prev.map(item => String(item.id) === String(newItem.id) ? { ...basicRes.data[0], website_link: payload.website_link, picture_link: sanitizeImageUrl(payload.picture_link) } : item));
        }
      } else if (data && data[0]) {
        setEvents(prev => prev.map(item => String(item.id) === String(newItem.id) ? { ...data[0], picture_link: sanitizeImageUrl(data[0].picture_link || payload.picture_link), website_link: payload.website_link || data[0].website_link } : item));
      }
    } catch (error) {
      console.error('Error inserting event:', error);
    }
  };

  const deleteEvent = async (id) => {
    setEvents(prev => prev.filter(e => String(e.id) !== String(id)));
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) console.error('Error deleting event:', error.message);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const updateEvent = async (id, eventData) => {
    const payload = {
      title: eventData.title || '',
      date: eventData.date || new Date().toISOString().split('T')[0],
      venue: eventData.venue || '',
      time: eventData.time || '',
      website_link: eventData.website_link || '',
      picture_link: eventData.picture_link || ''
    };

    setEvents(prev => prev.map(e => String(e.id) === String(id) ? { ...e, ...payload, picture_link: sanitizeImageUrl(payload.picture_link) } : e));

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      let { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', id)
        .select();

      if (error || !data || data.length === 0) {
        await supabase.from('events').delete().eq('id', id);
        const insRes = await supabase.from('events').insert([{ id, ...payload }]).select();
        data = insRes.data;
      }

      if (data && data[0]) {
        setEvents(prev => prev.map(item => String(item.id) === String(id) ? { ...data[0], picture_link: sanitizeImageUrl(data[0].picture_link || payload.picture_link) } : item));
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Faculty operations
  const addFacultyMember = async (facultyData) => {
    const payload = {
      name: facultyData.name || '',
      designation: facultyData.designation || 'Assistant Professor',
      qualification: facultyData.qualification || '',
      specialization: facultyData.specialization || '',
      experience: facultyData.experience || '',
      email: facultyData.email || '',
      website_link: facultyData.website_link || '',
      picture_link: facultyData.picture_link || ''
    };

    const newItem = { id: Date.now().toString(), ...payload, picture_link: sanitizeImageUrl(facultyData.picture_link) };
    setFaculty(prev => [...prev.filter(f => String(f.id) !== String(newItem.id)), newItem]);

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      const { data, error } = await supabase
        .from('faculty')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Faculty insert with optional fields failed, retrying basic fields:', error.message);
        const basicPayload = {
          name: payload.name,
          designation: payload.designation,
          qualification: payload.qualification,
          specialization: payload.specialization,
          experience: payload.experience,
          email: payload.email
        };
        const basicRes = await supabase.from('faculty').insert([basicPayload]).select();
        if (basicRes.data && basicRes.data[0]) {
          setFaculty(prev => prev.map(item => item.id === newItem.id ? { ...basicRes.data[0], website_link: payload.website_link, picture_link: sanitizeImageUrl(payload.picture_link) } : item));
        }
      } else if (data && data[0]) {
        setFaculty(prev => prev.map(item => item.id === newItem.id ? data[0] : item));
      }
    } catch (error) {
      console.error('Error inserting faculty member:', error);
    }
  };

  const deleteFacultyMember = async (id) => {
    setFaculty(prev => prev.filter(f => String(f.id) !== String(id)));
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) console.error('Error deleting faculty member:', error.message);
    } catch (error) {
      console.error('Error deleting faculty member:', error);
    }
  };

  const updateFacultyMember = async (id, facultyData) => {
    const payload = {
      name: facultyData.name || '',
      designation: facultyData.designation || 'Assistant Professor',
      qualification: facultyData.qualification || '',
      specialization: facultyData.specialization || '',
      experience: facultyData.experience || '',
      email: facultyData.email || '',
      website_link: facultyData.website_link || '',
      picture_link: facultyData.picture_link || ''
    };

    setFaculty(prev => prev.map(f => String(f.id) === String(id) ? { ...f, ...payload, picture_link: sanitizeImageUrl(payload.picture_link) } : f));

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) return;

    try {
      let { data, error } = await supabase
        .from('faculty')
        .update(payload)
        .eq('id', id)
        .select();

      if (error || !data || data.length === 0) {
        await supabase.from('faculty').delete().eq('id', id);
        const insRes = await supabase.from('faculty').insert([{ id, ...payload }]).select();
        data = insRes.data;
      }

      if (data && data[0]) {
        setFaculty(prev => prev.map(item => String(item.id) === String(id) ? { ...data[0], picture_link: sanitizeImageUrl(data[0].picture_link || payload.picture_link) } : item));
      }
    } catch (error) {
      console.error('Error updating faculty member:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      notices,
      events,
      faculty,
      loading,
      addNotice,
      deleteNotice,
      updateNotice,
      addEvent,
      deleteEvent,
      updateEvent,
      addFacultyMember,
      deleteFacultyMember,
      updateFacultyMember
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
