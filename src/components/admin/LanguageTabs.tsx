'use client';

type Language = 'en' | 'ru' | 'uz';

interface LanguageTabsProps {
    activeTab: Language;
    setActiveTab: (lang: Language) => void;
}

export default function LanguageTabs({ activeTab, setActiveTab }: LanguageTabsProps) {
    const tabs: { id: Language; label: string }[] = [
        { id: 'en', label: 'English' },
        { id: 'ru', label: 'Russian' },
        { id: 'uz', label: 'Uzbek' },
    ];

    return (
        <div className="languageTabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab.id);
                    }}
                    className={`tabBtn ${activeTab === tab.id ? 'active' : ''}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
