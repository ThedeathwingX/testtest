import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  UserPlus, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Mail, 
  Phone, 
  Check, 
  Tag, 
  ShieldAlert,
  Flame,
  CheckCircle,
  FolderLock,
  Printer
} from 'lucide-react';
import { ClientProfile, FollowUpNote, ClosedDeal, Property, ClientRecommendation } from '../types';
import ClientDetailView from './ClientDetailView';
import BatchExportModal from './BatchExportModal';

interface ClientsViewProps {
  clients: ClientProfile[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onUpdateClients: (updatedClients: ClientProfile[]) => void;
  completedTransactions?: ClosedDeal[];
  onDeleteCompletedTransaction?: (id: string) => void;
  recommendations?: ClientRecommendation[];
  properties?: Property[];
  onAddRecommendation?: (newRec: ClientRecommendation) => void;
  onUpdateRecommendationStatus?: (id: string, status: ClientRecommendation['status']) => void;
  onDeleteRecommendation?: (id: string) => void;
}

export default function ClientsView({ 
  clients, 
  selectedClientId, 
  onSelectClient, 
  onUpdateClients,
  completedTransactions = [],
  onDeleteCompletedTransaction,
  recommendations = [],
  properties = [],
  onAddRecommendation,
  onUpdateRecommendationStatus,
  onDeleteRecommendation
}: ClientsViewProps) {
  
  const [localSearch, setLocalSearch] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('All');
  const [heatFilter, setHeatFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Form Field States
  const [newName, setNewName] = useState('');
  const [newEngName, setNewEngName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVipTag, setNewVipTag] = useState<'VIP 投資者' | '精選買家' | '常規客戶'>('常規客戶');
  const [newHeatTag, setNewHeatTag] = useState<'A級熱度' | 'B級熱度' | 'C級熱度'>('B級熱度');
  const [newBudget, setNewBudget] = useState('JPY 3,000萬 - 5,000萬');
  const [newArea, setNewArea] = useState('大阪市中央區');
  const [newPropType, setNewPropType] = useState('一戶建');
  const [newPurpose, setNewPurpose] = useState('投資收租');
  const [newFundingPower, setNewFundingPower] = useState('現金買家');
  const [newDealStatus, setNewDealStatus] = useState('意向排查中');
  const [initialInquiry, setInitialInquiry] = useState('');

  // Handle Note Update for a particular client
  const handleUpdateNotes = (updatedNotes: FollowUpNote[]) => {
    const updated = clients.map(c => c.id === selectedClientId ? { ...c, followUpNotes: updatedNotes } : c);
    onUpdateClients(updated);
  };

  // Handle Client Add
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('請填寫客戶姓名與聯絡電話！');
      return;
    }

    const newClientId = 'c_' + Date.now();
    const mockAvatar = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    ][Math.floor(Math.random() * 4)];

    const notes: FollowUpNote[] = [];
    if (initialInquiry.trim()) {
      notes.push({
        id: 'note_init_' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'WhatsApp',
        question: initialInquiry,
        answer: '已收悉置業意向。B哥已第一時間跟進，安排提供日本合規一戶建/公寓首選清單。',
        nextStep: '加微信 or WhatsApp即時發送精選大阪筍盤手冊。'
      });
    }

    const newClient: ClientProfile = {
      id: newClientId,
      name: newName,
      engName: newEngName,
      phone: newPhone,
      email: newEmail || 'no-email@example.com',
      vipTag: newVipTag,
      heatTag: newHeatTag,
      budget: newBudget,
      preferredArea: newArea,
      propertyType: newPropType,
      purpose: newPurpose,
      fundingPower: newFundingPower,
      dealStatus: newDealStatus,
      avatarUrl: mockAvatar,
      followUpNotes: notes
    };

    onUpdateClients([newClient, ...clients]);
    onSelectClient(newClientId);
    setShowAddForm(false);

    // Reset Form fields
    setNewName('');
    setNewEngName('');
    setNewPhone('');
    setNewEmail('');
    setNewDealStatus('意向排查中');
    setInitialInquiry('');
    alert(`【客戶資料登記成功】\n${newName} 先生/女士 已成功錄入置業合規跟進檔案！`);
  };

  // Find currently active client safely
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Filtering Logic
  const filteredClients = clients.filter(c => {
    // 1. Text Search query
    const matchText = 
      c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      (c.engName && c.engName.toLowerCase().includes(localSearch.toLowerCase())) ||
      c.phone.includes(localSearch) ||
      c.email.toLowerCase().includes(localSearch.toLowerCase());
    
    // 2. VIP Tag Filter
    const matchVip = vipFilter === 'All' || c.vipTag === vipFilter;

    // 3. Heat Tag Filter
    const matchHeat = heatFilter === 'All' || c.heatTag === heatFilter;

    return matchText && matchVip && matchHeat;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Area and Metric Topbar */}
      <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>日本大阪房產代理・置業客戶資料庫</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            合規建檔、全流程意向追蹤，為每位海外置業買家配對最乾淨的資產，杜絕伏盤。
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>批量匯出成合約摘要 (PDF)</span>
          </button>

          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
            className="bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4" />
                <span>取消建檔</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>手動錄入新置業大客</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Column: Filters and Client List (col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm space-y-4">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="搜尋買家姓名 / 電話 / 郵箱..."
              className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Filters Block */}
          <div className="space-y-3 pt-1 border-t border-zinc-100">
            {/* VIP Tags filter group */}
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">置業標籤層級</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['All', 'VIP 投資者', '精選買家', '常規客戶'].map((vip) => (
                  <button
                    key={vip}
                    onClick={() => setVipFilter(vip)}
                    className={`px-2 py-1 text-[10px] transition rounded font-bold border ${
                      vipFilter === vip 
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {vip === 'All' ? '全部' : vip}
                  </button>
                ))}
              </div>
            </div>

            {/* Heat Tag filter group */}
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">跟進熱度分區</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['All', 'A級熱度', 'B級熱度', 'C級熱度'].map((heat) => (
                  <button
                    key={heat}
                    onClick={() => setHeatFilter(heat)}
                    className={`px-2 py-1 text-[10px] transition rounded font-bold border ${
                      heatFilter === heat 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {heat === 'All' ? '全部' : heat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client List */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 max-h-[460px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider pb-1">
              <span>現有檔案 ({filteredClients.length} 人)</span>
              <span>選中即看詳情</span>
            </div>

            {filteredClients.length === 0 ? (
              <div className="text-center py-8 bg-zinc-50 border border-dashed rounded-lg">
                <ShieldAlert className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
                <p className="text-zinc-500 text-xs">無合乎篩選條件的備選客戶</p>
              </div>
            ) : (
              filteredClients.map((c) => {
                const isSelected = c.id === selectedClientId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectClient(c.id);
                      if (showAddForm) setShowAddForm(false);
                    }}
                    className={`p-3.5 rounded-xl border transition duration-150 cursor-pointer flex gap-3 relative ${
                      isSelected 
                        ? 'bg-emerald-50/75 border-emerald-500 shadow-xs' 
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                          <span>{c.name}</span>
                          {c.engName && <span className="text-zinc-400 text-[10px] font-normal">({c.engName})</span>}
                        </h4>
                        
                        <div className="flex gap-1">
                          <span className={`text-[8px] font-bold px-1 rounded ${
                            c.heatTag === 'A級熱度' 
                              ? 'bg-rose-100 text-rose-800' 
                              : c.heatTag === 'B級熱度'
                              ? 'bg-amber-150 text-amber-800'
                              : 'bg-zinc-100 text-zinc-650'
                          }`}>
                            {c.heatTag}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-500 font-medium font-mono">{c.phone}</p>
                      
                      <div className="flex justify-between items-center text-[9px] pt-1 border-t border-dotted border-zinc-150 gap-1">
                        <span className="text-zinc-[650] font-bold bg-zinc-100 px-1.5 py-0.5 rounded uppercase shrink-0">
                          {c.vipTag}
                        </span>
                        <span className="text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded truncate" title={c.dealStatus || '意向排查中'}>
                          ⚡️ {c.dealStatus || '意向排查中'}
                        </span>
                        <strong className="text-emerald-700 font-mono shrink-0">{c.budget}</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* Right Side Column: Detail View or Form UI (col-span-8) */}
        <div className="lg:col-span-8">
          {showAddForm ? (
            /* ADD NEW CLIENT FORM DESIGN */
            <form onSubmit={handleAddClientSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-6 animate-in slide-in-from-right duration-150">
              
              <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>海外置業客戶與意向入網備份</span>
                  </h3>
                  <p className="text-[10.5px] text-zinc-400 mt-1">
                    手動建檔將與「睇樓、配對、交易成交流程欄」全棧串聯。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded bg-zinc-105 hover:bg-zinc-200 text-zinc-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Grid sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 flex items-center gap-1">
                    <span>1. 買家中文姓名</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. 張經理"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 2. Eng Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">2. 英文稱呼 / 拼音</label>
                  <input
                    type="text"
                    value={newEngName}
                    onChange={(e) => setNewEngName(e.target.value)}
                    placeholder="e.g. Mr. Zhang"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 3. Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 flex items-center gap-1">
                    <span>3. 客戶極速通聯電話</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +852 9222 3333 或微信號"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 4. Email */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">4. 電子郵件信箱</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. owner@example.com"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 5. VIP TAG */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">5. 海外置業群組歸類</label>
                  <select
                    value={newVipTag}
                    onChange={(e) => setNewVipTag(e.target.value as any)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="VIP 投資者">VIP 投資者 (高能大戶)</option>
                    <option value="精選買家">精選買家 (意向明確)</option>
                    <option value="常規客戶">常規客戶 (剛需初探)</option>
                  </select>
                </div>

                {/* 6. HEAT TAG */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">6. 跟進活躍度標籤</label>
                  <select
                    value={newHeatTag}
                    onChange={(e) => setNewHeatTag(e.target.value as any)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="A級熱度">A級熱度 (下週需聯絡)</option>
                    <option value="B級熱度">B級熱度 (常規推盤物色)</option>
                    <option value="C級熱度">C級熱度 (僅諮詢/長線觀望)</option>
                  </select>
                </div>

                {/* 6.5. DEAL STATUS */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 flex items-center gap-1.5 text-emerald-800">
                    <TrendingUp className="w-4 h-4" />
                    <span>當前交易及成交狀態</span>
                  </label>
                  <select
                    value={newDealStatus}
                    onChange={(e) => setNewDealStatus(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none font-bold"
                  >
                    <option value="意向排查中">跟進：1. 意向排查預熱</option>
                    <option value="視像睇樓中">跟進：2. 視像現場帶看</option>
                    <option value="買付書提出">跟進：3. 買付申込書提出</option>
                    <option value="重要事項講解">流程：4. 宅建士特別講解</option>
                    <option value="雙方簽約中">流程：5. 雙方契約用印</option>
                    <option value="安全款付中">流程：6. 首期/尾款安全匯付</option>
                    <option value="產權已過户">流程：7. 司法書士正式過户</option>
                    <option value="託管及收租">售後：8. 託管高能收租中</option>
                  </select>
                </div>

                {/* 7. Budget */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">7. 客戶投資總預算 (Budget)</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. JPY 5,000萬 - 8,000萬"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none font-mono font-bold"
                  />
                </div>

                {/* 8. Preferred Area */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">8. 意向地區 (Preferred Area)</label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. 大阪市中央區, 梅田"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 9. Property Type */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">9. 物業期望類型 (Type)</label>
                  <input
                    type="text"
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value)}
                    placeholder="e.g. 全棟收租, 一戶建, 新建套房"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 10. Purpose */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700">10. 海外安家/置業主要目的</label>
                  <input
                    type="text"
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    placeholder="e.g. 長租收租 / 民宿特權經營 / 度假別墅"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* 11. Funding Power */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-zinc-700">11. 備付金及實力核實 (Funding Ability)</label>
                  <input
                    type="text"
                    value={newFundingPower}
                    onChange={(e) => setNewFundingPower(e.target.value)}
                    placeholder="e.g. 全款現金買家 / 自備四成首期、在日辦理住宅按揭"
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none font-semibold text-emerald-800"
                  />
                </div>

                {/* 12. Initial Follow-up */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-rose-800 flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-lg py-1 px-2.5">
                    <Sparkles className="w-4 h-4 text-rose-600 animate-spin" />
                    <span>錄入此客時，一併歸檔的最初一筆諮詢對手紀錄 (可空)</span>
                  </label>
                  <textarea
                    value={initialInquiry}
                    onChange={(e) => setInitialInquiry(e.target.value)}
                    placeholder="例如：提問日本一戶建重建法規下「接道義務」如果不足2米時，要如何合規向政府申請再建築許可？"
                    className="w-full h-20 border border-zinc-200 bg-zinc-50 rounded-lg p-2.5 focus:bg-white focus:border-emerald-500 outline-none font-sans resize-none"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold text-xs h-9 px-4 rounded-lg transition shrink-0"
                >
                  放棄返回
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-extrabold text-xs h-9 px-6 rounded-lg shadow-sm transition shrink-0 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>合規完成歸檔、建立買家卡</span>
                </button>
              </div>

            </form>
          ) : (
            /* ACTIVE CLIENT DETAIL LAYOUT */
            activeClient ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 text-zinc-500 select-text">
                  <FolderLock className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10.5px]">您正在審視買家：<strong className="text-zinc-800 font-extrabold">{activeClient.name} ({activeClient.engName || '無'})</strong> — 置業合規跟進檔案。</span>
                </div>
                <div key={activeClient.id}>
                  <ClientDetailView 
                    client={activeClient}
                    onUpdateClientNotes={handleUpdateNotes}
                    onUpdateClientProfile={(updatedClient) => {
                      onUpdateClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
                    }}
                    onDeleteClient={(clientId) => {
                      const afterDelete = clients.filter(c => c.id !== clientId);
                      onUpdateClients(afterDelete);
                      if (afterDelete.length > 0) {
                        onSelectClient(afterDelete[0].id);
                      }
                    }}
                    completedTransactions={completedTransactions}
                    onDeleteCompletedTransaction={onDeleteCompletedTransaction}
                    recommendations={recommendations}
                    properties={properties}
                    onAddRecommendation={onAddRecommendation}
                    onUpdateRecommendationStatus={onUpdateRecommendationStatus}
                    onDeleteRecommendation={onDeleteRecommendation}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white border rounded-xl p-12 text-center text-zinc-400">
                <Users className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
                <p className="text-xs">未有任何已註冊之客戶，請點擊左側或上方錄入大客。</p>
              </div>
            )
          )}
        </div>

      </div>

      <BatchExportModal 
        show={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        clients={clients} 
      />

    </div>
  );
}
