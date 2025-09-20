'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cyber-blue/20 bg-cyber-steel/40 hover:border-cyber-blue/40 transition-all duration-200">
        <Globe className="h-4 w-4 text-cyber-silver/80" />
        <span className="text-sm text-cyber-silver/80 uppercase font-medium">
          {locale === 'gr' ? 'ΕΛ' : 'EN'}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 min-w-[120px] bg-cyber-steel/90 backdrop-blur-xl border border-cyber-blue/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => switchLanguage('en')}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-cyber-blue/10 transition-colors duration-200 rounded-t-lg ${
            locale === 'en' ? 'text-cyber-blue font-medium' : 'text-cyber-silver/80'
          }`}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => switchLanguage('gr')}
          className={`w-full px-4 py-3 text-left text-sm hover:bg-cyber-blue/10 transition-colors duration-200 rounded-b-lg ${
            locale === 'gr' ? 'text-cyber-blue font-medium' : 'text-cyber-silver/80'
          }`}
        >
          🇬🇷 Ελληνικά
        </button>
      </div>
    </div>
  );
}


