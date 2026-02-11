'use client';

import React, { createContext, useContext } from 'react';

export interface SiteConfig {
    phoneNumber: string;
    email: string;
    locations: string[];
    workingHours: string;
    facebook: string;
    instagram: string;
    telegram: string;
}

const SiteConfigContext = createContext<SiteConfig | undefined>(undefined);

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};

export const SiteConfigProvider = ({
    children,
    config
}: {
    children: React.ReactNode;
    config: SiteConfig;
}) => {
    return (
        <SiteConfigContext.Provider value={config}>
            {children}
        </SiteConfigContext.Provider>
    );
};
