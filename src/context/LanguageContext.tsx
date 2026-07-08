import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    tagline: 'AI-Powered Constituency Intelligence Platform',
    call_us: 'Call Us',
    call_description: 'Dial 1800-JAN-SAATH (24/7 Helpline)',
    whatsapp: 'WhatsApp',
    whatsapp_description: 'Chat directly with AI support',
    upload_photo: 'Upload Photo',
    photo_description: 'Show us the issue directly via geotag',
    text_complaint: 'Text Complaint',
    text_description: 'Detailed written reports',
    submit: 'Submit Report / जमा करें ▷',
    submitting: 'Processing Triage...',
    submitted: 'Report Successfully Registered!',
    ward_label: 'Ward / Area Name',
    desc_label: 'Detailed Description',
  },
  hi: {
    tagline: 'एआई-संचालित निर्वाचन क्षेत्र बुद्धिमत्ता मंच',
    call_us: 'कॉल करें',
    call_description: '1800-JAN-SAATH डायल करें (24/7 हेल्पलाइन)',
    whatsapp: 'व्हाट्सएप',
    whatsapp_description: 'एआई सहायता से सीधे चैट करें',
    upload_photo: 'फोटो अपलोड करें',
    photo_description: 'जियोटैग के माध्यम से सीधे समस्या दिखाएं',
    text_complaint: 'टेक्स्ट शिकायत',
    text_description: 'विस्तृत लिखित रिपोर्ट दर्ज करें',
    submit: 'जमा करें / Submit ▷',
    submitting: 'प्रक्रिया चल रही है...',
    submitted: 'शिकायत सफलतापूर्वक दर्ज की गई!',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: keyof typeof translations.en): string => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};