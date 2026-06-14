import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar nas suas memórias..."
          className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{user?.email}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-primary-600 font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-all" />
        </div>
      </div>
    </header>
  );
};

export default Header;
