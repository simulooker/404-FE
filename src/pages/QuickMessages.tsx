import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  api,
  type MatchMemberSummary,
  type QuickMessageItem,
  type QuickMessagePreset,
} from "../api/client";
import justLogo from "../assets/justlogo.png";
import ownProfile from "../assets/mypage/profile.png";
import { getProfileAvatar } from "../utils/profileAvatars";

const quickMessagePresets: QuickMessagePreset[] = [
  "게임 시작할게요",
  "한 판 더 하실래요?",
  "저는 잠시 휴식할게요.",
  "저는 여기까지 하겠습니다.",
  "감사합니다",
];

type DisplayMessage = {
  id: number | string;
  user_id: number;
  nickname: string;
  message: string;
  created_at: string;
  isInviteIntroduction?: boolean;
};

function getGameInviteId(member: MatchMemberSummary, game: string) {
  if (game === "fifa") return member.fc_online_nickname;
  if (game !== "leagueoflegends") return null;

  return member.riot_id;
}

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "방금";

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function QuickMessages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedGame = searchParams.get("game") ?? "leagueoflegends";
  const matchIdParam = searchParams.get("matchId");
  const matchId = matchIdParam ? Number(matchIdParam) : null;
  const [messages, setMessages] = useState<QuickMessageItem[]>([]);
  const [members, setMembers] = useState<MatchMemberSummary[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");

  const isValidMatchId = useMemo(() => Boolean(matchId && Number.isFinite(matchId)), [matchId]);

  const loadMessages = useCallback(async () => {
    if (!isValidMatchId || !matchId) return;

    try {
      const response = await api.getQuickMessages(matchId);
      setMessages(response.items);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "메시지를 불러오지 못했습니다.");
    }
  }, [isValidMatchId, matchId]);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => void loadMessages(), 0);
    const pollingId = window.setInterval(() => void loadMessages(), 3000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(pollingId);
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!isValidMatchId || !matchId) return;

    let isMounted = true;

    api.getMatchMembers(matchId)
      .then((response) => {
        if (isMounted) setMembers(response.members);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [isValidMatchId, matchId]);

  useEffect(() => {
    let isMounted = true;

    api.getProfileMe()
      .then((profile) => {
        if (isMounted) setCurrentUserId(profile.id);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const displayMessages = useMemo<DisplayMessage[]>(() => {
    const inviteIntroductions = members.flatMap((member) => {
      const inviteId = getGameInviteId(member, selectedGame);

      if (!inviteId) return [];

      return [{
        id: `invite-${member.user_id}`,
        user_id: member.user_id,
        nickname: member.nickname,
        message: `제 게임 아이디는 ${inviteId}입니다. 초대해 주세요!`,
        created_at: "",
        isInviteIntroduction: true,
      }];
    });

    return [...inviteIntroductions, ...messages];
  }, [members, messages, selectedGame]);

  const handleSend = async (message: QuickMessagePreset) => {
    if (isSending) return;

    if (!isValidMatchId || !matchId) {
      setError("매칭 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSending(true);

    try {
      const sentMessage = await api.sendQuickMessage(matchId, message);
      setMessages((current) => [...current, sentMessage]);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "메시지 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCompleteMatch = async () => {
    if (!isValidMatchId || !matchId || isCompleting) {
      setError("매칭 정보를 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm("매칭을 마치시겠습니까? 종료 후에는 채팅방으로 돌아올 수 없습니다.")) return;

    setIsCompleting(true);

    try {
      await api.completeMatch(matchId);
      alert("매칭을 종료했습니다.");
      navigate(`/game-result?matchId=${matchId}&result=win`, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "매칭 종료에 실패했습니다.");
      setIsCompleting(false);
    }
  };

  return (
    <main className="content quick-message-page">
      <header className="quick-message-brand">
        <img src={justLogo} alt="GameLink 로고" />
        <h1><span>Game</span><strong>Link</strong></h1>
      </header>

      <section className="quick-message-heading">
        <p>매칭이 완료되었어요</p>
        <h2>팀원에게 메시지를 보내보세요</h2>
      </section>

      <section className="quick-message-list" aria-label="팀 퀵메시지">
        {displayMessages.length === 0 ? (
          <p className="quick-message-empty">첫 메시지를 보내 팀원에게 인사해 보세요.</p>
        ) : displayMessages.map((item) => {
          const isMine = item.user_id === currentUserId;
          const avatar = isMine ? ownProfile : getProfileAvatar(item.user_id);

          return (
            <article className={`quick-message-item${isMine ? " quick-message-item--mine" : ""}`} key={item.id}>
              <img src={avatar} alt="" className="quick-message-avatar" />
              <div className={`quick-message-bubble${item.isInviteIntroduction ? " quick-message-bubble--invite" : ""}`}>
                <strong>{isMine ? "나" : item.nickname}</strong>
                <p>{item.message}</p>
                {!item.isInviteIntroduction ? (
                  <time dateTime={item.created_at}>{formatMessageTime(item.created_at)}</time>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      {error ? <p className="quick-message-error">{error}</p> : null}

      <section className="quick-message-presets" aria-label="빠른 메시지 선택">
        {quickMessagePresets.map((message) => (
          <button
            key={message}
            type="button"
            disabled={isSending || !isValidMatchId}
            onClick={() => void handleSend(message)}
          >
            {message}
          </button>
        ))}
      </section>

      <button
        className="quick-message-complete"
        type="button"
        disabled={isCompleting || !isValidMatchId}
        onClick={() => void handleCompleteMatch()}
      >
        {isCompleting ? "매칭 종료 중..." : "매칭을 마칩니다"}
      </button>
    </main>
  );
}

export default QuickMessages;
