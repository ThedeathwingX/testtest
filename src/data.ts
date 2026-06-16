import { 
  ClientProfile, 
  WhatsAppTemplate, 
  DocumentCase, 
  ChecklistItem, 
  SyncErrorLog, 
  KanbanCard,
  Property,
  Viewing,
  ClientRecommendation,
  ClosedDeal
} from './types';

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'c1',
    name: '陳大文',
    engName: 'Mr. Chan',
    phone: '+852 9123 4567',
    email: 'chan.tai.man@example.hk',
    vipTag: 'VIP 投資者',
    heatTag: 'A級熱度',
    budget: 'JPY 5,000萬 - 8,000萬',
    preferredArea: '大阪市中央區, 北區',
    propertyType: '一戶建, 全棟收租',
    purpose: '投資收租 (要避伏)',
    fundingPower: 'Full Pay 現金買家',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPGtHzzbj9wSZ6w1eDCJRKl6eN8VjtBf54yhHpBEzrZhHTz12FZqsq7tMyBgKBRoJOtjQVLJxnF3xDdc_49XXCU3go_TI7JFnZurEU42oNtd_8FDVeo4ulaRAbM0VXy5N69TxjSz3l1sJe5kh8opNtQ6Qjlpuqhk4RXga6u7g89aD9J46Lf25D8uwew0XF_lwAWBqpKlNt-BKpT4qIQDRTEmDJ5lAgHfAtC3sFZW4bArnZQjradg8JrNNFaS6QSfnU9lNCZIQTR2c',
    followUpNotes: [
      {
        id: 'n1',
        timestamp: '2023-10-25 14:30',
        type: 'WhatsApp',
        question: '睇過中央區果兩個盤，回報率幾多？會唔會係伏？',
        answer: '已經計咗實質回報比客，大約 5.2%。解釋咗管理費同修繕積立金嘅細項，唔係伏盤，係筍盤。',
        nextStep: '安排下星期二視像睇樓。'
      },
      {
        id: 'n2',
        timestamp: '2023-10-20 11:00',
        type: 'Phone',
        question: '預算提高到 8000萬 JPY，想睇全棟。',
        answer: '了解，會重新 filter 盤源，集中搵北區全棟。',
        nextStep: 'Send 3個新盤資料比客。'
      }
    ]
  },
  {
    id: 'c2',
    name: '林太',
    engName: 'Mrs. Lam',
    phone: '+852 6876 5432',
    email: 'mrs.lam68@example.hk',
    vipTag: '精選買家',
    heatTag: 'B級熱度',
    budget: 'JPY 3,000萬 - 5,000萬',
    preferredArea: '大阪市浪速區, 西成區',
    propertyType: '公寓套房 (近地鐵)',
    purpose: '民宿運營/長租',
    fundingPower: '自備五成首期, 辦理日本住宅貸款',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    followUpNotes: [
      {
        id: 'n3',
        timestamp: '2023-10-24 16:15',
        type: 'WhatsApp',
        question: '浪速區果個可以做民宿嗎？牌照難唔難申請？',
        answer: '該物件在特區民宿範圍之內，可以申請 365 天民宿經營。已協調日本行政書士代辦。',
        nextStep: '下週一提供行政書士代辦報價單與流程表。'
      }
    ]
  },
  {
    id: 'c3',
    name: '張偉文',
    engName: 'Mr. Cheung',
    phone: '+852 9444 8888',
    email: 'cheung.wm@example.com',
    vipTag: 'VIP 投資者',
    heatTag: 'A級熱度',
    budget: 'JPY 8,000萬 - 1.5億',
    preferredArea: '大阪市中央區, 北區 梅田',
    propertyType: '商用店鋪, 全棟收租',
    purpose: '高額資產配置',
    fundingPower: '香港公司營運資金匯款',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    followUpNotes: [
      {
        id: 'n4',
        timestamp: '2023-10-22 10:30',
        type: 'Meeting',
        question: '梅田全棟寫字樓的租約情況如何？有哪些穩定租戶？',
        answer: '主要租戶為日本本地律師事務所與科技公司，租約均有3年以上，空置率低於5%。',
        nextStep: '提供全體租戶租約撮要與詳細收益評估。'
      }
    ]
  },
  {
    id: 'c4',
    name: '李嘉欣',
    engName: 'Ms. Lee',
    phone: '+852 9888 1234',
    email: 'lee.jx@example.com',
    vipTag: '常規客戶',
    heatTag: 'C級熱度',
    budget: 'JPY 2,000萬 - 3,500萬',
    preferredArea: '京都市東山區, 大阪市天王寺區',
    propertyType: '中古公寓套房',
    purpose: '渡假自用+閒置出租',
    fundingPower: '全款現金買家',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    followUpNotes: [
      {
        id: 'n5',
        timestamp: '2023-10-18 09:45',
        type: 'Phone',
        question: '京都東山區老式公寓，大樓修繕會不會很貴？',
        answer: '京都中古樓有景觀保護條例限制，修繕成本略高，但歷史底蘊深厚。已查閱過去10年修繕記錄，無大額追加款。',
        nextStep: '發送過去大樓管委會修繕金賬目副本。'
      }
    ]
  },
  {
    id: 'c5',
    name: '黃美玲',
    engName: 'Ms. Wong',
    phone: '+852 9777 5555',
    email: 'wong.meiling@example.net',
    vipTag: '精選買家',
    heatTag: 'B級熱度',
    budget: 'JPY 4,000萬 - 6,500萬',
    preferredArea: '大阪市城東區, 阿倍野區',
    propertyType: '全新一戶建',
    purpose: '家族日本移居/留學',
    fundingPower: '現金支票與家族信託',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    followUpNotes: [
      {
        id: 'n6',
        timestamp: '2023-10-15 14:00',
        type: 'WhatsApp',
        question: '全新一戶建周邊有什麼優良學校？交通是否方便？',
        answer: '城東區周邊有知名公立小學與國際私立幼稚園，步行至最近地鐵站僅需6分鐘。',
        nextStep: '整理周邊5所重點學區分佈與通學時間對比表。'
      }
    ]
  }
];

export const INITIAL_KANBAN_CARDS: KanbanCard[] = [
  {
    id: 'k1',
    name: '陳大文',
    engName: 'Mr. Chan',
    phone: '+852 9123 4567',
    budget: 'HKD 3M - 5M',
    preferredArea: '大阪市中央區 / 浪速區',
    source: 'FB 廣告 (2023/10 展銷)',
    stageId: 'new',
    nextStep: '致電了解投資目標 (收租/自用)',
    label: '太耐無跟'
  },
  {
    id: 'k2',
    name: '林太',
    engName: 'Mrs. Lam',
    phone: '+852 6876 5432',
    budget: 'JPY 50M',
    preferredArea: '未定 (心齋橋周邊優先)',
    source: 'WhatsApp 查詢',
    stageId: 'replied',
    nextStep: '發送初步精選盤 List',
    label: '等回覆'
  }
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 't1',
    title: '推盤訊息 (首輪)',
    scenario: 'SCENARIO 1',
    iconType: 'campaign',
    colorTheme: 'green',
    content: '師兄，早晨！收到風大阪市中心有個新盤出，位置靚，近心齋橋，首批價單好抵玩。\n\n想問下最近有冇留意開果邊啲盤？有興趣嘅話我send個樓書同價單畀你望望先？唔買都當了解下行情吖！'
  },
  {
    id: 't2',
    title: '睇樓邀約 (視像/現場)',
    scenario: 'SCENARIO 2',
    iconType: 'map',
    colorTheme: 'blue',
    content: '哈囉！之前提過嗰個難波盤，而家可以安排睇樓啦！\n\n知道你忙，我哋可以安排個Zoom live睇樓，日本同事會現場行一圈，順便講解下附近配套。大約20分鐘搞掂。\n\n今個星期四或者五晏晝，邊日方便你？我幫你mark實個期先。'
  },
  {
    id: 't3',
    title: '重要事項講解提醒',
    scenario: 'SCENARIO 4',
    iconType: 'warning',
    colorTheme: 'red',
    content: '師兄，收到日本嗰邊準備好份約啦。\n\n不過提提你，份「重要事項告知書」(重說) 未講解之前，唔建議急住簽任何嘢。日本買樓手續嚴謹，入面有好多細節關於業權同隱藏費用，我哋約個時間，搵宅建士同你逐part過一次先。\n\n避開伏位先，保障返自己！聽日晏晝或者後日朝早傾下？'
  },
  {
    id: 't4',
    title: '三日追問 (Follow-up)',
    scenario: 'SCENARIO 3',
    iconType: 'schedule',
    colorTheme: 'orange',
    content: '早晨呀！之前畀你睇嗰幾份資料，唔知有冇時間望過下呢？\n\n見你呢幾日比較忙，唔阻你太多時間。主要係想話聲你知，個盤反應幾好，有兩個中層靚單位尋日已經被hold咗。\n\n如果覺得大方向啱嘅，不如傾兩句交流下睇法？就算呢個盤唔啱，等我知多啲你嘅要求，下次有好嘢即刻通知你！'
  },
  {
    id: 't5',
    title: '成交文件提醒',
    scenario: 'SCENARIO 5',
    iconType: 'task_alt',
    colorTheme: 'green',
    content: '恭喜晒！份買賣合約雙方都簽好咗啦，正式落實！🎉\n\n下一步就係要準備過數尾數同埋做過戶手續。為咗順利交吉，麻煩你準備定以下文件：\n1. 身份證副本\n2. 住址證明 (最近3個月內)\n3. 宣誓紙 (如適用)\n\n有唔清楚隨時搵我，我會一路跟進到鎖匙交落你手！'
  }
];

export const INITIAL_DOCUMENT_CASES: DocumentCase[] = [
  {
    id: 'HK-24001',
    clientName: '張偉文 (Mr. Cheung)',
    phone: '+852 9444 8888',
    propertyName: '大阪心齋橋投資型套房',
    status: '已備齊',
    explainProgress: '未講解',
    notes: '需盡快安排',
    explainer: 'B哥 / 宅建士'
  },
  {
    id: 'HK-24015',
    clientName: '李嘉欣 (Ms. Lee)',
    phone: '+852 9888 1234',
    propertyName: '京都中京區町家改建案',
    status: '審核中',
    explainProgress: '已安排',
    explainDate: '2024/05/12 • 視像(Zoom)',
    explainer: 'B哥 / 宅建士'
  },
  {
    id: 'HK-23099',
    clientName: '陳大文 (Mr. Chan)',
    phone: '+852 9123 4567',
    propertyName: '東京新宿區一棟收益物件',
    status: '已確認',
    explainProgress: '已講解',
    explainDate: '2024/05/01 • 面對面',
    explainer: 'B哥 / 宅建士'
  },
  {
    id: 'HK-24022',
    clientName: '黃美玲 (Ms. Wong)',
    phone: '+852 9777 5555',
    propertyName: '福岡博多區新建大樓',
    status: '已備齊',
    explainProgress: '未講解',
    explainer: 'B哥 / 宅建士'
  }
];

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 1,
    label: '1. 產權確認',
    description: '確認登記簿謄本、所有權人身份及抵押權設定狀況。',
    checked: true
  },
  {
    id: 2,
    label: '2. 法規限制調查',
    description: '都市計畫法、建築基準法等相關法令限制確認。',
    checked: true
  },
  {
    id: 3,
    label: '3. 基礎設施狀況',
    description: '飲用水、電力、瓦斯供氣及排水設施整備狀況。',
    checked: false,
    alert: '尚欠水管圖面資料'
  },
  {
    id: 4,
    label: '4. 宅建士安排',
    description: '指派具資格之宅地建物取引士進行講解。',
    checked: false
  },
  {
    id: 5,
    label: '5. 客戶簽署確認',
    description: '取得客戶對於重要事項告知書之簽名或蓋章。',
    checked: false
  }
];

export const INITIAL_SYNC_LOGS: SyncErrorLog[] = [
  {
    id: '1',
    timestamp: '2023-10-24 11:20',
    type: 'Webhook 逾時',
    clientName: '陳經理 (Osaka Inv.)',
    errorReason: '伺服器響應超過 5000ms',
    status: '待重試'
  },
  {
    id: '2',
    timestamp: '2023-10-24 10:15',
    type: 'Token 失效',
    clientName: '- 全域系統 -',
    errorReason: 'Authentication failed (401)',
    status: '已處理'
  },
  {
    id: '3',
    timestamp: '2023-10-23 18:45',
    type: '附件缺失',
    clientName: '王師兄 (北區睇樓)',
    errorReason: '媒體檔案已從 WhatsApp 伺服器移除',
    status: '跳過'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: '難波中心高級公寓・高層優雅戶型',
    price: 45000000,
    yieldGross: 6.2,
    yieldNet: 5.1,
    area: '大阪市中央區',
    address: '大阪市中央區難波 4丁目 12-5',
    type: '公寓',
    size: 28.5,
    yearBuilt: 2018,
    station: '地鐵「難波」站步行 3 分鐘',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    highlights: ['近地鐵站', '包租中', '管理費極低', '高租客穩定度']
  },
  {
    id: 'p2',
    name: '心齋橋全棟收益收租大樓・罕有全棟盤',
    price: 135000000,
    yieldGross: 7.8,
    yieldNet: 6.5,
    area: '大阪市中央區',
    address: '大阪市中央區東心齋橋 1 丁目 18-9',
    type: '全棟',
    size: 155.0,
    yearBuilt: 2012,
    station: '地鐵「心齋橋」站步行 5 分鐘',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    highlights: ['商業街核心', '滿租中', '結構安全(地固)', '高抗通脹']
  },
  {
    id: 'p3',
    name: '北區梅田高級大樓別墅式公寓',
    price: 85000000,
    yieldGross: 5.5,
    yieldNet: 4.5,
    area: '大阪市北區',
    address: '大阪市北區大淀中 2 丁目 3-12',
    type: '公寓',
    size: 52.4,
    yearBuilt: 2021,
    station: '「大阪/梅田」站步行 9 分鐘',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    highlights: ['2021年落成', '高質豪裝', '附設全域地暖', '適合投資及自住']
  },
  {
    id: 'p4',
    name: '浪速區一戶建自住/民宿兩用別墅',
    price: 52000000,
    yieldGross: 8.5,
    yieldNet: 6.9,
    area: '大阪市浪速區',
    address: '大阪市浪速區日本橋西 2 丁目 8-4',
    type: '一戶建',
    size: 80.0,
    yearBuilt: 2015,
    station: '地下鐵「惠美須町」站步行 4 分鐘',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    highlights: ['民宿合規特區', '含全年365日運營牌照', '雙層小洋房', '全套日系原木裝潢']
  },
  {
    id: 'p5',
    name: '天王寺靜謐高回報翻新町家',
    price: 38000000,
    yieldGross: 9.0,
    yieldNet: 7.2,
    area: '大阪市天王寺區',
    address: '大阪市天王寺區上汐 5 丁目 14-2',
    type: '一戶建',
    size: 65.0,
    yearBuilt: 1998,
    station: '地鐵「谷町九丁目」站步行 6 分鐘',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    highlights: ['高投資回報', '全屋重新翻新', '安靜住宅區', '步行可達著名學區']
  }
];

export const INITIAL_VIEWINGS: Viewing[] = [
  {
    id: 'v1',
    clientName: '陳大文',
    propertyName: '難波中心高級公寓・高層優雅戶型',
    dateTime: '2026-06-18 14:00',
    type: 'Zoom Live',
    status: '已預約',
    staff: 'B哥 (專屬對接)'
  },
  {
    id: 'v2',
    clientName: '林太',
    propertyName: '心齋橋全棟收益收租大樓・罕有全棟盤',
    dateTime: '2026-06-20 11:30',
    type: '現場睇樓',
    status: '已預約',
    staff: '日本大阪辦事處 Mr. Sato'
  },
  {
    id: 'v3',
    clientName: '王師兄',
    propertyName: '浪速區一戶建自住/民宿兩用別墅',
    dateTime: '2026-06-12 15:00',
    type: '自選影片錄影',
    status: '已完成',
    staff: 'B哥 (專屬對接)'
  }
];

export const INITIAL_RECOMMENDATIONS: ClientRecommendation[] = [
  {
    id: 'r1',
    clientId: 'c1',
    clientName: '陳大文',
    clientPhone: '+852 9123 4567',
    propertyId: 'p1',
    propertyName: '難波中心高級公寓・高層優雅戶型',
    propertyPrice: 45000000,
    propertyYieldNet: 5.1,
    propertyArea: '大阪市中央區',
    recommendedDate: '2026-06-15 10:30',
    status: '感興趣 / 預約帶看',
    notes: '客戶覺得難波站步行3分鐘很吸引。已為其約定 6/18 Zoom 帶看行程。'
  },
  {
    id: 'r2',
    clientId: 'c1',
    clientName: '陳大文',
    clientPhone: '+852 9123 4567',
    propertyId: 'p2',
    propertyName: '心齋橋全棟收益收租大樓・罕有全棟盤',
    propertyPrice: 135000000,
    propertyYieldNet: 6.5,
    propertyArea: '大阪市中央區',
    recommendedDate: '2026-06-12 14:15',
    status: '已送達 / 考慮中',
    notes: '對於全棟 1.35 億日圓的總價表示可以接受，正在與合夥人共同商量融資。'
  },
  {
    id: 'r3',
    clientId: 'c2',
    clientName: '林太',
    clientPhone: '+852 6876 5432',
    propertyId: 'p4',
    propertyName: '浪速區一戶建自住/民宿兩用別墅',
    propertyPrice: 52000000,
    propertyYieldNet: 6.9,
    propertyArea: '大阪市浪速區',
    recommendedDate: '2026-06-14 16:50',
    status: '高意向 / 準備買付',
    notes: '對浪速區365天特區特許持牌民宿極滿意，目前全權委託日本行政書士完成報價與流程。'
  },
  {
    id: 'r4',
    clientId: 'c3',
    clientName: '張偉文',
    clientPhone: '+852 9444 8888',
    propertyId: 'p3',
    propertyName: '北區梅田高級大樓別墅式公寓',
    propertyPrice: 85000000,
    propertyYieldNet: 4.5,
    propertyArea: '大阪市北區',
    recommendedDate: '2026-06-11 09:20',
    status: '已送達 / 考慮中',
    notes: '已發送梅田梅淀中寫字樓出租明細，客戶正在尋找日本稅理士評估利得稅率。'
  }
];

export const INITIAL_CLOSED_DEALS: ClosedDeal[] = [
  {
    id: 'deal1',
    clientName: '黃女士',
    clientPhone: '+852 9888 2212',
    propertyName: '中央區谷町四丁目全新精裝大樓公寓',
    propertyPrice: 38800000,
    propertyArea: '大阪市中央區',
    yieldNet: 5.4,
    contractDate: '2026-04-12',
    agencyFee: 1224000, // 3% + 6萬 calculations
    judicialScrivener: '三井司法書士事務所・平田先生',
    status: '民宿託管運營中',
    notes: '順利協助客戶申請特區民宿牌照並開辦。目前委託予「大阪B哥售後專業托管」，每月15日穩定匯入租金回報。'
  },
  {
    id: 'deal2',
    clientName: '李小姐',
    clientPhone: '+852 6543 9900',
    propertyName: '浪速區大國町站步3分鐘・雙陽台民宿一戶建',
    propertyPrice: 59000000,
    propertyArea: '大阪市浪速區',
    yieldNet: 6.8,
    contractDate: '2026-05-18',
    agencyFee: 1830000,
    judicialScrivener: '關西合同司法書士事務所',
    status: '民宿託管運營中',
    notes: '交易用印程序全部合規。由宅建士平井先生現場講解重要事項。客戶大讚買得安心！'
  },
  {
    id: 'deal3',
    clientName: '王師兄',
    clientPhone: '+852 9111 5566',
    propertyName: '城東區全棟收益商辦合一收租大樓',
    propertyPrice: 155000000,
    propertyArea: '大阪市城東區',
    yieldNet: 7.2,
    contractDate: '2026-03-05',
    agencyFee: 4710000,
    judicialScrivener: '大和司法書士特別顧問團隊',
    status: '一般租賃託管中',
    notes: '大樓自帶6個穩定租約（包括美容院與地鋪居酒屋）。協助完成銀行結滙與代扣源泉徵收稅登記。'
  }
];



