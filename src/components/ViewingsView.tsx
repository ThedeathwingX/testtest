import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Plus, 
  CheckCircle2, 
  Play, 
  Compass, 
  Sparkles,
  PhoneCall,
  Tv,
  Check,
  AlertTriangle,
  UserCheck
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
  const [viewDate, setViewDate] = useState('2026-06-25T14:30');
  const [viewType, setViewType] = useState<'Zoom Live' | '現場睇樓' | '自選影片錄影'>('Zoom Live');
  const [assignedStaff, setAssignedStaff] = useState('B哥');

  // Simulated live player state
  const [playingViewingId, setPlayingViewingId] = useState<string | null>(null);
  const [playerInteractions, setPlayerInteractions] = useState<string[]>([
    'B哥: 各位，佐藤專員已經到達難波公寓現場，街區好安靜。',
    '佐藤 Sato: 啱啱出地鐵口行咗3分鐘，好近！周圍配套成熟。',
    '陳大文: 直播好清！想睇睇套房洗手間通風情況同露台景觀。'
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  const activeLiveViewing = viewings.find(v => v.id === playingViewingId);

  const handleCreateViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient.trim()) {
      alert('請填寫預約置業客戶的中英文名稱！');
      return;
    }

    const newViewing: Viewing = {
      id: `v_${Date.now()}`,
      clientName: currentClient,
      propertyName: selectedPropName,
      dateTime: viewDate.replace('T', ' '),
      type: viewType,
      status: '已預約',
      staff: assignedStaff
    };

    onAddViewing(newViewing);
    setCurrentClient('');
    setShowAddForm(false);
    alert(`【帶看日程已成功掛載】\n已成功為 [ ${currentClient} ] 預約帶看：\n屋苑：${selectedPropName}\n時間：${viewDate.replace('T', ' ')}\n帶看形式：[ ${viewType} ]\n已分派 [ ${assignedStaff} ] 為主理宅建專員。`);
  };

  const handleAddChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatInput.trim()) {
      setPlayerInteractions([...playerInteractions, `您 (B哥): ${newChatInput.trim()}`]);
      setNewChatInput('');

      // Auto reply from Satos-san after a brief delay
      setTimeout(() => {
        setPlayerInteractions(prev => [
          ...prev, 
          '佐藤 Sato: 收到！正推開防盜門，全原木松下地暖與防火建材都保養得好好。'
        ]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title header */}
      <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>日本大阪・聯動睇樓帶看日程表</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            安排與追蹤日本置業「現場視像現場(Zoom Live)直播帶看」與實體觀景行程，宅地建物取引士現場實況反饋。
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
            <label className="text-[10px] font-bold text-zinc-400 uppercase">挑選預約的大阪標的 *</label>
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
                className="w-full text-xs border border-zinc-200 rounded-lg p-2 bg-white outline-none"
              >
                <option value="Zoom Live">大阪現場 Live 視訊直播 (最受歡迎)</option>
                <option value="現場睇樓">前往大阪現地陪同參觀</option>
                <option value="自選影片錄影">專員高清實景錄影</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">隨行日本宅建士 / 隨從專員</label>
            <input 
              type="text" 
              placeholder="e.g.佐藤佐藤 Mr. Sato / B哥"
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
              核銷掛載
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Schedules */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest border-b pb-2 flex items-center justify-between">
            <span>當前帶看進程排程簿 ({viewings.length})</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">LIVE-LINK</span>
          </h3>

          <div className="space-y-3.5">
            {viewings.map(view => {
              const isPlaying = view.id === playingViewingId;
              const isLiveType = view.type === 'Zoom Live';

              return (
                <div 
                  key={view.id}
                  className={`border rounded-xl p-4 transition ${
                    isPlaying 
                      ? 'border-emerald-500 bg-emerald-50/5 shadow-md' 
                      : 'border-zinc-150 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-extrabold text-xs text-zinc-900">{view.clientName}</span>
                        <span className="text-[10px] text-zinc-400 font-semibold">• 由 {view.staff} 帶看</span>
                      </div>
                      <h4 className="text-xs font-bold text-emerald-800 leading-snug">{view.propertyName}</h4>
                      <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 pt-1">
                        <span className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 font-medium">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {view.dateTime}
                        </span>
                        <span className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 font-medium">
                          <Video className="w-3.5 h-3.5 text-zinc-400" />
                          {view.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-2 select-none">
                      <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded leading-none ${
                        view.status === '已完成' 
                          ? 'bg-zinc-100 text-zinc-650 border border-zinc-200' 
                          : view.status === '直播中' 
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20'
                      }`}>
                        {view.status}
                      </span>

                      {/* Control buttons */}
                      <div className="pt-2 text-[10px] flex items-center justify-end gap-1.5 font-bold">
                        {view.status === '已預約' && (
                          <>
                            {isLiveType && (
                              <button
                                onClick={() => {
                                  onUpdateViewingStatus(view.id, '直播中');
                                  setPlayingViewingId(view.id);
                                }}
                                className="bg-rose-550 hover:bg-rose-500 text-white px-2 py-1 rounded"
                              >
                                啟動大阪直播
                              </button>
                            )}
                            <button
                              onClick={() => onUpdateViewingStatus(view.id, '已完成')}
                              className="bg-zinc-100 border text-zinc-700 hover:bg-zinc-200 px-2 py-1 rounded"
                            >
                              標記完成
                            </button>
                          </>
                        )}
                        
                        {view.status === '直播中' && (
                          <button
                            onClick={() => {
                              onUpdateViewingStatus(view.id, '已完成');
                              setPlayingViewingId(null);
                              alert('【視像帶看圓滿核銷】\n大阪直播帶看已順利結束。錄影壓縮檔已自動存入客戶在 CRM「重要事項告知書」之存檔中。');
                            }}
                            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-450 px-2.5 py-1 rounded shadow-xs"
                          >
                            完成存檔
                          </button>
                        )}

                        {isLiveType && view.status !== '已完成' && !isPlaying && (
                          <button
                            onClick={() => setPlayingViewingId(view.id)}
                            className="bg-zinc-900 text-white hover:bg-zinc-800 px-2.5 py-1 rounded"
                          >
                            開電視
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

        {/* Right Column: Visual Live Broadcast Simulation */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl p-5 text-zinc-200 space-y-4">
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {playingViewingId ? `OSAKA LIVE FEED: ${activeLiveViewing?.clientName}` : 'OSAKA CCTV / LIVE SIMULATION'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">2026-06-16 CAMERA-02</span>
            </div>

            {/* Video Player Display */}
            <div className="relative h-64 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
              
              {playingViewingId ? (
                <>
                  <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" 
                    alt="Osaka Street Live Feed" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-90 saturate-75 contrast-105"
                  />
                  
                  {/* Telemetry graphic overlays */}
                  <div className="absolute inset-0 bg-radial-gradient-to-t from-zinc-950/20 to-transparent pointer-events-none"></div>
                  
                  <div className="absolute top-4 left-4 bg-zinc-900/80 border border-zinc-700 py-1 px-2.5 rounded-lg text-[9px] font-mono text-emerald-400 space-y-0.5 uppercase tracking-wide">
                    <div>GPS: 34.6691° N, 135.5030° E</div>
                    <div>FPS: 60.0 • LATENCY: 28ms</div>
                  </div>

                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>LIVE</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-zinc-950/90 to-transparent p-3 rounded-lg select-text">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wider">正在進行視像帶看</div>
                    <div className="text-xs font-bold text-white truncate max-w-xs">{activeLiveViewing?.propertyName}</div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4 max-w-xs select-none">
                  <Tv className="w-12 h-12 text-zinc-650 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-300">日本直播監視接收台已就緒</h4>
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      選擇左側有 [視訊帶看] 狀態為「已預約」或「直播中」的行程，點選「啟動大阪直播」或「開電視」即可同步監視畫面。
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Chat list channel */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">
                聯動視像語音即時反饋 (MOCK CHAT)
              </h4>

              <div className="bg-zinc-900/70 border border-zinc-850 rounded-lg p-3.5 max-h-36 overflow-y-auto space-y-2 text-[10.5px] font-sans custom-scrollbar select-text">
                {playerInteractions.map((line, i) => {
                  const isMine = line.startsWith('您');
                  const isSato = line.startsWith('佐藤');
                  return (
                    <div key={i} className="leading-relaxed">
                      <strong className={`font-bold ${isMine ? 'text-emerald-400' : isSato ? 'text-amber-400' : 'text-blue-300'}`}>
                        {line.split(': ')[0]}:
                      </strong>
                      <span className="text-zinc-300"> {line.split(': ')[1]}</span>
                    </div>
                  );
                })}
              </div>

              {playingViewingId && (
                <form onSubmit={handleAddChat} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="輸入對話給現場佐藤專員或給陳大文..."
                    value={newChatInput}
                    onChange={e => setNewChatInput(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-zinc-700"
                  />
                  <button 
                    type="submit" 
                    className="bg-zinc-800 hover:bg-zinc-750 text-white px-3 text-xs rounded-lg font-bold"
                  >
                    傳送
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
