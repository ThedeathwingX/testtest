import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  Sparkles, 
  Filter, 
  MapPin, 
  Percent, 
  Trash2, 
  Share2, 
  CheckCircle, 
  FolderHeart,
  MessageSquare,
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { ClientProfile, Property, ClientRecommendation } from '../types';

interface RecommendedClientsViewProps {
  clients: ClientProfile[];
  properties: Property[];
  recommendations: ClientRecommendation[];
  onAddRecommendation: (newRec: ClientRecommendation) => void;
  onUpdateRecommendationStatus: (id: string, status: '已送達 / 考慮中' | '感興趣 / 預約帶看' | '高意向 / 準備買付' | '客戶婉拒') => void;
  onDeleteRecommendation: (id: string) => void;
  onNavigateToMatching?: (clientId: string) => void;
}

export default function RecommendedClientsView({
  clients,
  properties,
  recommendations,
  onAddRecommendation,
  onUpdateRecommendationStatus,
  onDeleteRecommendation,
  onNavigateToMatching
}: RecommendedClientsViewProps) {
  
  // Search and status filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form Drawer state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formClientId, setFormClientId] = useState(clients[0]?.id || '');
  const [formPropertyId, setFormPropertyId] = useState(properties[0]?.id || '');
  const [formStatus, setFormStatus] = useState<'已送達 / 考慮中' | '感興趣 / 預約帶看' | '高意向 / 準備買付' | '客戶婉拒'>('已送達 / 考慮中');
  const [formNotes, setFormNotes] = useState('');

  // Handle adding recommendation
  const handleCreateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientId || !formPropertyId) {
      alert('請先選取客戶及推薦之日本物業！');
      return;
    }

    const selectedClient = clients.find(c => c.id === formClientId);
    const selectedProp = properties.find(p => p.id === formPropertyId);

    if (!selectedClient || !selectedProp) {
      alert('選取的客戶或物業資料無效！');
      return;
    }

    const newRec: ClientRecommendation = {
      id: `rec_${Date.now()}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      propertyId: selectedProp.id,
      propertyName: selectedProp.name,
      propertyPrice: selectedProp.price,
      propertyYieldNet: selectedProp.yieldNet,
      propertyArea: selectedProp.area,
      recommendedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: formStatus,
      notes: formNotes.trim() || '已一鍵配對並推薦客戶。'
    };

    onAddRecommendation(newRec);
    setFormNotes('');
    setShowAddForm(false);
    alert(`【推介記錄新增成功】\n已將「${selectedProp.name}」成功配對並推薦予客戶「${selectedClient.name}」！`);
  };

  // Filter list
  const filteredRecs = recommendations.filter(rec => {
    const matchesSearch = 
      rec.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rec.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.propertyArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const copyRecommendationText = (rec: ClientRecommendation) => {
    const formattedPrice = (rec.propertyPrice / 10000).toLocaleString('zh-HK');
    const approxHKD = Math.round(rec.propertyPrice * 0.052 / 10000);

    const text = `【B哥精選推介：大阪優質物業回饋】\n尊敬的 ${rec.clientName} 閣下：\n\n專屬團隊特別為您留意的這套物業，極之契合您的置業配置喜好！\n\n🏠 物件名稱：${rec.propertyName}\n📍 區域：${rec.propertyArea}\n💰 售價：¥${formattedPrice}萬日圓 (約港幣 HK$ ${approxHKD}萬)\n📈 預估淨年收益率：${rec.propertyYieldNet}% (Net)\n\n💡 推薦理由及分析：${rec.notes}\n\n*產權書簿完備，誠實透明。可為您即刻排程下週視像 / 現場帶看講解！`;
    
    navigator.clipboard.writeText(text);
    alert(`【推介話術已複製到剪貼簿】\n可立即貼上至與 [${rec.clientName}] 的 WhatsApp 對話中發送！`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>日本大阪房產・已推介過的客戶資料庫</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            即時追蹤哪些大戶已發送推薦、意向反饋如何、並一鍵調度 WhatsApp 連續意向探查對話。
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            // Pre-select first values if forms show
            if (clients.length > 0) setFormClientId(clients[0].id);
            if (properties.length > 0) setFormPropertyId(properties[0].id);
          }}
          className="bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              <span>關閉視窗</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>登錄新規物業推介案</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Stats block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-xl p-4 shadow-xs flex justify-between items-center h-22">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">累計推介人次</span>
            <strong className="text-xl font-bold text-zinc-900 font-mono">{recommendations.length} 次</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-650">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-xs flex justify-between items-center h-22">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">高意向 / 準備買付</span>
            <strong className="text-xl font-bold text-emerald-700 font-mono">
              {recommendations.filter(r => r.status === '高意向 / 準備買付').length} 戶
            </strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-xs flex justify-between items-center h-22">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">考慮中 / 已預約帶看</span>
            <strong className="text-xl font-bold text-teal-700 font-mono">
              {recommendations.filter(r => r.status === '感興趣 / 預約帶看' || r.status === '已送達 / 考慮中').length} 戶
            </strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-700">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-xs flex justify-between items-center h-22">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">推介成交及帶看率</span>
            <strong className="text-xl font-bold text-zinc-900 font-mono">68.4%</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* New record form overlay drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateRecommendation} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-200">
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-bold text-zinc-900 text-xs tracking-wider flex items-center gap-2 uppercase">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>發起並登錄全新置業推介個案</span>
            </h3>
            <span className="text-[10px] text-zinc-400">登錄後可即時生成對話範式並同步跟進</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* Pick Client */}
            <div className="space-y-1.5 col-span-1">
              <label className="font-bold text-zinc-700">1. 選取意向投資買家 *</label>
              <select
                value={formClientId}
                onChange={e => setFormClientId(e.target.value)}
                className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2.5 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.vipTag} | {c.budget})</option>
                ))}
              </select>
            </div>

            {/* Pick Property */}
            <div className="space-y-1.5 col-span-1">
              <label className="font-bold text-zinc-700">2. 選取要推薦的大阪物件 *</label>
              <select
                value={formPropertyId}
                onChange={e => setFormPropertyId(e.target.value)}
                className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2.5 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>({p.area}) {p.name} - ¥{(p.price/10000).toLocaleString('zh-HK')}萬 - Net {p.yieldNet}%</option>
                ))}
              </select>
            </div>

            {/* Pick Status */}
            <div className="space-y-1.5 col-span-1">
              <label className="font-bold text-zinc-700">3. 推薦最新反饋狀態 *</label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as any)}
                className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2.5 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer font-bold text-emerald-800"
              >
                <option value="已送達 / 考慮中">已送達 / 考慮中</option>
                <option value="感興趣 / 預約帶看">感興趣 / 預約帶看</option>
                <option value="高意向 / 準備買付">高意向 / 準備買付</option>
                <option value="客戶婉拒">客戶婉拒 (更換盤源)</option>
              </select>
            </div>

            {/* Recommend notes */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="font-bold text-zinc-700 block">4. 推介理由與專屬筆記摘要 (將融合於 WhatsApp 推薦範式中)</label>
              <textarea
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                placeholder="例如：物業地段近地鐵站步行3分鐘，實際利潤達到5.1%，十分貼合您的預算，且大樓剛完成外牆修繕，無額外追繳款費用風險..."
                className="w-full h-20 border border-zinc-200 bg-zinc-50 rounded-lg p-2.5 focus:bg-white focus:border-emerald-500 outline-none resize-none"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button 
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-500 rounded-lg cursor-pointer"
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              登錄推介記錄
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controller bar */}
      <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs flex flex-col sm:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input 
            type="text"
            placeholder="搜尋客戶姓名、推薦之日本樓宇名稱、地址、或備忘筆記..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-xl pl-10 pr-4 py-3 bg-zinc-100/30 outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-1.5 shrink-0 select-none overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'All', label: '全部推介' },
            { id: '已送達 / 考慮中', label: '考慮中' },
            { id: '感興趣 / 預約帶看', label: '帶看安排' },
            { id: '高意向 / 準備買付', label: '準備買付' },
            { id: '客戶婉拒', label: '已婉拒' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition whitespace-nowrap cursor-pointer ${
                statusFilter === status.id
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                  : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

      </div>

      {/* List content table/cards */}
      {filteredRecs.length === 0 ? (
        <div className="bg-white border rounded-xl p-16 text-center text-zinc-400 space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-zinc-350" />
          <h4 className="text-zinc-700 text-xs font-bold">沒有檢索到符合條件的客戶推介記錄</h4>
          <p className="text-[11px] max-w-sm mx-auto">清除搜尋框內容，或切換篩選指標，您也可以在上方點擊「登錄新規物業推介案」手動建檔。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map(rec => {
            const approxPriceHKD = Math.round(rec.propertyPrice * 0.052 / 10000);
            
            // Dynamic theme for status
            let badgeStyle = "bg-zinc-100 text-zinc-700 border-zinc-200";
            if (rec.status === '高意向 / 準備買付') badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
            else if (rec.status === '感興趣 / 預約帶看') badgeStyle = "bg-teal-50 text-teal-700 border-teal-200";
            else if (rec.status === '已送達 / 考慮中') badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
            else if (rec.status === '客戶婉拒') badgeStyle = "bg-zinc-100 text-zinc-500 border-zinc-200 line-through opacity-70";

            return (
              <div 
                key={rec.id} 
                className="bg-white rounded-xl border border-zinc-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
              >
                {/* Client and Status Badge */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      {rec.clientName.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-zinc-900">{rec.clientName}</span>
                        <span className="text-[10px] text-zinc-400 font-medium font-mono">{rec.clientPhone}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        推介於：{rec.recommendedDate}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                    {rec.status}
                  </span>
                </div>

                {/* Recommended Property Summary card */}
                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-150 space-y-2 select-text">
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-200 font-extrabold text-[9px] text-zinc-700 px-1.5 py-0.2 rounded uppercase">
                      日本屋苑
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 truncate" title={rec.propertyName}>
                      {rec.propertyName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10.5px] leading-relaxed pt-1 border-t border-dotted border-zinc-200">
                    <div>
                      <span className="text-zinc-400 block font-medium">分區方位</span>
                      <strong className="text-zinc-700 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {rec.propertyArea}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">物業售價</span>
                      <strong className="text-zinc-800 font-mono font-bold">
                        ¥{(rec.propertyPrice/10000).toLocaleString('zh-HK')} 萬 JPY
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">淨回報率</span>
                      <strong className="text-emerald-700 font-mono font-bold">
                        Net {rec.propertyYieldNet}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Recommendation notes */}
                <p className="text-[11.5px] text-zinc-650 leading-relaxed bg-emerald-50/20 p-2.5 rounded-lg border border-dashed border-emerald-150 select-text">
                  <strong className="text-emerald-800 block text-[10.5px] font-bold mb-0.5">💬 推薦理由與客戶反饋：</strong>
                  {rec.notes}
                </p>

                {/* Operations bar */}
                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 gap-4">
                  
                  {/* Status selector directly here */}
                  <div className="flex items-center gap-1 text-[10.5px]">
                    <span className="text-zinc-400 font-medium">狀態更迭:</span>
                    <select
                      value={rec.status}
                      onChange={(e) => onUpdateRecommendationStatus(rec.id, e.target.value as any)}
                      className="border border-zinc-200 bg-zinc-50 rounded p-1 text-[10px] font-bold text-zinc-700 outline-none hover:bg-white transition cursor-pointer"
                    >
                      <option value="已送達 / 考慮中">考慮中</option>
                      <option value="感興趣 / 預約帶看">帶看日程</option>
                      <option value="高意向 / 準備買付">準備買付</option>
                      <option value="客戶婉拒">已婉拒</option>
                    </select>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    
                    {/* Delete Rec */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`【警示】您是否確認刪除此項為 [${rec.clientName}] 備份的物業推介跟進記錄？`)) {
                          onDeleteRecommendation(rec.id);
                        }
                      }}
                      className="bg-zinc-50 hover:bg-red-50 hover:text-red-600 font-bold border border-zinc-200 hover:border-red-200 p-2 text-zinc-400 rounded-lg transition"
                      title="刪除推介"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* WhatsApp copy */}
                    <button
                      type="button"
                      onClick={() => copyRecommendationText(rec)}
                      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-bold text-[10.5px] px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>發送客源</span>
                    </button>
                    
                    {onNavigateToMatching && (
                      <button
                        type="button"
                        onClick={() => onNavigateToMatching(rec.clientId)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[10.5px] px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer"
                        title="查看該客戶的 CRM 置業跟進卡"
                      >
                        客戶檔案
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
