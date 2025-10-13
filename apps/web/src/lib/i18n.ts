import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        search: 'Search',
        movies: 'Movies',
        series: 'Series',
        genres: 'Genres',
        trending: 'Trending',
        recommendations: 'For You',
        watchNow: 'Watch Now',
        notAvailable: 'Not available in your region',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        profile: 'Profile',
        settings: 'Settings',
      },
      home: {
        hero: {
          title: 'Discover Your Next Watch',
          subtitle: 'Find movies and series across all platforms, all languages',
        },
        trending: 'Trending Now',
        newOnPlatform: 'New on {{platform}}',
        topGenre: 'Top {{genre}}',
      },
      search: {
        placeholder: 'Search movies and series...',
        filters: 'Filters',
        sortBy: 'Sort by',
        noResults: 'No results found',
      },
      title: {
        cast: 'Cast',
        crew: 'Crew',
        overview: 'Overview',
        genres: 'Genres',
        languages: 'Languages',
        rating: 'Rating',
        runtime: 'Runtime',
        releaseDate: 'Release Date',
        similar: 'Similar Titles',
        whereToWatch: 'Where to Watch',
      },
      profile: {
        preferences: 'Preferences',
        preferredGenres: 'Preferred Genres',
        preferredLanguages: 'Preferred Languages',
        preferredProviders: 'Preferred Providers',
        region: 'Region',
        save: 'Save',
      },
    },
  },
  hi: {
    translation: {
      common: {
        search: 'खोजें',
        movies: 'फ़िल्में',
        series: 'सीरीज़',
        genres: 'शैली',
        trending: 'ट्रेंडिंग',
        recommendations: 'आपके लिए',
        watchNow: 'अभी देखें',
        notAvailable: 'आपके क्षेत्र में उपलब्ध नहीं',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        signOut: 'साइन आउट',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
      },
      home: {
        hero: {
          title: 'अपनी अगली पसंद खोजें',
          subtitle: 'सभी प्लेटफ़ॉर्म और भाषाओं में फ़िल्में और सीरीज़ खोजें',
        },
        trending: 'ट्रेंडिंग अभी',
        newOnPlatform: '{{platform}} पर नया',
        topGenre: 'शीर्ष {{genre}}',
      },
      search: {
        placeholder: 'फ़िल्में और सीरीज़ खोजें...',
        filters: 'फ़िल्टर',
        sortBy: 'क्रमबद्ध करें',
        noResults: 'कोई परिणाम नहीं मिला',
      },
      title: {
        cast: 'कलाकार',
        crew: 'क्रू',
        overview: 'सारांश',
        genres: 'शैली',
        languages: 'भाषाएँ',
        rating: 'रेटिंग',
        runtime: 'अवधि',
        releaseDate: 'रिलीज़ तिथि',
        similar: 'समान शीर्षक',
        whereToWatch: 'कहाँ देखें',
      },
      profile: {
        preferences: 'प्राथमिकताएं',
        preferredGenres: 'पसंदीदा शैली',
        preferredLanguages: 'पसंदीदा भाषाएँ',
        preferredProviders: 'पसंदीदा प्रदाता',
        region: 'क्षेत्र',
        save: 'सहेजें',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

