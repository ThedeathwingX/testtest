import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  CircleDollarSign, 
  CalendarDays, 
  AlertOctagon, 
  UserCheck2, 
  Check, 
  Lock,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  History,
  TrendingUp,
  PlusCircle,
  Trash2,
  BookmarkCheck,
  Coins,
  FileCheck2,
  X
} from 'lucide-react';
import { ActiveView, ClientProfile, ClosedDeal } from '../types';

interface ClosingChecklistViewProps {
  onViewChange: (view: ActiveView) => void;
  clients: ClientProfile[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  completedTransactions?: ClosedDeal[];
  onAddCompletedTransaction?: (deal: ClosedDeal) => void;
  onDeleteCompletedTransaction?: (id: string) => void;
}

interface StepItem {
  id: number;
  label: string;
  desc: string;
  status: 'completed' | 'active' | 'blocked' | 'future';
  actionLabel?: string;
}

export default function ClosingChecklistView({ 
  onViewChange, 
  clients, 
  selectedClientId, 
  onSelectClient,
  completedTransactions = [],
  onAddCompletedTransaction,
  onDeleteCompletedTransaction
}: ClosingChecklistViewProps) {

  // We initialize the steps state for clients dynamically
  const getInitialStepsForClient = (clientId: string): StepItem[] => {
    const defaultSteps: StepItem[] = [
      { id: 1, label: '1. 需求確認', desc: '篩選並釐清大阪市中心合規投資之期望意向與置業方向。', status: 'completed' },
      { id: 2, label: '2. 推盤介接', desc: '依據預算，精選發送大阪區域首選優質盤源與樓書。', status: 'completed' },
      { id: 3, label: '3. 視像/現場睇樓', desc: '聯動專員現場視像 live 直播帶看、解析大樓環境配套與完好度。', status: 'completed' },
      { id: 4, label: '4. 議價及意向階段', desc: '協商置業條件，確認免責規則，簽收買方意向委託。', status: 'completed' },
      { id: 5, label: '5. 買付申込書提出', desc: '由本司指派宅建士填寫正式買付意願書，提呈日本賣方進行留盤。', status: 'completed' },
      { id: 6, label: '6. 重要事項告知書收到', desc: '等待並收取日本賣方、司法書士機構寄達之重要事項正式合規調查文本。', status: 'active', actionLabel: 'B哥確認收到賣方寄送文件' },
      { id: 7, label: '7. B哥親自安排宅建士講解', desc: '指派大阪持牌取引士，針對產權、修繕積立金規章和隱加利息進行講解。', status: 'blocked', actionLabel: '即刻預約宅建士進行講解' },
      { id: 8, label: '8. 客戶確認明白條款', desc: '買方深度細閱並完全理會告知書每一章節，簽署確認反饋。', status: 'blocked', actionLabel: '點擊登記客戶明白並核銷' },
      { id: 9, label: '9. 買賣契約用印簽署', desc: '雙方正式簽字並用印於重要事項說明書與買賣契約，歸檔備份。', status: 'future', actionLabel: '完成買賣合同用印登記' },
      { id: 10, label: '10. 尾款及首期安全匯款', desc: '指導客戶依法規把置業尾款/首期匯入日本官方信託交易安全專戶。', status: 'future', actionLabel: '確認首期/尾款安全匯達' },
      { id: 11, label: '11. 所有權移轉及交樓', desc: '司法書士移轉登記簿所有權，交付物業精裝鑰匙。', status: 'future', actionLabel: '登記物權證書移交及拿鑰' },
      { id: 12, label: '12. 售後託管合同簽署', desc: '代理商正式介接日本合規牌照專屬託管物業管理，開始收租回報！', status: 'future', actionLabel: '建立物業託管運營建檔' }
    ];

    if (clientId === 'c2') {
      return defaultSteps.map(s => {
        if (s.id <= 3) return { ...s, status: 'completed' as const };
        if (s.id === 4) return { ...s, status: 'active' as const, actionLabel: '確認簽收買方意向書' };
        if (s.id === 5) return { ...s, status: 'blocked' as const };
        if (s.id > 5) return { ...s, status: 'future' as const, actionLabel: undefined };
        return s;
      });
    }

    if (clientId === 'c3') {
      return defaultSteps.map(s => {
        if (s.id <= 2) return { ...s, status: 'completed' as const };
        if (s.id === 3) return { ...s, status: 'active' as const, actionLabel: '完成現場/Zoom直播帶看' };
        if (s.id === 4) return { ...s, status: 'blocked' as const };
        if (s.id > 4) return { ...s, status: 'future' as const, actionLabel: undefined };
        return s;
      });
    }

    if (clientId === 'c4') {
      return defaultSteps.map(s => {
        if (s.id <= 4) return { ...s, status: 'completed' as const };
        if (s.id === 5) return { ...s, status: 'active' as const, actionLabel: '向日本賣家提出買付申込書' };
        if (s.id === 6) return { ...s, status: 'blocked' as const };
        if (s.id > 6) return { ...s, status: 'future' as const, actionLabel: undefined };
        return s;
      });
    }

    return defaultSteps;
  };

  // Maintain per-client step records in component state
  const [clientSteps, setClientSteps] = useState<Record<string, StepItem[]>>({});

  // Sub-tab selection state inside checklist
  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'archive'>('tracker');

  // Manual entry modal fields
  const [showManualModal, setShowManualModal] = useState(false);
  const [formClientName, setFormClientName] = useState('');
  const [formClientPhone, setFormClientPhone] = useState('');
  const [formPropertyName, setFormPropertyName] = useState('');
  const [formPropertyPrice, setFormPropertyPrice] = useState(42000000);
  const [formYieldNet, setFormYieldNet] = useState(5.8);
  const [formContractDate, setFormContractDate] = useState('2026-06-16');
  const [formAgencyFee, setFormAgencyFee] = useState(1320050);
  const [formJudicialScrivener, setFormJudicialScrivener] = useState('平井登記司法書士機構');
  const [formStatus, setFormStatus] = useState<'已辦理產權轉移' | '民宿託管運營中' | '一般租賃託管中'>('民宿託管運營中');
  const [formNotes, setFormNotes] = useState('');

  // Get currently active client's step progress
  const activeClientId = selectedClientId || (clients[0] ? clients[0].id : '');
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const currentSteps = clientSteps[activeClientId] || getInitialStepsForClient(activeClientId);

  const updateStepsForActiveClient = (updatedSteps: StepItem[]) => {
    setClientSteps({
      ...clientSteps,
      [activeClientId]: updatedSteps
    });
  };

  // Is Step 7 (B哥安排宅建士講解) completed?
  const isStep7Completed = currentSteps[6]?.status === 'completed';

  const handleStepAction = (stepId: number) => {
    const updated = currentSteps.map(step => {
      if (step.id === stepId) {
        return { ...step, status: 'completed' as const };
      }
      // Unlock next step
      if (step.id === stepId + 1) {
        return { ...step, status: 'active' as const };
      }
      return step;
    });

    updateStepsForActiveClient(updated);

    const targetStepName = currentSteps.find(s => s.id === stepId)?.label || '';
    const nextStepName = currentSteps.find(s => s.id === stepId + 1)?.label || '';

    alert(`【成交流程更新】\n已成功確認並登記：【${targetStepName}】！\n下一步驟：【${nextStepName}】已正式解除鎖定，進入跟進狀態。`);
  };

  const handleArchiveLoadedClient = () => {
    if (!activeClient) return;

    const priceEst = activeClient.budget.includes('1.5') 
      ? 120000000 
      : activeClient.budget.includes('8,000') 
      ? 65000000 
      : 42000000;

    const agencyFeeCal = Math.round(priceEst * 0.03 + 60000);

    const newDeal: ClosedDeal = {
      id: 'deal_' + Date.now(),
      clientName: activeClient.name,
      clientPhone: activeClient.phone,
      propertyName: activeClient.preferredArea.split(',')[0] + '特選優質產權投資物業',
      propertyPrice: priceEst,
      propertyArea: activeClient.preferredArea.split(',')[0] || '大阪市中央區',
      yieldNet: 5.8,
      contractDate: new Date().toISOString().split('T')[0],
      agencyFee: agencyFeeCal,
      judicialScrivener: '三井司法書士事務所・平田先生',
      status: '民宿託管運營中',
      notes: `由跟進交易流程十二部曲一鍵快速歸檔。客戶原置業意向：${activeClient.purpose || '大阪防伏置業'}。`
    };

    if (onAddCompletedTransaction) {
      onAddCompletedTransaction(newDeal);
      alert(`🎉 恭喜！已成功的將買家【${activeClient.name}】一鍵封箱，正式歸入「已完成交易資料庫」！`);
      setActiveSubTab('archive');
    }
  };

  const handleManualSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim() || !formPropertyName.trim()) {
      alert('請輸入買家姓名及成交標的名稱！');
      return;
    }

    const newDeal: ClosedDeal = {
      id: 'deal_' + Date.now(),
      clientName: formClientName,
      clientPhone: formClientPhone || '+852 9000 0000',
      propertyName: formPropertyName,
      propertyPrice: Number(formPropertyPrice) || 35000000,
      propertyArea: '大阪市中央區',
      yieldNet: Number(formYieldNet) || 5.5,
      contractDate: formContractDate || '2026-06-16',
      agencyFee: Number(formAgencyFee) || Math.round((Number(formPropertyPrice) || 35000000) * 0.03 + 60000),
      judicialScrivener: formJudicialScrivener || '關西合同司法書士第一支部',
      status: formStatus,
      notes: formNotes || '手動直接錄入已完成成交歷史，備案建檔。'
    };

    if (onAddCompletedTransaction) {
      onAddCompletedTransaction(newDeal);
      setShowManualModal(false);
      
      // Reset form fields
      setFormClientName('');
      setFormClientPhone('');
      setFormPropertyName('');
      setFormPropertyPrice(42000000);
      setFormYieldNet(5.8);
      setFormContractDate('2026-06-16');
      setFormAgencyFee(1320050);
      setFormJudicialScrivener('平井登記司法書士機構');
      setFormStatus('民宿託管運營中');
      setFormNotes('');
      
      alert('已成功登記全新歷史成交案入庫！');
    }
  };

  const deals = completedTransactions || [];
  const totalVolume = deals.reduce((sum, d) => sum + d.propertyPrice, 0);
  const totalCommission = deals.reduce((sum, d) => sum + d.agencyFee, 0);
  const avgYield = deals.length > 0 ? (deals.reduce((sum, d) => sum + d.yieldNet, 0) / deals.length) : 0;

  const formatJPY = (val: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(val);
  };

  const formatHKD = (val: number) => {
    const hkdVal = Math.round(val * 0.051);
    return `HK$${hkdVal.toLocaleString()}`;
  };

  const getBudgetDisplay = (budget: string) => {
    return budget || '¥45,000,000 JPY';
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in-50 duration-250 text-zinc-900">
      
      {/* 1. View Header Tab Selector */}
      <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <UserCheck2 className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>首選置業成交進度 / 歷史資料庫大簿</span>
          </h2>
          <p className="text-xs text-zinc-500">
            記錄客戶置業一站式流程，並為在大阪已完成交易之買家資產託管進行建檔。
          </p>
        </div>

        {/* Sub-tab Switchers Toggle Buttons */}
        <div className="flex bg-zinc-100 p-1 rounded-xl self-stretch md:self-auto shrink-0 select-none border">
          <button
            type="button"
            onClick={() => setActiveSubTab('tracker')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tracker'
                ? 'bg-white text-emerald-800 shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>十二部曲流程追蹤</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab('archive')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'archive'
                ? 'bg-white text-emerald-800 shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>已完成交易資料庫 ({deals.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'tracker' ? (
        // ----------------- SUB-TAB: ACTIVE CLIENT 12-STEP TRACKER -----------------
        activeClient ? (
          <>
            {/* Client Picker Panel */}
            <div className="bg-white border p-4.5 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-zinc-500 shrink-0 select-none">
                  切換追蹤買家個案：
                </span>
                <select
                  value={activeClientId}
                  onChange={(e) => {
                    onSelectClient(e.target.value);
                  }}
                  className="flex-1 sm:flex-initial text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.vipTag} | {c.budget})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-zinc-500 font-semibold select-none flex items-center gap-1">
                <span>當前個案：</span>
                <strong className="text-zinc-800 font-extrabold">{activeClient.name}</strong>
                <span className="text-zinc-300">|</span>
                <span>進度完成率：</span>
                <span className="font-mono text-emerald-650 font-bold">
                  {Math.round((currentSteps.filter(s => s.status === 'completed').length / 12) * 100)}%
                </span>
              </div>
            </div>

            {/* Detailed Transaction Strip */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-1 select-text">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">當前成交案編碼</span>
                  <span className="text-xs font-extrabold text-emerald-700 font-mono flex items-center gap-1.5 uppercase leading-none">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    #TXN-{activeClient.id.toUpperCase()}-2026
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">置業買家姓名</span>
                  <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 leading-none">
                    <User className="w-4 h-4 text-zinc-400" />
                    {activeClient.name} {activeClient.engName ? `(${activeClient.engName})` : ''}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">意向/配對地區</span>
                  <span className="text-xs font-bold text-zinc-850 flex items-center gap-1.5 leading-none truncate" title={activeClient.preferredArea}>
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {activeClient.preferredArea}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">物業成交預算 / 回報級別</span>
                  <span className="text-xs font-bold text-zinc-900 font-mono flex items-center gap-1.5 leading-none">
                    <CircleDollarSign className="w-4 h-4 text-emerald-650" />
                    {getBudgetDisplay(activeClient.budget)}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => onViewChange('clients')}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>查看客戶檔案</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Archiving Strip (Option to instantly file to Completed Transaction Archive) */}
            <div className="bg-emerald-500/5 hover:bg-emerald-500/10 transition border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-text">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-4 h-4 text-emerald-650" />
                  <span>一鍵成交易封箱歸檔 (Direct Archiving)</span>
                </h4>
                <p className="text-[11px] text-zinc-650 leading-relaxed font-semibold">
                  當前個案 <strong>{activeClient.name}</strong> 若已履行簽約、辦理信託或交付物業，您可立刻一鍵把此置業流程存檔、生成一宗交易歷史案件！
                </p>
              </div>

              <button
                type="button"
                onClick={handleArchiveLoadedClient}
                className="bg-emerald-650 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-xs px-4.5 py-2.5 rounded-lg shadow-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>完成此筆交易並一鍵歸檔</span>
              </button>
            </div>

            {/* Conditional Blocker Alert Banner */}
            {!isStep7Completed && (
              <div className="bg-amber-50 border-l-[4px] border-l-amber-500 p-4 rounded-r-xl border border-amber-200/60 flex items-start gap-3 shadow-xs select-text">
                <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <div>
                  <h4 className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    重要合規提醒 (Compliance Blocker Triggered)
                  </h4>
                  <p className="text-zinc-650 text-xs mt-1 leading-relaxed font-semibold">
                    依據日本宅地建物取引業法規定，簽署買賣合約、支付尾款前，<strong>必須由持牌宅地建物取引士（B哥一對一預約）</strong>親自對客戶解讀【重要事項告知書】。否則不予開放「第9步：契約用印」之後續步驟，切切保證閣下置業安全！
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Timeline container card */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest mb-6 border-b pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>規律成交流程 12 部曲 - 進度卡片 </span>
                </span>
                <span className="text-[10.5px] text-zinc-400 font-bold uppercase tracking-wider">
                  完成率：{Math.round((currentSteps.filter(s => s.status === 'completed').length / 12) * 100)}%
                </span>
              </h3>

              {/* Stepper Line and Items */}
              <div className="relative border-l border-zinc-200 ml-5 pl-7 space-y-5">
                {currentSteps.map((step) => {
                  const isCompleted = step.status === 'completed';
                  const isActive = step.status === 'active';
                  const isBlocked = step.status === 'blocked';

                  return (
                    <div key={step.id} className="relative">
                      
                      {/* Circle bullet representation */}
                      <span className="absolute -left-[35px] top-1 z-10">
                        {isCompleted ? (
                          <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 border border-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/10">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : isActive ? (
                          <span className="w-4.5 h-4.5 rounded-full bg-amber-400 border border-amber-400 flex items-center justify-center text-zinc-950 font-bold ring-4 ring-amber-400/20 text-[10.5px]">
                            {step.id}
                          </span>
                        ) : isBlocked ? (
                          <span className="w-4.5 h-4.5 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 ring-2 ring-rose-100" title="待前置任務完成以解鎖">
                            <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="w-4.5 h-4.5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 font-mono text-[9px]">
                            {step.id}
                          </span>
                        )}
                      </span>

                      {/* Step Card styling */}
                      <div className={`p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition duration-200 ${
                        isCompleted 
                          ? 'border-zinc-200 bg-zinc-50/70 opacity-70' 
                          : isActive 
                          ? 'border-emerald-500 bg-emerald-50/10 shadow-sm' 
                          : isBlocked 
                          ? 'border-zinc-150 bg-zinc-100/50 opacity-60' 
                          : 'border-zinc-100 text-zinc-400 opacity-40 bg-white'
                      }`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-bold leading-none ${
                              isCompleted ? 'text-zinc-700' : isActive ? 'text-emerald-800' : 'text-zinc-500'
                            }`}>
                              {step.label}
                            </h4>
                            {isCompleted && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                                已過審
                              </span>
                            )}
                            {isActive && (
                              <span className="text-[9px] bg-amber-400 text-zinc-950 font-extrabold px-1.5 py-0.2 rounded uppercase animate-pulse">
                                當前跟進中
                              </span>
                            )}
                          </div>
                          <p className={`text-[11.5px] leading-relaxed ${
                            isCompleted ? 'text-zinc-400 font-medium' : isActive ? 'text-zinc-650' : 'text-zinc-400'
                          }`}>
                            {step.desc}
                          </p>
                        </div>

                        {/* Micro actions buttons inside current active node */}
                        {isActive && step.actionLabel && (
                          <button
                            type="button"
                            onClick={() => handleStepAction(step.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-extrabold text-[10.5px] px-3.5 py-2 rounded-lg shadow-sm transition whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shrink-0"
                          >
                            {step.actionLabel}
                          </button>
                        )}

                        {/* Blocked message tag */}
                        {isBlocked && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded flex items-center gap-1 uppercase tracking-wide leading-none whitespace-nowrap shrink-0">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                            待前置部曲核銷
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border rounded-xl p-12 text-center text-zinc-400">
            <AlertOctagon className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
            <p className="text-xs">請先在客戶資料庫建立買家置業檔案，方能填入成交流程追縱。</p>
          </div>
        )
      ) : (
        // ----------------- SUB-TAB: COMPLETED TRANSACTIONS DATABASE -----------------
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* A. Statistics Panels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-text">
            
            <div className="bg-white border border-zinc-200 rounded-xl p-4.5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">歷史成交總金額</span>
                <span className="text-[17px] font-black text-zinc-900 block font-mono">{formatJPY(totalVolume)}</span>
                <span className="text-[10px] font-bold text-emerald-700 block">{formatHKD(totalVolume)} (特別匯算)</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4.5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">累計實收佣金 (JPY)</span>
                <span className="text-[17px] font-black text-amber-850 block font-mono">{formatJPY(totalCommission)}</span>
                <span className="text-[10px] font-bold text-zinc-500 block">業績錄入比例: 3% + 6萬律規</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4.5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <UserCheck2 className="w-5 h-5 text-blue-650" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">結案置業客源數</span>
                <span className="text-[18px] font-black text-zinc-900 block font-mono">{deals.length} 位貴賓</span>
                <span className="text-[10px] font-bold text-emerald-700 block">100% 簽妥託管合約</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4.5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">歷史平均實質回報</span>
                <span className="text-[18px] font-black text-purple-950 block font-mono">{avgYield.toFixed(2)} %</span>
                <span className="text-[10px] font-bold text-zinc-500 block">大阪最合規優質收益段</span>
              </div>
            </div>

          </div>

          {/* B. Database Table Card */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden select-text">
            
            <div className="border-b px-5 py-4.5 flex justify-between items-center bg-zinc-50/50 select-none">
              <div>
                <h3 className="text-xs font-black text-zinc-900 tracking-wide uppercase flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>已完成交易歷史存檔與託管大簿 </span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  日本司法書士確權辦理所有權移轉、特區民宿執照及精裝託管的實際登載明細。
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>登錄新歷史成交</span>
              </button>
            </div>

            {deals.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 select-none">
                <FileCheck2 className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-xs font-bold">暫無歷史成交存檔數據。</p>
                <p className="text-[11px] text-zinc-500 mt-1">點擊上方「登錄新歷史成交」或由成交流程「一鍵歸檔」手動載入。</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 text-[10.5px] font-bold text-zinc-400 uppercase border-b select-none">
                    <tr>
                      <th className="px-5 py-3">置業貴賓 (姓名/手機)</th>
                      <th className="px-4 py-3">成交物業及標的名稱</th>
                      <th className="px-4 py-3 text-right">成交價 (JPY)</th>
                      <th className="px-4 py-3 text-right">代理實收佣金</th>
                      <th className="px-4 py-3">對接司法書士 / 簽約日期</th>
                      <th className="px-4 py-3">售後託管狀態</th>
                      <th className="px-5 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                    {deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-zinc-50/50 transition">
                        
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-zinc-900 block">{deal.clientName}</span>
                            <span className="text-[10px] text-zinc-400 font-mono font-medium block">{deal.clientPhone}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 max-w-xs">
                          <div className="space-y-1">
                            <span className="font-extrabold text-zinc-850 block hover:text-emerald-700 transition" title={deal.propertyName}>
                              {deal.propertyName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.2 rounded font-medium">
                              <MapPin className="w-2.5 h-2.5" />
                              {deal.propertyArea}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="space-y-0.5 font-mono">
                            <span className="font-bold text-zinc-900 block">{formatJPY(deal.propertyPrice)}</span>
                            <span className="text-[10.5px] text-emerald-700 font-extrabold block">{formatHKD(deal.propertyPrice)}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="space-y-0.5 font-mono">
                            <span className="font-bold text-amber-850 block">{formatJPY(deal.agencyFee)}</span>
                            <span className="text-[10px] text-purple-650 block">實質回報: {deal.yieldNet}% 淨</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-0.5 text-zinc-500 text-[11px]">
                            <span className="block font-medium text-zinc-700">{deal.judicialScrivener}</span>
                            <span className="block font-mono text-[10.5px] text-zinc-400">{deal.contractDate}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${
                            deal.status === '民宿託管運營中'
                              ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                              : deal.status === '一般租賃託管中'
                              ? 'bg-blue-100/70 text-blue-800 border border-blue-200'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              deal.status === '民宿託管運營中'
                                ? 'bg-emerald-500 animate-pulse'
                                : deal.status === '一般租賃託管中'
                                ? 'bg-blue-500'
                                : 'bg-zinc-400'
                            }`} />
                            {deal.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right select-none">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`確定要將買家【${deal.clientName}】的此宗成交檔案自歷史庫中移除嗎？此舉不會刪除CRM原有客戶資訊。`)) {
                                if (onDeleteCompletedTransaction) onDeleteCompletedTransaction(deal.id);
                              }
                            }}
                            className="text-zinc-300 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition disabled:opacity-50 cursor-pointer inline-flex"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2]" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* General Footer Note */}
            <div className="bg-zinc-50 p-4 border-t text-[10.5px] text-zinc-400 leading-relaxed font-semibold">
              ⚠️ 法律聲明與合規備忘：本島内已完成之不動產交易均受日本《宅地建物取引業法》約束，其代理佣金標準、司法書士登記書副本與民宿365特許執照核對記錄，皆已完成日本金融監管署與大阪市役所雙重備案存檔。
            </div>

          </div>

        </div>
      )}

      {/* ----------------- DIALOG MODAL: MANUAL COMPLETE DEAL FORM ----------------- */}
      {showManualModal && (
        <div className="fixed inset-0 bg-zinc-950/45 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-text overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-zinc-900 text-white flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>登錄手動已成交或歷史交易案件</span>
                </h3>
                <p className="text-[10px] text-zinc-300">
                  為以往已售結案、或外部帶帶睇樓交接已結之項目補錄建檔。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleManualSubmitDeal} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    買家姓名 * (Client Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 黃女士"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    聯絡手機 (Phone Details)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: +852 9888 2212"
                    value={formClientPhone}
                    onChange={(e) => setFormClientPhone(e.target.value)}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                  成交標的 (物業全名/房型) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 中央區心齋橋南5分鐘・高層兩聯套房民宿"
                  value={formPropertyName}
                  onChange={(e) => setFormPropertyName(e.target.value)}
                  className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    成交金額 (JPY 元) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPropertyPrice}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setFormPropertyPrice(p);
                      // Auto calculate standard 3% + 6萬 JPY agency fee for ease
                      setFormAgencyFee(Math.round(p * 0.03 + 60000));
                    }}
                    className="w-full text-xs font-bold text-zinc-850 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    實收代理佣金 (JPY)
                  </label>
                  <input
                    type="number"
                    required
                    value={formAgencyFee}
                    onChange={(e) => setFormAgencyFee(Number(e.target.value))}
                    className="w-full text-xs font-bold text-zinc-850 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    實際實質回報率 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formYieldNet}
                    onChange={(e) => setFormYieldNet(Number(e.target.value))}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    簽定契約用印日
                  </label>
                  <input
                    type="date"
                    required
                    value={formContractDate}
                    onChange={(e) => setFormContractDate(e.target.value)}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    售後託管形式
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
                  >
                    <option value="民宿託管運營中">民宿託管運營中</option>
                    <option value="一般租賃託管中">一般租賃託管中</option>
                    <option value="已辦理產權轉移">僅代辦確權過戶</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                    合作司法書士 (Scrivener)
                  </label>
                  <input
                    type="text"
                    required
                    value={formJudicialScrivener}
                    onChange={(e) => setFormJudicialScrivener(e.target.value)}
                    className="w-full text-xs font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                  成交備註及特別條款 (以備後續回租對帳之用)
                </label>
                <textarea
                  rows={2}
                  placeholder="請填入諸如委託回租代理、租期、代扣在日源泉徵收稅詳情等..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 rounded-lg p-2.5 outline-none focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t select-none">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition shadow-xs cursor-pointer"
                >
                  登記並入歷史庫
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
