import { useEffect, useState } from 'react';
import { getKarachiMinutes } from '../lib/time';

// Current Karachi time in minutes after midnight, refreshed every 30 seconds
export function useKarachiMinutes() {
  const [minutes, setMinutes] = useState(() => getKarachiMinutes());

  useEffect(() => {
    const id = setInterval(() => setMinutes(getKarachiMinutes()), 30_000);
    return () => clearInterval(id);
  }, []);

  return minutes;
}
