export type ProfilePreferences = {
  nickname: string;
  department: string;
  playStyleTags: string[];
  voiceChatEnabled: boolean;
};

export type NotificationPreferences = {
  enabled: boolean;
  matchFound: boolean;
  acceptDeadline: boolean;
  serviceUpdates: boolean;
};

export type DiscordConnection = {
  connected: boolean;
  username: string;
};

const PROFILE_KEY = "gameLinkProfilePreferences";
const NOTIFICATION_KEY = "gameLinkNotificationPreferences";
const DISCORD_KEY = "gameLinkDiscordConnection";

const defaultProfile: ProfilePreferences = {
  nickname: "",
  department: "",
  playStyleTags: [],
  voiceChatEnabled: false,
};

const defaultNotifications: NotificationPreferences = {
  enabled: false,
  matchFound: true,
  acceptDeadline: true,
  serviceUpdates: false,
};

const defaultDiscord: DiscordConnection = {
  connected: false,
  username: "",
};

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? { ...fallback, ...JSON.parse(value) } : fallback;
  } catch {
    return fallback;
  }
}

export function getProfilePreferences() {
  return readStoredValue(PROFILE_KEY, defaultProfile);
}

export function saveProfilePreferences(value: ProfilePreferences) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
}

export function getNotificationPreferences() {
  return readStoredValue(NOTIFICATION_KEY, defaultNotifications);
}

export function saveNotificationPreferences(value: NotificationPreferences) {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(value));
}

export function getDiscordConnection() {
  return readStoredValue(DISCORD_KEY, defaultDiscord);
}

export function saveDiscordConnection(value: DiscordConnection) {
  localStorage.setItem(DISCORD_KEY, JSON.stringify(value));
}
