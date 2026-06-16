import React, { useState } from 'react';
import { 
  Check, 
  RefreshCw, 
  Upload, 
  HelpCircle, 
  Copy, 
  AlertTriangle, 
  Trash2, 
  Layers, 
  ShieldCheck,
  Send,
  MessageSquareCode
} from 'lucide-react';
import { SyncErrorLog } from '../types';

interface WhatsAppSyncViewProps {
  logs: SyncErrorLog[];
  onUpdateLogs: (updatedLogs: SyncErrorLog[]) => void;
}

export interface SyncRule {
  id: string;
  label: string;
  checked: boolean;
}

export default function WhatsAppSyncView({ logs, onUpdateLogs }: WhatsAppSyncViewProps) {
  const [tokenValue, setTokenValue] = useState('**** **** **** 8F2A');
  const [webhookUrl, setWebhookUrl] = useState('https://api.osaka-crm.com/v1/whatsapp-webhook');
  const [isSyncing, setIsSyncing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [rules, setRules] = useState<SyncRule[]>([
    { id: 'r1', label: '只同步已存在客戶', checked: true },
    { id: 'r2', label: '附件只記錄檔名 (節省流量)', checked: false },
    { id: 'r3', label: '陌生電話建立新查詢', checked: true },
    { id: 'r4', label: '模板發送後自動寫備註', checked: true },
    { id: 'r5', label: '訊息轉進時建立下一次提醒 (預設 24 小時內)', checked: true }
  ]);

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const handleRefreshSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('【雲端數據庫同步】\n已完成對 Meta Business Cloud API 之雙向握手，成功同步了 142 條對話和 54 份附件！');
    }, 1500);
  };

  const handleRetryLog = (id: string) => {
    const log = logs.find(l => l.id === id);
    if (!log) return;
    alert(`正在對影響客戶 [ ${log.clientName} ] 進行 API 重試發送...`);
    setTimeout(() => {
      onUpdateLogs(logs.map(l => l.id === id ? { ...l, status: '已處理' } : l));
      alert(`重試成功！該錯誤已妥善處置，狀態已轉化為「已處理」。`);
    }, 500);
  };

  const handleIgnoreLog = (id: string) => {
    onUpdateLogs(logs.filter(l => l.id !== id));
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('Webhook 端點 URL 已複製至剪貼簿！');
  };

  const handleClearLogs = () => {
    if (confirm('確定清空系統當前偵測到的所有 API 與 Webhook 故障紀錄嗎？')) {
      onUpdateLogs([]);
    }
  };

  const handleDragDropSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(0);
            alert("WhatsApp 對話歷史（.csv格式）解析完畢，已成功配對 12 筆電話條目，並注入跟進管線！");
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in-50 duration-200">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">WhatsApp 同步設定</h2>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">管理 B哥 WhatsApp Business 同步、Webhook 端點、手動導入檔案與錯誤重試日誌</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handleRefreshSync}
            className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition ${
              isSyncing 
                ? 'bg-zinc-200 text-zinc-550' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold'
            }`}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '同步中...' : '重新同步'}</span>
          </button>
        </div>
      </div>

      {/* Sync Metrics Strip (6 items) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        
        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">連接狀態</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
            <span className="text-xs font-bold text-zinc-800">已連接</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">WhatsApp 電話</span>
          <span className="text-xs font-bold text-zinc-800 font-mono mt-1">+852 9XXX XXXX</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">最後同步</span>
          <span className="text-xs font-bold text-zinc-800 font-mono mt-1">10:45 AM</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">來源渠道</span>
          <span className="text-xs font-semibold text-zinc-850 mt-1">Cloud API</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">今日對話</span>
          <span className="text-xs font-bold text-zinc-900 font-mono mt-1">142 條</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-bold">待回覆客戶</span>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.2 w-fit mt-1 text-[11px]">5 位 待處理</span>
        </div>

      </div>

      {/* Bento Grid configurations */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* API Webhook setting (Col 5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <MessageSquareCode className="w-4 h-4 text-emerald-600" />
              <span>API / Webhook 設定</span>
            </h3>

            {/* Token */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                <span>META API KEY (TOKEN)</span>
                <button 
                  onClick={() => {
                    const nextTok = prompt("請輸入您的 Meta Cloud API 新 Token 值：");
                    if (nextTok) {
                      setTokenValue("**** " + nextTok.slice(-4));
                      alert("金鑰重置握手成功，已重新注入安全沙盒隔離緩存中！");
                    }
                  }}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  更新 Token
                </button>
              </div>
              <input 
                type="text" 
                value={tokenValue} 
                disabled
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-xs p-2 rounded-lg cursor-not-allowed"
              />
            </div>

            {/* Webhook URL */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                <span>Webhook 回傳端點 (POST)</span>
                <button 
                  onClick={handleCopyWebhook}
                  className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>複製 URL</span>
                </button>
              </div>
              <input 
                type="text" 
                value={webhookUrl} 
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-700 font-mono text-xs p-2 rounded-lg focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Webhook Connection State card */}
            <div className="bg-zinc-50 border p-3.5 rounded-lg border-zinc-150 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-400">Webhook 連線狀態</p>
                <p className="text-xs font-bold text-zinc-700 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Meta 伺服器： 運作極為順暢</span>
                </p>
                <p className="text-[9.5px] text-zinc-400 mt-0.5">最後健全度驗證時間： 2026/06/16 09:00</p>
              </div>

              <button 
                onClick={() => {
                  alert("【Webhook 傳送測試】\n測試 JSON 已打包成功！\n即將發射 1KB 演示回調握手至 " + webhookUrl);
                }}
                className="bg-white border hover:border-emerald-500 text-zinc-700 hover:text-emerald-700 p-2 text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                測試 Webhook
              </button>
            </div>
          </div>

        </div>

        {/* Sync Rules config (Col 4) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>同步與合規判定規則</span>
            </h3>

            <div className="space-y-3.5 select-none text-xs">
              {rules.map((rule) => (
                <label 
                  key={rule.id}
                  className="flex items-start gap-2.5 text-zinc-700 cursor-pointer hover:text-zinc-900 group"
                >
                  <input 
                    type="checkbox"
                    checked={rule.checked}
                    onChange={() => handleToggleRule(rule.id)}
                    className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 border-zinc-300"
                  />
                  <span className="leading-tight font-medium group-hover:underline">{rule.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Chat importer (Col 3) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <form 
            onSubmit={handleDragDropSimulation}
            className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>手動對話對應</span>
            </h3>

            {/* Drag drop box */}
            <div className="border border-dashed border-zinc-300 rounded-xl py-6 p-4 text-center cursor-pointer hover:border-emerald-500 hover:bg-zinc-50 transition">
              <Upload className="w-7 h-7 text-zinc-400 mx-auto mb-1 stroke-[1.8]" />
              <p className="text-xs text-zinc-700 font-bold">點擊或拖曳對話檔案</p>
              <p className="text-[10px] text-zinc-400 mt-1">支援 .txt / .csv 對話紀錄檔 (最大 50MB)</p>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-1.5 text-xs text-zinc-650">
                <div className="flex justify-between font-bold font-mono">
                  <span>對話分析中...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-[10px] font-bold text-zinc-400 uppercase">1. 選取關聯目標客戶</div>
              <select className="w-full text-xs border border-zinc-250 bg-white rounded p-1.5 outline-none font-medium text-zinc-700">
                <option value="match_auto">自動依通訊號段判別配對</option>
                <option value="chan">陳大文 Mr. Chan (+852 9123 4567)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 font-bold text-zinc-950 text-xs py-2 rounded-lg transition shadow-sm h-8 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>手動讀取並注入</span>
            </button>
          </form>
        </div>

      </div>

      {/* Error registers logging center table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        
        <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center select-none">
          <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>故障與超時中斷日誌 (自動歸檔)</span>
          </h3>
          {logs.length > 0 && (
            <button 
              onClick={handleClearLogs}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空紀錄</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 text-xs font-medium">
              目前無任何 API 同步故障中斷日誌，系統極為健康！
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs select-text">
              <thead className="bg-zinc-100 text-zinc-500 uppercase tracking-wide font-bold">
                <tr className="border-b">
                  <th className="py-2 px-4">故障時間</th>
                  <th className="py-2 px-4">中斷類型</th>
                  <th className="py-2 px-4">影響客戶項目</th>
                  <th className="py-2 px-4">遠端系統反饋原因</th>
                  <th className="py-2 px-4">診斷狀態</th>
                  <th className="py-2 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                {logs.map((log) => {
                  const isRetrying = log.status === '待重試';
                  return (
                    <tr key={log.id} className="hover:bg-zinc-50 transition duration-150">
                      <td className="py-2.5 px-4 font-mono">{log.timestamp}</td>
                      <td className="py-2.5 px-4">
                        <span className="text-rose-600 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px]">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-zinc-850">{log.clientName}</td>
                      <td className="py-2.5 px-4 text-zinc-500 leading-none">{log.errorReason}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === '已處理' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : log.status === '待重試' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' 
                            : 'bg-zinc-100 text-zinc-700 border'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right flex justify-end gap-2.5 select-none">
                        {isRetrying ? (
                          <>
                            <button 
                              onClick={() => handleRetryLog(log.id)}
                              className="text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-600/30 font-bold px-2.5 py-0.5 rounded transition cursor-pointer"
                            >
                              重試
                            </button>
                            <button 
                              onClick={() => handleIgnoreLog(log.id)}
                              className="text-zinc-400 hover:text-zinc-600 font-bold cursor-pointer"
                            >
                              忽略
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => alert(`【合規詳情】\n故障時間：${log.timestamp}\n影響客戶：${log.clientName}\n詳細診斷代碼：SSL_HANDSHAKE_ERROR_401`)}
                            className="bg-zinc-100 border text-zinc-700 hover:bg-zinc-200 text-[10.5px] px-2 py-0.5 rounded font-bold transition cursor-pointer"
                          >
                            查看詳情
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Safety Info Panel */}
      <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-500/10 flex items-start gap-3 select-text shadow-inner">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2] mt-0.5" />
        <div className="text-zinc-550 text-xs">
          <strong className="text-emerald-800 font-bold block mb-1">合規與安全警示保障 Panel</strong>
          本系統採用官方正式授權的 Meta Business API，嚴禁使用非官方、網頁版協議逆向 WhatsApp Web 抓取模塊，絕對避免帳號被封或客戶私隱洩漏風險。所有 API 金鑰、通訊對話與授權 Token 皆經過 AES-256 全覆蓋端對端加密緩存，絕不透露給非權限前端主機或遭惡意腳本讀取。
        </div>
      </div>

    </div>
  );
}
