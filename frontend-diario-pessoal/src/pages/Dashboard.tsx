import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Smile, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import EntryForm from '../components/EntryForm';
import CalendarView from '../components/CalendarView';
import type { Entry, Stats, Mood } from '../types/types';

const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        api.get('/entries'),
        api.get('/entries/stats')
      ]);
      setEntries(entriesRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Erro ao carregar dados', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateClick = (date: Date, entry?: Entry) => {
    setSelectedDate(date);
    setSelectedEntry(entry || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEntry(null);
    setSelectedDate(null);
  };

  const moodEmoji: Record<Mood, string> = {
    radiante: '🤩',
    feliz: '😊',
    neutro: '😐',
    triste: '😔',
    pessimo: '😫'
  };

  const chartData = [...entries].reverse().slice(-7).map(entry => ({
    date: format(new Date(entry.date), 'dd/MM'),
    moodValue: { radiante: 5, feliz: 4, neutro: 3, triste: 2, pessimo: 1 }[entry.mood]
  }));

  if (loading) return <div className="flex h-64 items-center justify-center">Carregando Sentia...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Olá, {format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}</h1>
          <p className="text-indigo-700 font-medium opacity-70">Explore o seu histórico emocional no calendário.</p>
        </div>
        <button 
          onClick={() => handleDateClick(new Date())}
          className="bg-indigo-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nova Entrada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-md border border-zinc-200 hover:bg-indigo-600 group transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
              <Smile size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium group-hover:text-zinc-50">Humor Frequente</p>
              <p className="text-xl font-bold text-slate-800 group-hover:text-white capitalize">{stats?.mostFrequentMood || 'N/A'}</p>
            </div>
          </div>
          <div className="text-3xl group-hover:text-zinc-200">{stats?.mostFrequentMood ? moodEmoji[stats.mostFrequentMood] : '—'}</div>
        </div>

        <div className="bg-white p-6 rounded-md border border-zinc-200 hover:bg-indigo-600 group transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium group-hover:text-zinc-50">Total de Entradas</p>
              <p className="text-xl font-bold text-slate-800 group-hover:text-white">{entries.length}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 group-hover:text-zinc-200">Este mês: {stats?.monthlyEntries[0]?.count || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-md border border-zinc-200 hover:bg-indigo-600 group transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium group-hover:text-zinc-50">Tendência</p>
              <p className="text-xl font-bold text-slate-800 group-hover:text-white">Estável</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 group-hover:text-zinc-200">Baseado nos últimos 7 dias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CalendarView entries={entries} onDateClick={handleDateClick} />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" />
            Evolução do Humor
          </h3>
          <div className="flex-1 min-h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide domain={[1, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="moodValue" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showForm && (
        <EntryForm 
          onClose={handleCloseForm} 
          onSuccess={() => {
            handleCloseForm();
            fetchData();
          }} 
          initialData={selectedEntry}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Dashboard;
