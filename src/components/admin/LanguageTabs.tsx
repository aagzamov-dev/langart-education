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
        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab.id);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 rounded-t-lg
                        ${activeTab === tab.id
                            ? 'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/10'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
