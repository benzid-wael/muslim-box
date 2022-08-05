const reactI18Next = jest.createMockFromModule("react-i18next");

reactI18Next.useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      t: (str: string) => str,
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

module.exports = reactI18Next;
