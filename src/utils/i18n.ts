import { ref, computed } from 'vue'

export type LangCode = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'pt' | 'ru' | 'ar' | 'th' | 'vi'

export interface LangOption {
  code: LangCode
  label: string      // 该语言的自称
  labelZh: string    // 中文名
}

export const languages: LangOption[] = [
  { code: 'zh', label: '中文', labelZh: '中文' },
  { code: 'en', label: 'English', labelZh: '英语' },
  { code: 'ja', label: '日本語', labelZh: '日语' },
  { code: 'ko', label: '한국어', labelZh: '韩语' },
  { code: 'fr', label: 'Français', labelZh: '法语' },
  { code: 'de', label: 'Deutsch', labelZh: '德语' },
  { code: 'es', label: 'Español', labelZh: '西班牙语' },
  { code: 'pt', label: 'Português', labelZh: '葡萄牙语' },
  { code: 'ru', label: 'Русский', labelZh: '俄语' },
  { code: 'ar', label: 'العربية', labelZh: '阿拉伯语' },
  { code: 'th', label: 'ไทย', labelZh: '泰语' },
  { code: 'vi', label: 'Tiếng Việt', labelZh: '越南语' },
]

// 当前语言
const LANG_KEY = 'app_language'
const currentLang = ref<LangCode>((uni.getStorageSync(LANG_KEY) as LangCode) || 'zh')

export function useLang() {
  function setLang(code: LangCode) {
    currentLang.value = code
    uni.setStorageSync(LANG_KEY, code)
  }

  const isZh = computed(() => currentLang.value === 'zh')

  return { currentLang, setLang, isZh }
}

// ========== UI 文本翻译 ==========

const uiTexts: Record<string, Record<LangCode, string>> = {
  appTitle: {
    zh: '旅游番茄钟', en: 'TravelTomato', ja: 'トラベルトマト', ko: '여행 포모도로',
    fr: 'TravelTomate', de: 'ReiseTomate', es: 'TravelTomate', pt: 'TravelTomate',
    ru: 'ТрэвелТомато', ar: 'طماطم السفر', th: 'ท่องเที่ยวมะเขือเทศ', vi: 'Du Lịch Cà Chua',
  },
  pageDestination: {
    zh: '选择下一站', en: 'Next Stop', ja: '次の目的地', ko: '다음 정거장',
    fr: 'Prochaine étape', de: 'Nächster Halt', es: 'Siguiente parada', pt: 'Próxima parada',
    ru: 'Следующая остановка', ar: 'المحطة التالية', th: 'จุดหมายถัดไป', vi: 'Điểm đến tiếp',
  },
  pageCalendar: {
    zh: '我的旅行日历', en: 'Travel Calendar', ja: '旅カレンダー', ko: '여행 달력',
    fr: 'Calendrier de voyage', de: 'Reisekalender', es: 'Calendario de viaje', pt: 'Calendário de viagem',
    ru: 'Календарь путешествий', ar: 'تقويم السفر', th: 'ปฏิทินเดินทาง', vi: 'Lịch du lịch',
  },
  pageTravelMap: {
    zh: '我的旅行地图', en: 'Travel Map', ja: '旅マップ', ko: '여행 지도',
    fr: 'Carte de voyage', de: 'Reisekarte', es: 'Mapa de viaje', pt: 'Mapa de viagem',
    ru: 'Карта путешествий', ar: 'خريطة السفر', th: 'แผนที่เดินทาง', vi: 'Bản đồ du lịch',
  },
  locating: {
    zh: '正在定位您的位置...', en: 'Locating your position...', ja: '位置を取得中...', ko: '위치를 확인하는 중...',
    fr: 'Localisation en cours...', de: 'Standort wird ermittelt...', es: 'Localizando tu posición...', pt: 'Localizando sua posição...',
    ru: 'Определение местоположения...', ar: '...جارٍ تحديد موقعك', th: 'กำลังระบุตำแหน่ง...', vi: 'Đang xác định vị trí...',
  },
  locatedCity: {
    zh: '已定位到附近城市', en: 'Nearest city found', ja: '最寄りの都市を検出', ko: '가까운 도시를 찾았습니다',
    fr: 'Ville la plus proche trouvée', de: 'Nächste Stadt gefunden', es: 'Ciudad más cercana encontrada', pt: 'Cidade mais próxima encontrada',
    ru: 'Ближайший город найден', ar: 'تم العثور على أقرب مدينة', th: 'พบเมืองใกล้เคียง', vi: 'Đã tìm thấy thành phố gần nhất',
  },
  useThisCity: {
    zh: '从这里出发', en: 'Start from here', ja: 'ここから出発', ko: '여기서 출발',
    fr: 'Partir d\'ici', de: 'Von hier starten', es: 'Salir desde aquí', pt: 'Partir daqui',
    ru: 'Начать отсюда', ar: 'ابدأ من هنا', th: 'เริ่มจากที่นี่', vi: 'Bắt đầu từ đây',
  },
  chooseOther: {
    zh: '选择其他城市', en: 'Choose another city', ja: '他の都市を選択', ko: '다른 도시 선택',
    fr: 'Choisir une autre ville', de: 'Andere Stadt wählen', es: 'Elegir otra ciudad', pt: 'Escolher outra cidade',
    ru: 'Выбрать другой город', ar: 'اختر مدينة أخرى', th: 'เลือกเมืองอื่น', vi: 'Chọn thành phố khác',
  },
  selectOrigin: {
    zh: '选择你的出发城市', en: 'Select your departure city', ja: '出発都市を選択', ko: '출발 도시를 선택하세요',
    fr: 'Choisissez votre ville de départ', de: 'Wähle deine Abfahrtsstadt', es: 'Selecciona tu ciudad de salida', pt: 'Selecione sua cidade de partida',
    ru: 'Выберите город отправления', ar: 'اختر مدينة المغادرة', th: 'เลือกเมืองต้นทาง', vi: 'Chọn thành phố khởi hành',
  },
  startJourney: {
    zh: '开始你的环球专注之旅', en: 'Start your global focus journey', ja: 'グローバル集中の旅を始めよう', ko: '글로벌 집중 여행을 시작하세요',
    fr: 'Commencez votre voyage de concentration', de: 'Starte deine globale Fokusreise', es: 'Comienza tu viaje de enfoque global', pt: 'Comece sua jornada global de foco',
    ru: 'Начните свое глобальное путешествие', ar: 'ابدأ رحلة التركيز العالمية', th: 'เริ่มต้นการเดินทางโฟกัสทั่วโลก', vi: 'Bắt đầu hành trình tập trung toàn cầu',
  },
  searchCity: {
    zh: '搜索全球城市...', en: 'Search cities...', ja: '都市を検索...', ko: '도시 검색...',
    fr: 'Rechercher...', de: 'Stadt suchen...', es: 'Buscar ciudades...', pt: 'Buscar cidades...',
    ru: 'Поиск городов...', ar: '...البحث عن مدن', th: 'ค้นหาเมือง...', vi: 'Tìm thành phố...',
  },
  confirmOrigin: {
    zh: '确认出发点，开始旅行', en: 'Confirm & Start Journey', ja: '確認して旅を始める', ko: '확인 후 여행 시작',
    fr: 'Confirmer et commencer', de: 'Bestätigen & Reise starten', es: 'Confirmar e iniciar', pt: 'Confirmar e iniciar',
    ru: 'Подтвердить и начать', ar: 'تأكيد وبدء الرحلة', th: 'ยืนยันและเริ่มเดินทาง', vi: 'Xác nhận và bắt đầu',
  },
  youAreAt: {
    zh: '你现在在', en: 'You are at', ja: '現在地', ko: '현재 위치',
    fr: 'Vous êtes à', de: 'Du bist in', es: 'Estás en', pt: 'Você está em',
    ru: 'Вы находитесь в', ar: 'أنت في', th: 'คุณอยู่ที่', vi: 'Bạn đang ở',
  },
  pomodoro: {
    zh: '番茄钟', en: 'Pomodoros', ja: 'ポモドーロ', ko: '포모도로',
    fr: 'Pomodoros', de: 'Pomodoros', es: 'Pomodoros', pt: 'Pomodoros',
    ru: 'Помодоро', ar: 'بومودورو', th: 'โพโมโดโร', vi: 'Pomodoro',
  },
  totalDistance: {
    zh: '总里程', en: 'Distance', ja: '総距離', ko: '총 거리',
    fr: 'Distance', de: 'Distanz', es: 'Distancia', pt: 'Distância',
    ru: 'Расстояние', ar: 'المسافة', th: 'ระยะทาง', vi: 'Quãng đường',
  },
  cities: {
    zh: '城市', en: 'Cities', ja: '都市', ko: '도시',
    fr: 'Villes', de: 'Städte', es: 'Ciudades', pt: 'Cidades',
    ru: 'Городов', ar: 'مدن', th: 'เมือง', vi: 'Thành phố',
  },
  continueTravel: {
    zh: '继续旅行，选择下一站', en: 'Continue, pick next stop', ja: '旅を続ける、次の目的地', ko: '여행 계속, 다음 정거장',
    fr: 'Continuer, prochaine étape', de: 'Weiter, nächster Halt', es: 'Continuar, siguiente parada', pt: 'Continuar, próxima parada',
    ru: 'Продолжить, следующая остановка', ar: 'استمر، المحطة التالية', th: 'ต่อไป เลือกจุดหมาย', vi: 'Tiếp tục, chọn điểm đến',
  },
  recentTrips: {
    zh: '最近旅程', en: 'Recent Trips', ja: '最近の旅', ko: '최근 여행',
    fr: 'Voyages récents', de: 'Letzte Reisen', es: 'Viajes recientes', pt: 'Viagens recentes',
    ru: 'Последние поездки', ar: 'الرحلات الأخيرة', th: 'เที่ยวล่าสุด', vi: 'Chuyến gần đây',
  },
  calendar: {
    zh: '日历', en: 'Calendar', ja: 'カレンダー', ko: '달력',
    fr: 'Calendrier', de: 'Kalender', es: 'Calendario', pt: 'Calendário',
    ru: 'Календарь', ar: 'التقويم', th: 'ปฏิทิน', vi: 'Lịch',
  },
  map: {
    zh: '地图', en: 'Map', ja: '地図', ko: '지도',
    fr: 'Carte', de: 'Karte', es: 'Mapa', pt: 'Mapa',
    ru: 'Карта', ar: 'خريطة', th: 'แผนที่', vi: 'Bản đồ',
  },
  reset: {
    zh: '重置', en: 'Reset', ja: 'リセット', ko: '초기화',
    fr: 'Réinitialiser', de: 'Zurücksetzen', es: 'Reiniciar', pt: 'Redefinir',
    ru: 'Сброс', ar: 'إعادة تعيين', th: 'รีเซ็ต', vi: 'Đặt lại',
  },
  from: {
    zh: '从', en: 'From', ja: 'から', ko: '에서',
    fr: 'De', de: 'Von', es: 'Desde', pt: 'De',
    ru: 'Из', ar: 'من', th: 'จาก', vi: 'Từ',
  },
  depart: {
    zh: '出发', en: 'depart', ja: '出発', ko: '출발',
    fr: 'partir', de: 'abfahren', es: 'salir', pt: 'partir',
    ru: 'отправление', ar: 'انطلاق', th: 'ออกเดินทาง', vi: 'khởi hành',
  },
  refreshList: {
    zh: '换一批', en: 'Refresh', ja: '更新', ko: '새로고침',
    fr: 'Actualiser', de: 'Aktualisieren', es: 'Actualizar', pt: 'Atualizar',
    ru: 'Обновить', ar: 'تحديث', th: 'สุ่มใหม่', vi: 'Làm mới',
  },
  go: {
    zh: '出发！开始专注', en: 'Go! Start Focus', ja: '出発！集中開始', ko: '출발! 집중 시작',
    fr: 'C\'est parti !', de: 'Los! Fokus starten', es: '¡Vamos! Enfócate', pt: 'Vamos! Foco',
    ru: 'Поехали! Фокус', ar: '!انطلق! ركّز', th: 'ไป! เริ่มโฟกัส', vi: 'Đi! Tập trung',
  },
  remainingTime: {
    zh: '剩余时间', en: 'Remaining', ja: '残り時間', ko: '남은 시간',
    fr: 'Restant', de: 'Verbleibend', es: 'Restante', pt: 'Restante',
    ru: 'Осталось', ar: 'المتبقي', th: 'เหลือ', vi: 'Còn lại',
  },
  paused: {
    zh: '暂停中', en: 'Paused', ja: '一時停止', ko: '일시정지',
    fr: 'En pause', de: 'Pausiert', es: 'Pausado', pt: 'Pausado',
    ru: 'Пауза', ar: 'متوقف', th: 'หยุดชั่วคราว', vi: 'Tạm dừng',
  },
  pause: {
    zh: '暂停', en: 'Pause', ja: '一時停止', ko: '일시정지',
    fr: 'Pause', de: 'Pause', es: 'Pausa', pt: 'Pausa',
    ru: 'Пауза', ar: 'إيقاف', th: 'หยุด', vi: 'Dừng',
  },
  resume: {
    zh: '继续', en: 'Resume', ja: '再開', ko: '계속',
    fr: 'Reprendre', de: 'Weiter', es: 'Reanudar', pt: 'Retomar',
    ru: 'Продолжить', ar: 'استئناف', th: 'ต่อ', vi: 'Tiếp',
  },
  congrats: {
    zh: '恭喜到达', en: 'You arrived at', ja: '到着おめでとう', ko: '도착을 축하합니다',
    fr: 'Vous êtes arrivé à', de: 'Angekommen in', es: '¡Llegaste a', pt: 'Você chegou em',
    ru: 'Вы прибыли в', ar: 'وصلت إلى', th: 'ยินดีที่ถึง', vi: 'Chúc mừng đã đến',
  },
  recordTime: {
    zh: '记录这段时光', en: 'Record this moment', ja: 'この時間を記録', ko: '이 시간을 기록',
    fr: 'Notez ce moment', de: 'Moment festhalten', es: 'Registra este momento', pt: 'Registre este momento',
    ru: 'Запишите этот момент', ar: 'سجّل هذه اللحظة', th: 'บันทึกช่วงเวลานี้', vi: 'Ghi lại khoảnh khắc',
  },
  notePlaceholder: {
    zh: '这段时间我做了...', en: 'What I did...', ja: 'この時間にやったこと...', ko: '이 시간에 한 일...',
    fr: 'Ce que j\'ai fait...', de: 'Was ich gemacht habe...', es: 'Lo que hice...', pt: 'O que eu fiz...',
    ru: 'Что я сделал...', ar: '...ما فعلته', th: 'ช่วงนี้ฉันทำ...', vi: 'Tôi đã làm...',
  },
  saveFinish: {
    zh: '保存，完成旅程 ✓', en: 'Save & Finish ✓', ja: '保存して完了 ✓', ko: '저장 후 완료 ✓',
    fr: 'Sauvegarder ✓', de: 'Speichern ✓', es: 'Guardar ✓', pt: 'Salvar ✓',
    ru: 'Сохранить ✓', ar: '✓ حفظ وإنهاء', th: 'บันทึก ✓', vi: 'Lưu ✓',
  },
  skipFinish: {
    zh: '跳过，完成旅程', en: 'Skip & Finish', ja: 'スキップして完了', ko: '건너뛰고 완료',
    fr: 'Passer', de: 'Überspringen', es: 'Omitir', pt: 'Pular',
    ru: 'Пропустить', ar: 'تخطي وإنهاء', th: 'ข้าม', vi: 'Bỏ qua',
  },
  month: {
    zh: '月', en: 'Month', ja: '月', ko: '월',
    fr: 'Mois', de: 'Monat', es: 'Mes', pt: 'Mês',
    ru: 'Месяц', ar: 'شهر', th: 'เดือน', vi: 'Tháng',
  },
  week: {
    zh: '周', en: 'Week', ja: '週', ko: '주',
    fr: 'Semaine', de: 'Woche', es: 'Semana', pt: 'Semana',
    ru: 'Неделя', ar: 'أسبوع', th: 'สัปดาห์', vi: 'Tuần',
  },
  day: {
    zh: '日', en: 'Day', ja: '日', ko: '일',
    fr: 'Jour', de: 'Tag', es: 'Día', pt: 'Dia',
    ru: 'День', ar: 'يوم', th: 'วัน', vi: 'Ngày',
  },
  language: {
    zh: '语言', en: 'Language', ja: '言語', ko: '언어',
    fr: 'Langue', de: 'Sprache', es: 'Idioma', pt: 'Idioma',
    ru: 'Язык', ar: 'اللغة', th: 'ภาษา', vi: 'Ngôn ngữ',
  },
  origin: {
    zh: '出发点', en: 'Origin', ja: '出発地', ko: '출발지',
    fr: 'Origine', de: 'Startpunkt', es: 'Origen', pt: 'Origem',
    ru: 'Отправление', ar: 'نقطة الانطلاق', th: 'ต้นทาง', vi: 'Điểm đi',
  },
  traveled: {
    zh: '已行驶', en: 'Traveled', ja: '走行距離', ko: '이동 거리',
    fr: 'Parcouru', de: 'Gefahren', es: 'Recorrido', pt: 'Percorrido',
    ru: 'Пройдено', ar: 'المسافة المقطوعة', th: 'เดินทางแล้ว', vi: 'Đã đi',
  },
  noRecord: {
    zh: '这天没有番茄钟记录', en: 'No records this day', ja: 'この日の記録なし', ko: '이 날 기록 없음',
    fr: 'Aucun enregistrement', de: 'Keine Einträge', es: 'Sin registros', pt: 'Sem registros',
    ru: 'Нет записей', ar: 'لا توجد سجلات', th: 'ไม่มีบันทึก', vi: 'Không có bản ghi',
  },
  continents: {
    zh: '大洲', en: 'Continents', ja: '大陸', ko: '대륙',
    fr: 'Continents', de: 'Kontinente', es: 'Continentes', pt: 'Continentes',
    ru: 'Континенты', ar: 'القارات', th: 'ทวีป', vi: 'Châu lục',
  },
  continentProgress: {
    zh: '大洲进度', en: 'Continent Progress', ja: '大陸進捗', ko: '대륙 진행',
    fr: 'Progrès continents', de: 'Kontinent-Fortschritt', es: 'Progreso continental', pt: 'Progresso continental',
    ru: 'Прогресс по континентам', ar: 'تقدم القارات', th: 'ความคืบหน้าทวีป', vi: 'Tiến độ châu lục',
  },
  recentLit: {
    zh: '最近点亮', en: 'Recently Lit', ja: '最近点灯', ko: '최근 밝힘',
    fr: 'Récemment illuminé', de: 'Kürzlich beleuchtet', es: 'Iluminado recientemente', pt: 'Iluminado recentemente',
    ru: 'Недавно открытые', ar: 'أضيئت مؤخراً', th: 'เพิ่งจุดสว่าง', vi: 'Mới thắp sáng',
  },
  emptyMap: {
    zh: '完成番茄钟来点亮城市吧！', en: 'Complete pomodoros to light up cities!', ja: 'ポモドーロを完了して都市を点灯しよう！', ko: '포모도로를 완료하여 도시를 밝히세요!',
    fr: 'Complétez des pomodoros pour illuminer les villes !', de: 'Schließe Pomodoros ab, um Städte zu beleuchten!', es: '¡Completa pomodoros para iluminar ciudades!', pt: 'Complete pomodoros para iluminar cidades!',
    ru: 'Завершите помодоро, чтобы зажечь города!', ar: '!أكمل بومودورو لإضاءة المدن', th: 'ทำโพโมโดโรเพื่อจุดสว่างเมือง!', vi: 'Hoàn thành pomodoro để thắp sáng thành phố!',
  },
  firstArrival: {
    zh: '首次到达：', en: 'First arrival: ', ja: '初到着：', ko: '첫 도착: ',
    fr: 'Première arrivée : ', de: 'Erste Ankunft: ', es: 'Primera llegada: ', pt: 'Primeira chegada: ',
    ru: 'Первое посещение: ', ar: ' :الوصول الأول', th: 'ถึงครั้งแรก: ', vi: 'Lần đến đầu: ',
  },
  visitCount: {
    zh: '到访次数：', en: 'Visits: ', ja: '訪問回数：', ko: '방문 횟수: ',
    fr: 'Visites : ', de: 'Besuche: ', es: 'Visitas: ', pt: 'Visitas: ',
    ru: 'Посещений: ', ar: ' :عدد الزيارات', th: 'จำนวนครั้ง: ', vi: 'Số lần: ',
  },
  totalPomodoro: {
    zh: '番茄总数', en: 'Total', ja: '合計', ko: '총 수',
    fr: 'Total', de: 'Gesamt', es: 'Total', pt: 'Total',
    ru: 'Всего', ar: 'المجموع', th: 'รวม', vi: 'Tổng',
  },
  totalTime: {
    zh: '总时长', en: 'Duration', ja: '合計時間', ko: '총 시간',
    fr: 'Durée', de: 'Dauer', es: 'Duración', pt: 'Duração',
    ru: 'Длительность', ar: 'المدة', th: 'เวลารวม', vi: 'Thời gian',
  },
  totalMileage: {
    zh: '总里程(km)', en: 'Mileage(km)', ja: '総距離(km)', ko: '총 거리(km)',
    fr: 'Distance(km)', de: 'Strecke(km)', es: 'Distancia(km)', pt: 'Distância(km)',
    ru: 'Расст.(км)', ar: '(km)المسافة', th: 'ระยะทาง(km)', vi: 'Quãng đường(km)',
  },
  visitedCities: {
    zh: '到访城市', en: 'Cities visited', ja: '訪問都市', ko: '방문 도시',
    fr: 'Villes visitées', de: 'Besuchte Städte', es: 'Ciudades visitadas', pt: 'Cidades visitadas',
    ru: 'Посещено городов', ar: 'مدن تمت زيارتها', th: 'เมืองที่ไปแล้ว', vi: 'Thành phố đã đến',
  },
  monthStats: {
    zh: '月统计', en: 'Monthly Stats', ja: '月間統計', ko: '월간 통계',
    fr: 'Stats mensuelles', de: 'Monatsstatistik', es: 'Estadísticas mensuales', pt: 'Estatísticas mensais',
    ru: 'За месяц', ar: 'إحصائيات الشهر', th: 'สถิติรายเดือน', vi: 'Thống kê tháng',
  },
  weekStats: {
    zh: '本周统计', en: 'Weekly Stats', ja: '週間統計', ko: '주간 통계',
    fr: 'Stats hebdomadaires', de: 'Wochenstatistik', es: 'Estadísticas semanales', pt: 'Estatísticas semanais',
    ru: 'За неделю', ar: 'إحصائيات الأسبوع', th: 'สถิติรายสัปดาห์', vi: 'Thống kê tuần',
  },
  notFilled: {
    zh: '(未填写)', en: '(no note)', ja: '(未記入)', ko: '(미작성)',
    fr: '(non rempli)', de: '(nicht ausgefüllt)', es: '(sin nota)', pt: '(sem nota)',
    ru: '(не заполнено)', ar: '(غير مملوء)', th: '(ไม่ได้กรอก)', vi: '(chưa ghi)',
  },
  noMatch: {
    zh: '未找到匹配城市', en: 'No matching city', ja: '一致する都市なし', ko: '일치하는 도시 없음',
    fr: 'Aucune ville trouvée', de: 'Keine Stadt gefunden', es: 'Sin resultados', pt: 'Nenhuma cidade encontrada',
    ru: 'Город не найден', ar: 'لم يتم العثور على مدينة', th: 'ไม่พบเมือง', vi: 'Không tìm thấy',
  },
  expandedRadius: {
    zh: '附近城市较少，已扩大搜索至', en: 'Few nearby cities, expanded to', ja: '近くの都市が少ないため、検索範囲を拡大：', ko: '근처 도시가 적어 검색 범위 확대:',
    fr: 'Peu de villes proches, élargi à', de: 'Wenige Städte, erweitert auf', es: 'Pocas ciudades cercanas, ampliado a', pt: 'Poucas cidades, ampliado para',
    ru: 'Мало городов, расширено до', ar: 'مدن قليلة، توسيع إلى', th: 'เมืองใกล้เคียงน้อย ขยายเป็น', vi: 'Ít thành phố, mở rộng đến',
  },
  longPressAbandon: {
    zh: '长按放弃本次旅程', en: 'Long press to abandon', ja: '長押しで放棄', ko: '길게 눌러 포기',
    fr: 'Appui long pour abandonner', de: 'Lange drücken zum Abbrechen', es: 'Mantén pulsado para abandonar', pt: 'Pressione longo para abandonar',
    ru: 'Удерживайте для отмены', ar: 'اضغط مطولاً للتخلي', th: 'กดค้างเพื่อยกเลิก', vi: 'Nhấn giữ để hủy',
  },
  abandonTitle: {
    zh: '放弃旅程', en: 'Abandon Trip', ja: '旅を放棄', ko: '여행 포기',
    fr: 'Abandonner', de: 'Reise abbrechen', es: 'Abandonar viaje', pt: 'Abandonar viagem',
    ru: 'Отменить поездку', ar: 'التخلي عن الرحلة', th: 'ยกเลิกเที่ยว', vi: 'Hủy chuyến',
  },
  abandonConfirm: {
    zh: '确定放弃本次番茄钟吗？', en: 'Abandon this pomodoro?', ja: 'このポモドーロを放棄しますか？', ko: '이 포모도로를 포기하시겠습니까?',
    fr: 'Abandonner ce pomodoro ?', de: 'Diesen Pomodoro abbrechen?', es: '¿Abandonar este pomodoro?', pt: 'Abandonar este pomodoro?',
    ru: 'Отменить этот помодоро?', ar: 'هل تريد التخلي عن هذا البومودورو؟', th: 'ยกเลิกโพโมโดโรนี้?', vi: 'Hủy pomodoro này?',
  },
  resetTitle: {
    zh: '重置出发点', en: 'Reset Origin', ja: '出発地リセット', ko: '출발지 초기화',
    fr: 'Réinitialiser origine', de: 'Startpunkt zurücksetzen', es: 'Reiniciar origen', pt: 'Redefinir origem',
    ru: 'Сброс отправления', ar: 'إعادة تعيين نقطة الانطلاق', th: 'รีเซ็ตต้นทาง', vi: 'Đặt lại điểm đi',
  },
  resetConfirm: {
    zh: '将清除当前位置，重新选择出发城市', en: 'This will clear your current location and let you pick a new starting city', ja: '現在地をクリアし、新しい出発都市を選択します', ko: '현재 위치를 지우고 새 출발 도시를 선택합니다',
    fr: 'Cela effacera votre position actuelle', de: 'Aktuellen Standort löschen und neu wählen', es: 'Se borrará tu ubicación actual', pt: 'Isso limpará sua localização atual',
    ru: 'Текущее местоположение будет сброшено', ar: 'سيتم مسح موقعك الحالي', th: 'จะลบตำแหน่งปัจจุบัน เลือกเมืองต้นทางใหม่', vi: 'Sẽ xóa vị trí hiện tại, chọn lại thành phố khởi hành',
  },
  yearSuffix: {
    zh: '年', en: ' ', ja: '年', ko: '년 ',
    fr: ' ', de: ' ', es: ' ', pt: ' ',
    ru: ' ', ar: ' ', th: ' ', vi: ' ',
  },
  monthSuffix: {
    zh: '月', en: '', ja: '月', ko: '월',
    fr: '', de: '', es: '', pt: '',
    ru: '', ar: '', th: '', vi: '',
  },
  monthNames: {
    zh: '1,2,3,4,5,6,7,8,9,10,11,12',
    en: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
    ja: '1,2,3,4,5,6,7,8,9,10,11,12',
    ko: '1,2,3,4,5,6,7,8,9,10,11,12',
    fr: 'Jan,Fév,Mar,Avr,Mai,Juin,Juil,Aoû,Sep,Oct,Nov,Déc',
    de: 'Jan,Feb,Mär,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez',
    es: 'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
    pt: 'Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez',
    ru: 'Янв,Фев,Мар,Апр,Май,Июн,Июл,Авг,Сен,Окт,Ноя,Дек',
    ar: 'يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر',
    th: 'ม.ค.,ก.พ.,มี.ค.,เม.ย.,พ.ค.,มิ.ย.,ก.ค.,ส.ค.,ก.ย.,ต.ค.,พ.ย.,ธ.ค.',
    vi: 'Th1,Th2,Th3,Th4,Th5,Th6,Th7,Th8,Th9,Th10,Th11,Th12',
  },
  weekdayNames: {
    zh: '日,一,二,三,四,五,六',
    en: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    ja: '日,月,火,水,木,金,土',
    ko: '일,월,화,수,목,금,토',
    fr: 'Dim,Lun,Mar,Mer,Jeu,Ven,Sam',
    de: 'So,Mo,Di,Mi,Do,Fr,Sa',
    es: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
    pt: 'Dom,Seg,Ter,Qua,Qui,Sex,Sáb',
    ru: 'Вс,Пн,Вт,Ср,Чт,Пт,Сб',
    ar: 'أحد,إثن,ثلا,أرب,خمي,جمع,سبت',
    th: 'อา,จ,อ,พ,พฤ,ศ,ส',
    vi: 'CN,T2,T3,T4,T5,T6,T7',
  },
  weekdayShortNames: {
    zh: '一,二,三,四,五,六,日',
    en: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    ja: '月,火,水,木,金,土,日',
    ko: '월,화,수,목,금,토,일',
    fr: 'Lun,Mar,Mer,Jeu,Ven,Sam,Dim',
    de: 'Mo,Di,Mi,Do,Fr,Sa,So',
    es: 'Lun,Mar,Mié,Jue,Vie,Sáb,Dom',
    pt: 'Seg,Ter,Qua,Qui,Sex,Sáb,Dom',
    ru: 'Пн,Вт,Ср,Чт,Пт,Сб,Вс',
    ar: 'إثن,ثلا,أرب,خمي,جمع,سبت,أحد',
    th: 'จ,อ,พ,พฤ,ศ,ส,อา',
    vi: 'T2,T3,T4,T5,T6,T7,CN',
  },
  continentAsia: {
    zh: '亚洲', en: 'Asia', ja: 'アジア', ko: '아시아',
    fr: 'Asie', de: 'Asien', es: 'Asia', pt: 'Ásia',
    ru: 'Азия', ar: 'آسيا', th: 'เอเชีย', vi: 'Châu Á',
  },
  continentEurope: {
    zh: '欧洲', en: 'Europe', ja: 'ヨーロッパ', ko: '유럽',
    fr: 'Europe', de: 'Europa', es: 'Europa', pt: 'Europa',
    ru: 'Европа', ar: 'أوروبا', th: 'ยุโรป', vi: 'Châu Âu',
  },
  continentNorthAmerica: {
    zh: '北美洲', en: 'N. America', ja: '北米', ko: '북미',
    fr: 'Amér. Nord', de: 'Nordamerika', es: 'Norteamérica', pt: 'Am. Norte',
    ru: 'Сев. Америка', ar: 'أمريكا الشمالية', th: 'อเมริกาเหนือ', vi: 'Bắc Mỹ',
  },
  continentSouthAmerica: {
    zh: '南美洲', en: 'S. America', ja: '南米', ko: '남미',
    fr: 'Amér. Sud', de: 'Südamerika', es: 'Sudamérica', pt: 'Am. Sul',
    ru: 'Юж. Америка', ar: 'أمريكا الجنوبية', th: 'อเมริกาใต้', vi: 'Nam Mỹ',
  },
  continentAfrica: {
    zh: '非洲', en: 'Africa', ja: 'アフリカ', ko: '아프리카',
    fr: 'Afrique', de: 'Afrika', es: 'África', pt: 'África',
    ru: 'Африка', ar: 'أفريقيا', th: 'แอฟริกา', vi: 'Châu Phi',
  },
  continentOceania: {
    zh: '大洋洲', en: 'Oceania', ja: 'オセアニア', ko: '오세아니아',
    fr: 'Océanie', de: 'Ozeanien', es: 'Oceanía', pt: 'Oceania',
    ru: 'Океания', ar: 'أوقيانوسيا', th: 'โอเชียเนีย', vi: 'Châu Đại Dương',
  },
}

/** 获取 UI 文本 */
export function t(key: string): string {
  const entry = uiTexts[key]
  if (!entry) return key
  return entry[currentLang.value] || entry['zh'] || key
}

/** 获取城市显示名 */
export function cityName(city: { name: string; nameZh?: string }): string {
  if (currentLang.value === 'zh' && city.nameZh) return city.nameZh
  return city.name
}

/** 获取国家显示名 */
export function countryName(city: { country: string; countryZh?: string }): string {
  if (currentLang.value === 'zh' && city.countryZh) return city.countryZh
  return city.country
}

/** 城市+国家组合显示 */
export function cityFullName(city: { name: string; nameZh?: string; country: string; countryZh?: string }): string {
  return `${cityName(city)}, ${countryName(city)}`
}

/** 格式化月份标题 如 "2026年3月" / "Mar 2026" */
export function formatMonthTitle(year: number, month: number): string {
  const monthNames = t('monthNames').split(',')
  const mName = monthNames[month - 1] || String(month)
  const lang = currentLang.value
  if (lang === 'zh' || lang === 'ja') return `${year}${t('yearSuffix')}${mName}${t('monthSuffix')}`
  if (lang === 'ko') return `${year}${t('yearSuffix')}${mName}${t('monthSuffix')}`
  return `${mName} ${year}`
}

/** 获取星期名数组(日~六) */
export function getWeekdayNames(): string[] {
  return t('weekdayNames').split(',')
}

/** 获取星期短名数组(一~日) */
export function getWeekdayShortNames(): string[] {
  return t('weekdayShortNames').split(',')
}

const continentKeyMap: Record<string, string> = {
  'Asia': 'continentAsia',
  'Europe': 'continentEurope',
  'North America': 'continentNorthAmerica',
  'South America': 'continentSouthAmerica',
  'Africa': 'continentAfrica',
  'Oceania': 'continentOceania',
}

/** 翻译大洲名 */
export function continentName(eng: string): string {
  const key = continentKeyMap[eng]
  return key ? t(key) : eng
}
