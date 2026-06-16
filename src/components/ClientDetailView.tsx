import React, { useState } from 'react';
import { 
  PieChart, 
  Flame, 
  MessageCircle, 
  Mail, 
  Plus, 
  Save, 
  Phone, 
  Users, 
  ArrowRight,
  ClipboardList,
  Building,
  HardHat,
  FileCheck2,
  CalendarDays,
  Zap,
  RefreshCw,
  CheckCircle2,
  Settings,
  Trash2,
  X
} from 'lucide-react';
import { ClientProfile, FollowUpNote } from '../types';

interface ClientDetailViewProps {
  client: ClientProfile;
  onUpdateClientNotes: (updatedNotes: FollowUpNote[]) => void;
  onUpdateClientProfile?: (updatedClient: ClientProfile) => void;
  onDeleteClient?: (id: string) => void;
}

type SubTab = 'notes' | 'properties' | 'viewings' | 'cases' | 'documents';

export default function ClientDetailView({ 
  client, 
  onUpdateClientNotes,
  onUpdateClientProfile,
  onDeleteClient
}: ClientDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('notes');
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'WhatsApp' | 'Phone' | 'Meeting'>('WhatsApp');
  const [nextStepText, setNextStepText] = useState('');
  const [answerText, setAnswerText] = useState('');

  const [syncedIds, setSyncedIds] = useState<string[]>([]);
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(client.name);
  const [editEngName, setEditEngName] = useState(client.engName || '');
  const [editPhone, setEditPhone] = useState(client.phone);
  const [editEmail, setEditEmail] = useState(client.email);
  const [editVipTag, setEditVipTag] = useState(client.vipTag);
  const [editHeatTag, setEditHeatTag] = useState(client.heatTag);
  const [editBudget, setEditBudget] = useState(client.budget);
  const [editPreferredArea, setEditPreferredArea] = useState(client.preferredArea);
  const [editPropertyType, setEditPropertyType] = useState(client.propertyType);
  const [editPurpose, setEditPurpose] = useState(client.purpose);
  const [editFundingPower, setEditFundingPower] = useState(client.fundingPower);

  // Open Edit Modal and load current state
  const openEditModal = () => {
    setEditName(client.name);
    setEditEngName(client.engName || '');
    setEditPhone(client.phone);
    setEditEmail(client.email);
    setEditVipTag(client.vipTag);
    setEditHeatTag(client.heatTag);
    setEditBudget(client.budget);
    setEditPreferredArea(client.preferredArea);
    setEditPropertyType(client.propertyType);
    setEditPurpose(client.purpose);
    setEditFundingPower(client.fundingPower);
    setIsEditingProfile(true);
  };

  // Save updated profile
  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) {
      alert('請填寫姓名及聯絡電話！');
      return;
    }

    if (onUpdateClientProfile) {
      const updatedClient: ClientProfile = {
        ...client,
        name: editName,
        engName: editEngName,
        phone: editPhone,
        email: editEmail,
        vipTag: editVipTag,
        heatTag: editHeatTag,
        budget: editBudget,
        preferredArea: editPreferredArea,
        propertyType: editPropertyType,
        purpose: editPurpose,
        fundingPower: editFundingPower
      };
      onUpdateClientProfile(updatedClient);
      setIsEditingProfile(false);
      alert(`【買家基本資料更新成功】\n客戶「${editName}」置業跟進檔案已更新！`);
    } else {
      alert('無法更新檔案，請確認主視窗功能綁定。');
    }
  };

  // Delete client profile
  const handleDeleteAction = () => {
    const doubleConfirm = confirm(`🚨【重大警告】🚨\n您確定要刪除客戶「${client.name}」的所有在日本置業跟進案與歷史諮詢通訊紀錄嗎？\n此操作會永久清除該客戶資料庫，且不可還原！`);
    if (doubleConfirm) {
      if (onDeleteClient) {
        onDeleteClient(client.id);
        alert(`已成功註銷並永久刪除買家「${client.name}」之海外置業檔案。`);
      } else {
        alert('主視窗不支援註銷檔案。');
      }
    }
  };

  // Get realistic WhatsApp dialogues based on client details 
  const getPendingWhatsAppMessage = (clientId: string) => {
    switch (clientId) {
      case 'c1':
        return {
          id: 'w_c1',
          timestamp: '2026-06-16 09:40',
          question: "B哥，嗰套難波優質別墅我有興趣啊，但修繕積立金係咪真係15,000日元一個月？定係會加價㗎？",
          answer: "陳生，已幫你查明宅建謄本，發展商5年內承諾平穩不加修繕金。周邊租客穩定，我已為你預留下週一Zoom講解分析！",
          nextStep: "約定下週一 14:00 Zoom 視像詳解修繕金及租約細則。"
        };
      case 'c2':
        return {
          id: 'w_c2',
          timestamp: '2026-06-16 10:15',
          question: "林生問，如果我地用香港公司買浪速區公寓做民宿，日本稅局那邊扣利得稅大約係幾成？",
          answer: "林太，香港公司作為非日本居住者購入，扣繳源泉徵收稅率約為 20.42%，但年度可以向日本稅務署辦理申報扣除成本及退稅，實際負擔極低。已為您代約在日稅理士諮詢。",
          nextStep: "下週發送在日稅務申報流程指南及介紹合作稅理士。"
        };
      case 'c3':
        return {
          id: 'w_c3',
          timestamp: '2026-06-16 09:12',
          question: "梅田嗰棟全棟大樓有排約視像睇樓未？我合夥人呢個禮拜有時間一齊睇。",
          answer: "張生，已經同日本業主辦好觀光牌照和特許准許，預約好呢個禮拜五下晝3點鍾現場連線Zoom睇樓，我本人都會一齊講解！",
          nextStep: "預備星期五 15:00 梅田全棟大樓視像連線睇樓日程。"
        };
      case 'c4':
        return {
          id: 'w_c4',
          timestamp: '2026-06-16 08:30',
          question: "京都東山區老式公寓的管委會，容許海外買家全權託管給民宿管理公司嗎？",
          answer: "李小姐，經查證該公寓管理規約（等同大廈公契），大樓已全票通過許可民宿經營，並指定了特許的託管商。您可以放心託管，無任何法律合規糾紛。",
          nextStep: "提供京都大樓修繕報告與託管公司收費標準。"
        };
      case 'c5':
        return {
          id: 'w_c5',
          timestamp: '2026-06-15 17:22',
          question: "請問小朋友讀城東區的小學，我申請經營管理簽證最快要幾耐可以批落黎？",
          answer: "黃女士，配合我們購入指定的一戶建/全棟物業後，行政書士最快能在4-6個月內完成主體遞交、並批核出在留資格認定書（COE）！",
          nextStep: "發行留學與經管簽證流程說明包。"
        };
      default:
        return {
          id: `w_other_${clientId}`,
          timestamp: '2026-06-16 11:30',
          question: `我想問下你之前選盤配對嗰個日本大阪物件，產權會唔會有未知嘅債務登記限制？`,
          answer: "本司上架盤源均由日本大行宅地建物取引士（宅建士）完成詳查，絕無隱形債權登記或不法抵押。我們確保您交易安全合規格！",
          nextStep: "提供登記事項證明書抄本及產權調查報告。"
        };
    }
  };

  const pendingMsg = getPendingWhatsAppMessage(client.id);
  const isAlreadySynced = syncedIds.includes(pendingMsg.id);

  const handleWhatsAppSync = () => {
    if (isAlreadySynced) return;
    setIsSyncingLive(true);
    
    setTimeout(() => {
      setIsSyncingLive(false);
      
      const newNote: FollowUpNote = {
        id: 'note_wa_' + Date.now(),
        timestamp: pendingMsg.timestamp,
        type: 'WhatsApp',
        question: pendingMsg.question,
        answer: pendingMsg.answer,
        nextStep: pendingMsg.nextStep
      };

      onUpdateClientNotes([newNote, ...client.followUpNotes]);
      setSyncedIds([...syncedIds, pendingMsg.id]);
    }, 1000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) {
      alert('請先輸入跟進與諮詢紀錄內容。');
      return;
    }

    const newNote: FollowUpNote = {
      id: 'note_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: noteType,
      question: noteText,
      answer: answerText || 'B哥已詳細回复客，解釋該盤口的所有合規及物業修繕基金狀況，跟進進度順暢。',
      nextStep: nextStepText || '繼續保持聯絡，發送新一批心水盤源。'
    };

    onUpdateClientNotes([newNote, ...client.followUpNotes]);
    
    // reset form
    setNoteText('');
    setAnswerText('');
    setNextStepText('');
    alert('已成功將跟進對話紀錄歸檔存盤！');
  };

  // Generate continuous layout coordinates for heatmap
  const heatmapCells = Array.from({ length: 42 }).map((_, i) => ({
    active: i % 7 === 0 || i % 5 === 2 || i === 12 || i === 23,
    level: (i * 3 + 2) % 4
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in-50 duration-200">
      
      {/* 編輯客戶檔案 Modal overlay */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 select-text animate-fade-in backdrop-blur-xs">
          <div className="bg-white border border-zinc-250 rounded-2xl p-6 shadow-2xl space-y-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                  <Settings className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>編輯置業客戶「{client.name}」基本意向</span>
                </h3>
                <p className="text-[10.5px] text-zinc-400 mt-1">
                  更改後將即時儲存並同步至所有睇樓、重要事項告知書及成交流程模組。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs font-medium font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">姓名</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">英文稱呼/拼音</label>
                  <input
                    type="text"
                    value={editEngName}
                    onChange={(e) => setEditEngName(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">聯絡電話</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-850 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">電子信箱</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">置業群組標籤</label>
                  <select
                    value={editVipTag}
                    onChange={(e) => setEditVipTag(e.target.value as any)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                  >
                    <option value="VIP 投資者">VIP 投資者</option>
                    <option value="精選買家">精選買家</option>
                    <option value="常規客戶">常規客戶</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">跟進活躍度標籤</label>
                  <select
                    value={editHeatTag}
                    onChange={(e) => setEditHeatTag(e.target.value as any)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                  >
                    <option value="A級熱度">A級熱度</option>
                    <option value="B級熱度">B級熱度</option>
                    <option value="C級熱度">C級熱度</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">投資總預算 (Budget)</label>
                  <input
                    type="text"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">心意選區</label>
                  <input
                    type="text"
                    value={editPreferredArea}
                    onChange={(e) => setEditPreferredArea(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">物業需求類型</label>
                  <input
                    type="text"
                    value={editPropertyType}
                    onChange={(e) => setEditPropertyType(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">置業首要目的</label>
                  <input
                    type="text"
                    value={editPurpose}
                    onChange={(e) => setEditPurpose(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-zinc-850"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-zinc-700">資金流實力核實</label>
                  <input
                    type="text"
                    value={editFundingPower}
                    onChange={(e) => setEditFundingPower(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:border-emerald-500 outline-none text-emerald-800 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-650 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  儲存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Left Column: Client Basic Info Bento (col-span-4) */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* Profile General Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col items-center text-center relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-65 z-0"></div>
          
          {/* Quick Edit or Register Options */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20 select-none">
            <button 
              onClick={openEditModal}
              type="button"
              title="編輯基本資料"
              className="p-1 px-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-emerald-700 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleDeleteAction}
              type="button"
              title="註銷此大客檔案"
              className="p-1 px-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-20 h-20 rounded-full border-2 border-white shadow overflow-hidden z-10 mt-2 mb-3 bg-white">
            <img 
              alt={client.name} 
              className="w-full h-full object-cover" 
              src={client.avatarUrl || "https://lh3.googleusercontent.com/person"} 
            />
          </div>

          <h2 className="text-md font-bold text-zinc-900 z-10">{client.name} {client.engName && <span className="text-zinc-400">({client.engName})</span>}</h2>
          
          <div className="flex items-center gap-2 mt-1.5 z-10">
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wide">
              {client.vipTag}
            </span>
            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 uppercase tracking-wide">
              {client.heatTag}
            </span>
          </div>

          <div className="flex gap-2 w-full mt-4 z-10">
            <button 
              onClick={() => alert(`即將撥通客 ${client.name} 的 WhatsApp 熱線！`)}
              className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da14e] text-white font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent stroke-[1.5]" />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(client.email);
                alert(`已將電子郵箱 ${client.email} 複製至剪貼板！`);
              }}
              className="flex-1 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600 font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>電子信箱</span>
            </button>
          </div>
        </div>

        {/* Investment profile targets */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-zinc-800 mb-4 border-b border-zinc-100 pb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>合規投資意念 & 需求</span>
          </h3>

          <ul className="space-y-3.5 text-xs text-zinc-700">
            <li className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">預算限額 (Budget)</span>
              <span className="font-mono text-zinc-900 font-bold">{client.budget}</span>
            </li>
            <li className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">心水區域 (Preferred Area)</span>
              <span className="font-semibold text-zinc-800">{client.preferredArea}</span>
            </li>
            <li className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">物業目標 (Type)</span>
              <span className="font-semibold text-zinc-800">{client.propertyType}</span>
            </li>
            <li className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">置業目標 (Purpose)</span>
              <span className="text-rose-600 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px] uppercase">
                {client.purpose}
              </span>
            </li>
            <li className="flex justify-between items-center py-0.5">
              <span className="text-zinc-400 font-medium">資金流儲備 (Ability)</span>
              <span className="font-semibold text-emerald-700">{client.fundingPower}</span>
            </li>
          </ul>
        </div>

        {/* Activity Heatmap Grid */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 shrink-0" />
              <span>跟進活躍度 Heatmap</span>
            </h3>
            <span className="text-[10px] text-zinc-405 font-mono">Q4 已進行 31 次紀錄</span>
          </div>

          <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-150 flex flex-col items-center justify-center">
            <div className="grid grid-cols-7 gap-1">
              {heatmapCells.map((cell, idx) => {
                let colorClass = 'bg-zinc-100'; // level 0
                if (cell.active) {
                  if (cell.level === 1) colorClass = 'bg-emerald-200';
                  else if (cell.level === 2) colorClass = 'bg-emerald-400';
                  else colorClass = 'bg-emerald-600';
                }
                return (
                  <div 
                    key={idx}
                    className={`w-4.5 h-4.5 rounded-[1px] hover:ring-1 hover:ring-zinc-400 cursor-help transition-all ${colorClass}`}
                    title={`第 ${idx + 1} 日跟進諮詢強度`}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between w-full mt-3 text-[9px] font-semibold text-zinc-400 px-1 font-mono">
              <span>低頻</span>
              <div className="flex gap-1 items-center">
                <div className="w-2.5 h-2.5 bg-zinc-100 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-emerald-200 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-[1px]" />
                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-[1px]" />
              </div>
              <span>高頻 (宅建士)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Interaction Tabs & State details (col-span-8) */}
      <div className="xl:col-span-8 flex flex-col h-full gap-5">
        
        {/* Navigation Tabs (Glassmorphism layout) */}
        <div className="bg-white border border-zinc-250 p-1.5 rounded-xl flex gap-2 overflow-x-auto shadow-sm">
          <button 
            onClick={() => setActiveSubTab('notes')}
            className={`px-4 py-2 font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'notes' 
                ? 'bg-zinc-900 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
          >
            我的跟進紀錄
          </button>
          <button 
            onClick={() => setActiveSubTab('properties')}
            className={`px-4 py-2 font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'properties' 
                ? 'bg-zinc-900 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
          >
            推過筍盤
          </button>
          <button 
            onClick={() => setActiveSubTab('viewings')}
            className={`px-4 py-2 font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'viewings' 
                ? 'bg-zinc-900 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
          >
            睇樓紀錄
          </button>
          <button 
            onClick={() => setActiveSubTab('cases')}
            className={`px-4 py-2 font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'cases' 
                ? 'bg-zinc-950 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
          >
            交易案件
          </button>
          <button 
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 py-2 font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeSubTab === 'documents' 
                ? 'bg-zinc-950 text-white shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
          >
            文件紀錄
          </button>
        </div>

        {/* Tab Contents: Notes Timeline & Editor */}
        {activeSubTab === 'notes' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex-1 space-y-6">
            
            {/* Quick Add Note Editor */}
            <form onSubmit={handleSaveNote} className="space-y-4 pb-5 border-b border-zinc-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <ClipboardList className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase">1. 客戶最新諮詢/提問 (Client's Inquiry)</label>
                    <textarea 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="e.g. 客戶問及日本一戶建重建是否需要繳交額外登記手續費？或關心全棟物業的實得回報淨值..."
                      className="w-full h-18 border border-zinc-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none bg-zinc-50/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase">2. B哥專業對答 (B-Gor's Response)</label>
                    <textarea 
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="e.g. 已經計好實質回報，解釋了其中關於修繕積立金的細則，排除風險，極力向客推薦笋盤優勢。"
                      className="w-full h-15 border border-zinc-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none bg-zinc-50/50"
                    />
                  </div>

                  <div className="flex flex-wrap md:flex-row justify-between items-center gap-3">
                    
                    {/* Note Type Selector */}
                    <div className="flex gap-1">
                      {(['WhatsApp', 'Phone', 'Meeting'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNoteType(type)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md border tracking-wider transition cursor-pointer ${
                            noteType === type 
                              ? 'bg-zinc-850 text-white border-zinc-850 shadow' 
                              : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Next step prompt */}
                    <input 
                      type="text"
                      value={nextStepText}
                      onChange={(e) => setNextStepText(e.target.value)}
                      placeholder="下一步行動：e.g. 下週二相約視像看房..."
                      className="flex-1 max-w-xs border border-zinc-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-emerald-500"
                    />

                    <button 
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-bold text-xs px-4 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>儲存紀錄</span>
                    </button>

                  </div>
                </div>
              </div>
            </form>

            {/* WhatsApp Integration Sync Banner */}
            <div className="bg-emerald-500/5 hover:bg-emerald-500/10 transition border border-emerald-500/20 rounded-xl p-4.5 space-y-3.5 select-text">
              <div className="flex justify-between items-center select-none pb-2 border-b border-dashed border-emerald-500/15">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-500/10 shrink-0" />
                  <span className="text-xs font-extrabold text-emerald-800 tracking-wide">
                    Meta Business API 對談即時同步器
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold font-mono uppercase bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">
                  已匹配：{client.phone}
                </div>
              </div>

              {isAlreadySynced ? (
                <div className="flex items-center gap-3.5 select-none py-1.5">
                  <div className="bg-emerald-500/15 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800">
                      當前與買家【{client.name}】的 WhatsApp 置業對話已妥善對齊
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                      剛才已順利拉取並寫入下方跟進記錄歷史中。無其他待同步通訊紀錄。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold select-none">
                    偵測到最新一條來自 <strong>{client.name}</strong> 於 WhatsApp 傳送且<strong>尚未歸檔</strong>至 CRM 的置業諮詢：
                  </p>
                  
                  <div className="bg-white border border-emerald-100 rounded-xl p-3.5 space-y-2 relative shadow-xs">
                    <div className="flex justify-between items-center text-[10px] select-none text-zinc-400">
                      <span className="font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        對話待同步 (來自客源)
                      </span>
                      <span className="font-mono font-bold text-zinc-500">{pendingMsg.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 border-l-2 border-emerald-500 pl-2.5 py-0.5 leading-relaxed select-text">
                      「{pendingMsg.question}」
                    </p>
                    <div className="bg-zinc-50/70 p-2.5 rounded-lg border border-dashed border-zinc-200 mt-2 space-y-1.5">
                      <span className="text-[10px] text-emerald-800 font-bold block">💡 建議同步寫入的 B哥專業對答：</span>
                      <p className="text-[11px] text-zinc-600 leading-relaxed select-text">
                        {pendingMsg.answer}
                      </p>
                      <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded w-fit mt-1.5 font-bold">
                        🎯 重要下一步行動：{pendingMsg.nextStep}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center select-none pt-1">
                    <span className="text-[10.5px] text-zinc-400 font-medium">
                      一鍵拉取 Meta 的雙向通信，直接注入置業大簿中。
                    </span>
                    <button
                      type="button"
                      disabled={isSyncingLive}
                      onClick={handleWhatsAppSync}
                      className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs focus:outline-none transition flex items-center gap-1.5 cursor-pointer ${
                        isSyncingLive 
                          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          : 'bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da14e] text-white font-extrabold'
                      }`}
                    >
                      {isSyncingLive ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>與 Meta 雲端握手中...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>一鍵直接同步此對話</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline view */}
            <div className="relative border-l border-zinc-200 pl-6 ml-5 space-y-6">
              
              {client.followUpNotes.map((note) => {
                const isWhatsApp = note.type === 'WhatsApp';
                const isPhone = note.type === 'Phone';
                
                return (
                  <div key={note.id} className="relative transition duration-200 group">
                    {/* circular marker */}
                    <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-500/15"></div>
                    
                    {/* Timestamp header block */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-zinc-900 font-bold text-xs">{note.timestamp}</span>
                      <span className="bg-zinc-100 text-zinc-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-200 flex items-center gap-1 uppercase tracking-wide">
                        {isWhatsApp ? <MessageCircle className="w-3 h-3" /> : isPhone ? <Phone className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        <span>{note.type}</span>
                      </span>
                    </div>

                    {/* Dialog message bundle */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4.5 space-y-2">
                      <p className="text-xs text-zinc-900 leading-relaxed">
                        <strong className="text-emerald-700 font-bold">Q (Client):</strong> {note.question}
                      </p>
                      <p className="text-xs text-zinc-650 leading-relaxed pl-4 border-l-2 border-emerald-500/50">
                        <strong className="text-zinc-800 font-bold">A (B-Gor):</strong> {note.answer}
                      </p>
                    </div>

                    {/* Actions and Next Step layout */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-zinc-500">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 stroke-[2.5]" />
                      <span className="text-zinc-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded text-[10px]">
                        <strong>重要下一步 (Next Step)：</strong> {note.nextStep}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* Dummy/Pushed Properties Tab */}
        {activeSubTab === 'properties' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase border-b pb-2">已向客推薦之精選筍盤</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-200 rounded-xl overflow-hidden hover:border-emerald-500 transition shadow-sm bg-zinc-50 flex flex-col justify-between">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-800">難波公園南側公寓大樓</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 rounded">毛回報 6.2%</span>
                  </div>
                  <p className="text-zinc-500 text-xs">大阪市浪速區難波中，1LDK 套房，屋苑配套極優。</p>
                  <p className="text-zinc-900 text-xs font-mono font-bold">預估價格：JPY 4,500 萬</p>
                </div>
                <div className="p-3 bg-zinc-100 border-t border-zinc-200 text-right">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border">已發送樓書及詳盡修繕金清單</span>
                </div>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden hover:border-emerald-500 transition shadow-sm bg-zinc-50 flex flex-col justify-between">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-800">心齋橋周邊全棟收租店鋪物業</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 rounded">實質回報 5.4%</span>
                  </div>
                  <p className="text-zinc-500 text-xs">大阪市中央區東心齋橋，黃金地段，全棟滿租。</p>
                  <p className="text-zinc-900 text-xs font-mono font-bold">預估價格：JPY 7,900 萬</p>
                </div>
                <div className="p-3 bg-zinc-100 border-t border-zinc-200 text-right">
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border">客戶強烈感興趣、擬定約視像睇樓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dummy Viewing Logs Tab */}
        {activeSubTab === 'viewings' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase border-b pb-2">視像/現場睇樓歷程記錄</h3>
            <div className="space-y-3">
              <div className="p-3.5 border border-zinc-200 bg-zinc-50 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-800 text-xs">難波公園南側公寓 - #Unit 1402</div>
                  <p className="text-zinc-500 text-xs mt-1">睇樓實況：日本同事實地行一圈 Zoom 視像同步讲解，說明水電配管與公設比。</p>
                </div>
                <span className="bg-zinc-200 text-zinc-700 font-mono text-[10px] px-2 py-1 rounded font-bold">2023-09-10 現場考察完成</span>
              </div>
            </div>
          </div>
        )}

        {/* Dummy Cases Tab */}
        {activeSubTab === 'cases' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase border-b pb-2">成交案件履歷</h3>
            <div className="p-4 border-2 border-dashed border-zinc-200 rounded-lg text-center bg-zinc-50">
              <FileCheck2 className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.5]" />
              <p className="text-zinc-600 text-xs font-bold mt-2">物業大阪 Tower B #Unit 1402 已提交買付申込書！</p>
              <p className="text-zinc-400 text-[11px] mt-1">目前進度流程為：標準成交流程第 6/12 步 (重要事項告知書收到)。</p>
            </div>
          </div>
        )}

        {/* Dummy Documents Tab */}
        {activeSubTab === 'documents' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-850 uppercase border-b pb-2">合規上傳文件紀錄 (宅建法)</h3>
            <div className="flex items-center justify-between p-3 border border-zinc-200 bg-zinc-50 rounded-lg text-xs leading-none">
              <span className="font-semibold text-zinc-800 font-mono">[已備齊] 東京新宿收益物業重要事項告知書.pdf</span>
              <span className="text-zinc-400 font-mono">2.4 MB</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-zinc-200 bg-zinc-50 rounded-lg text-xs leading-none">
              <span className="font-semibold text-zinc-800 font-mono">[已備齊] 難波套房1402謄本登記帳目.pdf</span>
              <span className="text-zinc-400 font-mono">1.1 MB</span>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
