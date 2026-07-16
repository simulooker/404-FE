import { api, type ProfileMeResponse } from "../api/client";

export type GameId = "leagueoflegends" | "valorant" | "battleground" | "fifa";

export type LocalGameAccounts = Partial<Record<Exclude<GameId, "leagueoflegends">, string>>;

export const GAME_ACCOUNT_REQUIRED_MESSAGE =
  "게임 아이디를 등록해주세요.\n(마이페이지 -> 설정 -> 게임 아이디 설정)";

function storageKey(userId: number) {
  return `gameAccounts:${userId}`;
}

export function getLocalGameAccounts(userId: number): LocalGameAccounts {
  try {
    const saved = localStorage.getItem(storageKey(userId));
    return saved ? (JSON.parse(saved) as LocalGameAccounts) : {};
  } catch {
    return {};
  }
}

export function saveLocalGameAccount(
  userId: number,
  gameId: Exclude<GameId, "leagueoflegends">,
  accountId: string,
) {
  const current = getLocalGameAccounts(userId);
  localStorage.setItem(storageKey(userId), JSON.stringify({ ...current, [gameId]: accountId }));
}

export function getGameAccountId(
  profile: ProfileMeResponse,
  gameId: GameId,
  localAccounts = getLocalGameAccounts(profile.id),
) {
  if (gameId === "leagueoflegends") return profile.lol_profile?.riot_id?.trim() ?? "";
  return localAccounts[gameId]?.trim() ?? "";
}

export async function hasRegisteredGameAccount(gameId: GameId) {
  const profile = await api.getProfileMe();
  return Boolean(getGameAccountId(profile, gameId));
}

export function formatLolTier(profile: ProfileMeResponse) {
  const lolProfile = profile.lol_profile;
  if (!lolProfile?.riot_id) return "";
  if (lolProfile.tier === "UN_RANKED") return "언랭크";

  const tier = `${lolProfile.tier.charAt(0)}${lolProfile.tier.slice(1).toLowerCase()}`;
  return `${tier}${lolProfile.rank_division ? ` ${lolProfile.rank_division}` : ""}`;
}
