import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Entry, Mood } from '../types/types';

interface CalendarViewProps {
  entries: Entry[];
  onDateClick: (date: Date, entry?: Entry) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const moodEmoji: Record<Mood, string> = {
    radiante: '🤩',
    feliz: '😊',
    neutro: '😐',
    triste: '😔',
    pessimo: '😫'
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-bold text-slate-800 capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: pt })}
      </h2>
      <div className="flex gap-2">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, index) => (
          <div key={index} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const entry = entries.find(e => isSameDay(new Date(e.date), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={index}
              onClick={() => onDateClick(day, entry)}
              className={`
                relative h-24 p-2 border rounded-2xl transition-all cursor-pointer group
                ${!isCurrentMonth ? 'bg-slate-50/50 border-transparent opacity-40' : 'bg-white border-slate-100 hover:border-primary-300 hover:shadow-md'}
                ${isToday(day) ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
              `}
            >
              <span className={`text-sm font-bold ${isToday(day) ? 'text-primary-600' : 'text-slate-500'}`}>
                {format(day, 'd')}
              </span>
              
              {entry && (
                <div className="mt-1 flex flex-col items-center animate-in zoom-in duration-300">
                  <span className="text-2xl">{moodEmoji[entry.mood]}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 truncate w-full text-center">
                    {entry.mood}
                  </span>
                </div>
              )}

              {!entry && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">+</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;
