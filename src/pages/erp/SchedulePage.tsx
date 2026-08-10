import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Calendar as CalendarIcon, Truck, Wrench, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export const SchedulePage: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('todos');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026

  const fetchScheduleEvents = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data?.calendarEvents) {
        setEvents(data.calendarEvents);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchScheduleEvents();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = currentDate.toLocaleString('pt-MZ', { month: 'long', year: 'numeric' });

  const filteredEvents = events.filter(e => {
    if (filterType === 'todos') return true;
    return e.type === filterType;
  });

  const getEventsForDay = (day: number) => {
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    return filteredEvents.filter(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1628] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-[#F5A300]" />
            <span>Agenda Operacional & Calendário</span>
          </h1>
          <p className="text-[#A5B4C7] text-xs mt-1">
            Planeamento de viagens, partidas programadas, reservas de clientes e manutenções preventivas de frota.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 rounded-xl bg-[#13203A] text-[#A5B4C7] hover:text-white border border-white/5"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-white capitalize min-w-32 text-center">{monthName}</span>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 rounded-xl bg-[#13203A] text-[#A5B4C7] hover:text-white border border-white/5"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D1628] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#F5A300]" />
          <span className="text-xs font-bold text-white">Filtrar por Categoria:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'todos' ? 'bg-[#F5A300] text-black shadow-lg shadow-[#F5A300]/20' : 'bg-[#13203A] text-[#A5B4C7] hover:text-white'
            }`}
          >
            Todos os Eventos
          </button>
          <button
            onClick={() => setFilterType('trip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'trip' ? 'bg-blue-600 text-white' : 'bg-[#13203A] text-[#A5B4C7] hover:text-white'
            }`}
          >
            <Truck size={14} /> Viagens
          </button>
          <button
            onClick={() => setFilterType('maintenance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'maintenance' ? 'bg-rose-600 text-white' : 'bg-[#13203A] text-[#A5B4C7] hover:text-white'
            }`}
          >
            <Wrench size={14} /> Manutenções
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'document' ? 'bg-amber-600 text-white' : 'bg-[#13203A] text-[#A5B4C7] hover:text-white'
            }`}
          >
            <Clock size={14} /> Inspeções / Documentos
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="bg-[#0D1628] rounded-2xl border border-white/5 p-4 shadow-xl">
        {/* Days of Week Bar */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#A5B4C7] uppercase">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Blank cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`blank-${idx}`} className="h-28 bg-[#060B17]/40 rounded-xl border border-white/5 opacity-30" />
          ))}

          {daysArray.map(day => {
            const dayEvents = getEventsForDay(day);
            const isToday = day === 5 && currentDate.getMonth() === 7; // Mock Today Aug 5

            return (
              <div 
                key={day}
                className={`h-28 bg-[#060B17] rounded-xl border p-2 flex flex-col justify-between transition-all ${
                  isToday ? 'border-[#F5A300] bg-[#13203A]/40' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-[#F5A300]' : 'text-white'}`}>{day}</span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5A300]/20 text-[#F5A300] font-bold">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto flex-1 my-1 pr-0.5">
                  {dayEvents.map(e => (
                    <div 
                      key={e.id}
                      className={`text-[10px] p-1 rounded font-semibold truncate border ${
                        e.type === 'trip' 
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                          : e.type === 'maintenance'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                      title={e.title}
                    >
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
