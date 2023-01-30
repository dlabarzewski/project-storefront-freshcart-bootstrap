export const LanguageConfig : {
    storageKey: string,
    defaultLanguage: string,
    languages: {
        symbol: string,
        name: string
    }[]
  } = {
    storageKey: 'lang',
    defaultLanguage: 'en',
    languages: [
        {
            symbol: 'en',
            name: 'English'
        },
        {
            symbol: 'pl',
            name: 'Polski'
        }
    ]
  }