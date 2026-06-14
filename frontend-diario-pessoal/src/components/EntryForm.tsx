import React, { useState, useEffect } from 'react';
import { X, Save, Tag as TagIcon, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import type { Entry, Mood } from '../types/types';

interface EntryFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Entry | null;
  selectedDate?: Date | null;
}

const EntryForm: React.FC<EntryFormProps> = ({ onClose, onSuccess, initialData, selectedDate }) => {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<Mood>('neutro');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setMood(initialData.mood);
      setDate(format(new Date(initialData.date), 'yyyy-MM-dd'));
      setTags(initialData.tags || []);
    } else if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [initialData, selectedDate]);

  const moods: { id: Mood; emoji: string; label: string; color: string }[] = [
    { id: 'radiante', emoji: '🤩', label: 'Radiante', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { id: 'feliz', emoji: '😊', label: 'Feliz', color: 'bg-green-100 text-green-600 border-green-200' },
    { id: 'neutro', emoji: '😐', label: 'Neutro', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'triste', emoji: '😔', label: 'Triste', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    { id: 'pessimo', emoji: '😫', label: 'Péssimo', color: 'bg-red-100 text-red-600 border-red-200' },
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && initialData) {
        await api.put(`/entries/${initialData._id}`, { text, mood, date, tags });
      } else {
        await api.post('/entries', { text, mood, date, tags });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao guardar entrada.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem a certeza que deseja eliminar esta entrada?') || !initialData) return;
    setLoading(true);
    try {
      await api.delete(`/entries/${initialData._id}`);
      onSuccess();
    } catch (err) {
      setError('Erro ao eliminar entrada.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600/90">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? 'Editar Entrada' : 'Nova Entrada no Diário'}
          </h2>
          <button onClick={onClose} className="text-slate-200 p-1 bg-transparent hover:bg-indigo-500 rounded-full hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Data</label>
              <input 
                type="date" 
                value={date}
                disabled={isEditing}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Como se sente?</label>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`flex-1 py-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                      mood === m.id 
                        ? `${m.color} border-current scale-105 shadow-sm` 
                        : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] font-bold uppercase">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">O que aconteceu hoje?</label>
            <textarea 
              required
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva aqui os seus pensamentos..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span key={tag} className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-primary-100">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary-800">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Pressione Enter para adicionar tags"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            {isEditing && (
              <button 
                type="button"
                onClick={handleDelete}
                className="bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-2xl transition-all"
                title="Eliminar entrada"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-sm text-slate-600 font-semibold py-3 rounded-md transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-primary-300 text-sm text-white font-semibold py-3 rounded-md  transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'A guardar...' : (
                <>
                  <Save size={20} />
                  {isEditing ? 'Atualizar Entrada' : 'Guardar Entrada'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
