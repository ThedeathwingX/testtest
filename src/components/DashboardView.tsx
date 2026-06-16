import React from 'react';
import { 
  AlertTriangle, 
  Send, 
  Calendar, 
  Clock, 
  History, 
  ChevronRight, 
  Layers, 
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { ActiveView } from '../types';

interface DashboardViewProps {
  onViewChange: (view: ActiveView) => void;
  onSetSelectedClient: (clientId: string) => void;
}

export default function DashboardView({ onViewChange, onSetSelectedClient }: DashboardViewProps) {
  
  const handleQuickRecordClient = (name: string) => {
    if (name.includes('陳大文')) {
      onViewChange('clients');
    } else {
      alert(`已將該行紀錄保存歸檔。查看詳細資料，請轉到客戶資料庫。`);
    }
  };

  const handleSendTemplate = (tempName: string) => {
    alert(`【WhatsApp 快捷發送模擬】\n範本內容：「${tempName}」已成功複製至剪貼板。\n即將串接 Meta Business Cloud API 傳送給現有對應客戶！`);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Dashboard Headline Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-900 font-sans tracking-tight">B哥今日工作台</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
              <Award className="w-3 h-3" />
              宅建士合規認證
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-1 font-medium">B哥，今日有 <span className="text-emerald-600 font-bold">12</span> 項待跟近與法規要約正在處理。今天是 2026年6月16日</p>
        </div>
        <button 
          onClick={() => onViewChange('kanban')}
          className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>跟進 Kanban</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-emerald-500 hover:shadow-md transition">
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">今日要跟進</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">12</span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">項</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] hover:shadow-md transition">
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">本週睇樓</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">8</span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">組</span>
          </div>
        </div>

        {/* KPI 3 (Alert Stage) */}
        <div 
          onClick={() => onViewChange('pavel_checklist')}
          className="bg-rose-50/50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-rose-500 cursor-pointer hover:shadow-md transition-all group"
          title="點擊前往合規告知書進度審查"
        >
          <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase flex items-center gap-1 group-hover:underline">
            未講解重說
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-rose-600 tracking-tight">4</span>
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">份</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] hover:shadow-md transition">
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">準備落票</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">6</span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">單</span>
          </div>
        </div>

      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Bento Column (lg:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Today's Client List Table */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center select-none">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase">今日待跟進客戶名單</h3>
              <button 
                onClick={() => onViewChange('kanban')}
                className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                查看完整九宮格管線
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 text-zinc-500 uppercase tracking-wide font-bold">
                  <tr>
                    <th className="py-2.5 px-4">客戶姓名</th>
                    <th className="py-2.5 px-4">需求項目</th>
                    <th className="py-2.5 px-4">當前管線</th>
                    <th className="py-2.5 px-4 font-mono">下次聯絡時間</th>
                    <th className="py-2.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr className="hover:bg-zinc-50 transition duration-150">
                    <td className="py-3 px-4 font-bold text-zinc-900 font-mono">陳大文</td>
                    <td className="py-3 px-4 text-zinc-500">大阪西區 1LDK 投資</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        初步接觸
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">今天 14:00</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleQuickRecordClient('陳大文')}
                        className="bg-white border border-zinc-200 text-zinc-600 hover:text-emerald-600 hover:border-emerald-500 px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer"
                      >
                        對話紀錄
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition duration-150">
                    <td className="py-3 px-4 font-bold text-zinc-900 font-mono">李嘉欣</td>
                    <td className="py-3 px-4 text-zinc-500">中央區 塔樓 住宅</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                        安排睇樓
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">今天 16:30</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert("已打開李嘉欣的快跟流程檔案！")}
                        className="bg-white border border-zinc-200 text-zinc-600 hover:text-emerald-600 hover:border-emerald-500 px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer"
                      >
                        對話紀錄
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Alerts and WhatsApp Quick Templates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Critical Compliance Warning Card */}
            <div className="bg-white border border-rose-200 rounded-xl p-5 border-l-[4px] border-l-rose-500 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 stroke-[2.5]" />
                <span>重要事項告知書未簽署警示</span>
              </div>
              <p className="text-zinc-500 text-xs mb-4 leading-relaxed font-medium">
                目前有 <span className="text-rose-600 font-bold">4</span> 份即將到期的重說文件需緊急處理，未解説前請勿簽署契約。
              </p>
              
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between items-center py-1.5 border-b border-rose-100">
                  <span className="font-semibold text-zinc-800">王小明 (難波雅居)</span>
                  <span className="text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 font-mono font-bold rounded text-[10px]">剩餘 2 天</span>
                </li>
                <li className="flex justify-between items-center py-1.5">
                  <span className="font-semibold text-zinc-800">張建國 (梅田大廈)</span>
                  <span className="text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 font-mono font-bold rounded text-[10px]">剩餘 3 天</span>
                </li>
              </ul>
            </div>

            {/* Quick Templates Shortcard */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp 快捷範本庫</span>
                </div>
                <button 
                  onClick={() => onViewChange('whatsapp_templates')}
                  className="text-[11px] text-emerald-600 font-bold hover:underline"
                >
                  去管理庫
                </button>
              </div>
              
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <button 
                  onClick={() => handleSendTemplate('睇樓確認提醒 (明日)')}
                  className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition rounded-lg text-xs font-mono font-medium text-zinc-700 flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">睇樓確認提醒 (明日)</span>
                  <Send className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition" />
                </button>
                <button 
                  onClick={() => handleSendTemplate('發送物件資料庫連結')}
                  className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition rounded-lg text-xs font-mono font-medium text-zinc-700 flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">發送物件資料庫連結</span>
                  <Send className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Bento Column: Stepper Timeline & Stage Overview (lg:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Timeline showing schedules */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase mb-4 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>本週睇樓安排</span>
            </h3>

            <div className="relative pl-4 border-l border-zinc-250 ml-2 space-y-5">
              
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20"></div>
                <div className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider">今日 14:00</div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 mt-1 hover:border-emerald-500 transition">
                  <div className="font-bold text-zinc-800 text-xs">難波公園南側公寓</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">對應客戶：陳大文 (VIP)</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-300 border-2 border-white"></div>
                <div className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider">明日 10:30</div>
                <div className="bg-zinc-50/50 border border-zinc-200 rounded-lg p-2.5 mt-1 opacity-80">
                  <div className="font-bold text-zinc-800 text-xs">梅田天空之城高層</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">對應客戶：趙小姐 (常規)</div>
                </div>
              </div>

            </div>
          </div>

          {/* Stepper Pipeline Stage counts miniaturized */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>階段預覽 (Kanban)</span>
              </h3>
              <button 
                onClick={() => onViewChange('kanban')}
                className="text-[10px] text-emerald-600 font-semibold hover:underline"
              >
                前往管線
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Stage item 1 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-zinc-600">1. 初步接觸</span>
                  <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.1 border border-emerald-100 rounded text-[10px] font-bold">24 客</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => onViewChange('clients')}
                    className="p-2 bg-zinc-50 border border-zinc-200 hover:border-emerald-500 transition rounded-lg cursor-pointer text-[11px]"
                  >
                    <div className="flex justify-between font-bold text-zinc-800">
                      <span>陳大文</span>
                      <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-1 rounded">1LDK</span>
                    </div>
                    <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-zinc-350" />
                      <span>今天 14:00</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => onViewChange('kanban')}
                    className="p-2 bg-zinc-50 border border-zinc-200 hover:border-emerald-500 transition rounded-lg cursor-pointer text-[11px]"
                  >
                    <div className="flex justify-between font-bold text-zinc-800">
                      <span>張美玲</span>
                      <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-1 rounded">投資</span>
                    </div>
                    <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-0.5">
                      <History className="w-2.5 h-2.5 text-zinc-350" />
                      <span>2日前</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage item 2 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-zinc-600">2. 安排睇樓</span>
                  <span className="font-mono bg-amber-50 text-amber-700 px-2 py-0.1 border border-amber-100 rounded text-[10px] font-bold">8 客</span>
                </div>
                <div 
                  onClick={() => onViewChange('kanban')}
                  className="p-2 bg-zinc-50 border border-zinc-200 hover:border-emerald-500 transition rounded-lg cursor-pointer text-[11px] w-1/2"
                >
                  <div className="flex justify-between font-bold text-zinc-800">
                    <span>李嘉欣</span>
                    <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-1 rounded">住宅</span>
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 text-zinc-350" />
                    <span>今天 16:30</span>
                  </div>
                </div>
              </div>

              {/* Stage item 3 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-zinc-600">3. 準備落票</span>
                  <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.1 border border-blue-100 rounded text-[10px] font-bold">6 客</span>
                </div>
                <div 
                  onClick={() => onViewChange('kanban')}
                  className="p-2 bg-zinc-50 border border-zinc-200 hover:border-emerald-500 transition rounded-lg cursor-pointer text-[11px] w-1/2"
                >
                  <div className="flex justify-between font-bold text-zinc-800">
                    <span>黃先生</span>
                    <span className="text-[9px] text-zinc-500 font-mono bg-zinc-100 px-1 rounded">5千萬</span>
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5 text-zinc-350" />
                    <span>明日 10:00</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
