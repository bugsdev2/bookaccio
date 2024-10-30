import FontsProvider from '@/providers/fontProvider';
import AccentColorProvider from '@/providers/accentColorProvider';
import SelectedBookProvider from '@/providers/selectedBookProvider';
import ThemeProvider from '@/providers/themeProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SelectedBookProvider>
            <AccentColorProvider>
                <FontsProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </FontsProvider>
            </AccentColorProvider>
        </SelectedBookProvider>
    );
};

export default Providers;
