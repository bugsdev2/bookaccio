import { useAccentColorContext } from '@/providers/accentColorProvider';
import { useFontsContext } from '@/providers/fontProvider';
import { useDarkModeContext } from '@/providers/themeProvider';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

type DateTimePickerProps = {
    currentDate: string | undefined;
    onChange: any;
    minimumDate?: Date;
};

export default function DateTimePicker({ currentDate, onChange, minimumDate }: DateTimePickerProps) {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [font, setFont] = useFontsContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    let date = new Date(currentDate ? currentDate : '');

    function showDateTimePicker() {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            onChange: (_, date?: Date) => onChange(date ? new Date(date) : new Date()),
        });
    }

    return (
        <TouchableOpacity
            onPress={showDateTimePicker}
            style={[styles.bigBtn, { borderColor: isDarkMode ? Colors.light : Colors.dark }]}
        >
            <Text style={[styles.dateLabel, { fontFamily: `${font}B`, color: accentColor, backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>Start Date</Text>
            <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>{currentDate}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bigBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 80,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },

    dateLabel: {
        fontSize: 18,
        position: 'absolute',
        top: -15,
        paddingHorizontal: 8,
    },

    date: {
        fontSize: 17,
    },
});
