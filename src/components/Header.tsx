import React, { useState } from 'react';
import { Search, Bell, HelpCircle, AlertCircle } from 'lucide-react';
import { ActiveView } from '../types';

interface HeaderProps {
  currentView: ActiveView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ currentView, searchQuery, onSearchChange }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumbs = () => {
    const base = 'Osaka CRM';
    switch (currentView) {
      case 'dashboard':
        return [base, 'B哥個人工作台'];
      case 'clients':
        return [base, '客戶資料庫', '陳大文 (Mr. Chan)'];
      case 'kanban':
        return [base, 'B哥個人跟進管線'];
      case 'pavel_checklist':
        return [base, '重要事項告知書', '合規進度管理'];
      case 'whatsapp_sync':
        return [base, 'WhatsApp 同步設定', 'Business API 套件'];
      case 'whatsapp_templates':
        return [base, 'WhatsApp 模板庫', '快速對話指令'];
      case 'checklist':
        return [base, '成交流程', '#TXN-8842 案件進度'];
      default:
        return [base];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-12 bg-white border-b border-zinc-200 px-6 flex justify-between items-center sticky top-0 z-20 select-none font-sans shadow-sm">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-zinc-300 text-xs font-semibold">/</span>}
            <span className={`text-xs font-semibold ${
              idx === breadcrumbs.length - 1 
                ? 'text-emerald-700 font-bold' 
                : 'text-zinc-500'
            }`}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Center Search Field */}
      <div className="flex-1 max-w-xs md:max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2]" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋客戶姓名、電話、物業或編號..."
            className="w-full pl-9 pr-4 py-1 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-emerald-500 focus:bg-white rounded-full text-xs text-zinc-800 placeholder-zinc-400 outline-none transition duration-150 shadow-inner"
          />
        </div>
      </div>

      {/* Actions and User Profile */}
      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-1.5 rounded-full text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100 transition relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>
        <button 
          onClick={() => alert("聯絡售後客服或宅建士合規部門：\n電話：+852 9123 4567\n電郵：legal@hk-osaka-realty.com")}
          className="p-1.5 rounded-full text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100 transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-200 mx-2"></div>

        {/* User profile with custom state info */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-zinc-650 hidden md:inline">B哥 (大阪專家)</span>
          <div className="w-8 h-8 rounded-full border border-zinc-200 bg-emerald-50 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaLqL95ergfod9zRKUYJXJjCXU3F9eE7n4iAH50uHvX52AvbmmDB5e4pzHtw7I3oHF8S5XZHtCXixO6RgmXM9tFnRig0p3pz7J9EpqX2u5ruwrhotGETmquzCN2UjhphsA8e4prPxRfQXuyc4jMJykjwNcydUkeB9Olk08Ccmu_aHGrnDALOz0bL26ix3CKIWE9ZhasaBh7kOoFCBY5vxKvFH9D_JLGh9s3XKoAkavBtCnlPXFI1Kr5RzgQ5I_176BT64aZMhARMM"
              alt="B哥專業頭像"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-10 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl py-3 z-50 text-xs text-zinc-700 animate-in fade-in-50 duration-200">
            <div className="px-4 pb-2 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <span className="font-bold text-zinc-800">最新通知提醒</span>
              <span className="text-[10px] text-zinc-400">目前有 3 項代辦</span>
            </div>
            <div className="divide-y divide-zinc-50 max-h-64 overflow-y-auto">
              <div className="p-3 hover:bg-zinc-50 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-800">首要事項簽署提醒</p>
                  <p className="text-zinc-500 mt-0.5 text-[11px]">王小明 (難波雅居) 重要事項告知書剩餘 2 天過期！</p>
                </div>
              </div>
              <div className="p-3 hover:bg-zinc-50 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-800">成交案 #TXN-8842</p>
                  <p className="text-zinc-500 mt-0.5 text-[11px]">陳大文「重要事項告知書收到」等待B哥打勾確認。</p>
                </div>
              </div>
              <div className="p-3 hover:bg-zinc-50 flex gap-2.5" onClick={() => onSearchChange('Mrs. Lam')}>
                <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-800">跟進追蹤 WhatsApp 回覆</p>
                  <p className="text-zinc-500 mt-0.5 text-[11px]">林太 (Mrs. Lam) 正等待發送精選盤資訊。</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
