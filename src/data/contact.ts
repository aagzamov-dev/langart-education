// Contact information for LangArt Education Group

export interface ContactInfo {
  phoneNumber: string;
  email: string;
  locations: string[];
  workingHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    telegram: string;
  };
}

export const contactInfo: ContactInfo = {
  phoneNumber: '+998 99 123 45 67',
  email: 'info@langart.uz',
  locations: [
    'Tashkent, Yunusabad district, Amir Temur street 108',
  ],
  workingHours: '09:00 - 18:00',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/17njmqGe3R/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/langart_edu_gr',
    telegram: 'https://t.me/LangArt_Educational_Group'
  }
};

export function getContactInfo(): ContactInfo {
  return contactInfo;
}
