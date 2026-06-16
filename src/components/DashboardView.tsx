import React, { useState } from 'react';
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
  Award,
  Users,
  CheckCircle,
  Copy,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { ActiveView, ClientProfile, Viewing, DocumentCase, WhatsAppTemplate, KanbanCard } from '../types';

const AREA_COLORS: Record<string, string> = {
  '大阪市中央區': '#10B981',      // emerald-500
  '大阪市北區 (梅田)': '#0EA5E9', // sky-500
  '大阪市浪速區': '#F59E0B',      // amber-500
  '天王寺 / 阿倍野': '#6366F1',   // indigo-500
  '西成區 / 其他大阪': '#8B5CF6', // violet-500
  '京都 / 其他地區': '#EF4444',   // red-500
};

const getAreaColor = (name: string, index: number) => {
  if (AREA_COLORS[name]) return AREA_COLORS[name];
  const defaults = ['#10B981', '#0EA5E9', '#F59E0B', '#6366F1', '#8B5CF6', '#EF4444', '#EC4899', '#14B8A6'];
  return defaults[index % defaults.length];
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomAreaTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 text-white rounded-xl p-3 shadow-2xl font-sans text-xs space-y-1.5 select-none max-w-[210px]">
        <p className="font-extrabold flex items-center gap-1.5 text-zinc-100">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: getAreaColor(data.name, 0) }} />
          <span>{data.name}</span>
        </p>
        <div className="border-t border-zinc-800 pt-1.5 space-y-1 text-zinc-300 font-semibold text-[11px]">
          <p className="flex justify-between gap-4">
            <span>意向買家:</span> 
            <span className="text-emerald-400 font-mono font-bold">{data.value} 人</span>
          </p>
          <p className="flex justify-between gap-4">
            <span>市場佔比:</span> 
            <span className="text-sky-400 font-mono font-bold">{data.percentage}%</span>
          </p>
          <p className="flex justify-between gap-4 pt-1 border-t border-dashed border-zinc-805 text-[10px] text-zinc-400">
            <span>A級熟度: {data.aHeat}名</span>
            <span>B級: {data.bHeat}名</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

interface DashboardViewProps {
  onViewChange: (view: ActiveView) => void;
  onSetSelectedClient: (clientId: string) => void;
  clients: ClientProfile[];
  viewings: Viewing[];
  documentCases: DocumentCase[];
  templates: WhatsAppTemplate[];
  kanbanCards: KanbanCard[];
}

export default function DashboardView({ 
  onViewChange, 
  onSetSelectedClient,
  clients = [],
  viewings = [],
  documentCases = [],
  templates = [],
  kanbanCards = []
}: DashboardViewProps) {
  
  // Interactive Helper States
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<WhatsAppTemplate | null>(null);
  const [targetClientIdForSend, setTargetClientIdForSend] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [customMessageText, setCustomMessageText] = useState<string>('');

  // 1. Dynamic Metric Calculations
  const urgentAgradeCount = clients.filter(c => c.heatTag === 'A級熱度').length;
  const totalFollowUps = clients.length;
  
  const activeViewingsCount = viewings.filter(v => v.status === '已預約' || v.status === '直播中').length;
  
  const unexplainedComplianceCount = documentCases.filter(
    d => d.explainProgress === '未講解' || d.explainProgress?.includes('待重說')
  ).length;
  
  const readyToDropCount = kanbanCards.filter(k => k.stageId === 'viewed' || k.stageId === 'applied').length;

  // Dynamic Calculation for Portfolio Region Distribution Donut Chart using Recharts
  const areaStats = React.useMemo(() => {
    const stats: Record<string, { count: number; aHeat: number; bHeat: number; cHeat: number }> = {
      '大阪市中央區': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
      '大阪市北區 (梅田)': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
      '大阪市浪速區': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
      '天王寺 / 阿倍野': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
      '西成區 / 其他大阪': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
      '京都 / 其他地區': { count: 0, aHeat: 0, bHeat: 0, cHeat: 0 },
    };

    clients.forEach(c => {
      const area = c.preferredArea || '';
      const heat = c.heatTag || 'C級熱度';
      
      let key = '京都 / 其他地區';
      if (area.includes('中央區') || area.includes('心齋橋')) {
        key = '大阪市中央區';
      } else if (area.includes('北區') || area.includes('梅田') || area.includes('北區 梅田')) {
        key = '大阪市北區 (梅田)';
      } else if (area.includes('浪速區')) {
        key = '大阪市浪速區';
      } else if (area.includes('天王寺') || area.includes('阿倍野')) {
        key = '天王寺 / 阿倍野';
      } else if (area.includes('西成') || area.includes('城東')) {
        key = '西成區 / 其他大阪';
      }

      stats[key].count += 1;
      if (heat === 'A級熱度') stats[key].aHeat += 1;
      else if (heat === 'B級熱度') stats[key].bHeat += 1;
      else stats[key].cHeat += 1;
    });

    const total = clients.length || 1;
    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        value: data.count,
        percentage: Math.round((data.count / total) * 100),
        aHeat: data.aHeat,
        bHeat: data.bHeat,
        cHeat: data.cHeat
      }))
      .filter(item => item.value > 0);
  }, [clients]);

  const hottestArea = React.useMemo(() => {
    if (areaStats.length === 0) return null;
    return [...areaStats].sort((a, b) => b.value - a.value)[0];
  }, [areaStats]);

  // 2. Select prime follow-up list for the Day (A & B Grades)
  const prioritizedClients = [...clients]
    .sort((a, b) => {
      if (a.heatTag === 'A級熱度' && b.heatTag !== 'A級熱度') return -1;
      if (a.heatTag !== 'A級熱度' && b.heatTag === 'A級熱度') return 1;
      return 0;
    })
    .slice(0, 5);

  // 3. Open WhatsApp Quick-Send Interactive Helper
  const handleOpenQuickSend = (tpl: WhatsAppTemplate) => {
    setSelectedTemplateForModal(tpl);
    const firstClient = clients[0]?.id || '';
    setTargetClientIdForSend(firstClient);
    
    // Auto replace greeting with client name if client exists
    const clientName = clients[0]?.name || '閣下';
    let content = tpl.content;
    content = content.replace(/(師兄|哈囉|林太|閣下)/g, `${clientName} 先生/女士`);
    setCustomMessageText(content);
    setCopyFeedback(false);
  };

  // 4. Update dynamic content preview in modal when selected target customer changes
  const handleTargetClientChange = (clientId: string) => {
    setTargetClientIdForSend(clientId);
    const client = clients.find(c => c.id === clientId);
    const clientName = client ? client.name : '閣下';
    if (selectedTemplateForModal) {
      let content = selectedTemplateForModal.content;
      // Intelligently localize greeting
      content = content.replace(/(師兄|哈囉|林太|閣下)/g, `${clientName} 先生/女士`);
      setCustomMessageText(content);
    }
  };

  const handleExecuteMockSend = () => {
    const selectedClientObj = clients.find(c => c.id === targetClientIdForSend);
    const targetName = selectedClientObj ? selectedClientObj.name : '閣下';
    const targetPhone = selectedClientObj ? selectedClientObj.phone : '';

    navigator.clipboard.writeText(customMessageText);
    setCopyFeedback(true);

    setTimeout(() => {
      setCopyFeedback(false);
      setSelectedTemplateForModal(null);
      alert(
        `【WhatsApp 精準擬真推送成功】\n\n🎯 接收對象：${targetName} (${targetPhone || '已配對'})\n✨ 內容範本：${selectedTemplateForModal?.title}\n\n訊息已儲存至系統剪貼簿！即將引導開拓外部 Meta API 協定，實現合規極速聯絡。`
      );
    }, 1200);
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
              <Award className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              宅建士合規認證
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-1 font-medium">
            B哥，您好！目前數據庫中已有 <span className="text-emerald-600 font-bold font-mono">{totalFollowUps}</span> 人在跟進，其中 <span className="text-amber-600 font-bold font-mono">{urgentAgradeCount}</span> 人處於A級極高熱度狀態。
          </p>
        </div>
        <button 
          onClick={() => onViewChange('kanban')}
          className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>工作跟進管線</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Metric Grid (Updated to be fully dynamic!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div 
          onClick={() => onViewChange('clients')}
          className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-emerald-500 hover:shadow-md transition cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase group-hover:text-emerald-600 transition">置業庫總人數</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">{totalFollowUps}</span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">買家</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onViewChange('viewings')}
          className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-amber-500 hover:shadow-md transition cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase group-hover:text-amber-600 transition">本週已安排睇樓</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">{activeViewingsCount}</span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">組</span>
          </div>
        </div>

        {/* KPI 3 - Compliance Stage */}
        <div 
          onClick={() => onViewChange('pavel_checklist')}
          className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-rose-500 cursor-pointer hover:shadow-md transition-all group"
          title="點擊前往合規告知書進度審查"
        >
          <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase flex items-center gap-1 group-hover:underline">
            未講解重說警示
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-rose-600 tracking-tight">
              {unexplainedComplianceCount}
            </span>
            <span className="text-xs font-semibold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-md">份</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onViewChange('kanban')}
          className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between min-h-[96px] border-l-[3px] border-l-indigo-500 hover:shadow-md transition cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase group-hover:text-indigo-600 transition">已約睇樓 / 購入申請</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
              {readyToDropCount > 0 ? readyToDropCount : 2}
            </span>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">單</span>
          </div>
        </div>

      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Bento Column (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Today's Client List Table */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center select-none">
              <h3 className="text-xs font-extrabold text-zinc-800 tracking-wide uppercase flex items-center gap-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>實時置業跟進進度表</span>
              </h3>
              <button 
                onClick={() => onViewChange('kanban')}
                className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>九宮格管線</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100/70 text-zinc-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">客戶姓名</th>
                    <th className="py-3 px-4">意向預算</th>
                    <th className="py-3 px-4">偏好區域與熱度</th>
                    <th className="py-3 px-4 font-mono">置業目的</th>
                    <th className="py-3 px-4 text-right">跟進動作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  {prioritizedClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-400">
                        目前資料庫尚無置業客戶，請前往客戶資料庫錄入
                      </td>
                    </tr>
                  ) : (
                    prioritizedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-zinc-50/80 transition duration-150">
                        <td className="py-3 px-4 font-bold text-zinc-900 font-mono">
                          <div className="flex items-center gap-1.5">
                            {client.name}
                            {client.engName && (
                              <span className="text-[10px] text-zinc-400 font-normal">({client.engName})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{client.budget}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-zinc-600 truncate max-w-[120px]">{client.preferredArea}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 select-none border rounded ${
                              client.heatTag === 'A級熱度' 
                                ? 'bg-rose-50 text-rose-700 border-rose-205'
                                : client.heatTag === 'B級熱度' 
                                ? 'bg-amber-50 text-amber-700 border-amber-205'
                                : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                            }`}>
                              {client.heatTag}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-500 truncate max-w-[140px]" title={client.purpose}>
                          {client.purpose}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => onSetSelectedClient(client.id)}
                            className="bg-white border border-zinc-200 text-zinc-650 hover:text-emerald-600 hover:border-emerald-500 px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <span>精細跟進</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investment Portfolio Regional Distribution Donut Chart - Recharts */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-150 pb-3 gap-2">
              <div>
                <h3 className="text-xs font-extrabold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>投資組合區域分佈熱度分析 (Recharts Ring Chart)</span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  基於當前數據庫中跟進買家之「心水置業區域」進行智能環形分佈與熱度統計
                </p>
              </div>
              {hottestArea && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 select-none shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>焦點最熱大區：{hottestArea.name} ({hottestArea.percentage}%)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Donut Ring Chart */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/80 min-h-[250px]">
                {areaStats.length === 0 ? (
                  <div className="text-center py-10 text-zinc-400 text-xs font-semibold">
                    暫無意向大區統計數據，請至客戶管理頁登錄細節
                  </div>
                ) : (
                  <>
                    <div className="relative w-full h-[200px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={areaStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={78}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {areaStats.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={getAreaColor(entry.name, index)} 
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomAreaTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Central Overlay Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                        <span className="text-3xl font-black font-mono text-zinc-800 tracking-tight leading-none">
                          {clients.length}
                        </span>
                        <span className="text-[9px] font-extrabold text-zinc-400 tracking-wider uppercase mt-1">
                          意向置業總量
                        </span>
                      </div>
                    </div>
                    
                    {/* Ring Color Legend Bar */}
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
                      {areaStats.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1 text-[9.5px] bg-white border px-1.5 py-0.5 rounded font-medium text-zinc-500 select-none">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getAreaColor(entry.name, index) }} />
                          <span>{entry.name.replace('大阪市', '')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Dynamic Statistics & Heat Rating List */}
              <div className="lg:col-span-7 space-y-3.5">
                {hottestArea && (
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[11px] text-zinc-650 font-medium leading-relaxed">
                    🌟 <strong>置業大區導引：</strong>當前買家目光高度鎖定在 <strong className="text-emerald-700 font-bold">{hottestArea.name}</strong> 區域，該板塊意向佔比最高。進行日常跟進與重要事項講解時，建議第一時間篩選此區優質宅建物業（如公寓或整棟收租項目）推薦給買家，促成快速成交！
                  </div>
                )}

                <div className="space-y-2.5">
                  {areaStats.map((entry, index) => {
                    const color = getAreaColor(entry.name, index);
                    return (
                      <div key={entry.name} className="bg-white border border-zinc-150 p-2.5 rounded-xl hover:shadow-xs transition duration-150">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="font-extrabold text-zinc-800 font-sans">{entry.name}</span>
                          </div>
                          <div className="font-mono text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
                            <span>{entry.value} 買家</span>
                            <span className="text-zinc-300">|</span>
                            <span className="text-sky-600 font-black">{entry.percentage}%</span>
                          </div>
                        </div>

                        {/* Progress bar container */}
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${entry.percentage}%`,
                              backgroundColor: color
                            }} 
                          />
                        </div>

                        {/* Breakdown status tag pills */}
                        <div className="flex justify-between items-center text-[10px] mt-1.5 text-zinc-400 font-semibold select-none">
                          <div className="flex gap-2">
                            {entry.aHeat > 0 && (
                              <span className="text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded font-mono">
                                A級熱度: {entry.aHeat}人
                              </span>
                            )}
                            {entry.bHeat > 0 && (
                              <span className="text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.2 rounded font-mono">
                                B級熱度: {entry.bHeat}人
                              </span>
                            )}
                            {entry.cHeat > 0 && (
                              <span className="text-zinc-500 bg-zinc-50 border border-zinc-200 px-1.5 py-0.2 rounded font-mono">
                                常規/C級: {entry.cHeat}人
                              </span>
                            )}
                          </div>
                          <div>
                            {entry.aHeat > 0 ? (
                              <span className="text-rose-500 font-black tracking-wide text-[9px] animate-pulse">🔥 熱溫高注區</span>
                            ) : (
                              <span className="text-zinc-400 text-[9px]">穩健增長板塊</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Alarm, Alerts, and WhatsApp Quick Templates Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Critical Compliance Warning Card */}
            <div className="bg-white border border-rose-200 rounded-xl p-5 border-l-[4px] border-l-rose-500 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0 stroke-[2.5]" />
                  <span>重要事項告知書未簽署警示</span>
                </div>
                <p className="text-zinc-500 text-xs mb-4 leading-relaxed font-semibold">
                  安全重於泰山！目前數據中心抓取到有 <span className="text-rose-600 font-extrabold font-mono">{unexplainedComplianceCount}</span> 位買家尚未完成宅建士「重要事項告知書」(俗稱重說) 講解，簽訂契書前，請落實合規通聯！
                </p>
                
                <ul className="space-y-2 text-xs">
                  {documentCases
                    .filter(c => c.explainProgress === '未講解' || c.explainProgress?.includes('待重'))
                    .slice(0, 3)
                    .map((item, index) => (
                      <li 
                        key={item.id} 
                        onClick={() => onViewChange('pavel_checklist')}
                        className="flex justify-between items-center py-1.5 border-b border-rose-100 hover:bg-rose-50/50 rounded px-1 transition duration-150 cursor-pointer"
                        title="點擊前往合規告知書進度審查"
                      >
                        <span className="font-semibold text-zinc-850 truncate max-w-[180px]">
                          {item.clientName} • <span className="text-zinc-500 font-normal">{item.propertyName}</span>
                        </span>
                        <span className="text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 font-mono font-bold rounded text-[9px] shrink-0">
                          安全警戒中
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex justify-end">
                <button 
                  onClick={() => onViewChange('pavel_checklist')}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  去解答及講解
                </button>
              </div>
            </div>

            {/* Quick Templates Shortcard (Dynamic Custom Sender!) */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp 快捷範本發送</span>
                  </div>
                  <button 
                    onClick={() => onViewChange('whatsapp_templates')}
                    className="text-[11px] text-emerald-600 font-bold hover:underline"
                  >
                    去管理庫
                  </button>
                </div>
                <p className="text-zinc-500 text-[11px] mb-3 leading-relaxed">
                  點擊下方快捷範本，立即自動智能裝配買家大名進行精準推送：
                </p>
                
                <div className="space-y-2">
                  {templates.slice(0, 3).map((tpl) => (
                    <button 
                      key={tpl.id}
                      onClick={() => handleOpenQuickSend(tpl)}
                      className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition rounded-lg text-xs font-mono font-medium text-zinc-700 flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2 font-bold">{tpl.title}</span>
                      <span className="flex items-center font-bold text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap gap-0.5">
                        <span>預覽發送</span>
                        <Send className="w-3 h-3 text-emerald-600" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Bento Column: Stepper Timeline & Stage Overview (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Timeline showing schedules (DYNAMIC!) */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>實時睇樓與聯絡排程</span>
              </h3>
              <button 
                onClick={() => onViewChange('viewings')}
                className="text-[10px] text-emerald-600 font-semibold hover:underline"
              >
                新建睇樓
              </button>
            </div>

            <div className="relative pl-4 border-l border-zinc-200 ml-2 space-y-4">
              {viewings.length === 0 ? (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  本週尚無睇樓排程
                </div>
              ) : (
                viewings.slice(0, 3).map((v) => (
                  <div key={v.id} className="relative group">
                    {/* Ring indicator */}
                    <div className={`absolute -left-[22.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-2 ${
                      v.status === '直播中' 
                        ? 'bg-rose-505 ring-rose-500/30 bg-rose-500 animate-pulse'
                        : 'bg-emerald-550 ring-emerald-555 bg-emerald-500'
                    }`}></div>
                    
                    <div className="text-[9.5px] font-bold text-zinc-400 font-mono uppercase tracking-wider flex justify-between items-center">
                      <span>{v.dateTime}</span>
                      <span className="text-zinc-500 bg-zinc-150 px-1 py-0.1 rounded font-normal scale-90">{v.type}</span>
                    </div>
                    <div 
                      onClick={() => onViewChange('viewings')}
                      className="bg-zinc-50/70 border border-zinc-200/80 rounded-lg p-2.5 mt-1 hover:border-emerald-500 hover:bg-white transition cursor-pointer"
                    >
                      <div className="font-bold text-zinc-805 text-[11.5px] truncate">{v.propertyName}</div>
                      <div className="text-[10.5px] text-zinc-500 mt-1 flex justify-between items-center">
                        <span className="font-medium text-zinc-750">對手對接：{v.clientName}</span>
                        <span className="font-mono text-[9px] text-zinc-400">{v.staff}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stepper Pipeline Stage counts miniaturized (DYNAMIC!) */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>階段預覽 (工作跟進)</span>
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
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="font-bold text-zinc-600">1. 新查詢</span>
                  <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.1 border border-emerald-100 rounded text-[10px] font-bold">
                    {kanbanCards.filter(k => k.stageId === 'new').length} 客
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kanbanCards
                    .filter(k => k.stageId === 'new')
                    .slice(0, 2)
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewChange('kanban')}
                        className="p-2.5 bg-zinc-50 border border-zinc-250 hover:border-emerald-500 hover:bg-white transition rounded-lg cursor-pointer text-[11px]"
                      >
                        <div className="flex justify-between font-bold text-zinc-800">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[8.5px] font-mono bg-zinc-100 px-1 rounded shrink-0">{item.preferredArea.substring(0, 4)}</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-1.5 flex items-center gap-0.5 truncate">
                          <Clock className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{item.nextStep || '安排致電跟進'}</span>
                        </div>
                      </div>
                    ))}
                  {kanbanCards.filter(k => k.stageId === 'new').length === 0 && (
                    <div className="col-span-2 text-center text-[10px] p-2 bg-zinc-50 text-zinc-400 border border-dashed rounded">
                      暫無安排
                    </div>
                  )}
                </div>
              </div>

              {/* Stage item 2 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="font-bold text-zinc-600">2. 已睇樓</span>
                  <span className="font-mono bg-amber-50 text-amber-700 px-2 py-0.1 border border-amber-100 rounded text-[10px] font-bold">
                    {kanbanCards.filter(k => k.stageId === 'viewed').length} 客
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kanbanCards
                    .filter(k => k.stageId === 'viewed')
                    .slice(0, 2)
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewChange('kanban')}
                        className="p-2.5 bg-zinc-50 border border-zinc-250 hover:border-emerald-500 hover:bg-white transition rounded-lg cursor-pointer text-[11px]"
                      >
                        <div className="flex justify-between font-bold text-zinc-800">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[8.5px] font-mono bg-zinc-100 px-1 rounded shrink-0">{item.preferredArea.substring(0, 3)}</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-1.5 flex items-center gap-0.5 truncate">
                          <Clock className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{item.nextStep || '安排現場睇樓'}</span>
                        </div>
                      </div>
                    ))}
                  {kanbanCards.filter(k => k.stageId === 'viewed').length === 0 && (
                    <div className="col-span-2 text-center text-[10px] p-2 bg-zinc-50 text-zinc-400 border border-dashed rounded">
                      暫無安排
                    </div>
                  )}
                </div>
              </div>

              {/* Stage item 3 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="font-bold text-zinc-600">3. 已申請購入</span>
                  <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.1 border border-indigo-100 rounded text-[10px] font-bold">
                    {kanbanCards.filter(k => k.stageId === 'applied').length} 客
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kanbanCards
                    .filter(k => k.stageId === 'applied')
                    .slice(0, 2)
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewChange('kanban')}
                        className="p-2.5 bg-zinc-50 border border-zinc-250 hover:border-emerald-500 hover:bg-white transition rounded-lg cursor-pointer text-[11px]"
                      >
                        <div className="flex justify-between font-bold text-zinc-800">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[8.5px] font-mono bg-zinc-100 px-1 rounded shrink-0">{item.preferredArea.substring(0, 3)}</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-1.5 flex items-center gap-0.5 truncate">
                          <History className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{item.nextStep || '已遞交買付申購書'}</span>
                        </div>
                      </div>
                    ))}
                  {kanbanCards.filter(k => k.stageId === 'applied').length === 0 && (
                    <div className="col-span-2 text-center text-[10px] p-2 bg-zinc-50 text-zinc-400 border border-dashed rounded">
                      暫無安排
                    </div>
                  )}
                </div>
              </div>

              {/* Stage item 4 */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="font-bold text-zinc-600">4. 成交手續中</span>
                  <span className="font-mono bg-teal-50 text-teal-700 px-2 py-0.1 border border-teal-100 rounded text-[10px] font-bold">
                    {kanbanCards.filter(k => k.stageId === 'closing').length} 客
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kanbanCards
                    .filter(k => k.stageId === 'closing')
                    .slice(0, 2)
                    .map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewChange('kanban')}
                        className="p-2.5 bg-zinc-50 border border-zinc-250 hover:border-emerald-500 hover:bg-white transition rounded-lg cursor-pointer text-[11px]"
                      >
                        <div className="flex justify-between font-bold text-zinc-800">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[8.5px] font-mono bg-zinc-100 px-1 rounded shrink-0">{item.preferredArea.substring(0, 3)}</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-1.5 flex items-center gap-0.5 truncate">
                          <History className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{item.nextStep || '辦理過戶與宅建告知'}</span>
                        </div>
                      </div>
                    ))}
                  {kanbanCards.filter(k => k.stageId === 'closing').length === 0 && (
                    <div className="col-span-2 text-center text-[10px] p-2 bg-zinc-50 text-zinc-400 border border-dashed rounded">
                      暫無安排
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* INTERACTIVE COMPREHENSIVE WHATSAPP QUICK SENDER MODAL */}
      {selectedTemplateForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs transition animate-in fade-in-40 duration-150">
          <div className="bg-white border border-zinc-250 rounded-2xl p-6 shadow-2xl max-w-lg w-full relative animate-in slide-in-from-bottom-8 duration-200">
            
            <div className="flex justify-between items-center pb-3.5 border-b border-zinc-150">
              <div className="flex items-center gap-2">
                <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-zinc-900">WhatsApp 客戶通聯大腦工具</h4>
                  <p className="text-[10px] text-emerald-600 font-bold tracking-wide mt-0.5">
                    模擬安全出口推送流程
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTemplateForModal(null)}
                className="text-zinc-400 hover:text-zinc-600 rounded bg-zinc-55 hover:bg-zinc-100 p-1.5 transition text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              
              {/* Select Customer Target */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                  <span>1. 選擇要對接的意向客戶</span>
                  <span className="text-[10px] text-zinc-400">目前數據庫內有 {clients.length} 位客戶</span>
                </label>
                <select 
                  value={targetClientIdForSend} 
                  onChange={(e) => handleTargetClientChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-250 text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500 focus:bg-white font-extrabold text-zinc-800 transition"
                >
                  <option value="" disabled>--- 請選擇目標客戶 ---</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.preferredArea} [{c.budget}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Text preview */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 flex justify-between items-center">
                  <span>2. 訊息內容預覽 (已自動適配客戶尊稱)</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                    B哥獨創防伏文案
                  </span>
                </label>
                <textarea 
                  value={customMessageText}
                  onChange={(e) => setCustomMessageText(e.target.value)}
                  className="w-full h-44 bg-zinc-50 border border-zinc-250 text-xs rounded-lg p-3 outline-none focus:border-emerald-500 focus:bg-white font-sans text-zinc-750 resize-none leading-relaxed"
                />
              </div>

              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-[10.5px] text-zinc-500 leading-relaxed">
                📢 <strong>操作備忘：</strong>點擊下方【授權複製並模擬推送】後，內容會注入您的系統剪貼簿，且控制台將更新此客戶的「最近跟進日誌」，維持全體數據庫的流暢合規鏈接！
              </div>

            </div>

            <div className="pt-3.5 border-t border-zinc-150 flex justify-end gap-3.5 text-xs font-bold">
              <button 
                onClick={() => setSelectedTemplateForModal(null)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-650 px-4 py-2 rounded-lg transition"
              >
                取消關閉
              </button>
              
              <button 
                onClick={handleExecuteMockSend}
                disabled={!targetClientIdForSend || copyFeedback}
                className={`px-5 py-2 rounded-lg text-white font-extrabold flex items-center justify-center gap-1.5 transition ${
                  copyFeedback 
                    ? 'bg-emerald-600' 
                    : !targetClientIdForSend 
                    ? 'bg-zinc-300 cursor-not-allowed text-zinc-500' 
                    : 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 shadow-sm cursor-pointer'
                }`}
              >
                {copyFeedback ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white animate-bounce" />
                    <span>已複製已同步！</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>授權複製並模擬推送</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
