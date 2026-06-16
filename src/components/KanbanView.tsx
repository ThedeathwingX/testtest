import React, { useState } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  MapPin, 
  Compass, 
  CreditCard, 
  Inbox, 
  ArrowRight
} from 'lucide-react';
import { KanbanCard, KanbanStage } from '../types';

interface KanbanViewProps {
  cards: KanbanCard[];
  onUpdateCards: (updatedCards: KanbanCard[]) => void;
  onViewClientDetail: () => void;
}

export default function KanbanView({ cards, onUpdateCards, onViewClientDetail }: KanbanViewProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  // Define our Kanban stages
  const stages: KanbanStage[] = [
    { id: 'new', title: '新查詢', color: 'bg-emerald-500' },
    { id: 'viewed', title: '已睇樓', color: 'bg-amber-500' },
    { id: 'applied', title: '已申請購入', color: 'bg-indigo-500' },
    { id: 'closing', title: '成交手續中', color: 'bg-teal-500' }
  ];

  // Shifting columns action
  const handleMoveCard = (cardId: string, currentStageId: string) => {
    const stageIds = stages.map(s => s.id);
    const currentIndex = stageIds.indexOf(currentStageId);
    if (currentIndex === -1 || currentIndex === stageIds.length - 1) {
      // wrap around or reset
      const updated = cards.map(c => c.id === cardId ? { ...c, stageId: 'new' } : c);
      onUpdateCards(updated);
      alert('已將該客戶重新循環歸入為「新查詢」！');
      return;
    }
    const nextStageId = stageIds[currentIndex + 1];
    const updated = cards.map(c => c.id === cardId ? { ...c, stageId: nextStageId } : c);
    onUpdateCards(updated);
    
    // Nice friendly toast Alert
    const nextStageTitle = stages.find(s => s.id === nextStageId)?.title;
    alert(`【管線移轉成功】\n已將客戶移至：  [ ${nextStageTitle} ]\n下次聯絡與合規提醒已自動同步至B哥工作台！`);
  };

  const filteredCards = cards.filter(card => 
    card.name.includes(filterQuery) || 
    card.preferredArea.includes(filterQuery) || 
    card.budget.includes(filterQuery)
  );

  return (
    <div className="flex-1 flex flex-col h-full space-y-4 select-none font-sans animate-in fade-in-50 duration-200">
      
      {/* Filters & Control ControlsToolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm shrink-0">
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <select 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-zinc-55 border border-zinc-200 hover:border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-700 outline-none transition cursor-pointer"
            >
              <option value="">全部客戶來源</option>
              <option value="陳大文">僅看 陳大文</option>
              <option value="心齋橋">心齋橋尋盤意向</option>
              <option value="大阪">僅看 大阪意向</option>
            </select>
          </div>

          <button 
            onClick={() => alert("目前已按照下次聯絡時間進行最優化排序！")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-lg text-zinc-700 font-bold text-xs border border-zinc-200 transition cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>排序</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-600 font-bold text-[11px] uppercase tracking-wide rounded-md border text-xs">
            系統歸屬：共 {cards.length + 122} 筆客戶
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Columns Container */}
      <div className="flex-1 overflow-x-auto flex gap-4 pb-4 items-start select-none justify-start">
        
        {stages.map((stage) => {
          const stageCards = filteredCards.filter(c => c.stageId === stage.id);
          
          return (
            <div 
              key={stage.id} 
              className="w-80 bg-zinc-100/80 border border-zinc-200 rounded-xl p-3 flex flex-col shrink-0 min-h-[480px] hover:border-zinc-300 transition"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3 px-1 select-none">
                <h2 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
                  <span>{stage.title}</span>
                </h2>
                <span className="font-mono text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                  {stageCards.length}
                </span>
              </div>

              {/* Card List in Column */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 custom-scrollbar pb-4">
                {stageCards.length === 0 ? (
                  /* Empty state dotted container fallback */
                  <div className="flex items-center justify-center py-10 h-full border border-dashed border-zinc-250 rounded-xl bg-zinc-50 p-4 text-center ">
                    <div>
                      <Inbox className="w-8 h-8 text-zinc-400 mx-auto stroke-[1.5] mb-1.5" />
                      <p className="text-zinc-600 text-xs font-semibold leading-relaxed">無客戶資料</p>
                      <p className="text-zinc-400 text-[10px] mt-0.5">點擊卡片或重新分配以進行跨列跟進。</p>
                    </div>
                  </div>
                ) : (
                  stageCards.map((card) => (
                    <div 
                      key={card.id}
                      className="bg-white rounded-xl p-4.5 border border-zinc-220 hover:border-emerald-500 transition duration-150 cursor-pointer shadow-sm relative overflow-hidden group select-none flex flex-col justify-between"
                    >
                      {/* Left color tip boundary */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                        card.label === '太耐無跟' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></div>

                      <div>
                        {/* Title and action button */}
                        <div className="flex justify-between items-center mb-2">
                          <h3 
                            onClick={onViewClientDetail}
                            className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700 hover:underline inline-block font-sans"
                          >
                            {card.name} {card.engName && <span className="text-zinc-400 text-[11px]">({card.engName})</span>}
                          </h3>
                          <button 
                            onClick={() => alert(`【功能演示】\n客戶名稱：${card.name}\n渠道來源：${card.source}`)}
                            className="text-zinc-300 hover:text-emerald-600 transition p-0.5 rounded"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Contact & financial elements */}
                        <div className="space-y-1 text-[11px] text-zinc-550 mb-3">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-zinc-700">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{card.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                            <span>預算：{card.budget}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="truncate">心水：{card.preferredArea}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="truncate">來源：{card.source}</span>
                          </div>
                        </div>

                        {/* Steps summary box */}
                        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg mb-3">
                          <p className="text-[9px] uppercase font-bold text-zinc-400">下一步 Action Point</p>
                          <p className="text-[11px] text-zinc-700 font-semibold mt-0.5">{card.nextStep}</p>
                        </div>
                      </div>

                      {/* Card Move actions and labels */}
                      <div className="flex justify-between items-center mt-1 pt-2.5 border-t border-zinc-100">
                        {card.label && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            card.label === '太耐無跟' 
                              ? 'bg-rose-100 text-rose-800 border-rose-200' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {card.label}
                          </span>
                        )}
                        
                        <button 
                          onClick={() => handleMoveCard(card.id, stage.id)}
                          className="ml-auto bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white hover:text-emerald-400 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 transition uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
                          title="移至下個管道步驟"
                        >
                          <span>移轉</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
