import FontsProvider from '@/providers/fontProvider';
import AccentColorProvider from '@/providers/accentColorProvider';
import SelectedBookProvider from '@/providers/selectedBookProvider';
import ThemeProvider from '@/providers/themeProvider';
import FullBooksListProvider from './booksFullListProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <FullBooksListProvider>
            <SelectedBookProvider>
                <AccentColorProvider>
                    <FontsProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </FontsProvider>
                </AccentColorProvider>
            </SelectedBookProvider>
        </FullBooksListProvider>
    );
};

export default Providers;
