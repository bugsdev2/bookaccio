import FontsProvider from '@/providers/fontProvider';
import AccentColorProvider from '@/providers/accentColorProvider';
import SelectedBookProvider from '@/providers/selectedBookProvider';
import ThemeProvider from '@/providers/themeProvider';
import FullBooksListProvider from './booksFullListProvider';
import ShowPageNumberProvider from './options/showPageNumberProvider';
import ShowRatingProvider from './options/showRatingProvider';
import BlackThemeProvider from './blackThemeProvider';
import PreventScreenShotProvider from './options/preventScreenShotProvider';
import UnfinishedProvider from './options/showUnfinishedProvider';

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
                      <ThemeProvider>{children}</ThemeProvider>
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
