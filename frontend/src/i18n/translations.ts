export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

export const translations: Translations = {
  // Brand & Tagline
  brandName: {
    en: 'Poshan Mitra',
    hi: 'पोषण मित्र',
    kn: 'ಪೋಷಣ್ ಮಿತ್ರ',
  },
  tagline: {
    en: 'Healthy Food, Happy Children',
    hi: 'स्वस्थ भोजन, खुशहाल बच्चे',
    kn: 'ಆರೋಗ್ಯಕರ ಆಹಾರ, ಸಂತೋಷದ ಮಕ್ಕಳು',
  },
  subtagline: {
    en: 'Smart Diet, Nutrition Awareness and Child Welfare Platform for Anganwadi Centres',
    hi: 'आंगनवाड़ी केंद्रों के लिए स्मार्ट आहार, पोषण जागरूकता और बाल कल्याण मंच',
    kn: 'ಅಂಗನವಾಡಿ ಕೇಂದ್ರಗಳಿಗಾಗಿ ಸ್ಮಾರ್ಟ್ ಆಹಾರ, ಪೌಷ್ಟಿಕಾಂಶ ಜಾಗೃತಿ ಮತ್ತು ಮಕ್ಕಳ ಕಲ್ಯಾಣ ವೇದಿಕೆ',
  },

  // Navigation Links
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ', kn: 'ಮುಖಪುಟ' },
  navDashboard: { en: 'Worker Dashboard', hi: 'कार्यकर्ता डैशबोर्ड', kn: 'ಕಾರ್ಯಕರ್ತೆಯರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  navEducation: { en: 'Nutrition Education', hi: 'पोषण शिक्षा', kn: 'ಪೌಷ್ಟಿಕಾಂಶ ಶಿಕ್ಷಣ' },
  navFoodGuide: { en: 'Food Guide', hi: 'आहार निर्देशिका', kn: 'ಆಹಾರ ಮಾರ್ಗದರ್ಶಿ' },
  navMealPlanner: { en: 'Meal Planner', hi: 'भोजन योजनाकार', kn: 'ಆಹಾರ ಯೋಜಕ' },
  navPoshanPlay: { en: 'Poshan Play', hi: 'पोषण खेल', kn: 'ಪೋಷಣ್ ಆಟಗಳು' },
  navGrowthMonitoring: { en: 'Growth Monitoring', hi: 'बाल विकास निगरानी', kn: 'ಮಕ್ಕಳ ಬೆಳವಣಿಗೆ ಮಾನಿಟರಿಂಗ್' },
  navFollowUps: { en: 'Welfare Follow-Ups', hi: 'कल्याणकारी अनुवर्ती कार्य', kn: 'ಕಲ್ಯಾಣ ಫಾಲೋ-ಅಪ್' },
  navParentResources: { en: 'Parent Resources', hi: 'अभिभावक संसाधन', kn: 'ಪೋಷಕರ ಸಂಪನ್ಮೂಲಗಳು' },
  navGovtSchemes: { en: 'Govt Schemes', hi: 'सरकारी योजनाएं', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' },
  navImpactReports: { en: 'Impact Reports', hi: 'प्रभाव रिपोर्ट', kn: 'ಪ್ರಭಾವ ವರದಿಗಳು' },
  navLogin: { en: 'Worker Login', hi: 'लॉग इन करें', kn: 'ಲಾಗಿನ್' },
  navLogout: { en: 'Logout', hi: 'लॉग आउट', kn: 'ಲಾಗ್‌ಔಟ್' },

  // General & Accessibility
  listenAudio: { en: 'Listen (Audio)', hi: 'सुनें (ऑडियो)', kn: 'ಆಲಿಸಿ (ಆಡಿಯೋ)' },
  stopAudio: { en: 'Stop Audio', hi: 'ऑडियो रोकें', kn: 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ' },
  demoModeNotice: {
    en: 'College Evaluation Demo Mode: Fictional Data Only',
    hi: 'कॉलेज मूल्यांकन डेमो मोड: केवल काल्पनिक डेटा',
    kn: 'ಕಾಲೇಜು ಮೌಲ್ಯಮಾಪನ ಡೆಮೊ ಮೋಡ್: ಕಾಲ್ಪನಿಕ ಮಾಹಿತಿ ಮಾತ್ರ',
  },
  disclaimerText: {
    en: 'Educational & Anganwadi Support Platform. Not a clinical diagnostic tool. Medical emergencies must be referred to ANMs, PHCs, or doctors.',
    hi: 'शैक्षणिक और आंगनवाड़ी सहायता मंच। यह कोई चिकित्सीय निदान उपकरण नहीं है। आपात स्थिति में एएनएम या डॉक्टर से संपर्क करें।',
    kn: 'ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಅಂಗನವಾಡಿ ಬೆಂಬಲ ವೇದಿಕೆ. ಇದು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸಾ ಸಾಧನವಲ್ಲ. ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳಿಗೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  },

  // Home Page
  dailyTipTitle: { en: 'Daily Nutrition Tip for Mothers & Workers', hi: 'माताओं और कार्यकर्ताओं के लिए दैनिक पोषण सुझाव', kn: 'ತಾಯಂದಿರು ಮತ್ತು ಕಾರ್ಯಕರ್ತೆಯರಿಗೆ ದೈನಂದಿನ ಪೋಷಕಾಂಶ ಸಲಹೆ' },
  dailyTipContent: {
    en: 'Adding freshly sprouted green gram (moong) or roasted peanut powder to ragi porridge increases protein availability by over 30% and keeps young children active all morning.',
    hi: 'रागी के दलिये में अंकुरित मूंग या भुनी हुई मूंगफली का पाउडर मिलाने से प्रोटीन 30% तक बढ़ जाता है और बच्चे चुस्त रहते हैं।',
    kn: 'ರಾಗಿ ಅಂಬಲಿಗೆ ಮೊಳಕೆ ಕಟ್ಟಿದ ಹೆಸರುಕಾಳು ಅಥವಾ ಹುರಿದ ಕಡಲೆಕಾಯಿ ಪುಡಿ ಸೇರಿಸುವುದರಿಂದ ಪ್ರೋಟೀನ್ ಶೇಕಡಾ 30 ರಷ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ.',
  },
  getStarted: { en: 'Explore Features', hi: 'शुरू करें', kn: 'ಪ್ರಾರಂಭಿಸಿ' },
  tryMealPlanner: { en: 'Plan Budget Meal (₹)', hi: 'बजट भोजन योजना बनाएं (₹)', kn: 'ಬಜೆಟ್ ಊಟ ಯೋಜಿಸಿ (₹)' },
  playPoshanGames: { en: 'Play Learning Games (3-6 Yrs)', hi: 'बच्चों के खेल खेलें (3-6 वर्ष)', kn: 'ಮಕ್ಕಳ ಆಟಗಳನ್ನು ಆಡಿ (3-6 ವರ್ಷ)' },
  forWorkers: { en: 'For Anganwadi Workers', hi: 'आंगनवाड़ी कार्यकर्ताओं के लिए', kn: 'ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆಯರಿಗಾಗಿ' },
  forParents: { en: 'For Parents & Families', hi: 'माता-पिता और परिवारों के लिए', kn: 'ಪೋಷಕರು ಮತ್ತು ಕುಟುಂಬಗಳಿಗಾಗಿ' },
  forChildren: { en: 'For Young Children', hi: 'छोटे बच्चों के लिए', kn: 'ಚಿಕ್ಕ ಮಕ್ಕಳಿಗಾಗಿ' },

  // Worker Dashboard
  dashboardTitle: { en: 'Anganwadi Worker Command Centre', hi: 'आंगनवाड़ी कार्यकर्ता कमान केंद्र', kn: 'ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ' },
  enrolledChildren: { en: 'Enrolled Children', hi: 'नामांकित बच्चे', kn: 'ದಾಖಲಾದ ಮಕ್ಕಳು' },
  growthMeasurementsLogged: { en: 'Measurements Logged', hi: 'माप दर्ज किए गए', kn: 'ದಾಖಲಾದ ಅಳತೆಗಳು' },
  reviewNeededBadge: { en: 'Needing Growth Review', hi: 'समीक्षा की आवश्यकता', kn: 'ಮರುಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ' },
  pendingTasksLabel: { en: 'Pending Welfare Tasks', hi: 'लंबित कल्याण कार्य', kn: 'ಬಾಕಿ ಉಳಿದಿರುವ ಕಾರ್ಯಗಳು' },
  quickActions: { en: 'Quick Actions', hi: 'त्वरित कार्रवाई', kn: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು' },
  addMeasurementBtn: { en: 'Record Measurement', hi: 'माप दर्ज करें', kn: 'ಅಳತೆ ದಾಖಲಿಸಿ' },
  addNewTaskBtn: { en: 'New Welfare Task', hi: 'नया कार्य जोड़ें', kn: 'ಹೊಸ ಕಾರ್ಯ ರಚಿಸಿ' },
  viewAllRecords: { en: 'View All Child Records', hi: 'सभी बच्चे देखें', kn: 'ಎಲ್ಲಾ ಮಕ್ಕಳನ್ನು ವೀಕ್ಷಿಸಿ' },

  // Growth Monitoring
  growthMonitoringTitle: { en: 'Child Growth & Anthropometric Monitoring', hi: 'बाल विकास और माप निगरानी', kn: 'ಮಕ್ಕಳ ಬೆಳವಣಿಗೆ ಮಾನಿಟರಿಂಗ್' },
  pseudonymousNotice: {
    en: 'Privacy Safeguard: Children are identified exclusively via pseudonymous reference codes (e.g., CH-BLR-001) in compliance with digital child welfare data ethics.',
    hi: 'गोपनीयता सुरक्षा: बच्चों की पहचान केवल छद्म संदर्भ कोड (उदा. CH-BLR-001) से की जाती है।',
    kn: 'ಗೌಪ್ಯತೆ ರಕ್ಷಣೆ: ಮಕ್ಕಳನ್ನು ಕೇವಲ ಗೌಪ್ಯ ಕೋಡ್‌ಗಳ ಮೂಲಕ ಗುರುತಿಸಲಾಗುತ್ತದೆ (ಉದಾ: CH-BLR-001).',
  },
  selectChild: { en: 'Select Child Reference ID', hi: 'बच्चे का संदर्भ आईडी चुनें', kn: 'ಮಗುವಿನ ರೆಫರೆನ್ಸ್ ಐಡಿ ಆಯ್ಕೆಮಾಡಿ' },
  childDob: { en: 'Date of Birth', hi: 'जन्म तिथि', kn: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ' },
  childGender: { en: 'Gender', hi: 'लिंग', kn: 'ಲಿಂಗ' },
  weightKg: { en: 'Weight (kg)', hi: 'वजन (किलो)', kn: 'ತೂಕ (ಕೆಜಿ)' },
  heightCm: { en: 'Height / Length (cm)', hi: 'ऊंचाई / लंबाई (सेमी)', kn: 'ಎತ್ತರ (ಸೆಂ.ಮೀ)' },
  wazLabel: { en: 'Weight-for-Age (WAZ)', hi: 'उम्र के अनुसार वजन (WAZ)', kn: 'ವಯಸ್ಸಿಗೆ ತಕ್ಕ ತೂಕ (WAZ)' },
  hazLabel: { en: 'Height-for-Age (HAZ)', hi: 'उम्र के अनुसार ऊंचाई (HAZ)', kn: 'ವಯಸ್ಸಿಗೆ ತಕ್ಕ ಎತ್ತರ (HAZ)' },
  whzLabel: { en: 'Weight-for-Height (WHZ)', hi: 'ऊंचाई के अनुसार वजन (WHZ)', kn: 'ಎತ್ತರಕ್ಕೆ ತಕ್ಕ ತೂಕ (WHZ)' },
  normalGrowth: { en: 'Normal Growth Pattern', hi: 'सामान्य विकास', kn: 'ಸಾಮಾನ್ಯ ಬೆಳವಣಿಗೆ' },
  moderateUnderweight: { en: 'Moderate Underweight (<-2 SD)', hi: 'मध्यम कम वजन (<-2 SD)', kn: 'ಮಧ್ಯಮ ಕಡಿಮೆ ತೂಕ (<-2 SD)' },
  severeUnderweight: { en: 'Severe Underweight (<-3 SD)', hi: 'गंभीर कम वजन (<-3 SD)', kn: 'ತೀವ್ರ ಕಡಿಮೆ ತೂಕ (<-3 SD)' },
  moderateWasting: { en: 'Moderate Wasting (<-2 SD)', hi: 'मध्यम दुबलापन (<-2 SD)', kn: 'ಮಧ್ಯಮ ಕ್ಷೀಣತೆ (<-2 SD)' },
  severeWasting: { en: 'Severe Wasting (<-3 SD)', hi: 'गंभीर दुबलापन (<-3 SD)', kn: 'ತೀವ್ರ ಕ್ಷೀಣತೆ (<-3 SD)' },

  // Meal Planner
  mealPlannerTitle: { en: 'Smart Local Food & Budget Meal Planner', hi: 'स्मार्ट स्थानीय आहार और बजट भोजन योजनाकार', kn: 'ಸ್ಥಳೀಯ ಆಹಾರ ಮತ್ತು ಬಜೆಟ್ ಊಟ ಯೋಜಕ' },
  budgetSliderLabel: { en: 'Approximate Daily Budget (₹ INR)', hi: 'अनुमानित दैनिक बजट (₹ रुपये)', kn: 'ಅಂದಾಜು ದೈನಂದಿನ ಬಜೆಟ್ (₹)' },
  familyMembersCount: { en: 'Family Members', hi: 'परिवार के सदस्य', kn: 'ಕುಟುಂಬದ ಸದಸ್ಯರು' },
  dietaryPreference: { en: 'Dietary Preference', hi: 'आहार प्राथमिकता', kn: 'ಆಹಾರ ಪ್ರಾಶಸ್ತ್ಯ' },
  generatePlanBtn: { en: 'Generate Balanced Meal Plan', hi: 'संतुलित भोजन योजना बनाएं', kn: 'ಸಮತೋಲಿತ ಊಟ ಯೋಜಿಸಿ' },
  shoppingListTitle: { en: 'Local Ingredient Shopping List', hi: 'स्थानीय सामग्री खरीदारी सूची', kn: 'ಸ್ಥಳೀಯ ಪದಾರ್ಥಗಳ ಶಾಪಿಂಗ್ ಪಟ್ಟಿ' },
  estimatedCost: { en: 'Estimated Total Cost', hi: 'अनुमानित कुल लागत', kn: 'ಅಂದಾಜು ಒಟ್ಟು ವೆಚ್ಚ' },
  printPlanBtn: { en: 'Print Meal Plan', hi: 'योजना प्रिंट करें', kn: 'ಯೋಜನೆ ಮುದ್ರಿಸಿ' },

  // Poshan Play
  poshanPlayTitle: { en: 'Poshan Play — Fun Nutrition Games', hi: 'पोषण खेल — बच्चों के मजेदार खेल', kn: 'ಪೋಷಣ್ ಆಟಗಳು — ಮಕ್ಕಳ ಮೋಜಿನ ಕಲಿಕೆ' },
  gameSubtitle: { en: 'Interactive picture activities for children aged 3–6 years with encouraging audio & stars', hi: '3-6 वर्ष के बच्चों के लिए ऑडियो और सितारों के साथ इंटरैक्टिव चित्र गतिविधियां', kn: '3-6 ವರ್ಷದ ಮಕ್ಕಳಿಗಾಗಿ ಪ್ರೋತ್ಸಾಹದಾಯಕ ಆಡಿಯೋ ಮತ್ತು ನಕ್ಷತ್ರಗಳೊಂದಿಗೆ ಚಿತ್ರ ಚಟುವಟಿಕೆಗಳು' },
  pictureQuizTab: { en: 'Food Quiz', hi: 'भोजन प्रश्नोत्तरी', kn: 'ಆಹಾರ ರಸಪ್ರಶ್ನೆ' },
  sortingGameTab: { en: 'Healthy vs Junk Sort', hi: 'स्वस्थ बनाम जंक वर्गीकरण', kn: 'ಆರೋಗ್ಯಕರ vs ಜಂಕ್ ವಿಂಗಡಣೆ' },
  plateBuilderTab: { en: 'Build Rainbow Plate', hi: 'इंद्रधनुषी थाली बनाएं', kn: 'ಬಣ್ಣದ ತಟ್ಟೆ ನಿರ್ಮಿಸಿ' },
  handwashGameTab: { en: 'Handwashing Steps', hi: 'हाथ धोने के चरण', kn: 'ಕೈ ತೊಳೆಯುವ ಹಂತಗಳು' },
  scoreLabel: { en: 'Stars Earned', hi: 'अर्जित सितारे', kn: 'ಗಳಿಸಿದ ನಕ್ಷತ್ರಗಳು' },
};

