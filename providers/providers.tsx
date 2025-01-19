import FontsProvider from '@/providers/fontProvider';
import AccentColorProvider from '@/providers/accentColorProvider';
import SelectedBookProvider from '@/providers/selectedBookProvider';
import SelectedBookOLProvider from './selectedBookOLProvider';
import ThemeProvider from '@/providers/themeProvider';
import FullBooksListProvider from './booksFullListProvider';
import ShowPageNumberProvider from './options/showPageNumberProvider';
import ShowRatingProvider from './options/showRatingProvider';
import BlackThemeProvider from './blackThemeProvider';
import PreventScreenShotProvider from './options/preventScreenShotProvider';
import UnfinishedProvider from './options/showUnfinishedProvider';
import ShowAdditionalDetailsProvider from './options/showAdditionalDetails';
import LanguageProvider from './languageProvider';
import BookSourceProvider from './bookSourceProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <BlackThemeProvider>
      <ShowPageNumberProvider>
        <ShowRatingProvider>
          <FullBooksListProvider>
            <SelectedBookProvider>
              <AccentColorProvider>
                <FontsProvider>
                  <PreventScreenShotProvider>
                    <UnfinishedProvider>
                      <ShowAdditionalDetailsProvider>
                        <LanguageProvider>
                          <SelectedBookOLProvider>
                            <BookSourceProvider>
                              <ThemeProvider>{children}</ThemeProvider>
                            </BookSourceProvider>
                          </SelectedBookOLProvider>
                        </LanguageProvider>
                      </ShowAdditionalDetailsProvider>
                    </UnfinishedProvider>
                  </PreventScreenShotProvider>
                </FontsProvider>
              </AccentColorProvider>
            </SelectedBookProvider>
          </FullBooksListProvider>
        </ShowRatingProvider>
      </ShowPageNumberProvider>
    </BlackThemeProvider>
  );
};

export default Providers;
