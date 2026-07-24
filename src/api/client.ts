const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "/api" : "https://gamematch-be.onrender.com");

const TOKEN_KEY = "userToken";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  nickname: string;
  password: string;
  college: string;
  department: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type MessageResponse = {
  message: string;
};

export type VerifyEmailResponse = {
  message: string;
  is_verified: boolean;
};

export type ProfileMeResponse = {
  id: number;
  email: string;
  nickname: string;
  discord_id: string | null;
  college: string;
  department: string;
  voice_chat_enable: boolean;
  manner_score: number;
  lol_profile: LolProfileResponse | null;
};

export type LolProfileResponse = {
  tier: string;
  primary_position: string;
  secondary_position: string;
  play_styles: string[] | null;
  tier_rank: number;
  rank_division: string | null;
  league_points: number | null;
  riot_id: string | null;
  tier_updated_at: string | null;
  updated_at: string | null;
};

export type ProfileMeUpdate = {
  discord_id?: string | null;
  department?: string | null;
  voice_chat_enable?: boolean | null;
};

export type GameSettingsUpdate = {
  primary_position: string;
  secondary_position: string;
  play_styles: string[];
  riot_id?: string | null;
  sync_tier_from_riot?: boolean;
};

export type QueueGameMode = "SOLO" | "FLEX" | "Howling Abyss";

export type QueueJoinRequest = {
  game_mode: QueueGameMode;
};

export type QueueJoinResponse = {
  id: number;
  game: string;
  tier: string;
  tier_rank: number;
  position: string;
  play_styles: string[] | null;
  status: string;
  joined_at: string;
};

export type QueueStatusResponse = {
  in_queue: boolean;
  match_id: number | null;
  match_status: string | null;
  status: string | null;
  game: string | null;
  tier: string | null;
  tier_rank: number | null;
  position: string | null;
  elapsed_seconds: number;
  allowed_tier_delta: number;
  waiting_count: number;
  message: string | null;
};

export type ActiveMatchResponse = {
  id: number;
  game: string;
  status: string;
};

export type MatchCompleteResponse = {
  id: number;
  status: string;
  completed_at: string | null;
  result_status: string | null;
};

export type MatchMemberSummary = {
  user_id: number;
  nickname: string;
  college: string;
  department: string;
  manner_score: number;
  voice_chat_enable: boolean;
  tier: string;
  position: string;
  assigned_role: string;
  play_styles: string[] | null;
  accept_status: string;
  riot_id?: string | null;
  fc_online_nickname?: string | null;
};

export type MatchMembersResponse = {
  match_id: number;
  status: string;
  members: MatchMemberSummary[];
};

export type AcceptStatusResponse = {
  match_id: number;
  status: string;
  accept_deadline: string | null;
  accepted_count: number;
  pending_count: number;
  declined_count: number;
  seconds_remaining: number;
  all_accepted: boolean;
};

export type MatchActionResponse = {
  match_id: number;
  status: string;
  my_accept_status: string;
  message: string;
};

export type QuickMessagePreset =
  | "게임 시작할게요"
  | "한 판 더 하실래요?"
  | "저는 잠시 휴식할게요."
  | "저는 여기까지 하겠습니다."
  | "감사합니다";

export type QuickMessageItem = {
  id: number;
  match_id: number;
  user_id: number;
  nickname: string;
  message: QuickMessagePreset;
  created_at: string;
};

export type QuickMessageListResponse = {
  total: number;
  items: QuickMessageItem[];
};

export type MatchEvaluationItem = {
  target_user_id: number;
  manner_delta: -1 | 0 | 1;
};

export type MatchEvaluateResponse = {
  match_id: number;
  submitted_count: number;
  message: string;
};

export type MatchHistoryItem = {
  match_id: number;
  game: string;
  status: string;
  my_assigned_role: string;
  my_tier: string;
  member_count: number;
  confirmed_at: string | null;
  completed_at: string | null;
  evaluation_submitted: boolean;
};

export type MatchHistoryResponse = {
  total: number;
  items: MatchHistoryItem[];
};

export type MyRankingResponse = {
  user_id: number;
  rank: number | null;
  total_players?: number | null;
  percentile?: number | null;
  message?: string | null;
};

export type RankingEntry = {
  rank: number;
  user_id: number;
  nickname: string;
  manner_score: number;
  tier: string;
  tier_rank: number;
  primary_position: string;
  rank_division: string | null;
  league_points: number | null;
  riot_id?: string | null;
};

export type RankingListResponse = {
  total: number;
  limit: number;
  offset: number;
  items: RankingEntry[];
};

export type GameOnlineCount = {
  game: string;
  waiting_count: number;
  in_match_count: number;
  online_count: number;
};

export type OnlineCountsResponse = {
  games: GameOnlineCount[];
};

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token: string) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

function leaveQueueOnPageClose() {
  const token = getAccessToken();

  if (!token) return;

  void fetch(`${API_BASE_URL}/match/queue/leave`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    keepalive: true,
  }).catch(() => undefined);
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.message ??
      data?.detail?.[0]?.msg ??
      data?.detail ??
      "요청을 처리하지 못했습니다.";

    throw new Error(typeof message === "string" ? message : "요청을 처리하지 못했습니다.");
  }

  return data as T;
}

export const api = {
  login(payload: LoginRequest) {
    return apiRequest<TokenResponse>("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  register(payload: RegisterRequest) {
    return apiRequest<MessageResponse>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  resendVerification(email: string) {
    return apiRequest<MessageResponse>("/auth/resend-verification", {
      method: "POST",
      body: { email },
      auth: false,
    });
  },
  verifyEmail(token: string) {
    return apiRequest<VerifyEmailResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      auth: false,
    });
  },
  getProfileMe() {
    return apiRequest<ProfileMeResponse>("/profile/me");
  },
  updateProfileMe(payload: ProfileMeUpdate) {
    return apiRequest<ProfileMeResponse>("/profile/me", {
      method: "PATCH",
      body: payload,
    });
  },
  updateGameSettings(payload: GameSettingsUpdate) {
    return apiRequest<ProfileMeResponse>("/profile/game-settings", {
      method: "PATCH",
      body: payload,
    });
  },
  syncRiotProfile(riotId: string) {
    return apiRequest<ProfileMeResponse>("/profile/riot/sync", {
      method: "POST",
      body: { riot_id: riotId },
    });
  },
  refreshRiotTier() {
    return apiRequest<ProfileMeResponse>("/profile/riot/refresh", {
      method: "POST",
    });
  },
  joinQueue(payload: QueueJoinRequest) {
    return apiRequest<QueueJoinResponse>("/match/queue/join", {
      method: "POST",
      body: payload,
    });
  },
  getQueueStatus() {
    return apiRequest<QueueStatusResponse>("/match/queue/status");
  },
  leaveQueue() {
    return apiRequest<void>("/match/queue/leave", {
      method: "DELETE",
    });
  },
  leaveQueueOnPageClose,
  getActiveMatch() {
    return apiRequest<ActiveMatchResponse | null>("/match/active");
  },
  getMatch(matchId: number) {
    return apiRequest<ActiveMatchResponse>(`/match/${matchId}`);
  },
  getMatchHistory(limit = 20, offset = 0) {
    return apiRequest<MatchHistoryResponse>(`/match/history?limit=${limit}&offset=${offset}`);
  },
  getMyRanking() {
    return apiRequest<MyRankingResponse>("/ranking/me");
  },
  getLolRanking(limit = 100, offset = 0) {
    return apiRequest<RankingListResponse>(
      `/ranking/lol?limit=${limit}&offset=${offset}`,
    );
  },
  getOnlineCounts() {
    return apiRequest<OnlineCountsResponse>("/match/online");
  },
  getMatchMembers(matchId: number) {
    return apiRequest<MatchMembersResponse>(`/match/${matchId}/members`);
  },
  getAcceptStatus(matchId: number) {
    return apiRequest<AcceptStatusResponse>(`/match/${matchId}/accept-status`);
  },
  acceptMatch(matchId: number) {
    return apiRequest<MatchActionResponse>(`/match/${matchId}/accept`, {
      method: "POST",
    });
  },
  declineMatch(matchId: number) {
    return apiRequest<MatchActionResponse>(`/match/${matchId}/decline`, {
      method: "POST",
    });
  },
  getQuickMessages(matchId: number) {
    return apiRequest<QuickMessageListResponse>(`/match/${matchId}/quick-messages`);
  },
  sendQuickMessage(matchId: number, message: QuickMessagePreset) {
    return apiRequest<QuickMessageItem>(`/match/${matchId}/quick-messages`, {
      method: "POST",
      body: { message },
    });
  },
  completeMatch(matchId: number) {
    return apiRequest<MatchCompleteResponse>(`/match/${matchId}/complete`, {
      method: "POST",
    });
  },
  evaluateMatch(matchId: number, evaluations: MatchEvaluationItem[]) {
    return apiRequest<MatchEvaluateResponse>(`/match/${matchId}/evaluate`, {
      method: "POST",
      body: { evaluations },
    });
  },
};
