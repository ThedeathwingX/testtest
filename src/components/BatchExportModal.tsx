import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  UserCheck2, 
  Search, 
  ShieldCheck, 
  FileCheck2, 
  UserPlus,
  Coins,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';
import { ClientProfile } from '../types';

interface BatchExportModalProps {
  show: boolean;
  onClose: () => void;
  clients: ClientProfile[];
}

interface StepItem {
  id: number;
  label: string;
  desc: string;
  status: 'completed' | 'active' | 'blocked' | 'future';
  actionLabel?: string;
}

export default function BatchExportModal({ show, onClose, clients }: BatchExportModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(clients.map(c => c.id));
  const [searchText, setSearchText] = useState('');

  if (!show) return null;

  // Re-generate steps logic identical to ClosingChecklistView
  const getInitialStepsForClient = (clientId: string): StepItem[] => {
    const defaultSteps: StepItem[] = [
      { id: 1, label: '1. 需求確認', desc: '篩選並釐清大阪市中心合規投資之期望意向與置業方向。', status: 'completed' },
      { id: 2, label: '2. 推盤介接', desc: '依據預算，精選發送大阪區域首選優質盤源與樓書。', status: 'completed' },
      { id: 3, label: '3. 視像/現場睇樓', desc: '聯動專員現場視像 live 直播帶看、解析大樓環境配套與完好度。', status: 'completed' },
      { id: 4, label: '4. 議價及意向階段', desc: '協商置業條件，確認免責規則，簽收買方意向委託。', status: 'completed' },
      { id: 5, label: '5. 買付申込書提出', desc: '由本司指派宅建士填寫正式買付意願書，提呈日本賣方進行留盤。', status: 'completed' },
      { id: 6, label: '6. 重要事項告知書收到', desc: '等待並收取日本賣方、司法書士機構寄達之重要事項正式合規調查文本。', status: 'active' },
      { id: 7, label: '7. B哥親自安排宅建士講解', desc: '指派大阪持牌取引士，針對產權、修繕積立金規章和隱加利息進行講解。', status: 'blocked' },
      { id: 8, label: '8. 客戶確認明白條款', desc: '買方深度細閱並完全理會告知書每一章節，簽署確認反饋。', status: 'blocked' },
      { id: 9, label: '9. 買賣契約用印簽署', desc: '雙方正式簽字並用印於重要事項說明書與買賣契約，歸檔備份。', status: 'future' },
      { id: 10, label: '10. 尾款及首期安全匯款', desc: '指導客戶依法規把置業尾款/首期匯入日本官方信託交易安全專戶。', status: 'future' },
      { id: 11, label: '11. 所有權移轉及交樓', desc: '司法書士移轉登記簿所有權，交付物業精裝鑰匙。', status: 'future' },
      { id: 12, label: '12. 售後託管合同簽署', desc: '代理商正式介接日本合規牌照專屬託管物業管理，開始收租回報！', status: 'future' }
    ];

    if (clientId === 'c2') {
      return defaultSteps.map(s => {
        if (s.id <= 3) return { ...s, status: 'completed' as const };
        if (s.id === 4) return { ...s, status: 'active' as const };
        if (s.id === 5) return { ...s, status: 'blocked' as const };
        if (s.id > 5) return { ...s, status: 'future' as const };
        return s;
      });
    }

    if (clientId === 'c3') {
      return defaultSteps.map(s => {
        if (s.id <= 2) return { ...s, status: 'completed' as const };
        if (s.id === 3) return { ...s, status: 'active' as const };
        if (s.id === 4) return { ...s, status: 'blocked' as const };
        if (s.id > 4) return { ...s, status: 'future' as const };
        return s;
      });
    }

    if (clientId === 'c4') {
      return defaultSteps.map(s => {
        if (s.id <= 4) return { ...s, status: 'completed' as const };
        if (s.id === 5) return { ...s, status: 'active' as const };
        if (s.id === 6) return { ...s, status: 'blocked' as const };
        if (s.id > 6) return { ...s, status: 'future' as const };
        return s;
      });
    }

    return defaultSteps;
  };

  const getClientStepsLive = (clientId: string): StepItem[] => {
    const saved = localStorage.getItem('OSAKA_CRM_CLIENT_STEPS_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[clientId]) {
          return parsed[clientId];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return getInitialStepsForClient(clientId);
  };

  const filteredClients = clients.filter(c => {
    const q = searchText.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.engName && c.engName.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      c.vipTag.toLowerCase().includes(q)
    );
  });

  const handleToggleSelect = (clientId: string) => {
    if (selectedIds.includes(clientId)) {
      setSelectedIds(selectedIds.filter(id => id !== clientId));
    } else {
      setSelectedIds([...selectedIds, clientId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map(c => c.id));
    }
  };

  const selectedClients = clients.filter(c => selectedIds.includes(c.id));

  // High fidelity report styling generator
  const getFormattedReportHTML = () => {
    return selectedClients.map((client, index) => {
      const steps = getClientStepsLive(client.id);
      const completedSteps = steps.filter(s => s.status === 'completed');
      const latestFollowUp = client.followUpNotes && client.followUpNotes.length > 0 
        ? client.followUpNotes[0] 
        : null;

      return `
        <div class="client-card ${index > 0 && index % 2 === 0 ? 'page-break' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #065f46; padding-bottom: 10px; margin-bottom: 15px;">
            <div>
              <span style="font-size: 11px; background: #065f46; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-bottom: 4px; display: inline-block;">
                合約摘要編碼：TXN-${client.id.toUpperCase()}-2026
              </span>
              <h2 style="font-size: 18px; margin: 0; font-weight: bold; color: #111827;">
                置業大客摘要：${client.name} ${client.engName ? `(${client.engName})` : ''}
              </h2>
            </div>
            <div style="text-align: right;">
              <span class="badge ${
                client.vipTag === 'VIP 投資者' 
                  ? 'badge-vip' 
                  : 'badge-heat'
              }">${client.vipTag}</span>
              <span style="font-size: 10px; font-weight: bold; color: #b91c1c; border: 1px solid #fee2e2; background: #fef2f2; padding: 2px 6px; border-radius: 4px;">
                ${client.heatTag}
              </span>
            </div>
          </div>

          <!-- Basic client Info -->
          <table class="meta-table">
            <tr>
              <th>置業買家基本資料</th>
              <td>
                <strong>手機號碼：</strong>${client.phone}<br/>
                <strong>電子郵箱：</strong>${client.email}<br/>
                <strong>資金實力：</strong>${client.fundingPower}
              </td>
            </tr>
            <tr>
              <th>投資預算及標的需求</th>
              <td>
                <strong>資產總預算：</strong><span style="color: #b45309; font-weight: bold;">${client.budget}</span><br/>
                <strong>心水大區：</strong>${client.preferredArea}<br/>
                <strong>擬選物業目標：</strong>${client.propertyType}<br/>
                <strong>購買主要目的：</strong>${client.purpose || '投資收租 (大阪防伏)'}<br/>
                <strong>當前成交流程狀態：</strong><span style="color: #047857; font-weight: bold;">⚡️ ${client.dealStatus || '意向排查中'}</span>
              </td>
            </tr>
          </table>

          <!-- 12-Step checklist status summary -->
          <div class="section-title">跟进成交流程十二部曲履行進度 (${completedSteps.length} / 12)</div>
          <div class="steps-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            ${steps.map(s => {
              const isComp = s.status === 'completed';
              const isAct = s.status === 'active';
              return `
                <div class="step-item ${isComp ? 'step-completed' : ''}" style="border: 1px solid ${isComp ? '#a7f3d0' : isAct ? '#fde68a' : '#e5e7eb'}; background: ${isComp ? '#f0fdf4' : isAct ? '#fefcbf' : '#f9fafb'}; padding: 6px 8px; border-radius: 4px; font-size: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: ${isComp || isAct ? 'bold' : 'normal'}; color: ${isComp ? '#065f46' : isAct ? '#854d0e' : '#6b7280'};">
                    ${s.label}
                  </span>
                  <span style="font-size: 8.5px; font-weight: bold; padding: 1px 4px; border-radius: 3px; background: ${isComp ? '#d1fae5' : isAct ? '#fef3c7' : '#f3f4f6'}; color: ${isComp ? '#065f46' : isAct ? '#92400e' : '#9ca3af'};">
                    ${isComp ? '✓ 已完成' : isAct ? '★ 進行中' : '🔒 待進行'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Latest consulting log -->
          ${latestFollowUp ? `
            <div class="section-title">最新合規諮詢紀錄 (${latestFollowUp.timestamp})</div>
            <div class="notes-box">
              <strong>1. 客戶最新諮詢/提問：</strong><br/>
              <span style="display: inline-block; margin-bottom: 6px; font-style: italic;">"${latestFollowUp.question}"</span><br/>
              <strong>2. 大阪團隊B哥專業解答：</strong><br/>
              <span>"${latestFollowUp.answer}"</span><br/>
              <strong style="margin-top: 4px; display: block; color: #047857;">下一步行動行動部署：${latestFollowUp.nextStep}</strong>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  };

  const handlePrintPDF = () => {
    if (selectedClients.length === 0) {
      alert('請先勾選欲導出合約摘要之買家！');
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;
    
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>大阪置業合約及跟進摘要報表 - 批量歸檔</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif; padding: 25px; color: #1f2937; line-height: 1.4; }
            .report-container { max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px double #10b981; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header h1 { margin: 0; font-size: 20px; color: #065f46; letter-spacing: 1.5px; font-weight: bold; }
            .header p { margin: 4px 0 0 0; font-size: 11px; color: #6b7280; font-weight: 500; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; margin-top: 5px; }
            .meta-table th { background: #f3f4f6; text-align: left; padding: 6px 10px; font-size: 10.5px; font-weight: bold; border: 1px solid #d1d5db; width: 25%; color: #374151; }
            .meta-table td { padding: 6px 10px; font-size: 10.5px; border: 1px solid #d1d5db; color: #1f2937; }
            .client-card { border: 1px solid #9ca3af; border-radius: 8px; padding: 18px; margin-bottom: 25px; page-break-inside: avoid; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .badge { display: inline-block; padding: 1.5px 5px; font-size: 8.5px; font-weight: bold; border-radius: 3px; margin-right: 4px; text-transform: uppercase; }
            .badge-vip { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .badge-heat { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
            .section-title { font-size: 11.5px; font-weight: bold; color: #111827; margin: 12px 0 6px 0; border-left: 3.5px solid #059669; padding-left: 6px; }
            .step-item { display: flex; justify-content: space-between; align-items: center; }
            .step-completed { border-color: #a7f3d0 !important; background: #ecfdf5 !important; color: #065f46 !important; }
            .notes-box { background: #f9fafb; border: 1px solid #e5e7eb; border-left: 3.5px solid #10b981; padding: 8px 12px; margin-top: 8px; font-size: 10px; line-height: 1.45; color: #374151; border-radius: 4px; }
            .footer { text-align: center; margin-top: 40px; font-size: 9.5px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px; font-weight: 500; }
            .stamp-box { position: relative; }
            .stamp-image { position: absolute; right: 20px; bottom: 5px; border: 2.5px solid #dc2626; color: #dc2626; font-size: 10px; font-weight: bold; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); opacity: 0.85; text-transform: uppercase; pointer-events: none; }
            @media print {
              body { padding: 0; background: white; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <div>
                <h1>大阪合規置業買家・代理合約摘要備案</h1>
                <p>OSAKA TRUST REALTY • COMPLIANCE LEDGER REPORT</p>
              </div>
              <div style="text-align: right; font-size: 10px; color: #4b5563; font-weight: bold;">
                存檔印發時間：2026年Q2財政期 (June 2026)<br/>
                大阪交易督導：B Gor 及合規取引士團隊印製
              </div>
            </div>

            ${getFormattedReportHTML()}

            <div class="footer">
              🚨 法律存備聲明：本島内已完成及跟進中之不動產承作資訊均受日本《宅地建物取引業法》保護。歸檔摘要經由持牌宅建士與司法書士複核簽章。<br/>
              © 2026 大阪合規直營地產代理處。全權所有，翻印必究。
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 600);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  const handleDownloadHTML = () => {
    if (selectedClients.length === 0) {
      alert('請先勾選欲導出備查文件之買家！');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>大阪代理合約及跟進合規摘要備案</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif; padding: 40px; color: #1f2937; background-color: #f3f4f6; line-height: 1.5; }
            .report-container { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { border-bottom: 3px double #10b981; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header h1 { margin: 0; font-size: 22px; color: #065f46; letter-spacing: 1.5px; font-weight: bold; }
            .header p { margin: 4px 0 0 0; font-size: 11px; color: #6b7280; font-weight: bold; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .meta-table th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 11px; font-weight: bold; border: 1px solid #d1d5db; width: 25%; color: #374151; }
            .meta-table td { padding: 8px 12px; font-size: 11px; border: 1px solid #d1d5db; color: #1f2937; }
            .client-card { border: 1px solid #9ca3af; border-radius: 8px; padding: 20px; margin-bottom: 35px; background: #fff; page-break-inside: avoid; }
            .badge { display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 4px; margin-right: 5px; text-transform: uppercase; }
            .badge-vip { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .badge-heat { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
            .section-title { font-size: 12px; font-weight: bold; color: #111827; margin: 15px 0 8px 0; border-left: 4px solid #059669; padding-left: 8px; }
            .step-item { display: flex; justify-content: space-between; align-items: center; }
            .step-completed { border-color: #a7f3d0 !important; background: #ecfdf5 !important; color: #065f46 !important; }
            .notes-box { background: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #10b981; padding: 12px 16px; margin-top: 10px; font-size: 11px; line-height: 1.5; color: #374151; border-radius: 4px; }
            .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; font-weight: bold; }
            .btn { display: inline-block; background: #0f172a; color: white; padding: 8px 16px; font-size: 11px; font-weight: bold; border-radius: 6px; text-decoration: none; border: none; cursor: pointer; }
            .btn-print-box { text-align: right; margin-bottom: 20px; }
            @media print {
              body { padding: 0; background: white; }
              .report-container { max-width: 100%; border: none; padding: 0; box-shadow: none; }
              .btn-print-box { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="btn-print-box">
              <button class="btn" onclick="window.print()">列印/導出成 PDF (Print to PDF)</button>
            </div>
            
            <div class="header">
              <div>
                <h1>大阪合規置業買家・代理合約摘要備案</h1>
                <p>OSAKA TRUST REALTY • COMPLIANCE LEDGER REPORT</p>
              </div>
              <div style="text-align: right; font-size: 10px; color: #4b5563; font-weight: bold;">
                存檔印發時間：2026年Q2財政期 (June 2026)<br/>
                大阪交易督導：B Gor 及合規取引士團隊印製
              </div>
            </div>

            ${getFormattedReportHTML()}

            <div class="footer">
              🚨 法律存備聲明：本島内已完成及跟進中之不動產承作資訊均受日本《宅地建物取引業法》保護。歸檔摘要經由持牌宅建士與司法書士複核簽章。<br/>
              © 2026 大阪合規直營地產代理處。全權所有，翻印必究。
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `大客合約與合規摘要批量存檔_${new Date().toISOString().split('T')[0]}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('🎉 電子封存副本 (HTML) 已成功生成並下載。您隨時可以雙擊打開它並以高清格式直接列印或另存成 PDF 合約摘要。');
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl border overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-zinc-900 text-white flex justify-between items-center shrink-0">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-emerald-400" />
              <span>「批量匯出成合約摘要說明」合規歸檔面板</span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-bold">
              快速將指定買家、置業預算及12部曲交易跟進進度匯集成紙本與電子摘要報告。
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          
          {/* Quick instructions */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-zinc-650">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-900 font-extrabold block">B哥合規小錦囊：合約及跟進進度批處理</strong>
              <span>
                此工具可自動加載買家在 <strong>大阪成流程十二部曲</strong> 內的最新履約狀態，一鍵導出為 A4 完美尺寸的紙本格式。您可直接將其「另存為 PDF」或「印發電子快照」，方便隨時遞交大阪市役所備案存檔。
              </span>
            </div>
          </div>

          {/* Search bar & Bulk selections */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50 p-3 rounded-xl border">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="搜尋篩選買家..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full text-xs border border-zinc-200 bg-white rounded-lg pl-8.5 pr-2.5 py-1 outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-bold text-zinc-600 hover:text-zinc-900 px-3 py-1 bg-white hover:bg-zinc-100 border rounded-lg transition cursor-pointer self-stretch sm:self-auto text-center"
            >
              {selectedIds.length === filteredClients.length ? '取消全選' : `選取過濾結果 (${filteredClients.length})`}
            </button>
          </div>

          {/* Client select table */}
          <div className="border rounded-xl overflow-hidden max-h-56 overflow-y-auto bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 border-b font-extrabold text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2 w-12 text-center">選取</th>
                  <th className="px-4 py-2">置業大客姓名</th>
                  <th className="px-4 py-2">資產總預算</th>
                  <th className="px-4 py-2">當前成交狀態</th>
                  <th className="px-4 py-2">履行進度 (12部曲)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                {filteredClients.map((client) => {
                  const isChecked = selectedIds.includes(client.id);
                  const clientSteps = getClientStepsLive(client.id);
                  const completedLength = clientSteps.filter(s => s.status === 'completed').length;
                  
                  return (
                    <tr 
                      key={client.id}
                      onClick={() => handleToggleSelect(client.id)}
                      className={`hover:bg-zinc-50/50 cursor-pointer transition ${isChecked ? 'bg-emerald-50/20' : ''}`}
                    >
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(client.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-extrabold text-zinc-900">{client.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono font-medium">{client.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-amber-800 font-mono font-bold">
                        {client.budget}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-150 rounded px-1.5 py-0.5 text-[9.5px] font-bold">
                          {client.dealStatus || '意向排查中'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-zinc-700">{completedLength}/12 履約</span>
                      </td>
                    </tr>
                  );
                })}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-zinc-400">
                      查無匹配的置業買家資料。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Hidden temporary DOM for preview & metadata extraction */}
          <div id="printable-batch-report" className="hidden">
            {selectedClients.map((client) => {
              const steps = getClientStepsLive(client.id);
              const completedSteps = steps.filter(s => s.status === 'completed');
              const latestFollowUp = client.followUpNotes && client.followUpNotes.length > 0 
                ? client.followUpNotes[0] 
                : null;

              return (
                <div key={client.id} className="client-card">
                  <div className="stamp-box">
                    <div className="stamp-image">B GOR<br/>APPROVED</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #065f46', paddingBottom: '8px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '10px', background: '#059669', color: 'white', padding: '1.5px 5px', borderRadius: '3px', fontWeight: 'bold', marginBottom: '3px', display: 'inline-block' }}>
                        存檔合約邊碼：TXN-{client.id.toUpperCase()}-2026
                      </span>
                      <h2 style={{ fontSize: '17px', margin: 0, fontWeight: 'bold', color: '#111827' }}>
                        大阪置业合规摘要書：{client.name} {client.engName ? `(${client.engName})` : ''}
                      </h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-vip">{client.vipTag}</span>
                      <span className="badge badge-heat">{client.heatTag}</span>
                    </div>
                  </div>

                  <table className="meta-table">
                    <tbody>
                      <tr>
                        <th>置業買家基本資料</th>
                        <td>
                          <strong>聯絡電話：</strong>{client.phone}<br/>
                          <strong>電子郵箱：</strong>{client.email}<br/>
                          <strong>置業標籤等級：</strong>{client.vipTag}<br/>
                          <strong>資金實力證明：</strong>{client.fundingPower}
                        </td>
                      </tr>
                      <tr>
                        <th>投資預算及標的需求</th>
                        <td>
                          <strong>資產總預算：</strong><span style={{ color: '#b45309', fontWeight: 'bold' }}>{client.budget}</span><br/>
                          <strong>意向大區：</strong>{client.preferredArea}<br/>
                          <strong>擬置業類型：</strong>{client.propertyType}<br/>
                          <strong>置業目的：</strong>{client.purpose || '大阪防伏置業'}<br/>
                          <strong>當前成交狀態：</strong><span style={{ color: '#047857', fontWeight: 'bold' }}>{client.dealStatus || '意向排查中'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="section-title">跟進成交流程十二部曲履行進度 ({completedSteps.length} / 12)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    {steps.map(s => {
                      const isComp = s.status === 'completed';
                      return (
                        <div key={s.id} className={`step-item ${isComp ? 'step-completed' : ''}`} style={{ border: '1px solid #e5e7eb', padding: '5px 8px', borderRadius: '4px', fontSize: '10px' }}>
                          <span style={{ color: isComp ? '#065f46' : '#6b7280', fontWeight: isComp ? 'bold' : 'normal' }}>
                            {s.label}
                          </span>
                          <span style={{ fontSize: '8px', color: isComp ? '#059669' : '#9ca3af', fontWeight: 'bold' }}>
                            {isComp ? '✓ 已完成' : '🔒 待核銷'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {latestFollowUp && (
                    <>
                      <div className="section-title">最新合規置業諮詢對談錄 ({latestFollowUp.timestamp})</div>
                      <div className="notes-box">
                        <strong>1. 客戶最新諮詢/提問：</strong><br/>
                        <span style={{ fontStyle: 'italic' }}>"{latestFollowUp.question}"</span><br/>
                        <strong style={{ display: 'inline-block', marginTop: '4px' }}>2. 大阪合規專員對答：</strong><br/>
                        <span>"{latestFollowUp.answer}"</span><br/>
                        <strong style={{ display: 'block', marginTop: '4px', color: '#047857' }}>★ 下一步行動：{latestFollowUp.nextStep}</strong>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 bg-zinc-50 border-t flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 select-none">
          <div className="text-[10px] text-zinc-450 font-bold text-center sm:text-left">
            已勾選 <strong>{selectedIds.length}</strong> 宗買家檔案進行合約批量摘要導出。
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadHTML}
              disabled={selectedClients.length === 0}
              className="flex-1 sm:flex-none justify-center bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 disabled:opacity-50 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>電子封存大簿 (.html)</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPDF}
              disabled={selectedClients.length === 0}
              className="flex-1 sm:flex-none justify-center bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-zinc-950 font-extrabold text-[11.5px] px-4 py-2 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF A4 官方列印</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
