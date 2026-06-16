import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Trash2, 
  Copy, 
  MessageSquare,
  X
} from 'lucide-react';
import { WhatsAppTemplate } from '../types';

interface WhatsAppTemplatesViewProps {
  templates: WhatsAppTemplate[];
  onChangeTemplates: (updatedTemplates: WhatsAppTemplate[]) => void;
}

export default function WhatsAppTemplatesView({ templates, onChangeTemplates }: WhatsAppTemplatesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Template Inputs
  const [title, setTitle] = useState('');
  const [scenario, setScenario] = useState('SCENARIO 1');
  const [iconType, setIconType] = useState<'campaign' | 'map' | 'warning' | 'schedule' | 'task_alt'>('campaign');
  const [colorTheme, setColorTheme] = useState<'green' | 'blue' | 'red' | 'orange'>('green');
  const [content, setContent] = useState('');

  const handleCopyAndSend = (temp: WhatsAppTemplate) => {
    navigator.clipboard.writeText(temp.content);
    alert(`【複製發送範本成功】\n「${temp.title}」內容已成功複製至剪貼板。\n您現在可以在任何 WhatsApp 對答中直接 [Ctrl+V] 貼上快速傳送給客戶！`);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('請先填寫範本標題和模板對話內容。');
      return;
    }

    const newTemplate: WhatsAppTemplate = {
      id: 'template_' + Date.now(),
      title,
      scenario,
      iconType,
      colorTheme,
      content
    };

    onChangeTemplates([...templates, newTemplate]);
    
    // reset inputs
    setTitle('');
    setContent('');
    setShowAddModal(false);
    alert('新 WhatsApp 快速回覆範本已建立成功，即時載入至工作台快捷連結！');
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('確定刪除該快速發送範本嗎？這個操作無法還原。')) {
      onChangeTemplates(templates.filter(t => t.id !== id));
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.scenario.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in-50 duration-200">
      
      {/* Search and CTA Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">WhatsApp 快速模板庫</h2>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">備存 B哥 快速推盤、邀約視像睇樓、重要告知法規提醒或售後成交文件的對應訊息</p>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋範本名稱、關鍵字..."
              className="pl-9 pr-4 py-1.5 border border-zinc-200 hover:border-zinc-300 rounded-lg text-xs w-full md:w-56 bg-white outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer h-8.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新增範本</span>
          </button>
        </div>
      </div>

      {/* Grid listing of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {filteredTemplates.map((temp) => {
          // icon selectors
          const isCampaign = temp.iconType === 'campaign';
          const isMap = temp.iconType === 'map';
          const isWarning = temp.iconType === 'warning';
          const isSchedule = temp.iconType === 'schedule';
          
          let themeColorClass = '';
          let bgContainerClass = '';
          
          if (temp.colorTheme === 'green') {
            themeColorClass = 'text-emerald-700 bg-emerald-50 border-emerald-250';
            bgContainerClass = 'border-t-emerald-500';
          } else if (temp.colorTheme === 'blue') {
            themeColorClass = 'text-blue-700 bg-blue-50 border-blue-250';
            bgContainerClass = 'border-t-blue-500';
          } else if (temp.colorTheme === 'red') {
            themeColorClass = 'text-rose-700 bg-rose-50 border-rose-250';
            bgContainerClass = 'border-t-rose-500';
          } else {
            themeColorClass = 'text-amber-700 bg-amber-50 border-amber-250';
            bgContainerClass = 'border-t-amber-500';
          }

          return (
            <div 
              key={temp.id}
              className={`bg-white rounded-xl border border-zinc-200 border-t-4 ${bgContainerClass} p-5 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition duration-200`}
            >
              <div>
                
                {/* Card Title & Delete button */}
                <div className="flex justify-between items-start mb-3 select-none">
                  <div>
                    <span className={`px-2 py-0.5 rounded font-mono text-[9.5px] font-bold border ${themeColorClass}`}>
                      {temp.scenario}
                    </span>
                    <h3 className="font-bold text-zinc-905 text-xs font-sans tracking-tight mt-1.5">
                      {temp.title}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteTemplate(temp.id)}
                    className="text-zinc-300 hover:text-rose-600 transition p-1 rounded opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="刪除自訂範本"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Box */}
                <div className="bg-zinc-50 border border-zinc-150 p-3.5 rounded-lg text-zinc-650 text-xs font-mono select-text min-h-[140px] whitespace-pre-wrap leading-relaxed hover:bg-zinc-50/20">
                  {temp.content}
                </div>

              </div>

              {/* Action bar */}
              <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-zinc-100">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(temp.content);
                    alert("快捷複製成功！請至客戶對話框貼上即可發送。");
                  }}
                  className="text-zinc-500 hover:text-emerald-700 hover:underline text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span>快捷複製</span>
                </button>

                <button 
                  onClick={() => handleCopyAndSend(temp)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white hover:text-emerald-400 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 hover:shadow transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>複製並預覽發送</span>
                </button>
              </div>

            </div>
          );
        })}

      </div>

      {/* Add New Template Dialog Simulation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs select-none">
          <form 
            onSubmit={handleSaveTemplate}
            className="bg-white border border-zinc-205 p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-zinc-800 text-xs uppercase flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>建立全新快捷發送範本</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-405 hover:text-zinc-650 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">標題 (Title)</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 下週看房視像提醒"
                  className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">情境分配 (Scenario)</label>
                <select 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full text-xs border border-zinc-200 bg-white rounded-lg p-2 outline-none font-semibold text-zinc-700"
                >
                  <option value="SCENARIO 1">SCENARIO 1 (推盤)</option>
                  <option value="SCENARIO 2">SCENARIO 2 (邀約)</option>
                  <option value="SCENARIO 3">SCENARIO 3 (跟進)</option>
                  <option value="SCENARIO 4">SCENARIO 4 (合規)</option>
                  <option value="SCENARIO 5">SCENARIO 5 (成交)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">視覺配色 (Color)</label>
                <div className="flex gap-2 py-1 items-center">
                  {(['green', 'blue', 'red', 'orange'] as const).map((color) => {
                    const activeColor = colorTheme === color;
                    let dotColor = '';
                    if (color === 'green') dotColor = 'bg-emerald-500';
                    else if (color === 'blue') dotColor = 'bg-blue-500';
                    else if (color === 'red') dotColor = 'bg-rose-500';
                    else dotColor = 'bg-amber-500';
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setColorTheme(color)}
                        className={`w-5 h-5 rounded-full ${dotColor} relative cursor-pointer ${
                          activeColor ? 'ring-2 ring-zinc-950 ring-offset-2' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">預設 Icon (Context)</label>
                <select 
                  value={iconType}
                  onChange={(e) => setIconType(e.target.value as any)}
                  className="w-full text-xs border border-zinc-200 bg-white rounded-lg p-2 outline-none font-semibold text-zinc-700"
                >
                  <option value="campaign">Megaphone 廣播 (C)</option>
                  <option value="map">Map 地圖 (M)</option>
                  <option value="warning">Warning 合規警示 (W)</option>
                  <option value="schedule">Clock 時鐘 (S)</option>
                  <option value="task_alt">Checkmark 打勾 (T)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">範本對話內容 (Content Body)</label>
              <textarea 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="師兄，早晨！收到風大市中心極佳地段有新盤口，有興趣..."
                className="w-full border border-zinc-200 hover:border-zinc-300 rounded-lg p-3 text-xs focus:border-emerald-500 outline-none resize-none font-mono bg-zinc-50/50 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-500 cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold cursor-pointer shadow-sm active:scale-95"
              >
                儲存範本
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
