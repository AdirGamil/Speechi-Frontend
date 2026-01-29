/**
 * Simple i18n dictionary. No library. Keys cover marketing, product, and settings.
 */

export type UiLang = "en" | "he" | "fr" | "es" | "ar";

export interface I18nStrings {
  // Marketing
  tagline: string;
  taglineHe: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  howItWorks: string;
  whatIsSpeechiTitle: string;
  whatIsSpeechiBody: string;
  featureSpeechToText: string;
  featureSpeechToTextDesc: string;
  featureSmartSummaries: string;
  featureSmartSummariesDesc: string;
  featureMultiLanguage: string;
  featureMultiLanguageDesc: string;
  featureExportOptions: string;
  featureExportOptionsDesc: string;
  coreFeaturesTitle: string;
  poweredBy: string;
  trustNoStore: string;
  trustClarity: string;
  // Product
  newMeeting: string;
  history: string;
  settings: string;
  uploadLabel: string;
  uploadHint: string;
  outputLanguage: string;
  outputLanguageHint: string;
  analyze: string;
  export: string;
  exportWord: string;
  exportPdf: string;
  summary: string;
  summarySubtitle: string;
  summaryNote: string;
  cleanTranscript: string;
  cleanTranscriptLabel: string;
  originalTranscript: string;
  originalTranscriptTooltip: string;
  decisionsActions: string;
  decisionsEmpty: string;
  participants: string;
  decisions: string;
  actionItems: string;
  none: string;
  ownerUnassigned: string;
  // History
  historyTitle: string;
  historyEmpty: string;
  view: string;
  backToList: string;
  meetingSaved: string;
  meetingsSaved: string;
  delete: string;
  deleteConfirm: string;
  deleteConfirmBody: string;
  cancel: string;
  confirm: string;
  // Settings
  settingsTitle: string;
  defaultOutputLanguage: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  privacyTitle: string;
  privacyText: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  clearHistoryConfirmBody: string;
  // Common
  loading: string;
  exporting: string;
  done: string;
  error: string;
  toastWordDownloaded: string;
  toastPdfDownloaded: string;
  light: string;
  dark: string;
  // Auth
  authSignUp: string;
  authSignUpFree: string;
  authLogin: string;
  authLogout: string;
  authName: string;
  authEmail: string;
  authNamePlaceholder: string;
  authEmailPlaceholder: string;
  authSubmitRegister: string;
  authSubmitLogin: string;
  authWelcome: string;
  authNoAccount: string;
  authHaveAccount: string;
  authPrivacyNote: string;
  authBenefitsTitle: string;
  authBenefit1: string;
  authBenefit2: string;
  authBenefit3: string;
  authRegisterTitle: string;
  authRegisterSubtitle: string;
  authLoginTitle: string;
  authLoginSubtitle: string;
  authErrorNameRequired: string;
  authErrorNameMin: string;
  authErrorEmailRequired: string;
  authErrorEmailInvalid: string;
  authErrorUserNotFound: string;
  // Usage
  usageIndicator: string;
  usageLimitGuestTitle: string;
  usageLimitGuestMessage: string;
  usageLimitRegisteredTitle: string;
  usageLimitRegisteredMessage: string;
  // Additional UI
  yourResults: string;
  rawTranscriptionNote: string;
  noDecisionsIdentified: string;
  processingAudio: string;
  // Recording
  recordMeeting: string;
  startRecording: string;
  stopRecording: string;
  recording: string;
  recordingInProgress: string;
  deleteRecording: string;
  useRecording: string;
  orUploadFile: string;
  orRecordMeeting: string;
  recordingNotSupported: string;
  microphonePermissionDenied: string;
  // Supported formats
  supportedFormats: string;
  // Landing page specific
  heroBadge: string;
  scrollIndicator: string;
  footerCopyright: string;
  // Accessibility labels
  selectLanguage: string;
  toggleTheme: string;
}

const I18N: Record<UiLang, I18nStrings> = {
  en: {
    tagline: "Turn conversations into clarity.",
    taglineHe: "",
    heroTitle: "Meetings, summarized. Clearly.",
    heroSubtitle: "Upload a recording. Get a clean transcript, insights, and a Word summary in seconds.",
    ctaPrimary: "Start using Speechi",
    ctaSecondary: "How it works",
    howItWorks: "How it works",
    whatIsSpeechiTitle: "What is Speechi",
    whatIsSpeechiBody:
      "Speechi turns spoken conversations into clear, structured insights. Upload a meeting, podcast, or discussion and receive a clean transcript, summary, and action points.",
    featureSpeechToText: "Speech to Text",
    featureSpeechToTextDesc: "Accurate transcription powered by OpenAI Whisper",
    featureSmartSummaries: "Smart Summaries",
    featureSmartSummariesDesc: "AI-generated summaries using Claude",
    featureMultiLanguage: "Multi-language Support",
    featureMultiLanguageDesc: "Choose your output language before analysis",
    featureExportOptions: "Export Options",
    featureExportOptionsDesc: "Download your results as a Word document",
    coreFeaturesTitle: "Core Features",
    poweredBy: "Powered by Whisper + Claude",
    trustNoStore: "No data is stored on our servers",
    trustClarity: "Built for clarity and trust.",
    newMeeting: "New Meeting",
    history: "History",
    settings: "Settings",
    uploadLabel: "Audio file",
    uploadHint: "Drag & drop or click to select .mp3, .wav, .m4a",
    outputLanguage: "Output language",
    outputLanguageHint: "Summary and transcript will be generated in the selected language.",
    analyze: "Analyze Meeting",
    export: "Export",
    exportWord: "Export as Word (.docx)",
    exportPdf: "Export as PDF (.pdf)",
    summary: "Summary",
    summarySubtitle: "AI-generated executive overview",
    summaryNote: "Generated solely from the uploaded audio.",
    cleanTranscript: "Clean Transcript",
    cleanTranscriptLabel: "Clean, translated transcript",
    originalTranscript: "Original Transcript",
    originalTranscriptTooltip: "Raw transcription produced directly from the audio using Whisper.",
    decisionsActions: "Decisions & Actions",
    decisionsEmpty: "No decisions or action items were identified.",
    participants: "Participants",
    decisions: "Decisions",
    actionItems: "Action Items",
    none: "None",
    ownerUnassigned: "Unassigned",
    historyTitle: "History",
    historyEmpty: "No meetings yet.",
    view: "View",
    backToList: "Back to List",
    meetingSaved: "meeting saved",
    meetingsSaved: "meetings saved",
    delete: "Delete",
    deleteConfirm: "Delete meeting?",
    deleteConfirmBody: "This cannot be undone.",
    cancel: "Cancel",
    confirm: "Confirm",
    settingsTitle: "Settings",
    defaultOutputLanguage: "Default output language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    privacyTitle: "Privacy",
    privacyText: "Speechi does not store your files or transcripts on a server.",
    clearHistory: "Clear history",
    clearHistoryConfirm: "Clear all history?",
    clearHistoryConfirmBody: "All meeting history will be removed from this device.",
    loading: "Processing…",
    exporting: "Exporting…",
    done: "Done",
    error: "Something went wrong",
    toastWordDownloaded: "Your Word summary is downloading",
    toastPdfDownloaded: "PDF summary downloaded",
    light: "Light",
    dark: "Dark",
    // Auth
    authSignUp: "Sign up",
    authSignUpFree: "Sign up free",
    authLogin: "Log in",
    authLogout: "Log out",
    authName: "Name",
    authEmail: "Email",
    authNamePlaceholder: "Enter your name",
    authEmailPlaceholder: "you@example.com",
    authSubmitRegister: "Create free account",
    authSubmitLogin: "Log in",
    authWelcome: "Hi, {name}",
    authNoAccount: "Don't have an account?",
    authHaveAccount: "Already have an account?",
    authPrivacyNote: "No password required. Your data stays on your device.",
    authBenefitsTitle: "Free account benefits:",
    authBenefit1: "Analyze up to 5 meetings per day",
    authBenefit2: "Unlimited history storage",
    authBenefit3: "Export to Word & PDF",
    authRegisterTitle: "Create your free account",
    authRegisterSubtitle: "Get 5 meetings per day instead of 1",
    authLoginTitle: "Welcome back",
    authLoginSubtitle: "Log in to access your account",
    authErrorNameRequired: "Name is required",
    authErrorNameMin: "Name must be at least 2 characters",
    authErrorEmailRequired: "Email is required",
    authErrorEmailInvalid: "Please enter a valid email",
    authErrorUserNotFound: "No account found with this email",
    // Usage
    usageIndicator: "{used}/{limit} used today",
    usageLimitGuestTitle: "Daily limit reached",
    usageLimitGuestMessage: "Free users can analyze 1 meeting per day. Create a free account to get 5 per day.",
    usageLimitRegisteredTitle: "Daily limit reached",
    usageLimitRegisteredMessage: "You've used all {limit} meetings for today. Come back tomorrow.",
    // Additional UI
    yourResults: "Your Results",
    rawTranscriptionNote: "Raw transcription for reference",
    noDecisionsIdentified: "No specific decisions or action items were identified",
    processingAudio: "This may take a moment...",
    // Recording
    recordMeeting: "Record meeting",
    startRecording: "Start recording",
    stopRecording: "Stop recording",
    recording: "Recording",
    recordingInProgress: "Recording in progress...",
    deleteRecording: "Delete recording",
    useRecording: "Use recording",
    orUploadFile: "or upload a file",
    orRecordMeeting: "or record a meeting",
    recordingNotSupported: "Recording is not supported in this browser",
    microphonePermissionDenied: "Microphone access denied. Please allow microphone access to record.",
    // Supported formats
    supportedFormats: "Supported formats",
    // Landing page specific
    heroBadge: "AI-Powered Meeting Notes",
    scrollIndicator: "Scroll",
    footerCopyright: "All rights reserved",
    // Accessibility labels
    selectLanguage: "Select language",
    toggleTheme: "Toggle theme",
  },
  he: {
    tagline: "Turn conversations into clarity.",
    taglineHe: "Speechi הופך שיחות לתובנות.",
    heroTitle: "פגישות, מסוכמות. בבירור.",
    heroSubtitle: "העלה הקלטה. קבל תמליל מסודר, תובנות ומסמך Word תוך שניות.",
    ctaPrimary: "התחל להשתמש ב-Speechi",
    ctaSecondary: "איך זה עובד",
    howItWorks: "איך זה עובד",
    whatIsSpeechiTitle: "מה זה Speechi",
    whatIsSpeechiBody:
      "Speechi הופך שיחות מדוברות לתובנות ברורות ומבנות. העלה פגישה, פודקאסט או דיון וקבל תמליל נקי, סיכום ונקודות פעולה.",
    featureSpeechToText: "דיבור לטקסט",
    featureSpeechToTextDesc: "תמלול מדויק בטכנולוגיית OpenAI Whisper",
    featureSmartSummaries: "סיכומים חכמים",
    featureSmartSummariesDesc: "סיכומים שנוצרו ב-AI באמצעות Claude",
    featureMultiLanguage: "תמיכה במספר שפות",
    featureMultiLanguageDesc: "בחר את שפת הפלט לפני הניתוח",
    featureExportOptions: "אפשרויות ייצוא",
    featureExportOptionsDesc: "הורד את התוצאות כמסמך Word",
    coreFeaturesTitle: "תכונות עיקריות",
    poweredBy: "Powered by Whisper + Claude",
    trustNoStore: "אין אחסון נתונים בשרתים שלנו",
    trustClarity: "נבנה לשקיפות ואמון.",
    newMeeting: "פגישה חדשה",
    history: "היסטוריה",
    settings: "הגדרות",
    uploadLabel: "קובץ אודיו",
    uploadHint: "גרור והנח או לחץ לבחירה .mp3, .wav, .m4a",
    outputLanguage: "שפת פלט",
    outputLanguageHint: "הסיכום והתמליל יופקו בשפה הנבחרת.",
    analyze: "נתח פגישה",
    export: "ייצוא",
    exportWord: "ייצא כ-Word (.docx)",
    exportPdf: "ייצא כ-PDF (.pdf)",
    summary: "סיכום",
    summarySubtitle: "סקירת מנהלים שנוצרה ב-AI",
    summaryNote: "נוצר אך ורק מהאודיו שהועלה.",
    cleanTranscript: "תמליל נקי",
    cleanTranscriptLabel: "תמליל מתורגם ומסודר",
    originalTranscript: "תמליל מקורי",
    originalTranscriptTooltip: "תמלול גולמי שנוצר ישירות מהאודיו באמצעות Whisper.",
    decisionsActions: "החלטות ומשימות",
    decisionsEmpty: "לא זוהו החלטות או משימות בפגישה זו.",
    participants: "משתתפים",
    decisions: "החלטות",
    actionItems: "משימות",
    none: "אין",
    ownerUnassigned: "לא שויך",
    historyTitle: "היסטוריה",
    historyEmpty: "אין פגישות עדיין.",
    view: "צפה",
    backToList: "חזרה לרשימה",
    meetingSaved: "פגישה שמורה",
    meetingsSaved: "פגישות שמורות",
    delete: "מחק",
    deleteConfirm: "למחוק פגישה?",
    deleteConfirmBody: "לא ניתן לבטל.",
    cancel: "ביטול",
    confirm: "אישור",
    settingsTitle: "הגדרות",
    defaultOutputLanguage: "שפת פלט ברירת מחדל",
    theme: "ערכת נושא",
    themeLight: "בהיר",
    themeDark: "כהה",
    themeSystem: "מערכת",
    privacyTitle: "פרטיות",
    privacyText: "Speechi לא שומר את הקבצים או התמלילים שלך על שרת.",
    clearHistory: "נקה היסטוריה",
    clearHistoryConfirm: "לנקות את כל ההיסטוריה?",
    clearHistoryConfirmBody: "כל היסטוריית הפגישות תוסר מהמכשיר.",
    loading: "מעבד…",
    exporting: "מייצא…",
    done: "הושלם",
    error: "משהו השתבש",
    toastWordDownloaded: "סיכום ה-Word שלך מורד",
    toastPdfDownloaded: "סיכום PDF הורד",
    light: "בהיר",
    dark: "כהה",
    // Auth
    authSignUp: "הרשמה",
    authSignUpFree: "הרשמה חינם",
    authLogin: "התחברות",
    authLogout: "התנתקות",
    authName: "שם",
    authEmail: "אימייל",
    authNamePlaceholder: "הכנס את שמך",
    authEmailPlaceholder: "you@example.com",
    authSubmitRegister: "צור חשבון חינם",
    authSubmitLogin: "התחבר",
    authWelcome: "שלום, {name}",
    authNoAccount: "אין לך חשבון?",
    authHaveAccount: "כבר יש לך חשבון?",
    authPrivacyNote: "לא נדרשת סיסמה. הנתונים שלך נשמרים במכשיר שלך.",
    authBenefitsTitle: "יתרונות חשבון חינם:",
    authBenefit1: "נתח עד 5 פגישות ביום",
    authBenefit2: "אחסון היסטוריה ללא הגבלה",
    authBenefit3: "ייצוא ל-Word ו-PDF",
    authRegisterTitle: "צור חשבון חינם",
    authRegisterSubtitle: "קבל 5 תמלולים ביום במקום 1",
    authLoginTitle: "ברוך שובך",
    authLoginSubtitle: "התחבר כדי לגשת לחשבונך",
    authErrorNameRequired: "שם הוא שדה חובה",
    authErrorNameMin: "השם חייב להכיל לפחות 2 תווים",
    authErrorEmailRequired: "אימייל הוא שדה חובה",
    authErrorEmailInvalid: "אנא הכנס אימייל תקין",
    authErrorUserNotFound: "לא נמצא חשבון עם אימייל זה",
    // Usage
    usageIndicator: "{used}/{limit} בשימוש היום",
    usageLimitGuestTitle: "הגעת למגבלה היומית",
    usageLimitGuestMessage: "משתמשים חינמיים יכולים לנתח פגישה אחת ביום. צור חשבון חינם וקבל 5 ביום.",
    usageLimitRegisteredTitle: "הגעת למגבלה היומית",
    usageLimitRegisteredMessage: "השתמשת בכל {limit} התמלולים להיום. חזור מחר.",
    // Additional UI
    yourResults: "התוצאות שלך",
    rawTranscriptionNote: "תמלול גולמי לעיון",
    noDecisionsIdentified: "לא זוהו החלטות או משימות ספציפיות",
    processingAudio: "זה עשוי לקחת רגע...",
    // Recording
    recordMeeting: "הקלט פגישה",
    startRecording: "התחל הקלטה",
    stopRecording: "עצור הקלטה",
    recording: "מקליט",
    recordingInProgress: "הקלטה בתהליך...",
    deleteRecording: "מחק הקלטה",
    useRecording: "השתמש בהקלטה",
    orUploadFile: "או העלה קובץ",
    orRecordMeeting: "או הקלט פגישה",
    recordingNotSupported: "הקלטה לא נתמכת בדפדפן זה",
    microphonePermissionDenied: "הגישה למיקרופון נדחתה. אנא אשר גישה למיקרופון כדי להקליט.",
    // Supported formats
    supportedFormats: "פורמטים נתמכים",
    // Landing page specific
    heroBadge: "תמלול פגישות מונע AI",
    scrollIndicator: "גלול",
    footerCopyright: "כל הזכויות שמורות",
    // Accessibility labels
    selectLanguage: "בחר שפה",
    toggleTheme: "החלף ערכת נושא",
  },
  fr: {
    tagline: "Turn conversations into clarity.",
    taglineHe: "",
    heroTitle: "Réunions, résumées. Clairement.",
    heroSubtitle: "Téléversez un enregistrement. Obtenez une transcription claire, des insights et un résumé Word en secondes.",
    ctaPrimary: "Commencer avec Speechi",
    ctaSecondary: "Comment ça marche",
    howItWorks: "Comment ça marche",
    whatIsSpeechiTitle: "Qu'est-ce que Speechi",
    whatIsSpeechiBody:
      "Speechi transforme les conversations parlées en insights clairs et structurés. Téléversez une réunion, un podcast ou une discussion et recevez une transcription propre, un résumé et des points d'action.",
    featureSpeechToText: "Parole vers texte",
    featureSpeechToTextDesc: "Transcription précise par OpenAI Whisper",
    featureSmartSummaries: "Résumés intelligents",
    featureSmartSummariesDesc: "Résumés générés par IA avec Claude",
    featureMultiLanguage: "Multilingue",
    featureMultiLanguageDesc: "Choisissez votre langue de sortie avant l'analyse",
    featureExportOptions: "Export",
    featureExportOptionsDesc: "Téléchargez vos résultats en document Word",
    coreFeaturesTitle: "Fonctionnalités",
    poweredBy: "Propulsé par Whisper + Claude",
    trustNoStore: "Aucune donnée n'est stockée sur nos serveurs",
    trustClarity: "Conçu pour la clarté et la confiance.",
    newMeeting: "Nouvelle réunion",
    history: "Historique",
    settings: "Paramètres",
    uploadLabel: "Fichier audio",
    uploadHint: "Glissez-déposez ou cliquez pour sélectionner .mp3, .wav, .m4a",
    outputLanguage: "Langue de sortie",
    outputLanguageHint: "Le résumé et la transcription seront générés dans la langue choisie.",
    analyze: "Analyser la réunion",
    export: "Exporter",
    exportWord: "Exporter en Word (.docx)",
    exportPdf: "Exporter en PDF (.pdf)",
    summary: "Résumé",
    summarySubtitle: "Aperçu exécutif généré par IA",
    summaryNote: "Généré uniquement à partir de l'audio téléversé.",
    cleanTranscript: "Transcription propre",
    cleanTranscriptLabel: "Transcription traduite et épurée",
    originalTranscript: "Transcription originale",
    originalTranscriptTooltip: "Transcription brute produite directement depuis l'audio via Whisper.",
    decisionsActions: "Décisions et actions",
    decisionsEmpty: "Aucune décision ou action identifiée dans cette réunion.",
    participants: "Participants",
    decisions: "Décisions",
    actionItems: "Actions",
    none: "Aucun",
    ownerUnassigned: "Non assigné",
    historyTitle: "Historique",
    historyEmpty: "Aucune réunion pour le moment.",
    view: "Voir",
    backToList: "Retour à la liste",
    meetingSaved: "réunion enregistrée",
    meetingsSaved: "réunions enregistrées",
    delete: "Supprimer",
    deleteConfirm: "Supprimer la réunion ?",
    deleteConfirmBody: "Cette action est irréversible.",
    cancel: "Annuler",
    confirm: "Confirmer",
    settingsTitle: "Paramètres",
    defaultOutputLanguage: "Langue de sortie par défaut",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    privacyTitle: "Confidentialité",
    privacyText: "Speechi ne stocke pas vos fichiers ni transcriptions sur un serveur.",
    clearHistory: "Effacer l'historique",
    clearHistoryConfirm: "Effacer tout l'historique ?",
    clearHistoryConfirmBody: "Tout l'historique des réunions sera supprimé de cet appareil.",
    loading: "Traitement…",
    exporting: "Exportation…",
    done: "Terminé",
    error: "Une erreur s'est produite",
    toastWordDownloaded: "Votre résumé Word est en cours de téléchargement",
    toastPdfDownloaded: "Résumé PDF téléchargé",
    light: "Clair",
    dark: "Sombre",
    // Auth
    authSignUp: "S'inscrire",
    authSignUpFree: "Inscription gratuite",
    authLogin: "Connexion",
    authLogout: "Déconnexion",
    authName: "Nom",
    authEmail: "Email",
    authNamePlaceholder: "Entrez votre nom",
    authEmailPlaceholder: "vous@exemple.com",
    authSubmitRegister: "Créer un compte gratuit",
    authSubmitLogin: "Se connecter",
    authWelcome: "Bonjour, {name}",
    authNoAccount: "Pas encore de compte ?",
    authHaveAccount: "Vous avez déjà un compte ?",
    authPrivacyNote: "Aucun mot de passe requis. Vos données restent sur votre appareil.",
    authBenefitsTitle: "Avantages du compte gratuit :",
    authBenefit1: "Analysez jusqu'à 5 réunions par jour",
    authBenefit2: "Stockage d'historique illimité",
    authBenefit3: "Export vers Word & PDF",
    authRegisterTitle: "Créez votre compte gratuit",
    authRegisterSubtitle: "Obtenez 5 réunions par jour au lieu de 1",
    authLoginTitle: "Bon retour",
    authLoginSubtitle: "Connectez-vous pour accéder à votre compte",
    authErrorNameRequired: "Le nom est requis",
    authErrorNameMin: "Le nom doit contenir au moins 2 caractères",
    authErrorEmailRequired: "L'email est requis",
    authErrorEmailInvalid: "Veuillez entrer un email valide",
    authErrorUserNotFound: "Aucun compte trouvé avec cet email",
    // Usage
    usageIndicator: "{used}/{limit} utilisé aujourd'hui",
    usageLimitGuestTitle: "Limite quotidienne atteinte",
    usageLimitGuestMessage: "Les utilisateurs gratuits peuvent analyser 1 réunion par jour. Créez un compte gratuit pour en avoir 5.",
    usageLimitRegisteredTitle: "Limite quotidienne atteinte",
    usageLimitRegisteredMessage: "Vous avez utilisé vos {limit} réunions pour aujourd'hui. Revenez demain.",
    // Additional UI
    yourResults: "Vos résultats",
    rawTranscriptionNote: "Transcription brute pour référence",
    noDecisionsIdentified: "Aucune décision ou action spécifique n'a été identifiée",
    processingAudio: "Cela peut prendre un moment...",
    // Recording
    recordMeeting: "Enregistrer une réunion",
    startRecording: "Démarrer l'enregistrement",
    stopRecording: "Arrêter l'enregistrement",
    recording: "Enregistrement",
    recordingInProgress: "Enregistrement en cours...",
    deleteRecording: "Supprimer l'enregistrement",
    useRecording: "Utiliser l'enregistrement",
    orUploadFile: "ou téléverser un fichier",
    orRecordMeeting: "ou enregistrer une réunion",
    recordingNotSupported: "L'enregistrement n'est pas pris en charge dans ce navigateur",
    microphonePermissionDenied: "Accès au microphone refusé. Veuillez autoriser l'accès au microphone pour enregistrer.",
    // Supported formats
    supportedFormats: "Formats pris en charge",
    // Landing page specific
    heroBadge: "Notes de réunion alimentées par IA",
    scrollIndicator: "Défiler",
    footerCopyright: "Tous droits réservés",
    // Accessibility labels
    selectLanguage: "Sélectionner la langue",
    toggleTheme: "Changer de thème",
  },
  es: {
    tagline: "Turn conversations into clarity.",
    taglineHe: "",
    heroTitle: "Reuniones, resumidas. Con claridad.",
    heroSubtitle: "Sube una grabación. Obtén una transcripción limpia, insights y un resumen en Word en segundos.",
    ctaPrimary: "Empezar con Speechi",
    ctaSecondary: "Cómo funciona",
    howItWorks: "Cómo funciona",
    whatIsSpeechiTitle: "Qué es Speechi",
    whatIsSpeechiBody:
      "Speechi convierte conversaciones habladas en insights claros y estructurados. Sube una reunión, pódcast o debate y obtén una transcripción limpia, resumen y puntos de acción.",
    featureSpeechToText: "Voz a texto",
    featureSpeechToTextDesc: "Transcripción precisa con OpenAI Whisper",
    featureSmartSummaries: "Resúmenes inteligentes",
    featureSmartSummariesDesc: "Resúmenes generados por IA con Claude",
    featureMultiLanguage: "Varios idiomas",
    featureMultiLanguageDesc: "Elige tu idioma de salida antes del análisis",
    featureExportOptions: "Exportar",
    featureExportOptionsDesc: "Descarga tus resultados como documento Word",
    coreFeaturesTitle: "Características",
    poweredBy: "Impulsado por Whisper + Claude",
    trustNoStore: "No se almacenan datos en nuestros servidores",
    trustClarity: "Hecho para claridad y confianza.",
    newMeeting: "Nueva reunión",
    history: "Historial",
    settings: "Ajustes",
    uploadLabel: "Archivo de audio",
    uploadHint: "Arrastra y suelta o haz clic para .mp3, .wav, .m4a",
    outputLanguage: "Idioma de salida",
    outputLanguageHint: "El resumen y la transcripción se generarán en el idioma seleccionado.",
    analyze: "Analizar reunión",
    export: "Exportar",
    exportWord: "Exportar como Word (.docx)",
    exportPdf: "Exportar como PDF (.pdf)",
    summary: "Resumen",
    summarySubtitle: "Resumen ejecutivo generado por IA",
    summaryNote: "Generado únicamente a partir del audio subido.",
    cleanTranscript: "Transcripción limpia",
    cleanTranscriptLabel: "Transcripción traducida y limpia",
    originalTranscript: "Transcripción original",
    originalTranscriptTooltip: "Transcripción cruda producida directamente del audio con Whisper.",
    decisionsActions: "Decisiones y acciones",
    decisionsEmpty: "No se identificaron decisiones ni acciones en esta reunión.",
    participants: "Participantes",
    decisions: "Decisiones",
    actionItems: "Acciones",
    none: "Ninguno",
    ownerUnassigned: "Sin asignar",
    historyTitle: "Historial",
    historyEmpty: "Aún no hay reuniones.",
    view: "Ver",
    backToList: "Volver a la lista",
    meetingSaved: "reunión guardada",
    meetingsSaved: "reuniones guardadas",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar reunión?",
    deleteConfirmBody: "No se puede deshacer.",
    cancel: "Cancelar",
    confirm: "Confirmar",
    settingsTitle: "Ajustes",
    defaultOutputLanguage: "Idioma de salida por defecto",
    theme: "Tema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    privacyTitle: "Privacidad",
    privacyText: "Speechi no almacena tus archivos ni transcripciones en un servidor.",
    clearHistory: "Borrar historial",
    clearHistoryConfirm: "¿Borrar todo el historial?",
    clearHistoryConfirmBody: "Todo el historial de reuniones se eliminará de este dispositivo.",
    loading: "Procesando…",
    exporting: "Exportando…",
    done: "Hecho",
    error: "Algo salió mal",
    toastWordDownloaded: "Tu resumen Word se está descargando",
    toastPdfDownloaded: "Resumen PDF descargado",
    light: "Claro",
    dark: "Oscuro",
    // Auth
    authSignUp: "Registrarse",
    authSignUpFree: "Registro gratuito",
    authLogin: "Iniciar sesión",
    authLogout: "Cerrar sesión",
    authName: "Nombre",
    authEmail: "Email",
    authNamePlaceholder: "Ingresa tu nombre",
    authEmailPlaceholder: "tu@ejemplo.com",
    authSubmitRegister: "Crear cuenta gratuita",
    authSubmitLogin: "Iniciar sesión",
    authWelcome: "Hola, {name}",
    authNoAccount: "¿No tienes cuenta?",
    authHaveAccount: "¿Ya tienes cuenta?",
    authPrivacyNote: "No se requiere contraseña. Tus datos permanecen en tu dispositivo.",
    authBenefitsTitle: "Beneficios de la cuenta gratuita:",
    authBenefit1: "Analiza hasta 5 reuniones por día",
    authBenefit2: "Almacenamiento de historial ilimitado",
    authBenefit3: "Exportar a Word y PDF",
    authRegisterTitle: "Crea tu cuenta gratuita",
    authRegisterSubtitle: "Obtén 5 reuniones por día en lugar de 1",
    authLoginTitle: "Bienvenido de nuevo",
    authLoginSubtitle: "Inicia sesión para acceder a tu cuenta",
    authErrorNameRequired: "El nombre es obligatorio",
    authErrorNameMin: "El nombre debe tener al menos 2 caracteres",
    authErrorEmailRequired: "El email es obligatorio",
    authErrorEmailInvalid: "Por favor ingresa un email válido",
    authErrorUserNotFound: "No se encontró cuenta con este email",
    // Usage
    usageIndicator: "{used}/{limit} usado hoy",
    usageLimitGuestTitle: "Límite diario alcanzado",
    usageLimitGuestMessage: "Los usuarios gratuitos pueden analizar 1 reunión por día. Crea una cuenta gratuita para obtener 5.",
    usageLimitRegisteredTitle: "Límite diario alcanzado",
    usageLimitRegisteredMessage: "Has usado tus {limit} reuniones de hoy. Vuelve mañana.",
    // Additional UI
    yourResults: "Tus resultados",
    rawTranscriptionNote: "Transcripción cruda para referencia",
    noDecisionsIdentified: "No se identificaron decisiones o acciones específicas",
    processingAudio: "Esto puede tomar un momento...",
    // Recording
    recordMeeting: "Grabar reunión",
    startRecording: "Iniciar grabación",
    stopRecording: "Detener grabación",
    recording: "Grabando",
    recordingInProgress: "Grabación en curso...",
    deleteRecording: "Eliminar grabación",
    useRecording: "Usar grabación",
    orUploadFile: "o subir un archivo",
    orRecordMeeting: "o grabar una reunión",
    recordingNotSupported: "La grabación no es compatible con este navegador",
    microphonePermissionDenied: "Acceso al micrófono denegado. Por favor, permita el acceso al micrófono para grabar.",
    // Supported formats
    supportedFormats: "Formatos compatibles",
    // Landing page specific
    heroBadge: "Notas de reunión impulsadas por IA",
    scrollIndicator: "Desplazar",
    footerCopyright: "Todos los derechos reservados",
    // Accessibility labels
    selectLanguage: "Seleccionar idioma",
    toggleTheme: "Cambiar tema",
  },
  ar: {
    tagline: "Turn conversations into clarity.",
    taglineHe: "",
    heroTitle: "اجتماعات موجزة. بوضوح.",
    heroSubtitle: "ارفع تسجيلاً. احصل على نص منقح ورؤى وملخص Word في ثوانٍ.",
    ctaPrimary: "ابدأ باستخدام Speechi",
    ctaSecondary: "كيف يعمل",
    howItWorks: "كيف يعمل",
    whatIsSpeechiTitle: "ما هو Speechi",
    whatIsSpeechiBody:
      "Speechi يحوّل المحادثات المنطوقة إلى رؤى واضحة ومنظمة. ارفع اجتماعًا أو بودكاست أو نقاشًا واحصل على نص منقّح وملخص ونقاط عمل.",
    featureSpeechToText: "صوت إلى نص",
    featureSpeechToTextDesc: "نسخ دقيق بواسطة OpenAI Whisper",
    featureSmartSummaries: "ملخصات ذكية",
    featureSmartSummariesDesc: "ملخصات من AI باستخدام Claude",
    featureMultiLanguage: "دعم لغات متعددة",
    featureMultiLanguageDesc: "اختر لغة المخرجات قبل التحليل",
    featureExportOptions: "خيارات التصدير",
    featureExportOptionsDesc: "نزّل نتائجك كمستند Word",
    coreFeaturesTitle: "الميزات الأساسية",
    poweredBy: "Powered by Whisper + Claude",
    trustNoStore: "لا تُخزَّن البيانات على خوادمنا",
    trustClarity: "مصمم للوضوح والثقة.",
    newMeeting: "اجتماع جديد",
    history: "السجل",
    settings: "الإعدادات",
    uploadLabel: "ملف صوتي",
    uploadHint: "اسحب وأفلت أو انقر لاختيار .mp3, .wav, .m4a",
    outputLanguage: "لغة المخرجات",
    outputLanguageHint: "سيُنشأ الملخص والنص باللغة المختارة.",
    analyze: "تحليل الاجتماع",
    export: "تصدير",
    exportWord: "تصدير Word (.docx)",
    exportPdf: "تصدير PDF (.pdf)",
    summary: "الملخص",
    summarySubtitle: "نظرة تنفيذية من AI",
    summaryNote: "نُشئ فقط من الصوت المرفوع.",
    cleanTranscript: "نص منقح",
    cleanTranscriptLabel: "نص مترجم ومنقح",
    originalTranscript: "النص الأصلي",
    originalTranscriptTooltip: "نسخ خام منتج مباشرة من الصوت باستخدام Whisper.",
    decisionsActions: "القرارات والإجراءات",
    decisionsEmpty: "لم تُحدد قرارات أو إجراءات في هذا الاجتماع.",
    participants: "المشاركون",
    decisions: "القرارات",
    actionItems: "الإجراءات",
    none: "لا شيء",
    ownerUnassigned: "غير معيّن",
    historyTitle: "السجل",
    historyEmpty: "لا اجتماعات بعد.",
    view: "عرض",
    backToList: "العودة إلى القائمة",
    meetingSaved: "اجتماع محفوظ",
    meetingsSaved: "اجتماعات محفوظة",
    delete: "حذف",
    deleteConfirm: "حذف الاجتماع؟",
    deleteConfirmBody: "لا يمكن التراجع.",
    cancel: "إلغاء",
    confirm: "تأكيد",
    settingsTitle: "الإعدادات",
    defaultOutputLanguage: "لغة المخرجات الافتراضية",
    theme: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
    privacyTitle: "الخصوصية",
    privacyText: "Speechi لا يخزن ملفاتك أو نصوصك على خادم.",
    clearHistory: "مسح السجل",
    clearHistoryConfirm: "مسح كل السجل؟",
    clearHistoryConfirmBody: "ستُزال كل سجلات الاجتماعات من هذا الجهاز.",
    loading: "جاري المعالجة…",
    exporting: "جاري التصدير…",
    done: "تم",
    error: "حدث خطأ",
    toastWordDownloaded: "ملخص Word قيد التنزيل",
    toastPdfDownloaded: "تم تنزيل ملخص PDF",
    light: "فاتح",
    dark: "داكن",
    // Auth
    authSignUp: "إنشاء حساب",
    authSignUpFree: "إنشاء حساب مجاني",
    authLogin: "تسجيل الدخول",
    authLogout: "تسجيل الخروج",
    authName: "الاسم",
    authEmail: "البريد الإلكتروني",
    authNamePlaceholder: "أدخل اسمك",
    authEmailPlaceholder: "you@example.com",
    authSubmitRegister: "إنشاء حساب مجاني",
    authSubmitLogin: "تسجيل الدخول",
    authWelcome: "مرحباً، {name}",
    authNoAccount: "ليس لديك حساب؟",
    authHaveAccount: "لديك حساب بالفعل؟",
    authPrivacyNote: "لا حاجة لكلمة مرور. بياناتك تبقى على جهازك.",
    authBenefitsTitle: "مزايا الحساب المجاني:",
    authBenefit1: "حلل حتى 5 اجتماعات يومياً",
    authBenefit2: "تخزين سجل غير محدود",
    authBenefit3: "تصدير إلى Word و PDF",
    authRegisterTitle: "أنشئ حسابك المجاني",
    authRegisterSubtitle: "احصل على 5 اجتماعات يومياً بدلاً من 1",
    authLoginTitle: "مرحباً بعودتك",
    authLoginSubtitle: "سجل الدخول للوصول إلى حسابك",
    authErrorNameRequired: "الاسم مطلوب",
    authErrorNameMin: "يجب أن يحتوي الاسم على حرفين على الأقل",
    authErrorEmailRequired: "البريد الإلكتروني مطلوب",
    authErrorEmailInvalid: "يرجى إدخال بريد إلكتروني صالح",
    authErrorUserNotFound: "لم يتم العثور على حساب بهذا البريد",
    // Usage
    usageIndicator: "{used}/{limit} مستخدم اليوم",
    usageLimitGuestTitle: "تم الوصول للحد اليومي",
    usageLimitGuestMessage: "المستخدمون المجانيون يمكنهم تحليل اجتماع واحد يومياً. أنشئ حساباً مجانياً للحصول على 5.",
    usageLimitRegisteredTitle: "تم الوصول للحد اليومي",
    usageLimitRegisteredMessage: "لقد استخدمت جميع {limit} الاجتماعات لليوم. عد غداً.",
    // Additional UI
    yourResults: "نتائجك",
    rawTranscriptionNote: "نسخ خام للرجوع إليه",
    noDecisionsIdentified: "لم يتم تحديد قرارات أو إجراءات محددة",
    processingAudio: "قد يستغرق هذا لحظة...",
    // Recording
    recordMeeting: "تسجيل اجتماع",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    recording: "جاري التسجيل",
    recordingInProgress: "التسجيل قيد التنفيذ...",
    deleteRecording: "حذف التسجيل",
    useRecording: "استخدام التسجيل",
    orUploadFile: "أو ارفع ملفاً",
    orRecordMeeting: "أو سجل اجتماعاً",
    recordingNotSupported: "التسجيل غير مدعوم في هذا المتصفح",
    microphonePermissionDenied: "تم رفض الوصول إلى الميكروفون. يرجى السماح بالوصول إلى الميكروفون للتسجيل.",
    // Supported formats
    supportedFormats: "الصيغ المدعومة",
    // Landing page specific
    heroBadge: "ملاحظات اجتماعات مدعومة بالذكاء الاصطناعي",
    scrollIndicator: "تمرير",
    footerCopyright: "جميع الحقوق محفوظة",
    // Accessibility labels
    selectLanguage: "اختر اللغة",
    toggleTheme: "تبديل المظهر",
  },
};

export function getStrings(lang: UiLang): I18nStrings {
  return I18N[lang] ?? I18N.en;
}

export function isRtl(lang: UiLang): boolean {
  return lang === "he" || lang === "ar";
}
