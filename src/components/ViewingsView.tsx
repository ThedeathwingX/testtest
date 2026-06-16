import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  User,
  Check
} from 'lucide-react';
import { Viewing, Property } from '../types';

interface ViewingsViewProps {
  viewings: Viewing[];
  properties: Property[];
  onAddViewing: (newViewing: Viewing) => void;
  onUpdateViewingStatus: (viewingId: string, status: Viewing['status']) => void;
}

export default function ViewingsView({
  viewings,
  properties,
  onAddViewing,
  onUpdateViewingStatus
}: ViewingsViewProps) {
  // Add viewing form visible
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentClient, setCurrentClient] = useState('');
  const [selectedPropName, setSelectedPropName] = useState(properties[0]?.name || '');
  const [viewDate, setViewDate] = useState('2026-06-18T14:00');
  const [viewType, setViewType] = useState<'現場睇樓' | '自選影片錄影'>('現場睇樓');
  const [assignedStaff, setAssignedStaff] = useState('B哥');

  // Calendar states
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 1-index (6 = June)
  const [selectedDay, setSelectedDay] = useState<number>(18); // Default to June 18 where v1 resides

  const handleCreateViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient.trim()) {
      alert('請填寫預約置業客戶的中英文名稱！');
      return;
    }

    const formattedDate = viewDate.replace('T', ' ');
    const newViewing: Viewing = {
      id: `v_${Date.now()}`,
      clientName: currentClient,
      propertyName: selectedPropName,
      dateTime: formattedDate,
      type: viewType as any,
      status: '已預約',
      staff: assignedStaff
    };

    onAddViewing(newViewing);
    setCurrentClient('');
    setShowAddForm(false);
    
    // Auto focus on the newly scheduled day in the calendar
    try {
      const parts = formattedDate.split(' ')[0].split('-');
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const d = parseInt(parts[2]);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        setCurrentYear(y);
        setCurrentMonth(m);
        setSelectedDay(d);
      }
    } catch (err) {
      console.error("Error parsing date: ", err);
    }

    alert(`【帶看日程已成功掛載】\n已成功為 [ ${currentClient} ] 預約帶看：\n屋苑：${selectedPropName}\n時間：${formattedDate}\n帶看形式：[ ${viewType} ]\n已分派 [ ${assignedStaff} ] 為主理宅建專員。`);
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sunday, 1 = Monday etc

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Extract date-specific viewings helper
  const getViewingsForDay = (day: number) => {
    const formattedPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return viewings.filter(v => v.dateTime.startsWith(formattedPrefix));
  };

  // Days list labels
  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];

  // Current month's scheduled viewings list
  const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const monthViewings = viewings.filter(v => v.dateTime.startsWith(currentMonthPrefix));

  // Chosen selected day viewings
  const selectedDayViewings = getViewingsForDay(selectedDay);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title header */}
      <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>日本大阪・實體/錄影帶看日程月曆表</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            安排與追蹤日本大阪置業「現場陪同參觀」與「海外專員高清實景錄影」行程，宅建物料與重要事項流程日程備查。
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>添加新睇樓行程</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateViewing} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4 md:col-span-2 border-b pb-2 flex justify-between items-center">
            <h3 className="font-bold text-zinc-900 text-xs tracking-wider flex items-center gap-2 uppercase">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>新登載睇樓排程</span>
            </h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-zinc-400 hover:text-zinc-650">關閉</button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">預約置業買家姓名 *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. 陳大文 Mr. Chan"
              value={currentClient}
              onChange={e => setCurrentClient(e.target.value)}
              className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 focus:bg-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">挑選預約的大盤物業 *</label>
            <select
              value={selectedPropName}
              onChange={e => setSelectedPropName(e.target.value)}
              className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-white outline-none"
            >
              {properties.map(p => (
                <option key={p.id} value={p.name}>{p.area} • {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">預計睇樓時間 *</label>
              <input 
                type="datetime-local" 
                required
                value={viewDate}
                onChange={e => setViewDate(e.target.value)}
                className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 focus:bg-white outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">睇樓帶看形式</label>
              <select
                value={viewType}
                onChange={e => setViewType(e.target.value as any)}
                className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-white outline-none text-zinc-800 font-semibold"
              >
                <option value="現場睇樓">前往大阪現地陪同參觀</option>
                <option value="自選影片錄影">海外專員高清實景錄影</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">隨行日本宅建士 / 隨從專員</label>
            <input 
              type="text" 
              placeholder="e.g. 佐藤專員 Mr. Sato / B哥"
              value={assignedStaff}
              onChange={e => setAssignedStaff(e.target.value)}
              className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 focus:bg-white outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-500 rounded-lg"
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-lg shadow-xs"
            >
              核銷排程日程
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of all Schedules */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>當前所有帶看進程排程簿 ({viewings.length})</span>
            </h3>
            <span className="text-[9.5px] bg-zinc-100 text-zinc-500 font-mono font-bold px-2 py-0.5 rounded">
              B哥 CRM 聯動
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {viewings.map(view => {
              const viewOnCal = () => {
                try {
                  const datePart = view.dateTime.split(' ')[0];
                  const y = parseInt(datePart.split('-')[0]);
                  const m = parseInt(datePart.split('-')[1]);
                  const d = parseInt(datePart.split('-')[2]);
                  if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    setCurrentYear(y);
                    setCurrentMonth(m);
                    setSelectedDay(d);
                  }
                } catch(e) {}
              };

              return (
                <div 
                  key={view.id}
                  onClick={viewOnCal}
                  className={`border rounded-xl p-3.5 transition cursor-pointer hover:border-emerald-300 bg-white ${
                    selectedDayViewings.some(sv => sv.id === view.id)
                      ? 'ring-2 ring-emerald-500/20 border-emerald-500 bg-emerald-50/10'
                      : 'border-zinc-150'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-xs text-zinc-900 truncate">
                          {view.clientName}
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-semibold shrink-0">
                          • 由 {view.staff} 帶看
                        </span>
                      </div>
                      <h4 className="text-[11.5px] font-bold text-emerald-800 leading-snug truncate">
                        {view.propertyName}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 text-[9.5px] text-zinc-500 pt-1">
                        <span className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 font-medium">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {view.dateTime}
                        </span>
                        <span className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 font-medium">
                          <Compass className="w-3 h-3 text-zinc-400" />
                          {view.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1.5 shrink-0">
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                        view.status === '已完成' 
                          ? 'bg-zinc-100 text-zinc-500 border border-zinc-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {view.status}
                      </span>

                      <div className="pt-1.5">
                        {view.status === '已預約' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateViewingStatus(view.id, '已完成');
                              alert(`【帶看備案登記成功】\n「${view.clientName}」對「${view.propertyName}」的參觀已順利核備。`);
                            }}
                            className="bg-zinc-900 hover:bg-emerald-500 text-white hover:text-zinc-950 font-bold px-2 py-1 rounded text-[9.5px] shadow-xs cursor-pointer block w-full transition"
                          >
                            標記已完成
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Interactive Calendar */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-5">
            
            {/* Calendar Control Bar */}
            <div className="flex justify-between items-center bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-150">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4.5 h-4.5 text-emerald-600" />
                <span className="font-extrabold text-sm text-zinc-900 tracking-tight font-sans">
                  {currentYear} 年 {currentMonth} 月
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded select-none">
                  {monthViewings.length} 個本月排程
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 select-none">
                <button 
                  type="button" 
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-600 transition cursor-pointer"
                  title="上一個月"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const today = new Date();
                    setCurrentYear(2026);
                    setCurrentMonth(6);
                    setSelectedDay(18);
                  }}
                  className="text-[10.5px] font-bold border border-zinc-250 bg-white hover:bg-zinc-50 px-2.5 py-1 rounded-lg text-zinc-700 cursor-pointer"
                >
                  回到 June 2026
                </button>
                <button 
                  type="button" 
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-600 transition cursor-pointer"
                  title="下一個月"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-zinc-400 select-none pb-1">
              {daysOfWeek.map((dayLabel, i) => (
                <div key={i} className={`py-1 ${i === 0 || i === 6 ? 'text-rose-400' : ''}`}>
                  {dayLabel}
                </div>
              ))}
            </div>

            {/* Calendar Grid Numbers */}
            <div className="grid grid-cols-7 gap-2.5">
              
              {/* Empty placeholder boxes before first day */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-zinc-50/30 rounded-xl" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateViewings = getViewingsForDay(dayNum);
                const hasViewings = dateViewings.length > 0;
                const isSelected = selectedDay === dayNum;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => setSelectedDay(dayNum)}
                    className={`aspect-square relative flex flex-col items-center justify-between p-1.5 rounded-xl border focus:outline-none transition group cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-600 border-emerald-600 text-white font-extrabold shadow-md' 
                        : hasViewings
                        ? 'border-emerald-400 bg-emerald-50/40 text-emerald-950 font-bold hover:bg-emerald-50 hover:border-emerald-500'
                        : 'border-zinc-150 hover:border-zinc-300 text-zinc-800'
                    }`}
                  >
                    {/* Day number */}
                    <span className="text-xs">{dayNum}</span>

                    {/* Indicators of scheduling */}
                    <div className="w-full flex justify-center gap-1 min-h-[4px]">
                      {dateViewings.map((v, index) => (
                        <span 
                          key={v.id} 
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected 
                              ? 'bg-white' 
                              : v.status === '已完成' 
                              ? 'bg-zinc-400' 
                              : 'bg-emerald-500'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Hover Tooltip or floating viewings count */}
                    {hasViewings && !isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {dateViewings.length}
                      </span>
                    )}
                  </button>
                );
              })}

            </div>

            {/* Target Day Detailed Section */}
            <div className="border-t border-zinc-100 pt-5 space-y-3.5">
              <div className="flex justify-between items-center">
                <h4 className="text-[11.5px] font-extrabold text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded bg-emerald-500" />
                  <span>【 {currentYear} 年 {currentMonth} 月 {selectedDay} 日 】 本日帶看詳情 </span>
                </h4>
                <span className="text-[10px] text-zinc-400">
                  {selectedDayViewings.length} 個預約
                </span>
              </div>

              {selectedDayViewings.length === 0 ? (
                <div className="text-center py-7 border border-dashed rounded-xl bg-zinc-50/50 text-xs text-zinc-400">
                  本日暫時沒有安排實體睇樓或錄影日程安排。
                  <button 
                    onClick={() => {
                      // Set default time to selected date
                      const timeStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}T14:30`;
                      setViewDate(timeStr);
                      setShowAddForm(true);
                    }}
                    className="text-emerald-600 font-bold hover:underline ml-1 block mt-1"
                  >
                    + 點此為當天添加睇樓預約
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayViewings.map((v) => (
                    <div 
                      key={v.id} 
                      className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/35 hover:bg-zinc-50/70 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <span className="inline-block text-[9px] font-extrabold border border-emerald-500/20 bg-emerald-50 text-emerald-800 rounded px-1.5 py-0.5">
                            {v.type} ({v.status})
                          </span>
                          <h5 className="font-extrabold text-xs text-zinc-900">{v.propertyName}</h5>
                          <div className="text-[11.5px] text-zinc-650 space-y-0.5">
                            <p className="flex items-center gap-1">
                              <span className="text-zinc-400 font-medium">對接客戶：</span>
                              <span className="font-extrabold text-zinc-800">{v.clientName}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <span className="text-zinc-400 font-medium font-sans">隨行宅建：</span>
                              <span className="font-semibold text-zinc-700">{v.staff}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <span className="text-zinc-400 font-medium">預定時間：</span>
                              <span className="font-bold text-emerald-800 font-mono text-[11px]">{v.dateTime}</span>
                            </p>
                          </div>
                        </div>

                        {v.status === '已預約' && (
                          <button
                            onClick={() => {
                              onUpdateViewingStatus(v.id, '已完成');
                              alert(`【帶看備案登記成功】\n「${v.clientName}」對「${v.propertyName}」的參觀已順利核備。`);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>登記完成</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
