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
  es: {
    translation: {
      common: {
        search: 'Buscar',
        movies: 'Películas',
        series: 'Series',
        genres: 'Géneros',
        trending: 'Tendencias',
        recommendations: 'Para ti',
        watchNow: 'Ver ahora',
        notAvailable: 'No disponible en tu región',
        signIn: 'Iniciar sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar sesión',
        profile: 'Perfil',
        settings: 'Configuración',
      },
      home: {
        hero: {
          title: 'Descubre tu próxima película',
          subtitle: 'Encuentra películas y series en todas las plataformas y idiomas',
        },
        trending: 'Tendencias ahora',
        newOnPlatform: 'Nuevo en {{platform}}',
        topGenre: 'Top {{genre}}',
      },
      search: {
        placeholder: 'Buscar películas y series...',
        filters: 'Filtros',
        sortBy: 'Ordenar por',
        noResults: 'No se encontraron resultados',
      },
      title: {
        cast: 'Reparto',
        crew: 'Equipo',
        overview: 'Resumen',
        genres: 'Géneros',
        languages: 'Idiomas',
        rating: 'Calificación',
        runtime: 'Duración',
        releaseDate: 'Fecha de lanzamiento',
        similar: 'Títulos similares',
        whereToWatch: 'Dónde ver',
      },
      profile: {
        preferences: 'Preferencias',
        preferredGenres: 'Géneros preferidos',
        preferredLanguages: 'Idiomas preferidos',
        preferredProviders: 'Proveedores preferidos',
        region: 'Región',
        save: 'Guardar',
      },
    },
  },
  fr: {
    translation: {
      common: {
        search: 'Rechercher',
        movies: 'Films',
        series: 'Séries',
        genres: 'Genres',
        trending: 'Tendances',
        recommendations: 'Pour vous',
        watchNow: 'Regarder maintenant',
        notAvailable: 'Non disponible dans votre région',
        signIn: 'Se connecter',
        signUp: 'S\'inscrire',
        signOut: 'Se déconnecter',
        profile: 'Profil',
        settings: 'Paramètres',
      },
      home: {
        hero: {
          title: 'Découvrez votre prochain film',
          subtitle: 'Trouvez des films et séries sur toutes les plateformes et langues',
        },
        trending: 'Tendances maintenant',
        newOnPlatform: 'Nouveau sur {{platform}}',
        topGenre: 'Top {{genre}}',
      },
      search: {
        placeholder: 'Rechercher des films et séries...',
        filters: 'Filtres',
        sortBy: 'Trier par',
        noResults: 'Aucun résultat trouvé',
      },
      title: {
        cast: 'Distribution',
        crew: 'Équipe',
        overview: 'Résumé',
        genres: 'Genres',
        languages: 'Langues',
        rating: 'Note',
        runtime: 'Durée',
        releaseDate: 'Date de sortie',
        similar: 'Titres similaires',
        whereToWatch: 'Où regarder',
      },
      profile: {
        preferences: 'Préférences',
        preferredGenres: 'Genres préférés',
        preferredLanguages: 'Langues préférées',
        preferredProviders: 'Fournisseurs préférés',
        region: 'Région',
        save: 'Enregistrer',
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
    lng: typeof window !== 'undefined' ? localStorage.getItem('cinefindr-language') || 'en' : 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      lookupLocalStorage: 'cinefindr-language',
      caches: ['localStorage'],
    },
  });

export default i18n;

