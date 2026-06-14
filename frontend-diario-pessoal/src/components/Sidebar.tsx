import React from 'react';
import { 
  Home, 
  Calendar, 
  LogOut, 
  BookOpen, 
  BarChart2,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <Home size={22} />, label: 'Dashboard', active: true },
    { icon: <Calendar size={22} />, label: 'Calendário', active: false },
    { icon: <BarChart2 size={22} />, label: 'Estatísticas', active: false },
    { icon: <BookOpen size={22} />, label: 'Memórias', active: false },
  ];

  const categories = [
    { label: 'Trabalho', color: 'bg-emerald-400' },
    { label: 'Educação', color: 'bg-amber-400' },
    { label: 'Família', color: 'bg-rose-400' },
    { label: 'Pessoal', color: 'bg-sky-400' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <Heart size={24} fill="currentColor" />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tight">Sentia</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Principal</p>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                    item.active 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Categorias</p>
          <ul className="space-y-2">
            {categories.map((cat, index) => (
              <li key={index}>
                <a href="#" className="flex items-center gap-4 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                  <span>{cat.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
        >
          <LogOut size={22} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
