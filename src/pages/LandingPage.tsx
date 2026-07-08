import { Link } from 'react-router-dom';
import { Mic, Map, TrendingUp, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LandingPage() {
  const { language, setLanguage } = useLanguage();

  const capabilities = [
    {
      icon: <Mic className="w-6 h-6 text-red-600" />,
      title: 'Voice-First Intake',
      titleHi: 'आवाज-प्रथम इनटेक',
      description: 'Removing literacy barriers by transcribing local dialects and speech instantly via multilingual AI, ensuring every voice is captured accurately.',
      descriptionHi: 'बहुभाषी एआई के माध्यम से स्थानीय बोलियों और भाषणों को तुरंत ट्रांसक्राइब करके साक्षरता बाधाओं को दूर करना, यह सुनिश्चित करना कि हर आवाज सही ढंग से दर्ज हो।',
      linkText: 'Learn More →',
      linkTextHi: 'और जानें →',
      color: 'bg-red-50 border-red-100',
      iconBg: 'bg-red-100'
    },
    {
      icon: <Map className="w-6 h-6 text-amber-600" />,
      title: 'Geospatial Verification',
      titleHi: 'जियोस्पेशियल सत्यापन',
      description: 'Mapping regional needs using precision satellite and open-source data to verify development milestones and infrastructure requirements.',
      descriptionHi: 'विकास के मील के पत्थर और बुनियादी ढांचे की आवश्यकताओं को सत्यापित करने के लिए सटीक उपग्रह और ओपन-सोर्स डेटा का उपयोग करके क्षेत्रीय आवश्यकताओं का मानचित्रण करना।',
      linkText: 'View Map Demo →',
      linkTextHi: 'मानचित्र डेमो देखें →',
      color: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: 'Predictive Governance',
      titleHi: 'पूर्वानुमानित शासन',
      description: 'Forecasting future infrastructure needs and resource allocation automatically using deep-learning models trained on community feedback.',
      descriptionHi: 'सामुदायिक प्रतिक्रिया पर प्रशिक्षित डीप-लर्निंग मॉडल का उपयोग करके भविष्य की बुनियादी ढांचे की जरूरतों और संसाधन आवंटन का स्वचालित रूप से पूर्वानुमान लगाना।',
      linkText: 'Explore AI Insights →',
      linkTextHi: 'एआई अंतर्दृष्टि का अन्वेषण करें →',
      color: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between font-sans">
      {/* Hero Section Banner */}
      <div 
        className="relative w-full h-[600px] bg-cover bg-center flex flex-col justify-between p-6 md:p-12 overflow-hidden shadow-lg"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop')" 
        }}
      >
        {/* Transparent Header */}
        <header className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
          <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/25 flex items-center justify-center">
            <span className="text-xl font-black text-white tracking-tight">JanSaath</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-white hover:text-jan-coral font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? 'Language' : 'भाषा'}</span>
            </button>
            <Link 
              to="/citizen" 
              className="bg-jan-coral hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95"
            >
              {language === 'hi' ? 'शुरू करें' : 'Get Started'}
            </Link>
          </div>
        </header>

        {/* Hero Body */}
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-start text-white z-10 mt-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none max-w-3xl">
            {language === 'hi' ? 'अपनी आवाज़ उठाएं। प्रगति को ट्रैक करें।' : 'Raise Your Voice. Track Progress.'}
          </h1>
          <Link 
            to="/citizen" 
            className="mt-8 bg-jan-coral hover:bg-red-500 text-white font-black text-base px-8 py-4 rounded-full flex items-center gap-2 shadow-xl shadow-jan-coral/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{language === 'hi' ? 'शुरू करें ▷' : 'Get Started ▷'}</span>
          </Link>
        </div>

        {/* Capabilities Subtitle overlay */}
        <div className="w-full max-w-7xl mx-auto z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{language === 'hi' ? 'हमारी क्षमताएं' : 'OUR CAPABILITIES'}</span>
            <h2 className="text-xl md:text-3xl font-black text-white mt-1">
              {language === 'hi' ? 'आपके निर्वाचन क्षेत्र के लिए इंटेलिजेंस लेयर' : 'The Intelligence Layer for Your Constituency'}
            </h2>
          </div>
          <p className="text-zinc-200 text-sm max-w-md font-medium leading-relaxed">
            {language === 'hi' 
              ? 'सटीक सामुदायिक प्रतिक्रिया को व्यावहारिक विकास अंतर्दृष्टि में बदलने के लिए अत्याधुनिक एआई का उपयोग करना।' 
              : 'Utilizing state-of-the-art AI to transform raw local feedback into actionable development insights.'}
          </p>
        </div>
      </div>

      {/* Capabilities Section Cards */}
      <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {capabilities.map((cap, i) => (
          <div 
            key={i} 
            className={`p-8 rounded-3xl border ${cap.color} bg-white shadow-sm flex flex-col justify-between items-start h-[280px] transition-all hover:shadow-md hover:scale-[1.01]`}
          >
            <div className="space-y-4">
              <div className={`p-3 rounded-2xl ${cap.iconBg} inline-flex`}>
                {cap.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800">
                {language === 'hi' ? cap.titleHi : cap.title}
              </h3>
              <p className="text-zinc-600 text-xs font-medium leading-relaxed line-clamp-4">
                {language === 'hi' ? cap.descriptionHi : cap.description}
              </p>
            </div>
            <Link 
              to="/citizen" 
              className="text-xs font-black text-jan-coral hover:underline mt-4 flex items-center"
            >
              {language === 'hi' ? cap.linkTextHi : cap.linkText}
            </Link>
          </div>
        ))}
      </div>

      {/* Basic Footer */}
      <footer className="bg-zinc-900 py-6 text-center text-xs text-zinc-500 font-bold border-t border-zinc-800">
        © 2026 JanSaath Framework • Built with Google AI Studio & Firebase Spark
      </footer>
    </div>
  );
}
export default LandingPage;
