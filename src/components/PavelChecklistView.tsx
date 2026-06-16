import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  CheckSquare, 
  FileText, 
  Upload, 
  ChevronRight, 
  Info, 
  X,
  UserCheck
} from 'lucide-react';
import { DocumentCase, ChecklistItem, ActiveView } from '../types';

interface PavelChecklistViewProps {
  documentCases: DocumentCase[];
  checklistItems: ChecklistItem[];
  onUpdateChecklist: (updatedChecklist: ChecklistItem[]) => void;
  onViewChange: (view: ActiveView) => void;
}

export default function PavelChecklistView({ 
  documentCases, 
  checklistItems, 
  onUpdateChecklist,
  onViewChange
}: PavelChecklistViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleToggleChecklist = (id: number) => {
    const updated = checklistItems.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    onUpdateChecklist(updated);
  };

  const handleUploadFileSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(0);
            alert("重要事項告知書上傳成功！宅地建物取引士(宅建士)已自動排程合規審閱。");
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const filteredCases = documentCases.filter(c => 
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in-50 duration-200">
      
      {/* Page Header toolbar */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">重要事項告知書</h2>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">B哥個人合規進度管理 (宅地建物取引法合規安全防護)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 h-8.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-950 stroke-[2.5]" />
            <span>上傳新範本</span>
          </button>
        </div>
      </div>

      {/* Warning Compliance Banner */}
      <div className="bg-rose-50 border-l-[4px] border-l-rose-500 p-4 rounded-r-xl border border-rose-100 flex items-start gap-3 shadow-sm select-text">
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <h4 className="font-bold text-rose-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">注意：進入契約階段前置作業</h4>
          <p className="text-zinc-650 text-xs mt-1 leading-relaxed font-semibold">
            「重要事項告知書未講解，未完成前不建議進入契約階段範疇。」請確保所有必填項目與宅建士講解程序正式完成，以符合本法法規要求，強力避免交易爭議，保證投資者避坑。
          </p>
        </div>
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Case List Table (xl:col-span-2) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between">
          
          {/* Table Header toolbar search bar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>重要事項說明文件管理</span>
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋姓名、案件 ID、物業項目..."
                className="pl-9 pr-4 py-1.5 border border-zinc-200 hover:border-zinc-300 rounded-lg text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Real Cases Grid Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-zinc-100 text-zinc-500 uppercase tracking-wide font-bold">
                <tr className="border-b border-zinc-200">
                  <th className="py-2.5 px-4 font-bold">案件編號</th>
                  <th className="py-2.5 px-4 font-bold">客戶 / 物件目標</th>
                  <th className="py-2.5 px-4 font-bold">文件狀態</th>
                  <th className="py-2.5 px-4 font-bold">講解進度與時間</th>
                  <th className="py-2.5 px-4 font-bold">執法講解人</th>
                  <th className="py-2.5 px-4 text-right font-bold">合規操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                {filteredCases.map((c) => {
                  const isUnexplained = c.explainProgress === '未講解';
                  const isScheduled = c.explainProgress === '已安排';
                  const isCompleted = c.explainProgress === '已講解';
                  
                  return (
                    <tr key={c.id} className="hover:bg-zinc-55 transition duration-150">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{c.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-900">{c.clientName}</div>
                        <div className="text-zinc-500 mt-0.5 text-[10px]">{c.propertyName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.status === '已確認' 
                            ? 'bg-emerald-100 text-emerald-850 border-emerald-200' 
                            : c.status === '審核中' 
                            ? 'bg-amber-100 text-amber-850 border-amber-200' 
                            : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isCompleted ? 'bg-emerald-500' : isScheduled ? 'bg-amber-400' : 'bg-rose-500'
                          }`}></span>
                          <span className={`font-bold uppercase ${
                            isCompleted ? 'text-emerald-700' : isScheduled ? 'text-amber-700' : 'text-rose-600'
                          }`}>{c.explainProgress}</span>
                        </div>
                        {c.explainDate && (
                          <div className="text-zinc-400 mt-0.5 text-[10px] font-mono">{c.explainDate}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 font-medium">{c.explainer}</td>
                      <td className="py-3 px-4 text-right">
                        {isCompleted ? (
                          <button 
                            onClick={() => onViewChange('checklist')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-sm active:scale-95"
                          >
                            <span>進入契約</span>
                            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => alert(`【功能演示】\n案件：${c.id}\n已為您自動通知宅建士排定「${c.clientName}」的重說講解日期，並發送 WhatsApp 提醒！`)}
                            className="text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-600 px-2.5 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            安排講解
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Standard Checklist Detail (xl:col-span-1) */}
        <div className="xl:col-span-1 bg-white rounded-xl border border-zinc-200 p-5 flex flex-col shadow-sm">
          <h3 className="text-xs font-bold text-zinc-800 flex items-center gap-2 mb-4 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>合規核對清單 (Checklist)</span>
          </h3>

          <div className="space-y-4 flex-1">
            {checklistItems.map((item) => {
              const isDisabled = item.id <= 2; // initial checked step
              return (
                <div 
                  key={item.id}
                  onClick={() => !isDisabled && handleToggleChecklist(item.id)}
                  className={`border rounded-xl p-3.5 transition duration-150 select-none flex items-start gap-3 relative overflow-hidden bg-zinc-50/50 ${
                    isDisabled 
                      ? 'border-zinc-200 opacity-65 cursor-not-allowed bg-zinc-50' 
                      : item.checked 
                      ? 'border-emerald-500 bg-emerald-50/35 cursor-pointer shadow-sm' 
                      : 'border-zinc-200 hover:border-emerald-300 hover:bg-white cursor-pointer shadow-none'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    disabled={isDisabled}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-zinc-300 pointer-events-none"
                  />
                  <div>
                    <h4 className={`text-xs font-bold ${item.checked ? 'text-zinc-800' : 'text-zinc-500'}`}>
                      {item.label}
                    </h4>
                    <p className="text-[10.5px] text-zinc-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    {item.alert && (
                      <div className="mt-2 text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded px-2 py-0.5 font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        <span>{item.alert}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Upload Doc Modal Simulation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs select-none">
          <form 
            onSubmit={handleUploadFileSimulation}
            className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-zinc-800 text-xs uppercase">上傳合規告知書 (重要事項説明)</span>
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-400 hover:text-zinc-650 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center space-y-2">
              <Upload className="w-8 h-8 text-zinc-400 mx-auto stroke-[1.5]" />
              <p className="text-zinc-700 text-xs font-semibold">拖曳至此處或點擊上傳重要文件</p>
              <p className="text-[10px] text-zinc-400">支援 .pdf、.docx 格式，最大 10MB</p>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold font-mono text-zinc-600">
                  <span>傳送中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-500 cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-zinc-900 border border-zinc-90 w hover:bg-zinc-800 rounded-lg text-xs font-bold text-white cursor-pointer shadow-sm"
              >
                模擬備齊
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
