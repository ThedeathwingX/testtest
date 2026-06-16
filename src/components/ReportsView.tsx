import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  Users, 
  Activity, 
  CheckCircle, 
  Wallet,
  ArrowUpRight,
  Sparkles,
  PieChart,
  Calendar,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import { Property, ClientProfile, Viewing } from '../types';

interface ReportsViewProps {
  properties: Property[];
  clients: ClientProfile[];
  viewings: Viewing[];
}

export default function ReportsView({ properties, clients, viewings }: ReportsViewProps) {
  // Compute nice metrics
  const totalLeads = clients.length + 122; // Let's keep it anchored with real counts + dummy
  const totalProperties = properties.length;
  
  // Average yield calculation
  const totalGrossYield = properties.reduce((acc, p) => acc + p.yieldGross, 0);
  const avgGrossYield = totalProperties > 0 ? (totalGrossYield / totalProperties).toFixed(2) : '6.4';

  const totalNetYield = properties.reduce((acc, p) => acc + p.yieldNet, 0);
  const avgNetYield = totalProperties > 0 ? (totalNetYield / totalProperties).toFixed(2) : '5.3';

  // Total valuation calculation (fictional mock portfolio sum for style)
  const portfolioSum = 45000000 * 3 + 135000000 + 85000000 + 52000000 + 38000000;
  const portfolioSumMillion = (portfolioSum / 10000).toLocaleString('zh-HK');

  // Selected breakdown tab
  const [activeTab, setActiveTab] = useState<'overview' | 'regions' | 'pipeline'>('overview');

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="bg-white border text-zinc-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 animate-bounce" />
            <span>日本大阪房產・成交與營收統計看板</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            即時透視置業諮詢熱度、大區投報指標對比、跟進漏斗轉化合規報告。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-zinc-50 border p-2 rounded-lg">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span>會計年度：2026/Q2 財政期</span>
        </div>
      </div>

      {/* KPI Stats Panel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between h-28 hover:border-emerald-555 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">當期總跟進客源</span>
              <strong className="text-xl font-bold text-zinc-900 font-mono">{totalLeads} 名</strong>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-750">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>自展銷會後增長 +18.4%</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between h-28 hover:border-emerald-555 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">當前登記案量市值</span>
              <strong className="text-xl font-bold text-zinc-900 font-mono">¥{portfolioSumMillion}萬</strong>
            </div>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>合規已確權優良儲備物業</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between h-28 hover:border-emerald-555 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">均淨回報率 (Net Rate)</span>
              <strong className="text-xl font-bold text-emerald-750 font-mono">{avgNetYield}%</strong>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-750">
            <span>毛收益平均在 {avgGrossYield}% 以上</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between h-28 hover:border-emerald-555 transition">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">帶看與直播轉化率</span>
              <strong className="text-xl font-bold text-zinc-900 font-mono">72.5%</strong>
            </div>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-orange-700">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>宅建講解完成度提升 4.2%</span>
          </div>
        </div>

      </div>

      {/* Navigation block for reports options */}
      <div className="bg-white border p-1 rounded-xl shadow-xs flex select-none max-w-sm font-semibold text-xs text-zinc-650">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 text-center rounded-lg transition ${
            activeTab === 'overview' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'
          }`}
        >
          財政營收總括
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`flex-1 py-1.5 text-center rounded-lg transition ${
            activeTab === 'regions' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'
          }`}
        >
          行政大區熱度
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex-1 py-1.5 text-center rounded-lg transition ${
            activeTab === 'pipeline' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'
          }`}
        >
          CRM 漏斗與轉化
        </button>
      </div>

      {/* Reports Panel Grid depending on active tab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {activeTab === 'overview' && (
          <>
            {/* Visual Chart 1: Revenue Contract Line simulation */}
            <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>2026年上半年 成交規模走勢</span>
                </h3>
                <span className="text-[10px] text-zinc-400">百萬日圓 JPY</span>
              </div>

              {/* Graphic custom SVG Line chart */}
              <div className="relative pt-6">
                <svg className="w-full h-48" viewBox="0 0 500 200" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#f4f4f5" strokeWidth="2" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" strokeWidth="1" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#f4f4f5" strokeWidth="1" />
                  <line x1="0" y1="10" x2="500" y2="10" stroke="#f4f4f5" strokeWidth="1" />

                  {/* Gradient fill */}
                  <path 
                    d="M 50 150 C 130 140, 210 90, 290 85 C 370 80, 450 35, 450 35 L 450 180 L 50 180 Z" 
                    fill="url(#emeraldGrad)" 
                    opacity="0.1" 
                  />
                  
                  {/* Line path */}
                  <path 
                    d="M 50 150 C 130 140, 210 90, 290 85 C 370 80, 450 35, 450 35" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Nodes */}
                  <circle cx="50" cy="150" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="170" cy="115" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="290" cy="85" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                  <circle cx="450" cy="35" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />

                  {/* Node labels */}
                  <text x="50" y="130" fill="#71717a" fontSize="10" fontWeight="bold" textAnchor="middle">¥4,500萬</text>
                  <text x="170" y="95" fill="#71717a" fontSize="10" fontWeight="bold" textAnchor="middle">¥9,200萬</text>
                  <text x="290" y="65" fill="#71717a" fontSize="10" fontWeight="bold" textAnchor="middle">¥1.35億</text>
                  <text x="450" y="15" fill="#047857" fontSize="11" fontWeight="extrabold" textAnchor="middle">¥2.17億 (破紀錄)</text>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X labels */}
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest px-4 pt-1 font-mono">
                  <span>1月</span>
                  <span>2月-3月</span>
                  <span>4月-5月</span>
                  <span>Q2預估(6月尾)</span>
                </div>
              </div>
            </div>

            {/* Visual Chart 2: Client Yield Bins / Budget distribution */}
            <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>置業投資預算區間 買家構成比面</span>
                </h3>
              </div>

              <div className="space-y-4.5 pt-2">
                {[
                  { label: '優化常規級：JPY 3,000萬 - 5,000萬', count: 74, share: 60, color: 'bg-emerald-500' },
                  { label: '精選旗艦級：JPY 5,000萬 - 8,000萬', count: 38, share: 31, color: 'bg-teal-500' },
                  { label: 'VIP 高淨值級：JPY 8,000萬以上', count: 12, share: 9, color: 'bg-amber-500' }
                ].map((bin, i) => (
                  <div key={i} className="space-y-1.5 select-text text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-700">{bin.label}</span>
                      <span className="font-mono font-bold text-zinc-900">{bin.count} 人 ({bin.share}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${bin.color} h-full rounded-full`} style={{ width: `${bin.share}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'regions' && (
          <>
            {/* Visual Chart 3: Region bar graphs */}
            <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  <span>大阪市行政大區  投資熱度(跟進成交案對比)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 text-center">
                {[
                  { region: '大阪市中央區', activeDeals: 58, avgNet: '5.2%', comment: '心齋橋、難波核心', colorText: 'text-emerald-700', bgGrad: 'from-emerald-50 to-emerald-100/50' },
                  { region: '大阪市北區', activeDeals: 32, avgNet: '4.5%', comment: '梅田高新行政區', colorText: 'text-teal-700', bgGrad: 'from-teal-50 to-teal-100/50' },
                  { region: '大阪市浪速區', activeDeals: 24, avgNet: '6.9%', comment: '日本橋、惠美須民宿特區', colorText: 'text-amber-700', bgGrad: 'from-amber-50 to-amber-100/50' },
                  { region: '大阪市天王寺區', activeDeals: 10, avgNet: '7.2%', comment: '谷町靜謐學區', colorText: 'text-zinc-700', bgGrad: 'from-zinc-50 to-zinc-100' }
                ].map((item, i) => (
                  <div key={i} className={`p-4 border border-zinc-150 rounded-xl bg-gradient-to-b ${item.bgGrad} flex flex-col justify-between space-y-3`}>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-zinc-900 leading-none">{item.region}</h4>
                      <p className="text-[10px] text-zinc-500 font-medium leading-tight">{item.comment}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">跟進案數</span>
                      <strong className={`text-xl font-bold font-mono ${item.colorText}`}>{item.activeDeals} 宗</strong>
                    </div>
                    <div className="pt-2 border-t text-[11px] font-semibold text-zinc-650 flex justify-between">
                      <span>均淨利高達</span>
                      <span className="text-zinc-900 font-bold font-mono">{item.avgNet}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'pipeline' && (
          <>
            {/* Visual Chart 4: Funnel conversion */}
            <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>CRM 流程轉化率漏斗分析</span>
                </h3>
              </div>

              {/* Graphical Funnel */}
              <div className="max-w-xl mx-auto space-y-3 pt-6 select-text">
                {[
                  { stage: '1. 初步置業諮詢對接 (FB/展銷熱盤推介)', count: 124, pct: 100, width: 'w-full', bg: 'bg-zinc-900 text-white' },
                  { stage: '2. 意向互動 & 發送精選盤樓書', count: 86, pct: 69, width: 'w-11/12', bg: 'bg-zinc-800 text-zinc-100' },
                  { stage: '3. 視像 Zoom Live 或現地睇樓安排', count: 48, pct: 38, width: 'w-9/12', bg: 'bg-zinc-700 text-zinc-200' },
                  { stage: '4. 取得買付、安排宅建士合規重說講解', count: 22, pct: 17, width: 'w-7/12', bg: 'bg-emerald-600 text-white' },
                  { stage: '5. 雙向簽署買賣契約書，落實收租!', count: 12, pct: 9, width: 'w-5/12', bg: 'bg-emerald-500 text-zinc-950 font-bold' }
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-sans">
                    <div className="w-12 text-right font-mono font-bold text-zinc-500">{row.pct}%</div>
                    <div className={`${row.width} ${row.bg} py-2.5 px-4 rounded-lg shadow-xs flex justify-between items-center`}>
                      <span className="truncate">{row.stage}</span>
                      <strong className="font-mono ml-4 shrink-0">{row.count} 案</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

// Internal little dummy helper to show green bullet indicator
function AlarmIndicator({ className }: { className?: string }) {
  return (
    <span className={`${className} rounded-full bg-emerald-500 inline-block`}></span>
  );
}
