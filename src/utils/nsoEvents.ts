/**
 * Utility for NSO game quest schedules, challenge timings, and platform inception uptime.
 * Matches authentic Ninja School Online logic and challenge-system.js from web repo.
 */

export interface DialogueItem {
  id: string;
  text: string;
  color: "#51cf66" | "#ffd43b" | "#ff6b6b" | "#ffffff";
  category?: string;
  avatar?: string;
}

export interface UptimeData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedText: string;
}

export type UptimeBreakdown = UptimeData;

const INCEPTION_DATE_ISO = "2019-02-01T17:05:40";

export function calculateUptime(): UptimeData {
  const inceptionDate = new Date(INCEPTION_DATE_ISO);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - inceptionDate.getTime();
  const totalSeconds = Math.max(0, Math.floor(timeDifference / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  const inceptionYear = inceptionDate.getFullYear();
  const inceptionMonth = inceptionDate.getMonth();
  const inceptionDay = inceptionDate.getDate();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  let years = currentYear - inceptionYear;
  let months = currentMonth - inceptionMonth;
  let days = currentDay - inceptionDay;

  if (days < 0) {
    months--;
    const prevMonthDate = new Date(currentYear, currentMonth, 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const formattedText =
    `${years} years ${months} months\n` +
    `${days} days ${hours} hours\n` +
    `${minutes} minutes ${seconds} seconds`;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    formattedText,
  };
}

function formatTimeDiff(diffMs: number): string {
  if (diffMs <= 0) return "0 seconds";
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(days + (days === 1 ? " day" : " days"));
  if (hours > 0) parts.push(hours + (hours === 1 ? " hour" : " hours"));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? " minute" : " minutes"));
  if (seconds > 0) parts.push(seconds + (seconds === 1 ? " second" : " seconds"));

  return parts.slice(0, 3).join(", ") || "0 seconds";
}

function getNextDailyUTCDate(hour: number, minute: number): Date {
  const now = new Date();
  const target = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute, 0)
  );
  if (target.getTime() > now.getTime()) {
    return target;
  }
  target.setUTCDate(target.getUTCDate() + 1);
  return target;
}

export function generateDialogues(): DialogueItem[] {
  const now = new Date();
  const dialogues: DialogueItem[] = [];

  // 1. Static Welcome & Wisdom
  dialogues.push({
    id: "welcome",
    text: "Welcome to Matrix™",
    color: "#ffffff",
  });

  // 2. Server Daily Reset (00:00 UTC)
  const nextReset = getNextDailyUTCDate(0, 0);
  const resetDiff = nextReset.getTime() - now.getTime();
  dialogues.push({
    id: "server-reset",
    text: `Server will reset in ${formatTimeDiff(resetDiff)}.`,
    color: "#ffffff",
  });

  // 3. Daily Maintenance (02:00 UTC)
  const nextMaint = getNextDailyUTCDate(2, 0);
  const maintDiff = nextMaint.getTime() - now.getTime();
  dialogues.push({
    id: "maintenance",
    text: `Maintenance in ${formatTimeDiff(maintDiff)}.`,
    color: "#ffffff",
  });

  // 4. Seven Beasts (Thất Thú) - Tue (2), Thu (4), Sat (6)
  const sevenBeastsDays = [2, 4, 6];
  const sevenBeastsWindows = [
    { openH: 9, openM: 0, startH: 9, startM: 30, endH: 10, endM: 30 },
    { openH: 21, openM: 0, startH: 21, startM: 30, endH: 22, endM: 30 },
  ];
  const todayUTC = now.getUTCDay();

  if (!sevenBeastsDays.includes(todayUTC)) {
    const nextDay = sevenBeastsDays.find((d) => d > todayUTC) || sevenBeastsDays[0];
    const daysUntil = nextDay > todayUTC ? nextDay - todayUTC : 7 - todayUTC + nextDay;
    const nextDate = new Date(now.getTime() + daysUntil * 86400000);
    const nextOpen = new Date(
      Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate(), 9, 0, 0)
    );
    const diff = nextOpen.getTime() - now.getTime();
    dialogues.push({
      id: "seven-beasts-upcoming",
      text: `Seven Beasts challenge will open in ${formatTimeDiff(diff)}.`,
      color: "#ffffff",
    });
  } else {
    let windowFound = false;
    for (const win of sevenBeastsWindows) {
      const open = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.openH, win.openM, 0)
      );
      const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.startH, win.startM, 0)
      );
      const end = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.endH, win.endM, 0)
      );

      if (now < open) {
        const diff = open.getTime() - now.getTime();
        const color = diff <= 30 * 60 * 1000 ? "#ffd43b" : "#ffffff";
        dialogues.push({
          id: `sb-open-${win.openH}`,
          text: `Seven Beasts gate will open in ${formatTimeDiff(diff)}.`,
          color,
        });
        windowFound = true;
        break;
      }
      if (now >= open && now < start) {
        const diff = start.getTime() - now.getTime();
        dialogues.push({
          id: `sb-enter-${win.openH}`,
          text: `Seven Beasts gate has opened for ${formatTimeDiff(diff)} — enter now!`,
          color: "#51cf66",
        });
        windowFound = true;
        break;
      }
      if (now >= start && now < end) {
        const diff = end.getTime() - now.getTime();
        dialogues.push({
          id: `sb-live-${win.openH}`,
          text: `Seven Beasts challenge is live for ${formatTimeDiff(diff)} — gates closed!`,
          color: "#ff6b6b",
        });
        windowFound = true;
        break;
      }
    }
    if (!windowFound) {
      dialogues.push({
        id: "sb-ended",
        text: "Seven Beasts challenge has ended for today.",
        color: "#ffffff",
      });
    }
  }

  // 5. Yin-Yang Battlefield (Chiến Trường Hắc Bạch / Âm Dương)
  const yinYangWindows = [
    { levelRange: "Lv30-59", openH: 17, openM: 0, startH: 17, startM: 30, endH: 18, endM: 30 },
    { levelRange: "Lv60-89", openH: 19, openM: 0, startH: 19, startM: 30, endH: 20, endM: 30 },
    { levelRange: "Lv90-130", openH: 21, openM: 0, startH: 21, startM: 30, endH: 22, endM: 30 },
  ];

  yinYangWindows.forEach((win) => {
    let open = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.openH, win.openM, 0)
    );
    let start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.startH, win.startM, 0)
    );
    let end = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), win.endH, win.endM, 0)
    );

    // If today's battle window has already concluded, schedule it for tomorrow
    if (now >= end) {
      open = new Date(open.getTime() + 86400000);
      start = new Date(start.getTime() + 86400000);
      end = new Date(end.getTime() + 86400000);
    }

    if (now < open) {
      const diff = open.getTime() - now.getTime();
      const color = diff <= 30 * 60 * 1000 ? "#ffd43b" : "#ffffff";
      dialogues.push({
        id: `yy-${win.levelRange}-soon`,
        text: `Yin-Yang Battlefield ${win.levelRange} will open in ${formatTimeDiff(diff)}.`,
        color,
      });
    } else if (now >= open && now < start) {
      const diff = start.getTime() - now.getTime();
      dialogues.push({
        id: `yy-${win.levelRange}-open`,
        text: `Yin-Yang Battlefield ${win.levelRange} is now open for ${formatTimeDiff(diff)} — enter now!`,
        color: "#51cf66",
      });
    } else if (now >= start && now < end) {
      const diff = end.getTime() - now.getTime();
      dialogues.push({
        id: `yy-${win.levelRange}-live`,
        text: `Yin-Yang Battlefield ${win.levelRange} is live for ${formatTimeDiff(diff)} — door closed!`,
        color: "#ff6b6b",
      });
    }
  });

  return dialogues;
}

export const calculateInceptionUptime = calculateUptime;
export const generateNsoDialogues = generateDialogues;

