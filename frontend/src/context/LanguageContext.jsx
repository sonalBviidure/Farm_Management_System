import React, { createContext, useContext, useState } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
//  Language Context — FMS Bilingual Support (English / Marathi)
// ──────────────────────────────────────────────────────────────────────────────

const translations = {
  en: {
    // Nav / Sidebar
    dashboard: 'Dashboard',
    crops: 'Crops & Fields',
    expenses: 'Expenses',
    harvestSales: 'Harvest & Sales',
    reports: 'Financial Reports',
    aiCropRec: 'AI Crop Advisory',
    aiYieldPred: 'AI Yield Prediction',
    aiProfitPred: 'AI Profit Prediction',
    profile: 'My Profile',
    logout: 'Logout',

    // Dashboard
    welcomeBack: 'Welcome back',
    totalCrops: 'Total Crops',
    totalExpenses: 'Total Expenses',
    totalRevenue: 'Total Revenue',
    netProfit: 'Net Profit / Loss',
    activeCrops: 'Active Crops',
    quickActions: 'Quick Actions',
    addCrop: 'Add Crop',
    logExpense: 'Log Expense',
    recordSale: 'Record Sale',
    aiAdvisory: 'AI Advisory',
    refresh: 'Refresh',

    // Crops Page
    cropLandManagement: 'Crop & Land Management',
    manageFields: 'Manage Fields',
    cropName: 'Crop Name',
    variety: 'Seed Variety',
    season: 'Season',
    sowingDate: 'Sowing Date',
    fieldParcel: 'Field Parcel',
    status: 'Status',
    actions: 'Actions',
    addNewCrop: 'Add New Crop',
    editCrop: 'Edit Crop',
    saveCrop: 'Save Crop',
    updateCrop: 'Update Crop',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirmDelete: 'Confirm Delete',

    // Expenses
    expenseTracking: 'Expense Tracking',
    addExpense: 'Add Expense',
    category: 'Category',
    description: 'Description',
    amount: 'Amount',
    date: 'Date',
    totalExpensesFiltered: 'Total Expenses (Filtered)',
    expenseEntries: 'Expense Entries',
    avgPerEntry: 'Avg per Entry',

    // Harvest & Sales
    harvestSalesTitle: 'Harvest & Sales',
    logHarvest: 'Log Harvest',
    recordSaleBtn: 'Record Sale',
    harvestDate: 'Harvest Date',
    quantity: 'Quantity',
    unit: 'Unit',
    buyerName: 'Buyer Name',
    saleDate: 'Sale Date',
    pricePer: 'Price / Unit',
    totalHarvested: 'Total Harvested',
    totalRevenueBadge: 'Total Revenue',

    // Reports
    financialReports: 'Financial Reports',
    cropWiseComparison: 'Crop-wise Financial Comparison',
    totalCost: 'Total Cost',
    profitLoss: 'Profit / Loss',
    profitPerAcre: 'Profit/Acre',
    costPerAcre: 'Cost/Acre',
    recalculate: 'Recalculate',

    // AI Pages
    aiCropRecTitle: 'AI Crop Recommendation',
    enterFarmParams: 'Enter Farm Parameters',
    soilType: 'Soil Type',
    weatherConditions: 'Weather Conditions',
    irrigationType: 'Irrigation Type',
    getRecommendation: 'Get Recommendation',
    analyzing: 'Analyzing...',
    recommendationHistory: 'Recommendation History',

    aiYieldPredTitle: 'AI Yield Prediction',
    cultivationParams: 'Cultivation Parameters',
    targetCrop: 'Target Crop',
    landArea: 'Land Area (Acres)',
    farmingSeason: 'Farming Season',
    rainfall: 'Rainfall (mm)',
    fertilizerRegimen: 'Fertilizer Regimen',
    calculateYield: 'Calculate Predicted Yield',
    calculating: 'Calculating...',
    estimatedHarvest: 'Estimated Total Harvest',
    historicalPredictions: 'Historical Predictions',

    aiProfitPredTitle: 'AI Profit Prediction',
    estimatedCost: 'Estimated Cost (₹)',
    expectedYield: 'Expected Yield',
    expectedPrice: 'Expected Market Price / Unit (₹)',
    calculateProfit: 'Predict Profit',
    expectedProfit: 'Expected Net Profit',
    profitHistory: 'Profit Prediction History',

    // Common
    loading: 'Loading...',
    noData: 'No data found',
    save: 'Save',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    filterBySeason: 'Season:',
    filterByStatus: 'Status:',
    allSeasons: 'All Seasons',
    allStatuses: 'All Statuses',
    allCrops: 'All Crops',
    allCategories: 'All Categories',
    field: 'Field',
    area: 'Area',
    acres: 'Acres',
    registered: 'Registered',
    created: 'Created',

    // Landing
    landingTitle: 'Manage Crop Cycles, Track Expenses & Predict Harvest Outcomes',
    landingSubtitle: 'A purpose-built system helping farmers record crop operations and utilize ML for intelligent cultivation decisions.',
    goToDashboard: 'Go to Dashboard',
    createAccount: 'Create Farmer Account',
    login: 'Login',
    register: 'Register',

    // Profile
    myProfile: 'My Profile',
    fullName: 'Full Name',
    phone: 'Phone Number',
    location: 'Village / Taluka / District',
    totalAcres: 'Total Land (Acres)',
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile updated successfully!',

    // Seasons
    kharif: 'Kharif (Monsoon)',
    rabi: 'Rabi (Winter)',
    zaid: 'Zaid (Summer)',
    annual: 'Annual / Perennial',
  },

  mr: {
    // Nav / Sidebar
    dashboard: 'डॅशबोर्ड',
    crops: 'पिके व शेत',
    expenses: 'खर्च',
    harvestSales: 'काढणी व विक्री',
    reports: 'आर्थिक अहवाल',
    aiCropRec: 'AI पीक सल्ला',
    aiYieldPred: 'AI उत्पन्न अंदाज',
    aiProfitPred: 'AI नफा अंदाज',
    profile: 'माझी प्रोफाइल',
    logout: 'बाहेर पडा',

    // Dashboard
    welcomeBack: 'स्वागत आहे',
    totalCrops: 'एकूण पिके',
    totalExpenses: 'एकूण खर्च',
    totalRevenue: 'एकूण उत्पन्न',
    netProfit: 'निव्वळ नफा / तोटा',
    activeCrops: 'सक्रिय पिके',
    quickActions: 'त्वरित क्रिया',
    addCrop: 'पीक जोडा',
    logExpense: 'खर्च नोंद करा',
    recordSale: 'विक्री नोंदवा',
    aiAdvisory: 'AI सल्ला',
    refresh: 'रिफ्रेश',

    // Crops Page
    cropLandManagement: 'पीक व जमीन व्यवस्थापन',
    manageFields: 'शेते व्यवस्थापित करा',
    cropName: 'पिकाचे नाव',
    variety: 'बियाण्याची जात',
    season: 'हंगाम',
    sowingDate: 'पेरणी तारीख',
    fieldParcel: 'शेत भूखंड',
    status: 'स्थिती',
    actions: 'क्रिया',
    addNewCrop: 'नवीन पीक जोडा',
    editCrop: 'पीक संपादित करा',
    saveCrop: 'पीक जतन करा',
    updateCrop: 'पीक अद्यतनित करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    confirmDelete: 'हटवण्याची पुष्टी',

    // Expenses
    expenseTracking: 'खर्च ट्रॅकिंग',
    addExpense: 'खर्च जोडा',
    category: 'श्रेणी',
    description: 'तपशील',
    amount: 'रक्कम',
    date: 'तारीख',
    totalExpensesFiltered: 'एकूण खर्च (फिल्टर केलेले)',
    expenseEntries: 'खर्च नोंदी',
    avgPerEntry: 'प्रति नोंद सरासरी',

    // Harvest & Sales
    harvestSalesTitle: 'काढणी व विक्री',
    logHarvest: 'काढणी नोंदवा',
    recordSaleBtn: 'विक्री नोंदवा',
    harvestDate: 'काढणी तारीख',
    quantity: 'प्रमाण',
    unit: 'एकक',
    buyerName: 'खरेदीदाराचे नाव',
    saleDate: 'विक्री तारीख',
    pricePer: 'प्रति एकक किंमत',
    totalHarvested: 'एकूण काढणी',
    totalRevenueBadge: 'एकूण उत्पन्न',

    // Reports
    financialReports: 'आर्थिक अहवाल',
    cropWiseComparison: 'पीक-निहाय आर्थिक तुलना',
    totalCost: 'एकूण खर्च',
    profitLoss: 'नफा / तोटा',
    profitPerAcre: 'एकरी नफा',
    costPerAcre: 'एकरी खर्च',
    recalculate: 'पुन्हा गणना',

    // AI Pages
    aiCropRecTitle: 'AI पीक शिफारस',
    enterFarmParams: 'शेती माहिती भरा',
    soilType: 'मातीचा प्रकार',
    weatherConditions: 'हवामान परिस्थिती',
    irrigationType: 'सिंचन प्रकार',
    getRecommendation: 'शिफारस मिळवा',
    analyzing: 'विश्लेषण सुरू...',
    recommendationHistory: 'शिफारस इतिहास',

    aiYieldPredTitle: 'AI उत्पन्न अंदाज',
    cultivationParams: 'लागवड माहिती',
    targetCrop: 'लक्ष्य पीक',
    landArea: 'जमीन क्षेत्र (एकर)',
    farmingSeason: 'शेती हंगाम',
    rainfall: 'पाऊस (मिमी)',
    fertilizerRegimen: 'खत योजना',
    calculateYield: 'उत्पन्न अंदाज काढा',
    calculating: 'गणना सुरू...',
    estimatedHarvest: 'अंदाजित एकूण काढणी',
    historicalPredictions: 'मागील अंदाज',

    aiProfitPredTitle: 'AI नफा अंदाज',
    estimatedCost: 'अंदाजित खर्च (₹)',
    expectedYield: 'अपेक्षित उत्पन्न',
    expectedPrice: 'अपेक्षित बाजार भाव / एकक (₹)',
    calculateProfit: 'नफा अंदाज काढा',
    expectedProfit: 'अपेक्षित निव्वळ नफा',
    profitHistory: 'नफा अंदाज इतिहास',

    // Common
    loading: 'लोड होत आहे...',
    noData: 'माहिती उपलब्ध नाही',
    save: 'जतन करा',
    submit: 'सादर करा',
    close: 'बंद करा',
    back: 'मागे',
    filterBySeason: 'हंगाम:',
    filterByStatus: 'स्थिती:',
    allSeasons: 'सर्व हंगाम',
    allStatuses: 'सर्व स्थिती',
    allCrops: 'सर्व पिके',
    allCategories: 'सर्व श्रेण्या',
    field: 'शेत',
    area: 'क्षेत्र',
    acres: 'एकर',
    registered: 'नोंदणीकृत',
    created: 'तयार केले',

    // Landing
    landingTitle: 'पीक चक्र व्यवस्थापित करा, खर्च ट्रॅक करा आणि काढणीचे परिणाम अंदाज करा',
    landingSubtitle: 'शेतकऱ्यांना पीक नोंदी ठेवण्यास आणि ML वापरून हुशार शेती निर्णय घेण्यास मदत करणारी प्रणाली.',
    goToDashboard: 'डॅशबोर्डवर जा',
    createAccount: 'शेतकरी खाते तयार करा',
    login: 'प्रवेश करा',
    register: 'नोंदणी करा',

    // Profile
    myProfile: 'माझी प्रोफाइल',
    fullName: 'पूर्ण नाव',
    phone: 'फोन नंबर',
    location: 'गाव / तालुका / जिल्हा',
    totalAcres: 'एकूण जमीन (एकर)',
    updateProfile: 'प्रोफाइल अद्यतनित करा',
    profileUpdated: 'प्रोफाइल यशस्वीरित्या अद्यतनित झाली!',

    // Seasons
    kharif: 'खरीप (पावसाळी)',
    rabi: 'रब्बी (हिवाळी)',
    zaid: 'झायद (उन्हाळी)',
    annual: 'वार्षिक / बहुवार्षिक',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // read saved preference or default to English
  const [language, setLanguage] = useState(
    () => localStorage.getItem('fms_lang') || 'en'
  );

  function toggleLanguage() {
    const next = language === 'en' ? 'mr' : 'en';
    setLanguage(next);
    localStorage.setItem('fms_lang', next);
  }

  function setLang(lang) {
    setLanguage(lang);
    localStorage.setItem('fms_lang', lang);
  }

  const t = (key) => translations[language][key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
