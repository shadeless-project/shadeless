import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // import locale

dayjs.locale('vi'); // use locale

export function dateToString (d: Date, hasSecond = true): string {
  if (hasSecond) {
    return dayjs(d).format('DD-MM-YYYY HH:MM:SS');
  }
  return dayjs(d).format('DD-MM-YYYY HH:MM');
}
