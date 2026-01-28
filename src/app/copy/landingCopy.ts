/**
 * Language-aware landing page copy loader.
 * Maps approved copy from landing-copy.txt and landing-copy-fr-es-ar.txt
 * into a structured object for all 13 sections. No runtime parsing.
 */

export type LandingLang = "en" | "he" | "fr" | "es" | "ar";

export interface LandingCopy {
  hero: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  valueStatement: { text: string };
  benefits: { title: string; description: string }[];
  benefitsTitle: string;
  comparison: { manual: string[]; ai: string[] };
  comparisonTitle: string;
  comparisonManualTitle: string;
  comparisonAiTitle: string;
  productivity: { title: string; paragraphs: string[] };
  actionItems: { title: string; description: string; takeaway: string };
  memory: { title: string; paragraphs: string[] };
  remote: { title: string; paragraphs: string[] };
  useCases: { title: string; description: string }[];
  useCasesTitle: string;
  howItWorks: { step: number; title: string; description: string }[];
  howItWorksTitle: string;
  features: { title: string; description: string }[];
  featuresTitle: string;
  faq: { question: string; answer: string }[];
  faqTitle: string;
  finalCta: { title: string; subtitle: string; button: string };
}

const COPY: Record<LandingLang, LandingCopy> = {
  en: {
    hero: {
      title: "Meetings, summarized. Clearly.",
      subtitle:
        "Upload a recording. Get a full transcript, a clear summary, and action items in minutes. No manual notes.",
      ctaPrimary: "Start using Speechi",
      ctaSecondary: "How it works",
    },
    valueStatement: {
      text: "Taking notes during a meeting splits your attention. You miss what matters, and decisions slip through. Speechi records and transcribes the conversation so you can focus on participating. You get an accurate summary, decisions, and action items—without the tradeoff between contributing and documenting.",
    },
    benefits: [
      {
        title: "Full participation in meetings",
        description:
          "Stop splitting attention between contributing and note-taking; stay present in the conversation.",
      },
      {
        title: "Automatic action item detection",
        description: "Speechi surfaces commitments and next steps so nothing gets lost in the shuffle.",
      },
      {
        title: "Accurate summaries",
        description:
          "Transcription and analysis are powered by proven models so you get reliable, structured output.",
      },
      {
        title: "Fast sharing",
        description: "Export to Word or PDF and share with your team right after the meeting.",
      },
      {
        title: "Multi-language support",
        description: "Choose your output language and get transcripts and summaries in the language you need.",
      },
    ],
    benefitsTitle: "Core benefits",
    comparison: {
      manual: [
        "Divided attention — You're either contributing or writing, rarely both.",
        "Missing decisions — Key outcomes often never make it into the notes.",
        "Partial documentation — What gets written depends on who's typing and when they tune out.",
        "Hard to search later — Notes live in different apps and formats, scattered and hard to find.",
        "Slow distribution — Summaries and next steps take extra time to draft and send.",
      ],
      ai: [
        "Everyone participates — No one is stuck as the designated note-taker.",
        "Complete documentation — Full transcript plus a structured summary, every time.",
        "Decisions and actions extracted — Commitments and next steps are called out clearly.",
        "Ready to share immediately — Export and share right after the meeting.",
        "Searchable meeting memory — Transcripts and summaries you can search and reuse.",
      ],
    },
    comparisonTitle: "From manual notes to AI clarity",
    comparisonManualTitle: "Manual meeting notes",
    comparisonAiTitle: "Speechi with AI",
    productivity: {
      title: "Why AI meeting notes improve team productivity",
      paragraphs: [
        "When someone on the team is assigned to take notes, they contribute less. The team loses a voice, and the notes still reflect one person's focus and gaps. AI removes that tradeoff. Everyone can participate fully while Speechi handles transcription and summarization. Managers and technical leads benefit most: they keep full context, decisions, and action items without sacrificing their presence in the conversation.",
      ],
    },
    actionItems: {
      title: "Automatic action items",
      description:
        "Speechi identifies commitments and tasks mentioned in the conversation and surfaces them as clear action items. When someone says they'll own something or agree to a deadline, that shows up in your summary. Responsibilities become visible, so follow-up is easier and fewer items fall through the cracks.",
      takeaway: "Clear action items mean fewer dropped handoffs and better accountability.",
    },
    memory: {
      title: "Searchable organizational memory",
      paragraphs: [
        "Meetings hold critical knowledge: decisions, context, and commitments. Traditional notes are scattered across tools and rarely searchable. Speechi gives you a transcript and summary for each meeting that you can store, search, and reference. That creates transparency, accountability, and lasting knowledge instead of institutional forgetfulness.",
      ],
    },
    remote: {
      title: "Remote and hybrid teams",
      paragraphs: [
        "Remote and hybrid teams need equal access to what was said and decided. Speechi lets absent participants catch up asynchronously with a full transcript and summary. No more \"what did we decide?\" or \"who was supposed to do that?\"—everyone works from the same documented record.",
      ],
    },
    useCases: [
      {
        title: "Team standups",
        description:
          "Quick, structured summaries and action items so the whole team stays aligned.",
      },
      {
        title: "Client meetings",
        description: "Accurate records of discussions and commitments for follow-up and compliance.",
      },
      {
        title: "Strategic planning",
        description: "Clear documentation of decisions and next steps for execution and review.",
      },
      {
        title: "Board meetings",
        description: "Reliable transcripts and summaries for governance and audit trails.",
      },
      {
        title: "Project kickoffs",
        description: "Shared context and action items so everyone knows what was agreed.",
      },
      {
        title: "Cross-team collaboration",
        description: "Searchable records so different teams can find and reuse what matters.",
      },
    ],
    useCasesTitle: "Use cases",
    howItWorks: [
      {
        step: 1,
        title: "Record or upload your meeting.",
        description:
          "Use your usual recorder or upload an existing audio file (e.g. MP3, WAV, M4A).",
      },
      {
        step: 2,
        title: "AI transcribes and analyzes the conversation.",
        description:
          "Speechi turns speech into text and extracts summary, participants, decisions, and action items.",
      },
      {
        step: 3,
        title: "Share, export, and archive the results.",
        description:
          "Download Word or PDF, share with your team, and keep a searchable record for later.",
      },
    ],
    howItWorksTitle: "How it works",
    features: [
      {
        title: "Speaker identification",
        description:
          "Speakers are distinguished in the transcript where possible; no personal identification unless you provide it.",
      },
      {
        title: "Decision extraction",
        description: "Key decisions are pulled out and listed so they're easy to find and track.",
      },
      {
        title: "Multi-format export",
        description: "Export to Word or PDF so you can share and archive in the formats you use.",
      },
      {
        title: "Multi-language output",
        description:
          "Choose the language for your transcript and summary so global teams get output in their language.",
      },
    ],
    featuresTitle: "Advanced features",
    faq: [
      {
        question: "How accurate is Speechi compared to a human note-taker?",
        answer:
          "Speechi uses Whisper for transcription and Claude for analysis. Accuracy is high for clear audio; you get a consistent, structured record without the gaps and bias of a single note-taker.",
      },
      {
        question: "How does speaker identification work?",
        answer:
          "Speechi distinguishes between speakers in the audio when possible. It does not attach real names unless you add them; speakers are typically labeled in a generic way (e.g. Speaker 1, 2) for privacy.",
      },
      {
        question: "How are action items detected?",
        answer:
          "The system looks for commitments, deadlines, and ownership in the conversation and surfaces them as action items. You can review and adjust them before sharing.",
      },
      {
        question: "Can I search across multiple meetings?",
        answer:
          "You can store and search your own exported transcripts and summaries. Speechi gives you the output; how you organize and search it is up to your workflow.",
      },
      {
        question: "What platforms are supported?",
        answer:
          "Use Speechi in any modern browser. Upload audio from your device; no special hardware or plugins required.",
      },
      {
        question: "How fast is processing?",
        answer:
          "Processing time depends on recording length. Most meetings are processed within minutes. You'll see progress in the app.",
      },
    ],
    faqTitle: "FAQ",
    finalCta: {
      title: "You deserve meetings where everyone participates and nothing important gets lost.",
      subtitle:
        "Start with a single recording and see how clarity feels. No pressure—just upload, review, and share when you're ready.",
      button: "Start using Speechi",
    },
  },

  he: {
    hero: {
      title: "פגישות, מסוכמות. בבירור.",
      subtitle:
        "העלו הקלטה. קבלו תמליל מלא, סיכום ברור ונקודות פעולה בתוך דקות. בלי רשימות ידניות.",
      ctaPrimary: "התחל להשתמש ב-Speechi",
      ctaSecondary: "איך זה עובד",
    },
    valueStatement: {
      text: "רישום הערות בזמן פגישה מפצל את הקשב. דברים חשובים נשמטים והחלטות נשכחות. Speechi מקליט ומתמלל את השיחה כדי שתוכל להשתתף במלואך. תקבל סיכום מדויק, החלטות ונקודות פעולה—בלי לבחור בין תיעוד להשתתפות.",
    },
    benefits: [
      {
        title: "השתתפות מלאה בפגישות",
        description: "הפסיקו לפצל קשב בין תרומה לרישום; תישארו ממוקדים בשיחה.",
      },
      {
        title: "זיהוי אוטומטי של משימות",
        description: "Speechi מציג התחייבויות וצעדים הבאים כדי ששום דבר לא יאבד בדרך.",
      },
      {
        title: "סיכומים מדויקים",
        description: "התמלול והניתוח מבוססים על מודלים מוכחים—ותקבלו פלט אמין ומסודר.",
      },
      {
        title: "שיתוף מהיר",
        description: "ייצאו ל-Word או PDF ושתפו עם הצוות מיד אחרי הפגישה.",
      },
      {
        title: "תמיכה במספר שפות",
        description: "בחרו שפת פלט וקבלו תמלילים וסיכומים בשפה שאתם צריכים.",
      },
    ],
    benefitsTitle: "תועלות עיקריות",
    comparison: {
      manual: [
        "קשב מפוצל — או שתורמים או שכותבים, קשה לעשות את שניהם.",
        "החלטות חסרות — תוצאות מפתח לא תמיד מגיעות לרשימות.",
        "תיעוד חלקי — מה נכתב תלוי במי מקליד ומתי הוא מתנתק.",
        "קשה לחפש אחר כך — ההערות מפוזרות בין כלים ופורמטים.",
        "הפצה איטית — סיכומים וצעדים הבאים דורשים זמן נוסף לניסוח ולשליחה.",
      ],
      ai: [
        "כולם משתתפים — אף אחד לא תקוע בתור מתמלל.",
        "תיעוד מלא — תמליל מלא וסיכום מסודר, בכל פעם.",
        "החלטות ומשימות מחולצות — התחייבויות וצעדים ברורים.",
        "מוכן לשיתוף מיידי — ייצוא ושיתוף מיד אחרי הפגישה.",
        "זיכרון פגישות חיפושי — תמלילים וסיכומים שאפשר לחפש ולנצל מחדש.",
      ],
    },
    comparisonTitle: "מהערות ידניות לצלילות AI",
    comparisonManualTitle: "הערות פגישה ידניות",
    comparisonAiTitle: "Speechi עם AI",
    productivity: {
      title: "למה הערות פגישה מבוססות AI משפרות פרודוקטיביות צוות",
      paragraphs: [
        "כשמישהו בצוות מוגדר כמתמלל, הוא תורם פחות. הצוות מאבד קול, וההערות עדיין משקפות את המיקוד והפערים של אדם אחד. AI מסיר את הדיל הזה. כולם יכולים להשתתף במלואם בעוד ש-Speechi מטפל בתמלול ובסיכום. מנהלים ורכזים טכניים מרוויחים הכי הרבה: הם שומרים על ההקשר, ההחלטות ונקודות הפעולה בלי לוותר על הנוכחות בשיחה.",
      ],
    },
    actionItems: {
      title: "נקודות פעולה אוטומטיות",
      description:
        "Speechi מזהה התחייבויות ומשימות שמוזכרות בשיחה ומציג אותן כנקודות פעולה ברורות. כשמישהו אומר שהוא ייקח אחריות או מסכים למועד סיום, זה מופיע בסיכום. האחריות נהיית גלויה, כך שהמעקב קל ופחות דברים נופלים בין הכיסאות.",
      takeaway: "נקודות פעולה ברורות מצמצמות ידיים שנשמטות ומחזקות אחריות.",
    },
    memory: {
      title: "זיכרון ארגוני ניתן לחיפוש",
      paragraphs: [
        "פגישות מחזיקות ידע קריטי: החלטות, הקשר והתחייבויות. הערות מסורתיות מפוזרות בין כלים ולעתים קרובות קשות לחיפוש. Speechi נותן לכם תמליל וסיכום לכל פגישה שאפשר לאחסן, לחפש ולהפנות אליהם. כך נוצרים שקיפות, אחריות וידע מתמשך במקום שכחה ארגונית.",
      ],
    },
    remote: {
      title: "צוותים מרוחקים והיברידיים",
      paragraphs: [
        "צוותים מרוחקים והיברידיים זקוקים לגישה שווה למה נאמר והוחלט. Speechi מאפשר למשתתפים שנעדרו להדביק את הקצב באופן אסינכרוני עם תמליל וסיכום מלאים. לא עוד מה החלטנו או מי היה אמור לעשות את זה—כולם עובדים מאותו תיעוד.",
      ],
    },
    useCases: [
      { title: "סטנדאפים", description: "סיכומים ונקודות פעולה מהירים ומסודרים כדי שהצוות יישאר מסונכרן." },
      {
        title: "פגישות לקוחות",
        description: "תיעוד מדויק של דיונים והתחייבויות למעקב ותאימות.",
      },
      {
        title: "תכנון אסטרטגי",
        description: "תיעוד ברור של החלטות וצעדים לביצוע ולבדיקה.",
      },
      {
        title: "פגישות דירקטוריון",
        description: "תמלילים וסיכומים אמינים לתאום ובקרה.",
      },
      {
        title: "השקות פרויקט",
        description: "הקשר ומשימות משותפים כדי שכולם יודעים מה הוסכם.",
      },
      {
        title: "שיתוף פעולה בין צוותים",
        description: "רשומות ניתנות לחיפוש כדי שצוותים שונים יוכלו למצוא ולהשתמש במה שחשוב.",
      },
    ],
    useCasesTitle: "מקרי שימוש",
    howItWorks: [
      {
        step: 1,
        title: "הקלטו או העלו את הפגישה.",
        description: "השתמשו במקליט הרגיל או העלו קובץ אודיו קיים (למשל MP3, WAV, M4A).",
      },
      {
        step: 2,
        title: "ה-AI מתמלל ומנתח את השיחה.",
        description:
          "Speechi הופך דיבור לטקסט ומחלץ סיכום, משתתפים, החלטות ונקודות פעולה.",
      },
      {
        step: 3,
        title: "שתפו, ייצאו וארכבו את התוצאות.",
        description:
          "הורידו Word או PDF, שתפו עם הצוות ושמרו רשומה ניתנת לחיפוש לעתיד.",
      },
    ],
    howItWorksTitle: "איך זה עובד",
    features: [
      {
        title: "זיהוי דוברים",
        description:
          "דוברים מובחנים בתמליל כשאפשר; אין זיהוי פרטי אלא אם אתם מוסיפים.",
      },
      {
        title: "חילוץ החלטות",
        description: "החלטות מפתח מחולצות ומסודרות כדי שיהיה קל למצוא ולעקוב.",
      },
      {
        title: "ייצוא למספר פורמטים",
        description: "ייצוא ל-Word או PDF לשיתוף וארכוב בפורמטים שבשימוש.",
      },
      {
        title: "פלט רב-לשוני",
        description: "בחרו שפה לתמליל ולסיכום כדי שצוותים גלובליים יקבלו פלט בשפתם.",
      },
    ],
    featuresTitle: "תכונות מתקדמות",
    faq: [
      {
        question: "מה רמת הדיוק של Speechi לעומת מתמלל אנושי?",
        answer:
          "Speechi משתמש ב-Whisper לתמלול ו-Claude לניתוח. הדיוק גבוה לאודיו ברור; תקבלו תיעוד עקבי ומסודר בלי הפערים וההטיה של מתמלל בודד.",
      },
      {
        question: "איך עובד זיהוי דוברים?",
        answer:
          "Speechi מבדיל בין דוברים באודיו כשאפשר. הוא לא מצרף שמות אמיתיים אלא אם אתם מוסיפים; בדרך כלל דוברים מסומנים באופן גנרי (למשל דובר 1, 2) לפרטיות.",
      },
      {
        question: "איך מזוהות נקודות פעולה?",
        answer:
          "המערכת מחפשת התחייבויות, מועדים ובעלות בשיחה ומציגה אותן כנקודות פעולה. אפשר לעבור ולתקן לפני שיתוף.",
      },
      {
        question: "אפשר לחפש על פני כמה פגישות?",
        answer:
          "אתם יכולים לאחסן ולחפש את התמלילים והסיכומים שייצאו. Speechi נותן את הפלט; איך מארגנים ומחפשים תלוי בתהליך העבודה שלכם.",
      },
      {
        question: "אילו פלטפורמות נתמכות?",
        answer:
          "השתמשו ב-Speechi בכל דפדפן מודרני. העלו אודיו מהמכשיר; אין צורך בחומרה או תוספים מיוחדים.",
      },
      {
        question: "מה זמן העיבוד?",
        answer:
          "זמן העיבוד תלוי באורך ההקלטה. רוב הפגישות מעובדות תוך דקות. תראו התקדמות באפליקציה.",
      },
    ],
    faqTitle: "שאלות נפוצות",
    finalCta: {
      title: "מגיע לכם פגישות שבהן כולם משתתפים ושום דבר חשוב לא אובד.",
      subtitle: "התחילו בהקלטה אחת ותראו איך נראית וודאות. בלי לחץ—פשוט העלו, עברו ושתפו כשאתם מוכנים.",
      button: "התחל להשתמש ב-Speechi",
    },
  },

  fr: {
    hero: {
      title: "Réunions, résumées. Clairement.",
      subtitle:
        "Téléversez un enregistrement. Obtenez une transcription complète, un résumé clair et des points d'action en quelques minutes. Plus de prises de notes à la main.",
      ctaPrimary: "Commencer avec Speechi",
      ctaSecondary: "Comment ça marche",
    },
    valueStatement: {
      text: "Prendre des notes pendant une réunion divise votre attention. Vous ratez l'essentiel et les décisions passent entre les mailles du filet. Speechi enregistre et transcrit la conversation pour que vous puissiez vous concentrer sur la participation. Vous obtenez un résumé fidèle, les décisions et les points d'action—sans avoir à choisir entre contribuer et documenter.",
    },
    benefits: [
      {
        title: "Participation pleine et entière aux réunions",
        description:
          "Arrêtez de partager votre attention entre contribuer et noter; restez pleinement dans la conversation.",
      },
      {
        title: "Détection automatique des points d'action",
        description:
          "Speechi met en évidence les engagements et les prochaines étapes pour que rien ne se perde.",
      },
      {
        title: "Résumés fidèles",
        description:
          "La transcription et l'analyse reposent sur des modèles éprouvés; vous obtenez un résultat fiable et structuré.",
      },
      {
        title: "Partage rapide",
        description: "Exportez en Word ou PDF et partagez avec votre équipe juste après la réunion.",
      },
      {
        title: "Multilinguisme",
        description:
          "Choisissez la langue de sortie et recevez transcriptions et résumés dans la langue dont vous avez besoin.",
      },
    ],
    benefitsTitle: "Avantages principaux",
    comparison: {
      manual: [
        "Attention divisée — Vous contribuez ou vous notez, rarement les deux.",
        "Décisions manquantes — Les conclusions clés n'arrivent souvent jamais sur le papier.",
        "Documentation partielle — Ce qui est noté dépend de qui tape et du moment où il décroche.",
        "Difficile à retrouver — Les notes sont éparpillées entre outils et formats.",
        "Diffusion lente — Résumés et prochaines étapes prennent du temps à rédiger et à envoyer.",
      ],
      ai: [
        "Tout le monde participe — Personne n'est bloqué en secrétaire de séance.",
        "Documentation complète — Transcription intégrale et résumé structuré, à chaque fois.",
        "Décisions et actions extraites — Engagements et prochaines étapes clairement identifiés.",
        "Prêt à partager tout de suite — Exportez et partagez dès la fin de la réunion.",
        "Mémoire de réunions rechercheable — Transcripts et résumés que vous pouvez rechercher et réutiliser.",
      ],
    },
    comparisonTitle: "Des notes manuelles à la clarté IA",
    comparisonManualTitle: "Notes manuelles",
    comparisonAiTitle: "Speechi avec l'IA",
    productivity: {
      title: "Pourquoi les comptes rendus IA améliorent la productivité d'équipe",
      paragraphs: [
        "Quand quelqu'un est désigné pour prendre les notes, il contribue moins. L'équipe perd une voix, et les notes reflètent encore le focus et les angles morts d'une seule personne. L'IA supprime cet arbitrage. Chacun peut participer pleinement pendant que Speechi gère transcription et résumé. Les managers et leads techniques en bénéficient le plus: ils gardent le contexte, les décisions et les points d'action sans sacrifier leur présence dans la conversation.",
      ],
    },
    actionItems: {
      title: "Points d'action automatiques",
      description:
        "Speechi repère les engagements et tâches mentionnés dans la conversation et les expose comme des points d'action clairs. Quand quelqu'un dit qu'il prend en charge un sujet ou accepte une échéance, cela apparaît dans le résumé. Les responsabilités deviennent visibles, donc le suivi est plus simple et moins d'éléments tombent entre les mailles du filet.",
      takeaway:
        "Des points d'action clairs signifient moins de relais lâchés et une meilleure redevabilité.",
    },
    memory: {
      title: "Mémoire organisationnelle rechercheable",
      paragraphs: [
        "Les réunions contiennent un savoir crucial: décisions, contexte, engagements. Les notes traditionnelles sont dispersées entre outils et rarement rechercheables. Speechi vous donne une transcription et un résumé par réunion que vous pouvez stocker, rechercher et consulter. Cela crée de la transparence, de la redevabilité et un savoir durable, au lieu de l'oubli institutionnel.",
      ],
    },
    remote: {
      title: "Équipes distantes et hybrides",
      paragraphs: [
        "Les équipes distantes et hybrides ont besoin d'un accès égal à ce qui a été dit et décidé. Speechi permet aux absents de rattraper de façon asynchrone avec une transcription et un résumé complets. Fini le « qu'est-ce qu'on a décidé? » ou « qui devait faire ça? »—tout le monde travaille à partir du même document.",
      ],
    },
    useCases: [
      {
        title: "Stand-ups d'équipe",
        description:
          "Résumés et points d'action rapides et structurés pour garder toute l'équipe alignée.",
      },
      {
        title: "Réunions clients",
        description: "Comptes rendus fidèles des échanges et engagements pour le suivi et la conformité.",
      },
      {
        title: "Planification stratégique",
        description:
          "Documentation claire des décisions et prochaines étapes pour l'exécution et la revue.",
      },
      {
        title: "Réunions de conseil",
        description: "Transcripts et résumés fiables pour la gouvernance et la traçabilité.",
      },
      {
        title: "Lancements de projet",
        description: "Contexte et points d'action partagés pour que chacun sache ce qui a été convenu.",
      },
      {
        title: "Collaboration inter-équipes",
        description:
          "Archives rechercheables pour que les équipes trouvent et réutilisent ce qui compte.",
      },
    ],
    useCasesTitle: "Cas d'usage",
    howItWorks: [
      {
        step: 1,
        title: "Enregistrez ou téléversez votre réunion.",
        description:
          "Utilisez votre enregistreur habituel ou téléversez un fichier audio existant (ex. MP3, WAV, M4A).",
      },
      {
        step: 2,
        title: "L'IA transcrit et analyse la conversation.",
        description:
          "Speechi transforme la parole en texte et extrait résumé, participants, décisions et points d'action.",
      },
      {
        step: 3,
        title: "Partagez, exportez et archivez les résultats.",
        description:
          "Téléchargez Word ou PDF, partagez avec l'équipe et gardez une trace rechercheable pour plus tard.",
      },
    ],
    howItWorksTitle: "Comment ça marche",
    features: [
      {
        title: "Identification des locuteurs",
        description:
          "Les locuteurs sont distingués dans la transcription quand c'est possible; aucune identification personnelle sauf si vous l'ajoutez.",
      },
      {
        title: "Extraction des décisions",
        description:
          "Les décisions clés sont extraites et listées pour les retrouver et les suivre facilement.",
      },
      {
        title: "Export multi-format",
        description:
          "Export Word ou PDF pour partager et archiver dans les formats que vous utilisez.",
      },
      {
        title: "Sortie multilingue",
        description:
          "Choisissez la langue de la transcription et du résumé pour que les équipes globales reçoivent un résultat dans leur langue.",
      },
    ],
    featuresTitle: "Fonctionnalités avancées",
    faq: [
      {
        question: "Quelle est la précision de Speechi par rapport à un preneur de notes humain?",
        answer:
          "Speechi utilise Whisper pour la transcription et Claude pour l'analyse. La précision est élevée pour un audio clair; vous obtenez un compte rendu cohérent et structuré, sans les trous et biais d'un seul preneur de notes.",
      },
      {
        question: "Comment fonctionne l'identification des locuteurs?",
        answer:
          "Speechi distingue les locuteurs dans l'audio quand c'est possible. Il n'associe pas de noms réels sauf si vous les ajoutez; les locuteurs sont en général étiquetés de façon générique (ex. Locuteur 1, 2) pour la confidentialité.",
      },
      {
        question: "Comment les points d'action sont-ils détectés?",
        answer:
          "Le système repère les engagements, échéances et responsabilités dans la conversation et les expose comme points d'action. Vous pouvez les relire et les corriger avant de partager.",
      },
      {
        question: "Puis-je rechercher sur plusieurs réunions?",
        answer:
          "Vous pouvez stocker et rechercher dans vos propres transcriptions et résumés exportés. Speechi fournit la sortie; l'organisation et la recherche dépendent de votre façon de travailler.",
      },
      {
        question: "Quelles plateformes sont prises en charge?",
        answer:
          "Utilisez Speechi dans tout navigateur moderne. Téléversez l'audio depuis votre appareil; aucun matériel ni plugin particulier requis.",
      },
      {
        question: "Combien de temps prend le traitement?",
        answer:
          "Le temps dépend de la longueur de l'enregistrement. La plupart des réunions sont traitées en quelques minutes. Vous voyez la progression dans l'appli.",
      },
    ],
    faqTitle: "FAQ",
    finalCta: {
      title:
        "Vous méritez des réunions où tout le monde participe et où rien d'important ne se perd.",
      subtitle:
        "Commencez par un seul enregistrement et voyez ce que la clarté apporte. Sans pression—téléversez, relisez et partagez quand vous êtes prêt.",
      button: "Commencer avec Speechi",
    },
  },

  es: {
    hero: {
      title: "Reuniones, resumidas. Con claridad.",
      subtitle:
        "Sube una grabación. Obtén una transcripción completa, un resumen claro y puntos de acción en minutos. Sin notas a mano.",
      ctaPrimary: "Empezar con Speechi",
      ctaSecondary: "Cómo funciona",
    },
    valueStatement: {
      text: "Tomar notas en una reunión divide tu atención. Te pierdes lo importante y las decisiones se escapan. Speechi graba y transcribe la conversación para que puedas centrarte en participar. Obtienes un resumen fiel, las decisiones y los puntos de acción—sin elegir entre contribuir y documentar.",
    },
    benefits: [
      {
        title: "Participación plena en las reuniones",
        description:
          "Deja de repartir tu atención entre contribuir y anotar; permanece en la conversación.",
      },
      {
        title: "Detección automática de puntos de acción",
        description: "Speechi saca a la luz compromisos y próximos pasos para que nada se pierda.",
      },
      {
        title: "Resúmenes fieles",
        description:
          "La transcripción y el análisis se apoyan en modelos probados; obtienes una salida fiable y estructurada.",
      },
      {
        title: "Compartir rápido",
        description: "Exporta a Word o PDF y comparte con tu equipo nada más terminar la reunión.",
      },
      {
        title: "Varios idiomas",
        description:
          "Elige el idioma de salida y obtén transcripciones y resúmenes en el idioma que necesitas.",
      },
    ],
    benefitsTitle: "Beneficios principales",
    comparison: {
      manual: [
        "Atención dividida — O contribuyes o anotas, rara vez ambas.",
        "Decisiones que faltan — Las conclusiones clave a menudo no llegan al papel.",
        "Documentación parcial — Lo que se escribe depende de quién escribe y de cuándo desconecta.",
        "Difícil de buscar después — Las notas viven en distintas herramientas y formatos, dispersas.",
        "Distribución lenta — Resúmenes y próximos pasos llevan tiempo extra en redactar y enviar.",
      ],
      ai: [
        "Todos participan — Nadie atrapado como secretario.",
        "Documentación completa — Transcripción completa y resumen estructurado, cada vez.",
        "Decisiones y acciones extraídas — Compromisos y próximos pasos claramente señalados.",
        "Listo para compartir al instante — Exporta y comparte nada más acabar la reunión.",
        "Memoria de reuniones buscable — Transcripciones y resúmenes que puedes buscar y reutilizar.",
      ],
    },
    comparisonTitle: "De notas manuales a claridad con IA",
    comparisonManualTitle: "Notas manuales",
    comparisonAiTitle: "Speechi con IA",
    productivity: {
      title: "Por qué las notas con IA mejoran la productividad del equipo",
      paragraphs: [
        "Cuando alguien del equipo tiene que tomar notas, contribuye menos. El equipo pierde una voz, y las notas siguen reflejando el foco y los huecos de una sola persona. La IA elimina ese intercambio. Todos pueden participar al cien por cien mientras Speechi se encarga de la transcripción y el resumen. Los responsables y tech leads se benefician más: mantienen contexto, decisiones y puntos de acción sin sacrificar su presencia en la conversación.",
      ],
    },
    actionItems: {
      title: "Puntos de acción automáticos",
      description:
        "Speechi identifica compromisos y tareas mencionados en la conversación y los presenta como puntos de acción claros. Cuando alguien dice que se hace cargo de algo o acepta una fecha, eso aparece en el resumen. Las responsabilidades se hacen visibles, así que el seguimiento es más fácil y se pierden menos cosas.",
      takeaway:
        "Puntos de acción claros implican menos entregas caídas y mejor rendición de cuentas.",
    },
    memory: {
      title: "Memoria organizacional buscable",
      paragraphs: [
        "Las reuniones contienen conocimiento crítico: decisiones, contexto, compromisos. Las notas tradicionales están dispersas entre herramientas y rara vez son buscables. Speechi te da transcripción y resumen por reunión que puedes almacenar, buscar y consultar. Eso crea transparencia, rendición de cuentas y conocimiento duradero, en lugar de olvido institucional.",
      ],
    },
    remote: {
      title: "Equipos remotos e híbridos",
      paragraphs: [
        "Los equipos remotos e híbridos necesitan acceso equitativo a lo que se dijo y se decidió. Speechi permite a quienes faltaron ponerse al día de forma asíncrona con transcripción y resumen completos. Se acaba el « qué decidimos? » o « quién tenía que hacer eso? »—todos trabajan a partir del mismo documento.",
      ],
    },
    useCases: [
      {
        title: "Stand-ups de equipo",
        description:
          "Resúmenes y puntos de acción rápidos y estructurados para que todo el equipo siga alineado.",
      },
      {
        title: "Reuniones con clientes",
        description: "Registros fieles de discusiones y compromisos para seguimiento y cumplimiento.",
      },
      {
        title: "Planificación estratégica",
        description:
          "Documentación clara de decisiones y próximos pasos para ejecución y revisión.",
      },
      {
        title: "Reuniones de junta",
        description: "Transcripciones y resúmenes fiables para gobernanza y trazabilidad.",
      },
      {
        title: "Kickoffs de proyecto",
        description: "Contexto y puntos de acción compartidos para que todos sepan qué se acordó.",
      },
      {
        title: "Colaboración entre equipos",
        description:
          "Registros buscables para que distintos equipos encuentren y reutilicen lo que importa.",
      },
    ],
    useCasesTitle: "Casos de uso",
    howItWorks: [
      {
        step: 1,
        title: "Graba o sube tu reunión.",
        description:
          "Usa tu grabadora habitual o sube un archivo de audio existente (p. ej. MP3, WAV, M4A).",
      },
      {
        step: 2,
        title: "La IA transcribe y analiza la conversación.",
        description:
          "Speechi convierte el habla en texto y extrae resumen, participantes, decisiones y puntos de acción.",
      },
      {
        step: 3,
        title: "Comparte, exporta y archiva los resultados.",
        description:
          "Descarga Word o PDF, comparte con el equipo y conserva un registro buscable para más adelante.",
      },
    ],
    howItWorksTitle: "Cómo funciona",
    features: [
      {
        title: "Identificación de hablantes",
        description:
          "Los hablantes se distinguen en la transcripción cuando es posible; ninguna identificación personal salvo que tú la indiques.",
      },
      {
        title: "Extracción de decisiones",
        description:
          "Las decisiones clave se extraen y se listan para encontrarlas y seguirlas con facilidad.",
      },
      {
        title: "Exportación multi-formato",
        description:
          "Exporta a Word o PDF para compartir y archivar en los formatos que usas.",
      },
      {
        title: "Salida multilingüe",
        description:
          "Elige el idioma de la transcripción y del resumen para que equipos globales reciban la salida en su idioma.",
      },
    ],
    featuresTitle: "Funciones avanzadas",
    faq: [
      {
        question: "¿Qué precisión tiene Speechi frente a un humano que toma notas?",
        answer:
          "Speechi usa Whisper para transcripción y Claude para análisis. La precisión es alta con audio claro; obtienes un registro consistente y estructurado, sin los huecos y sesgos de un solo responsable de actas.",
      },
      {
        question: "¿Cómo funciona la identificación de hablantes?",
        answer:
          "Speechi distingue hablantes en el audio cuando es posible. No asocia nombres reales salvo que tú los añadas; los hablantes suelen etiquetarse de forma genérica (p. ej. Hablante 1, 2) por privacidad.",
      },
      {
        question: "¿Cómo se detectan los puntos de acción?",
        answer:
          "El sistema busca compromisos, plazos y responsabilidades en la conversación y los presenta como puntos de acción. Puedes revisarlos y ajustarlos antes de compartir.",
      },
      {
        question: "¿Puedo buscar en varias reuniones?",
        answer:
          "Puedes almacenar y buscar en tus propias transcripciones y resúmenes exportados. Speechi te da la salida; cómo organices y busques depende de tu flujo de trabajo.",
      },
      {
        question: "¿Qué plataformas se soportan?",
        answer:
          "Usa Speechi en cualquier navegador moderno. Sube audio desde tu dispositivo; no hace falta hardware ni plugins especiales.",
      },
      {
        question: "¿Cuánto tarda el procesamiento?",
        answer:
          "Depende de la duración de la grabación. La mayoría de reuniones se procesan en minutos. Ves el progreso en la app.",
      },
    ],
    faqTitle: "FAQ",
    finalCta: {
      title: "Mereces reuniones en las que todos participan y nada importante se pierde.",
      subtitle:
        "Empieza con una sola grabación y comprueba qué aporta la claridad. Sin presión—solo sube, revisa y comparte cuando estés listo.",
      button: "Empezar con Speechi",
    },
  },

  ar: {
    hero: {
      title: "اجتماعات موجزة. بوضوح.",
      subtitle:
        "ارفع تسجيلاً. احصل على نسخ كامل وملخص واضح ونقاط عمل خلال دقائق. من دون تدوين يدوي.",
      ctaPrimary: "ابدأ باستخدام Speechi",
      ctaSecondary: "كيف يعمل",
    },
    valueStatement: {
      text: "تدوين الملاحظات أثناء الاجتماع يشتت انتباهك. تفوتك النقاط المهمة وتتسرب القرارات. Speechi يسجّل وينسخ المحادثة حتى تركّز على المشاركة. تحصل على ملخص دقيق والقرارات ونقاط العمل—من دون الاختيار بين المساهمة والتوثيق.",
    },
    benefits: [
      {
        title: "مشاركة كاملة في الاجتماعات",
        description: "توقّف عن تقسيم انتباهك بين المساهمة والتدوين; ابقَ حاضراً في المحادثة.",
      },
      {
        title: "كشف تلقائي لنقاط العمل",
        description: "Speechi يبرز الالتزامات والخطوات التالية حتى لا يُفقد شيء.",
      },
      {
        title: "ملخصات دقيقة",
        description: "النسخ والتحليل يعتمدان على نماذج مُجرّبة; تحصل على مخرجات موثوقة ومنظّمة.",
      },
      {
        title: "مشاركة سريعة",
        description: "صدّر إلى Word أو PDF وشارك مع فريقك فور انتهاء الاجتماع.",
      },
      {
        title: "دعم لغات متعددة",
        description: "اختر لغة المخرجات واحصل على نصوص وملخصات باللغة التي تحتاجها.",
      },
    ],
    benefitsTitle: "الفوائد الرئيسية",
    comparison: {
      manual: [
        "انتباه مقسوم — إما تساهم أو تكتب، نادراً الاثنان معاً.",
        "قرارات ناقصة — النتائج الأساسية غالباً لا تصل إلى الورقة.",
        "توثيق جزئي — ما يُكتَب يعتمد على من يكتب ومتى ينقطع.",
        "صعب البحث لاحقاً — الملاحظات مبعثرة بين أدوات وصيغ.",
        "توزيع بطيء — الملخصات والخطوات التالية تحتاج وقتاً إضافياً للصياغة والإرسال.",
      ],
      ai: [
        "الجميع يشارك — لا أحد عالق كمتلقّي للقرارات.",
        "توثيق كامل — نسخ كامل وملخص منظّم، في كل مرة.",
        "قرارات وإجراءات مستخرجة — التزامات وخطوات تالية واضحة.",
        "جاهز للمشاركة فوراً — صدّر وشارك فور انتهاء الاجتماع.",
        "ذاكرة اجتماعات قابلة للبحث — نصوص وملخصات يمكنك البحث فيها وإعادة استخدامها.",
      ],
    },
    comparisonTitle: "من الملاحظات اليدوية إلى وضوح الذكاء الاصطناعي",
    comparisonManualTitle: "ملاحظات الاجتماع اليدوية",
    comparisonAiTitle: "Speechi مع الذكاء الاصطناعي",
    productivity: {
      title: "لماذا تحسّن ملاحظات الاجتماع بالذكاء الاصطناعي إنتاجية الفريق",
      paragraphs: [
        "عندما يُعيَّن شخص في الفريق لتدوين الملاحظات، يساهم أقل. الفريق يفقد صوتاً، والملاحظات ما تزال تعكس تركيز وفجوات شخص واحد. الذكاء الاصطناعي يزيل هذه المفاضلة. الجميع يمكنه المشاركة بالكامل بينما Speechi يتولى النسخ والملخص. المدراء والقياديون التقنيون يستفيدون أكثر: يحافظون على السياق والقرارات ونقاط العمل من دون التضحية بحضورهم في المحادثة.",
      ],
    },
    actionItems: {
      title: "نقاط عمل تلقائية",
      description:
        "Speechi يحدد الالتزامات والمهام المذكورة في المحادثة ويعرضها كنقاط عمل واضحة. عندما يقول أحدهم إنه سيتولى شيئاً أو يوافق على موعد، يظهر ذلك في الملخص. تصبح المسؤوليات مرئية، فيسهل المتابعة ويُفقد عدد أقل من العناصر.",
      takeaway: "نقاط عمل واضحة تعني تسليمات أقل ضائعة ومحاسبة أفضل.",
    },
    memory: {
      title: "ذاكرة تنظيمية قابلة للبحث",
      paragraphs: [
        "الاجتماعات تحتوي معرفة حرجة: قرارات، سياق، التزامات. الملاحظات التقليدية مبعثرة بين أدوات ونادراً قابلة للبحث. Speechi يمنحك نسخاً وملخصاً لكل اجتماع يمكنك تخزينه والبحث فيه والاستشهاد به. ذلك يخلق شفافية ومحاسبة ومعرفة دائمة، بدل النسيان المؤسسي.",
      ],
    },
    remote: {
      title: "فرق العمل عن بُعد والهجينة",
      paragraphs: [
        "فرق العمل عن بُعد والهجينة تحتاج وصولاً متساوياً إلى ما قيل وما قُُرِّر. Speechi يسمح للغائبين بتدارك التأخّر بشكل غير متزامن بنسخ وملخص كاملين. لا مزيد من «ماذا قررنا؟» أو «من كان يفترض أن يفعل ذلك؟»—الجميع يعمل من نفس السجل الموثّق.",
      ],
    },
    useCases: [
      {
        title: "الوقوف اليومي للفريق",
        description: "ملخصات ونقاط عمل سريعة ومنظّمة ليبقى الفريق بأكمله متوافقاً.",
      },
      {
        title: "اجتماعات العملاء",
        description: "سجلات دقيقة للنقاشات والالتزامات للمتابعة والامتثال.",
      },
      {
        title: "التخطيط الاستراتيجي",
        description: "توثيق واضح للقرارات والخطوات التالية للتنفيذ والمراجعة.",
      },
      {
        title: "اجتماعات مجلس الإدارة",
        description: "نصوص وملخصات موثوقة للحوكمة والتتبّع.",
      },
      {
        title: "انطلاقات المشاريع",
        description: "سياق ونقاط عمل مشتركة ليعرف الجميع ما تم الاتفاق عليه.",
      },
      {
        title: "التعاون بين الفرق",
        description: "سجلات قابلة للبحث حتى تجد الفرق المختلفة ما يهم وتعيد استخدامه.",
      },
    ],
    useCasesTitle: "حالات الاستخدام",
    howItWorks: [
      {
        step: 1,
        title: "سجّل أو ارفع اجتماعك.",
        description: "استخدم مسجّلك المعتاد أو ارفع ملف صوت موجود (مثلاً MP3, WAV, M4A).",
      },
      {
        step: 2,
        title: "الذكاء الاصطناعي ينسخ ويحلّل المحادثة.",
        description:
          "Speechi يحوّل الكلام إلى نص ويستخرج الملخص والمشاركين والقرارات ونقاط العمل.",
      },
      {
        step: 3,
        title: "شارك وصدّر وأرشف النتائج.",
        description:
          "نزّل Word أو PDF وشارك مع الفريق واحتفظ بسجل قابل للبحث لاحقاً.",
      },
    ],
    howItWorksTitle: "كيف يعمل",
    features: [
      {
        title: "تحديد المتحدثين",
        description:
          "المتحدثون مُيَّزون في النسخ عندما أمكن; لا تحديد هوية شخصية إلا إذا أضفته أنت.",
      },
      {
        title: "استخراج القرارات",
        description: "القرارات الأساسية مُستخرجة ومُدرجة لتسهيل العثور عليها وتتبّعها.",
      },
      {
        title: "تصدير بصيغ متعددة",
        description: "تصدير إلى Word أو PDF للمشاركة والأرشفة بالصيغ التي تستخدمها.",
      },
      {
        title: "مخرجات متعددة اللغات",
        description:
          "اختر لغة النسخ والملخص لتحصل الفرق العالمية على المخرجات بلغتها.",
      },
    ],
    featuresTitle: "ميزات متقدمة",
    faq: [
      {
        question: "ما دقة Speechi مقارنة بإنسان يكتب الملاحظات؟",
        answer:
          "Speechi يستخدم Whisper للنسخ وClaude للتحليل. الدقة عالية مع صوت واضح; تحصل على سجل متسق ومنظّم من دون الثغرات والتحيز لمسؤول واحد عن المحضر.",
      },
      {
        question: "كيف يعمل تحديد المتحدثين؟",
        answer:
          "Speechi يُميّز المتحدثين في الصوت عندما أمكن. لا يربط أسماء حقيقية إلا إذا أضفتها أنت; عادةً يُوسَم المتحدثون بشكل عام (مثلاً متحدث 1، 2) للخصوصية.",
      },
      {
        question: "كيف تُكتشَف نقاط العمل؟",
        answer:
          "النظام يبحث عن الالتزامات والمواعيد والمسؤولية في المحادثة ويعرضها كنقاط عمل. يمكنك المراجعة والتعديل قبل المشاركة.",
      },
      {
        question: "هل أستطيع البحث عبر عدة اجتماعات؟",
        answer:
          "يمكنك تخزين والبحث في نصوصك وملخصاتك المُصدَّرة. Speechi يمنحك المخرجات; كيفية تنظيمك وبحثك تعتمد على سير عملك.",
      },
      {
        question: "ما المنصات المدعومة؟",
        answer:
          "استخدم Speechi في أي متصفح حديث. ارفع الصوت من جهازك; لا حاجة لعتاد أو إضافات خاصة.",
      },
      {
        question: "ما سرعة المعالجة؟",
        answer:
          "تعتمد على طول التسجيل. معظم الاجتماعات تُعالَج خلال دقائق. ترى التقدّم في التطبيق.",
      },
    ],
    faqTitle: "الأسئلة الشائعة",
    finalCta: {
      title: "تستحق اجتماعات يشارك فيها الجميع ولا يُفقد فيها شيء مهم.",
      subtitle:
        "ابدأ بتسجيل واحد واكتشف ما يجلبه الوضوح. من دون ضغط—فقط ارفع وراجع وشارك عندما تكون جاهزاً.",
      button: "ابدأ باستخدام Speechi",
    },
  },
};

export function getLandingCopy(language: LandingLang): LandingCopy {
  return COPY[language] ?? COPY.en;
}

export function isLandingRtl(lang: LandingLang): boolean {
  return lang === "he" || lang === "ar";
}
