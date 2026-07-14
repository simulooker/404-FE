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

export type ProfileMeResponse = {
  id: number;
  email: string;
  nickname: string;
  discord_id: string | null;
  department: string;
  voice_chat_enable: boolean;
  manner_score: number;
  lol_profile: unknown | null;
};

export type GameSettingsUpdate = {
  tier: string;
  primary_position: string;
  secondary_position: string;
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

export type MatchDetailResponse = {
  id: number;
  game: string;
  status: string;
  accept_deadline: string | null;
  created_at: string;
  confirmed_at: string | null;
  my_accept_status?: string | null;
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

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
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
    return apiRequest<ProfileMeResponse>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },
  getProfileMe() {
    return apiRequest<ProfileMeResponse>("/profile/me");
  },
  updateGameSettings(payload: GameSettingsUpdate) {
    return apiRequest<ProfileMeResponse>("/profile/game-settings", {
      method: "PATCH",
      body: payload,
    });
  },
  joinQueue() {
    return apiRequest<QueueJoinResponse>("/match/queue/join", {
      method: "POST",
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
    return apiRequest<MatchDetailResponse>("/match/active");
  },
  getMatch(matchId: number) {
    return apiRequest<MatchDetailResponse>(`/match/${matchId}`);
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
};
