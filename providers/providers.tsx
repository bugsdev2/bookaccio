import FontsProvider from '@/providers/fontProvider';
import AccentColorProvider from '@/providers/accentColorProvider';
import SelectedBookProvider from '@/providers/selectedBookProvider';
import ThemeProvider from '@/providers/themeProvider';
import FullBooksListProvider from './booksFullListProvider';
import ShowPageNumberProvider from './options/showPageNumberProvider';
import ShowRatingProvider from './options/showRatingProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ShowPageNumberProvider>
      <ShowRatingProvider>
        <FullBooksListProvider>
          <SelectedBookProvider>
            <AccentColorProvider>
              <FontsProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </FontsProvider>
            </AccentColorProvider>
          </SelectedBookProvider>
        </FullBooksListProvider>
      </ShowRatingProvider>
    </ShowPageNumberProvider>
  );
};

export default Providers;
