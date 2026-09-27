import { CLOSE_AT, OPEN_AT } from '../data/contact';

export const TIME_ZONE = 'Asia/Karachi';
const DAY = 24 * 60;

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

// Minutes after midnight in Karachi, regardless of the visitor's own time zone
export const getKarachiMinutes = (date = new Date()) => {
  const parts = clockFormat.formatToParts(date);
  const get = (type) => Number(parts.find((part) => part.type === type).value);
  return get('hour') * 60 + get('minute');
};

export const isOpenAt = (minutes) => minutes >= OPEN_AT || minutes < CLOSE_AT;

// Night palette from 7 PM until 6 AM
export const isNightAt = (minutes) => minutes >= 19 * 60 || minutes < 6 * 60;

export const getOpenStatus = (minutes) => {
  if (isOpenAt(minutes)) {
    const untilClose = (CLOSE_AT - minutes + DAY) % DAY;
    return untilClose <= 60
      ? { state: 'closing', label: `Closing soon · ${untilClose} min left` }
      : { state: 'open', label: 'Open now · until 4 AM' };
  }
  const untilOpen = OPEN_AT - minutes;
  return untilOpen <= 60
    ? { state: 'closed', label: `Opens in ${untilOpen} min` }
    : { state: 'closed', label: 'Closed · opens 5 PM' };
};

// Formats minutes after midnight (may run past 24h for after-midnight slots) as "9 PM"
export const formatSlot = (minutes) => {
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
};
