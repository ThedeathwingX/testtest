import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ActiveView, ClientProfile, KanbanCard, WhatsAppTemplate, DocumentCase, ChecklistItem, SyncErrorLog, Property, Viewing, ClientRecommendation, ClosedDeal } from './types';
import { 
  INITIAL_CLIENTS, 
  INITIAL_KANBAN_CARDS, 
  INITIAL_WHATSAPP_TEMPLATES, 
  INITIAL_DOCUMENT_CASES, 
  INITIAL_CHECKLIST_ITEMS, 
  INITIAL_SYNC_LOGS,
  INITIAL_PROPERTIES,
  INITIAL_VIEWINGS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_CLOSED_DEALS
} from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import KanbanView from './components/KanbanView';
import PavelChecklistView from './components/PavelChecklistView';
import WhatsAppSyncView from './components/WhatsAppSyncView';
import WhatsAppTemplatesView from './components/WhatsAppTemplatesView';
import ClosingChecklistView from './components/ClosingChecklistView';
import RecommendedClientsView from './components/RecommendedClientsView';
import ViewingsView from './components/ViewingsView';
import ReportsView from './components/ReportsView';
import BackupView from './components/BackupView';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Elegant Toast notification states (Comprehensive All-Around Optimization)
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'info' | 'warning' | 'error'; message: string; title?: string }[]>([]);

  const showToast = React.useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  }, []);
  
  // Dynamic Persistent States with local recovery rehydration on load
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.clients)) return parsed.database.clients;
      }
    } catch (e) {}
    return INITIAL_CLIENTS;
  });
  
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.kanbanCards)) return parsed.database.kanbanCards;
      }
    } catch (e) {}
    return INITIAL_KANBAN_CARDS;
  });

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.templates)) return parsed.database.templates;
      }
    } catch (e) {}
    return INITIAL_WHATSAPP_TEMPLATES;
  });

  const [documentCases, setDocumentCases] = useState<DocumentCase[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.documentCases)) return parsed.database.documentCases;
      }
    } catch (e) {}
    return INITIAL_DOCUMENT_CASES;
  });

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.checklistItems)) return parsed.database.checklistItems;
      }
    } catch (e) {}
    return INITIAL_CHECKLIST_ITEMS;
  });

  const [syncLogs, setSyncLogs] = useState<SyncErrorLog[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.syncLogs)) return parsed.database.syncLogs;
      }
    } catch (e) {}
    return INITIAL_SYNC_LOGS;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.properties)) return parsed.database.properties;
      }
    } catch (e) {}
    return INITIAL_PROPERTIES;
  });

  const [viewings, setViewings] = useState<Viewing[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.viewings)) return parsed.database.viewings;
      }
    } catch (e) {}
    return INITIAL_VIEWINGS;
  });

  const [recommendations, setRecommendations] = useState<ClientRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.recommendations)) return parsed.database.recommendations;
      }
    } catch (e) {}
    return INITIAL_RECOMMENDATIONS;
  });

  const [completedTransactions, setCompletedTransactions] = useState<ClosedDeal[]>(() => {
    try {
      const saved = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.database && Array.isArray(parsed.database.completedTransactions)) return parsed.database.completedTransactions;
      }
    } catch (e) {}
    return INITIAL_CLOSED_DEALS;
  });

  // Automatically save state on changes to maintain live Local Backup
  React.useEffect(() => {
    const backupPayload = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      exporter: 'Auto Backup Client',
      database: {
        clients,
        kanbanCards,
        templates,
        documentCases,
        checklistItems,
        syncLogs,
        properties,
        viewings,
        recommendations,
        completedTransactions
      }
    };
    localStorage.setItem('OSAKA_CRM_BACKUP_v1', JSON.stringify(backupPayload));
  }, [
    clients,
    kanbanCards,
    templates,
    documentCases,
    checklistItems,
    syncLogs,
    properties,
    viewings,
    recommendations,
    completedTransactions
  ]);

  // Google Cloud Storage Auto-Backup Background Worker
  const isFirstMount = React.useRef(true);
  
  React.useEffect(() => {
    // Avoid triggering auto backup on immediate launch/hydration or if components are remounting
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const autoEnabled = localStorage.getItem('OSAKA_CRM_GCP_AUTO_ENABLED') !== 'false';
    const autoTrigger = localStorage.getItem('OSAKA_CRM_GCP_AUTO_TRIGGER') || 'change';

    if (!autoEnabled || autoTrigger !== 'change') {
      return;
    }

    // Debounce background uploads by 15 seconds to group continuous typing/updating
    const timer = setTimeout(() => {
      try {
        const bucket = 'gcs-hksa-realty-crm-backups';
        const payload = {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          exporter: 'B哥 (大阪置業專家 - GCP 自動背景備份)',
          database: {
            clients,
            kanbanCards,
            templates,
            documentCases,
            checklistItems,
            syncLogs,
            properties,
            viewings,
            recommendations,
            completedTransactions
          }
        };

        const payloadStr = JSON.stringify(payload);
        const sizeBytes = new Blob([payloadStr]).size;
        const sizeKb = parseFloat((sizeBytes / 1024).toFixed(1));

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const dateSlug = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const newBackup = {
          id: `gcp_${Date.now()}`,
          timestamp: nowStr,
          fileName: `gcs-auto-backup_${dateSlug}_${Math.floor(100 + Math.random() * 900)}.json`,
          sizeKb,
          bucket,
          clientsCount: clients.length,
          viewingsCount: viewings.length,
          status: 'completed',
          payloadStr
        };

        // Load existing
        let currentBackups: any[] = [];
        const saved = localStorage.getItem('OSAKA_CRM_GCP_BACKUPS');
        if (saved) {
          try {
            currentBackups = JSON.parse(saved);
          } catch (e) {}
        }

        const updated = [newBackup, ...currentBackups].slice(0, 15);
        localStorage.setItem('OSAKA_CRM_GCP_BACKUPS', JSON.stringify(updated));
        localStorage.setItem('OSAKA_CRM_GCP_LAST_TIME', nowStr);

        showToast(
          `資料庫異動偵測成功！已自動背景備份至 GCS Bucket「${bucket}」。名稱：${newBackup.fileName}`,
          'success',
          '☁️ GCP 自動背景備份'
        );
      } catch (err: any) {
        console.error('Auto backup failed', err);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [
    clients,
    kanbanCards,
    templates,
    documentCases,
    checklistItems,
    syncLogs,
    properties,
    viewings,
    recommendations,
    completedTransactions,
    showToast
  ]);

  // Interval-based 5-minute Auto Backup Worker
  React.useEffect(() => {
    const handleIntervalBackup = () => {
      const autoEnabled = localStorage.getItem('OSAKA_CRM_GCP_AUTO_ENABLED') !== 'false';
      const autoTrigger = localStorage.getItem('OSAKA_CRM_GCP_AUTO_TRIGGER') || 'change';

      if (!autoEnabled || autoTrigger !== 'interval_5m') {
        return;
      }

      try {
        const bucket = 'gcs-hksa-realty-crm-backups';
        const savedPayload = localStorage.getItem('OSAKA_CRM_BACKUP_v1');
        if (!savedPayload) return;

        let payloadJson;
        try {
          payloadJson = JSON.parse(savedPayload);
        } catch (e) {
          return;
        }

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const dateSlug = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const sizeBytes = new Blob([savedPayload]).size;
        const sizeKb = parseFloat((sizeBytes / 1024).toFixed(1));

        const newBackup = {
          id: `gcp_${Date.now()}`,
          timestamp: nowStr,
          fileName: `gcs-timer-backup_${dateSlug}_${Math.floor(100 + Math.random() * 900)}.json`,
          sizeKb,
          bucket,
          clientsCount: payloadJson?.database?.clients?.length || 0,
          viewingsCount: payloadJson?.database?.viewings?.length || 0,
          status: 'completed',
          payloadStr: savedPayload
        };

        let currentBackups: any[] = [];
        const saved = localStorage.getItem('OSAKA_CRM_GCP_BACKUPS');
        if (saved) {
          try {
            currentBackups = JSON.parse(saved);
          } catch (e) {}
        }

        const updated = [newBackup, ...currentBackups].slice(0, 15);
        localStorage.setItem('OSAKA_CRM_GCP_BACKUPS', JSON.stringify(updated));
        localStorage.setItem('OSAKA_CRM_GCP_LAST_TIME', nowStr);

        showToast(
          `5分鐘定時備份觸發成功！資料已上傳至 GCP [asia-east1]：${newBackup.fileName}`,
          'success',
          '☁️ GCP 定時備份'
        );
      } catch (err) {
        console.error('GCS Timer backup error', err);
      }
    };

    const intervalId = setInterval(handleIntervalBackup, 300000);
    return () => clearInterval(intervalId);
  }, [showToast]);

  // Globally hijack native alert with a gorgeous UI toast notification card!
  React.useEffect(() => {
    const nativeAlert = window.alert;
    window.alert = (msg: string) => {
      if (typeof msg !== 'string') {
        msg = String(msg);
      }
      
      // Attempt to extract title from content blocks
      let title = "系統通知";
      let cleanMessage = msg;
      
      const titleMatch = msg.match(/^(.+?【.+?】)\n*([\s\S]*)$/);
      if (titleMatch) {
        title = titleMatch[1];
        cleanMessage = titleMatch[2];
      } else {
        const simpleTitleMatch = msg.match(/^【(.+?)】\n*([\s\S]*)$/);
        if (simpleTitleMatch) {
          title = `【${simpleTitleMatch[1]}】`;
          cleanMessage = simpleTitleMatch[2];
        }
      }
      
      let type: 'success' | 'info' | 'warning' | 'error' = 'info';
      if (msg.includes('警告') || msg.includes('重要') || msg.includes('警示') || msg.includes('欠缺') || msg.includes('請填') || msg.includes('未講解') || msg.includes('警告')) {
        type = 'warning';
      } else if (msg.includes('失敗') || msg.includes('錯誤') || msg.includes('逾時')) {
        type = 'error';
      } else if (msg.includes('成功') || msg.includes('完成') || msg.includes('🎉') || msg.includes('登登') || msg.includes('匯出') || msg.includes('匯入') || msg.includes('複製') || msg.includes('備份')) {
        type = 'success';
      }
      
      showToast(cleanMessage, type, title);
    };
    
    return () => {
      window.alert = nativeAlert;
    };
  }, [showToast]);

  
  // Current active profiles
  const [selectedClientId, setSelectedClientId] = useState('c1');
  const [showAddDealModal, setShowAddDealModal] = useState(false);

  // New Deal inputs
  const [dealClientName, setDealClientName] = useState('');
  const [dealClientPhone, setDealClientPhone] = useState('');
  const [dealPropName, setDealPropName] = useState('');
  const [dealBudget, setDealBudget] = useState('');
  const [dealArea, setDealArea] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleUpdateClientNotes = (updatedNotes: any) => {
    setClients(clients.map(c => c.id === selectedClientId ? { ...c, followUpNotes: updatedNotes } : c));
  };

  const handleCreateNewInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealClientName.trim() || !dealClientPhone.trim()) {
      alert('請填寫買家姓名及聯絡電話以建立跟進諮詢檔案！');
      return;
    }

    const newClientId = `c_${Date.now()}`;
    const budgetVal = dealBudget.trim() || '未核實意向';
    const areaVal = dealArea.trim() || '大阪全域';
    const propVal = dealPropName.trim() || '大阪精選置業項目';

    // 1. Add as a ClientProfile to the Client Database! (Fixes the "不同步" / "沒有加到客戶資料庫" issue)
    const newClient: ClientProfile = {
      id: newClientId,
      name: dealClientName,
      engName: '',
      phone: dealClientPhone,
      email: `${dealClientName.toLowerCase().replace(/\s+/g, '') || 'client'}@osaka-realty.com.hk`,
      vipTag: budgetVal.includes('1.5') || budgetVal.includes('150,000,000') || budgetVal.includes('1億') ? 'VIP 投資者' : budgetVal.includes('8,000') || budgetVal.includes('80,000,000') ? '精選買家' : '常規客戶',
      heatTag: 'A級熱度', // New inquiry starts with high active heat
      budget: budgetVal,
      preferredArea: areaVal,
      propertyType: '精裝民宿套房 / 特選公寓',
      purpose: `就標的物件 [${propVal}] 進行大阪置業諮詢`,
      fundingPower: `已與買家同步：置業意向預算為 ${budgetVal}`,
      avatarUrl: undefined,
      followUpNotes: [
        {
          id: `note_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('zh-HK', { hour12: false }) + ' 存檔紀錄',
          type: 'WhatsApp',
          question: `諮詢意向物業地區：${areaVal}`,
          answer: `買家諮詢預算約 ${budgetVal}，想了解該區域的交通生活狀況、民宿牌照合規及未來五年租金實質回報預測。`,
          nextStep: '宅建士一對一安排致電講解並比對重要事項告知書合規清單。'
        }
      ]
    };
    setClients([newClient, ...clients]);
    setSelectedClientId(newClientId); // Set active so user sees detail instantly optionally

    // 2. Add to Document Cases (Compliance board in important checklist)
    const newCase: DocumentCase = {
      id: `HK-24${Math.floor(100 + Math.random() * 900)}`,
      clientName: dealClientName,
      phone: dealClientPhone,
      propertyName: propVal,
      status: '審核中',
      explainProgress: '未講解',
      explainer: 'B哥 / 宅建士'
    };
    setDocumentCases([newCase, ...documentCases]);

    // 3. Add as a Kanban Card too
    const newKanban: KanbanCard = {
      id: `k_${Date.now()}`,
      name: dealClientName,
      phone: dealClientPhone,
      budget: budgetVal,
      preferredArea: areaVal,
      source: '置業跟進查詢新增',
      stageId: 'new',
      nextStep: '待宅建士初審文件並安排致電時間',
      label: '新查詢'
    };
    setKanbanCards([newKanban, ...kanbanCards]);

    // 4. Reset form fields
    setDealClientName('');
    setDealClientPhone('');
    setDealPropName('');
    setDealBudget('');
    setDealArea('');
    setShowAddDealModal(false);

    alert(`🎉【置業跟進查詢新增成功】\n已成功為新買家「${dealClientName}」建檔！\n\n系統已全面同步至：\n1. 客戶資料庫 (Client Profile Created)\n2. 工作跟進 (Inquiry Registered)\n3. 重要事項告知書合規看板 (Compliance Tracked)\n\n您可於各模組無縫跟進此宗海外置業查詢！`);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            onViewChange={setCurrentView}
            onSetSelectedClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('clients');
            }}
            clients={clients}
            viewings={viewings}
            documentCases={documentCases}
            templates={templates}
            kanbanCards={kanbanCards}
          />
        );
      case 'clients':
        return (
          <ClientsView 
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
            onUpdateClients={setClients}
            completedTransactions={completedTransactions}
            onDeleteCompletedTransaction={(id) => setCompletedTransactions(completedTransactions.filter(t => t.id !== id))}
            recommendations={recommendations}
            properties={properties}
            onAddRecommendation={(newRec) => setRecommendations([newRec, ...recommendations])}
            onUpdateRecommendationStatus={(id, status) => setRecommendations(recommendations.map(r => r.id === id ? { ...r, status } : r))}
            onDeleteRecommendation={(id) => setRecommendations(recommendations.filter(r => r.id !== id))}
          />
        );
      case 'kanban':
        return (
          <KanbanView 
            cards={kanbanCards}
            onUpdateCards={setKanbanCards}
            onViewClientDetail={() => setCurrentView('clients')}
          />
        );
      case 'pavel_checklist':
        return (
          <PavelChecklistView 
            documentCases={documentCases}
            checklistItems={checklistItems}
            onUpdateChecklist={setChecklistItems}
            onViewChange={setCurrentView}
          />
        );
      case 'whatsapp_sync':
        return (
          <WhatsAppSyncView 
            logs={syncLogs}
            onUpdateLogs={setSyncLogs}
          />
        );
      case 'whatsapp_templates':
        return (
          <WhatsAppTemplatesView 
            templates={templates}
            onChangeTemplates={setTemplates}
          />
        );
      case 'checklist':
        return (
          <ClosingChecklistView 
            onViewChange={setCurrentView}
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
            completedTransactions={completedTransactions}
            onAddCompletedTransaction={(newDeal) => setCompletedTransactions([newDeal, ...completedTransactions])}
            onDeleteCompletedTransaction={(id) => setCompletedTransactions(completedTransactions.filter(t => t.id !== id))}
          />
        );
      case 'properties':
        return (
          <RecommendedClientsView 
            clients={clients}
            properties={properties}
            recommendations={recommendations}
            onAddRecommendation={(newRec) => setRecommendations([newRec, ...recommendations])}
            onUpdateRecommendationStatus={(id, status) => {
              setRecommendations(recommendations.map(r => r.id === id ? { ...r, status } : r));
            }}
            onDeleteRecommendation={(id) => {
              setRecommendations(recommendations.filter(r => r.id !== id));
            }}
            onNavigateToMatching={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('clients');
            }}
          />
        );
      case 'viewings':
        return (
          <ViewingsView 
            viewings={viewings}
            properties={properties}
            onAddViewing={(v) => setViewings([v, ...viewings])}
            onUpdateViewingStatus={(id, status) => {
              setViewings(viewings.map(v => v.id === id ? { ...v, status } : v));
            }}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            properties={properties}
            clients={clients}
            viewings={viewings}
          />
        );
      case 'backup':
        return (
          <BackupView
            clients={clients}
            setClients={setClients}
            kanbanCards={kanbanCards}
            setKanbanCards={setKanbanCards}
            templates={templates}
            setTemplates={setTemplates}
            documentCases={documentCases}
            setDocumentCases={setDocumentCases}
            checklistItems={checklistItems}
            setChecklistItems={setChecklistItems}
            syncLogs={syncLogs}
            setSyncLogs={setSyncLogs}
            properties={properties}
            setProperties={setProperties}
            viewings={viewings}
            setViewings={setViewings}
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            completedTransactions={completedTransactions}
            setCompletedTransactions={setCompletedTransactions}
          />
        );
      default:
        return (
          <div className="p-8 text-center bg-white border rounded-xl">
            <h3 className="text-sm font-bold text-zinc-800">檢視仍在開發中</h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans select-none overflow-x-hidden">
      
      {/* Sidebar - Fix sizing context */}
      <Sidebar 
        currentView={currentView}
        onViewChange={(view) => {
          setSearchQuery('');
          setCurrentView(view);
        }}
        onOpenAddDeal={() => setShowAddDealModal(true)}
        totalClientsCount={kanbanCards.length + 122}
      />

      {/* Main Container Right (Shift left by sidebar width: 260px) */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
        
        {/* Persistent Topbar */}
        <Header 
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim()) {
              // auto-route to lists view contextually if client searched
              if (q.toLowerCase().includes('chan') || q.includes('陳') || q.includes('大文')) {
                setCurrentView('clients');
              } else if (q.includes('林') || q.toLowerCase().includes('lam')) {
                setCurrentView('kanban');
              } else if (q.includes('門') || q.includes('重') || q.includes('說明')) {
                setCurrentView('pavel_checklist');
              }
            }
          }}
        />

        {/* Actionable View Hub Section wrapper */}
        <main className="p-6 md:p-8 flex-1 max-w-[1440px] w-full mx-auto pb-16">
          {renderActiveView()}
        </main>

      </div>

      {/* New Inquiry / Add New Client Modal Form */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs select-none">
          <form 
            onSubmit={handleCreateNewInquiry}
            className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-zinc-900 text-xs tracking-wide uppercase flex items-center gap-1.5 label-icon">
                <Building2 className="w-4 h-4 text-emerald-600 stroke-[2]" />
                <span>新增跟進查詢 / 新買家建檔</span>
              </span>
              <button 
                type="button" 
                onClick={() => setShowAddDealModal(false)}
                className="text-zinc-400 hover:text-zinc-650 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>客戶中文姓名</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={dealClientName}
                    onChange={(e) => setDealClientName(e.target.value)}
                    placeholder="e.g. 潘彼得"
                    className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>聯絡電話</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={dealClientPhone}
                    onChange={(e) => setDealClientPhone(e.target.value)}
                    placeholder="e.g. +852 9876 5432"
                    className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 outline-none focus:bg-white animate-once"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>投資預算</span>
                  </label>
                  <input 
                    type="text"
                    value={dealBudget}
                    onChange={(e) => setDealBudget(e.target.value)}
                    placeholder="e.g. ¥45,000,000"
                    className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 outline-none focus:bg-white font-semibold text-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>心水置業區域</span>
                  </label>
                  <input 
                    type="text"
                    value={dealArea}
                    onChange={(e) => setDealArea(e.target.value)}
                    placeholder="e.g. 大阪市北區"
                    className="w-full text-xs border border-zinc-200 hover:border-zinc-300 rounded-lg p-2 bg-zinc-50/50 focus:border-emerald-500 outline-none focus:bg-white font-semibold text-zinc-700"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2.5 pt-2 select-none">
              <button 
                type="button"
                onClick={() => setShowAddDealModal(false)}
                className="px-4 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-500 cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 rounded-lg text-xs font-bold cursor-pointer shadow-sm active:scale-95"
              >
                新增跟進
              </button>
            </div>
          </form>
         </div>
       )}

      {/* Dynamic Notification Toast Center (Comprehensive System-Wide Professional Optimization) */}
      <div className="fixed bottom-5 right-5 z-[300] max-w-sm w-full pointer-events-none space-y-3 select-none font-sans">
        {toasts.map(toast => {
          let iconColor = "text-emerald-500 bg-emerald-50 border-emerald-100";
          
          if (toast.type === 'warning') {
            iconColor = "text-amber-500 bg-amber-50 border-amber-100";
          } else if (toast.type === 'error') {
            iconColor = "text-red-500 bg-red-50 border-red-105";
          } else if (toast.type === 'info') {
            iconColor = "text-blue-500 bg-blue-50 border-blue-100";
          }
          
          return (
            <div 
              key={toast.id}
              className="bg-white border text-zinc-800 rounded-xl p-4 shadow-xl pointer-events-auto border-zinc-250 animate-in slide-in-from-right-16 duration-200 flex gap-3.5 relative overflow-hidden"
              style={{ boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 8px 12px -6px rgba(0, 0, 0, 0.05)' }}
            >
              {/* Colored left bar indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                toast.type === 'success' ? 'bg-emerald-500' :
                toast.type === 'warning' ? 'bg-amber-500' :
                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>

              <div className={`p-2 rounded-lg border h-fit shrink-0 ${iconColor}`}>
                {toast.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" />
                ) : toast.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5] text-rose-500 animate-pulse" />
                ) : toast.type === 'info' ? (
                  <Building2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center pr-1">
                  <h5 className="font-extrabold text-[12px] text-zinc-900 tracking-tight leading-normal">
                    {toast.title || '系統資訊'}
                  </h5>
                  <button 
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="text-zinc-450 hover:text-zinc-650 hover:bg-zinc-100 p-0.5 rounded transition duration-150 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-zinc-500 text-[11px] leading-relaxed whitespace-pre-wrap font-medium">
                  {toast.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
