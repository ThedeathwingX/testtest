import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  Building2, 
  Handshake, 
  Calendar, 
  Gavel, 
  ClipboardCheck, 
  MessageSquare, 
  RefreshCw, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus,
  Compass
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenAddDeal: () => void;
  totalClientsCount?: number;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  onOpenAddDeal,
  totalClientsCount = 124 
}: SidebarProps) {
  
  const mainNavItems = [
    { id: 'dashboard', label: '今日工作台', icon: LayoutDashboard },
    { id: 'clients', label: '客戶資料庫', icon: Users },
    { id: 'kanban', label: '跟進 Kanban', icon: KanbanSquare },
    { id: 'properties', label: '有推介過的客戶', icon: Building2 },
    { id: 'viewings', label: '睇樓安排', icon: Calendar },
    { id: 'pavel_checklist', label: '重要事項告知書', icon: Gavel },
    { id: 'checklist', label: '成交流程', icon: ClipboardCheck },
    { id: 'whatsapp_templates', label: 'WhatsApp 模板', icon: MessageSquare },
    { id: 'whatsapp_sync', label: 'WhatsApp 同步設定', icon: RefreshCw },
    { id: 'reports', label: '報表', icon: BarChart3 },
  ] as const;


  return (
    <aside className="w-[260px] bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen fixed left-0 top-0 text-zinc-300 select-none z-30 font-sans">
      {/* Brand logo & header */}
      <div className="p-5 border-b border-zinc-850">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Compass className="w-5 h-5 text-zinc-900 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white leading-tight">HK-Osaka Realty</h1>
            <p className="text-[11px] text-zinc-500 font-medium tracking-wider uppercase mt-0.5">客戶關係管理系統</p>
          </div>
        </div>
      </div>

      {/* Primary CTA - Add New Inquiry */}
      <div className="px-4 py-4">
        <button 
          onClick={onOpenAddDeal}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-semibold text-sm rounded-lg py-2.5 px-4 shadow transition duration-200 flex items-center justify-center gap-2 cursor-pointer cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>新增跟進查詢</span>
        </button>
      </div>

      {/* Main Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar pb-6">
        <div className="px-3 mb-2 text-[10px] font-bold text-zinc-600 tracking-wider uppercase">CRM 主要模組</div>
        {mainNavItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if ('isDummy' in item && item.isDummy) {
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-md font-medium text-xs text-zinc-500 cursor-not-allowed hover:bg-zinc-800/20 group relative"
                title="系統功能：僅供演示"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 stroke-[1.8] opacity-60" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[9px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono scale-90">DEMO</span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ActiveView)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition duration-150 cursor-pointer ${
                isActive 
                  ? 'bg-zinc-800 text-emerald-400 font-semibold border-l-[3px] border-emerald-500 pl-2.5 shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'kanban' && (
                <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded-full font-mono font-medium">124</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Nav Settings/Profile */}
      <div className="p-3 border-t border-zinc-850 bg-zinc-900/50 space-y-0.5">
        <button 
          onClick={() => alert("目前為 B哥 單人演示模式，如需修改設置請配置 WhatsApp 同步。")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer"
        >
          <Settings className="w-4 h-4 text-zinc-500" />
          <span className="text-left">設定</span>
        </button>
        <div className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-md font-medium text-xs text-zinc-500 hover:text-zinc-400 transition">
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-zinc-500" />
            <span>單人工作台</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-semibold font-mono">B-GOR</span>
        </div>
      </div>
    </aside>
  );
}
