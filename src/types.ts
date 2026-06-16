export type ActiveView = 
  | 'dashboard' 
  | 'clients' 
  | 'kanban' 
  | 'pavel_checklist' 
  | 'whatsapp_sync' 
  | 'whatsapp_templates' 
  | 'checklist'
  | 'properties'
  | 'viewings'
  | 'reports'
  | 'backup';

export interface Property {
  id: string;
  name: string;
  price: number; // JPY
  yieldGross: number; // %
  yieldNet: number; // %
  area: string; // e.g. 中央區
  address: string;
  type: string; // 一戶建, 公寓, 全棟
  size: number; // 平方米
  yearBuilt: number;
  station: string; // station exit/walk
  imageUrl: string;
  highlights: string[];
}

export interface Viewing {
  id: string;
  clientName: string;
  propertyName: string;
  dateTime: string;
  type: 'Zoom Live' | '現場睇樓' | '自選影片錄影';
  status: '已預約' | '直播中' | '已完成' | '客戶取消';
  staff: string;
}

export interface FollowUpNote {
  id: string;
  timestamp: string;
  type: 'WhatsApp' | 'Phone' | 'Meeting';
  question: string;
  answer: string;
  nextStep: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  engName: string;
  phone: string;
  email: string;
  vipTag: 'VIP 投資者' | '精選買家' | '常規客戶';
  heatTag: 'A級熱度' | 'B級熱度' | 'C級熱度';
  budget: string;
  preferredArea: string;
  propertyType: string;
  purpose: string;
  fundingPower: string;
  avatarUrl?: string;
  followUpNotes: FollowUpNote[];
  dealStatus?: string; // e.g. 跟進中, 已安排講解, 已成交, 等
}

export interface KanbanStage {
  id: string;
  title: string;
  color: string;
}

export interface KanbanCard {
  id: string;
  name: string;
  engName?: string;
  phone: string;
  budget: string;
  preferredArea: string;
  source: string;
  stageId: string;
  nextStep: string;
  label?: string;
}

export interface DocumentCase {
  id: string;
  clientName: string;
  phone: string;
  propertyName: string;
  status: '已備齊' | '審核中' | '已確認';
  explainProgress: '未講解' | '已安排' | '已講解';
  explainDate?: string;
  explainer: string;
  notes?: string;
}

export interface ChecklistItem {
  id: number;
  label: string;
  description: string;
  checked: boolean;
  alert?: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  scenario: string;
  iconType: 'campaign' | 'map' | 'warning' | 'schedule' | 'task_alt';
  colorTheme: 'green' | 'blue' | 'red' | 'orange';
  content: string;
}

export interface SyncErrorLog {
  id: string;
  timestamp: string;
  type: string;
  clientName: string;
  errorReason: string;
  status: '待重試' | '已處理' | '跳過';
}

export interface ClientRecommendation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  propertyYieldNet: number;
  propertyArea: string;
  recommendedDate: string;
  status: '已送達 / 考慮中' | '感興趣 / 預約帶看' | '高意向 / 準備買付' | '客戶婉拒';
  notes: string;
}

export interface ClosedDeal {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyName: string;
  propertyPrice: number; // JPY
  propertyArea: string;
  yieldNet: number; // %
  contractDate: string;
  agencyFee: number; // JPY
  judicialScrivener: string; // 司法書士
  status: '已辦理產權轉移' | '民宿託管運營中' | '一般租賃託管中';
  notes: string;
}


