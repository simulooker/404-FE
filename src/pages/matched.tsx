import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  api,
  type AcceptStatusResponse,
  type MatchMemberSummary,
} from "../api/client";
import discordIcon from "../assets/matched/discord.png";
import micIcon from "../assets/matched/mic.png";
import micOffIcon from "../assets/matched/micoff.png";
import starIcon from "../assets/matched/Star.png";
import trophyIcon from "../assets/matched/Trophy.png";
import bg1 from "../assets/profile/background/basic1.png";
import bg2 from "../assets/profile/background/basic2.png";
import bg3 from "../assets/profile/background/basic3.png";
import bg4 from "../assets/profile/background/basic4.png";
import profile1 from "../assets/profile/roundprofile/basic1.png";
import profile2 from "../assets/profile/roundprofile/basic2.png";
import profile3 from "../assets/profile/roundprofile/basic3.png";
import profile4 from "../assets/profile/roundprofile/basic4.png";

const backgrounds = [bg1, bg2, bg3, bg4];
const profiles = [profile1, profile2, profile3, profile4];

const demoMembers: MatchMemberSummary[] = [
  {
    user_id: 1,
    nickname: "닉네임",
    college: "전남대학교",
    department: "물리학과",
    manner_score: 4.8,
    voice_chat_enable: true,
    tier: "Gold III",
    position: "MID",
    assigned_role: "MID",
    play_styles: null,
    accept_status: "pending",
  },
  {
    user_id: 2,
    nickname: "닉네임",
    college: "전남대학교",
    department: "물리학과",
    manner_score: 4.5,
    voice_chat_enable: true,
    tier: "Gold II",
    position: "TOP",
    assigned_role: "TOP",
    play_styles: null,
    accept_status: "pending",
  },
  {
    user_id: 3,
    nickname: "닉네임",
    college: "전남대학교",
    department: "물리학과",
    manner_score: 4.7,
    voice_chat_enable: false,
    tier: "Gold I",
    position: "ADC",
    assigned_role: "ADC",
    play_styles: null,
    accept_status: "pending",
  },
  {
    user_id: 4,
    nickname: "닉네임",
    college: "전남대학교",
    department: "물리학과",
    manner_score: 4.6,
    voice_chat_enable: true,
    tier: "Gold III",
    position: "SUPPORT",
    assigned_role: "SUPPORT",
    play_styles: null,
    accept_status: "pending",
  },
];

type ResultType = "win" | "lose";

function isAccepted(status: string) {
  return ["accepted", "accept", "ACCEPTED", "수락"].includes(status);
}

function Matched() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedGame = searchParams.get("game") || "leagueoflegends";
  const matchIdParam = searchParams.get("matchId");
  const matchId = matchIdParam ? Number(matchIdParam) : null;
  const [members, setMembers] = useState<MatchMemberSummary[]>(demoMembers);
  const [acceptStatus, setAcceptStatus] = useState<AcceptStatusResponse | null>(null);
  const [demoAccepted, setDemoAccepted] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const isReturningToQueue = useRef(false);
  const allAccepted = acceptStatus?.all_accepted ?? demoAccepted;

  const returnToQueueAfterDecline = useCallback(async () => {
    if (isReturningToQueue.current) return;

    isReturningToQueue.current = true;
    alert("다른 사용자가 매칭을 거절했습니다. 다시 대기열을 찾습니다.");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      let queueStatus = await api.getQueueStatus();

      if (!queueStatus.in_queue) {
        try {
          await api.joinQueue();
        } catch {
          queueStatus = await api.getQueueStatus();

          if (!queueStatus.in_queue) {
            throw new Error("대기열 재참가에 실패했습니다.");
          }
        }
      }

      navigate(`/matching?game=${selectedGame}`, { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "대기열 재참가에 실패했습니다.");
      navigate("/home", { replace: true });
    }
  }, [navigate, selectedGame]);

  const loadMatchData = useCallback(async () => {
    if (!matchId) return;

    const [memberData, statusData] = await Promise.all([
      api.getMatchMembers(matchId),
      api.getAcceptStatus(matchId),
    ]);

    if (statusData.declined_count > 0) {
      void returnToQueueAfterDecline();
      return;
    }

    setMembers(memberData.members);
    setAcceptStatus(statusData);
  }, [matchId, returnToQueueAfterDecline]);

  useEffect(() => {
    if (!matchId) return;

    const initialLoadId = window.setTimeout(() => {
      void loadMatchData();
    }, 0);
    const pollingId = window.setInterval(() => {
      void loadMatchData();
    }, 3000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(pollingId);
    };
  }, [loadMatchData, matchId]);

  const handleAccept = async () => {
    if (isResponding) return;

    if (!matchId) {
      setDemoAccepted(true);
      setMembers((current) =>
        current.map((member) => ({ ...member, accept_status: "accepted" })),
      );
      return;
    }

    setIsResponding(true);

    try {
      await api.acceptMatch(matchId);
      await loadMatchData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "매칭 수락에 실패했습니다.");
    } finally {
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    if (isResponding) return;

    if (!matchId) {
      alert("거절되었습니다.");
      navigate("/home");
      return;
    }

    setIsResponding(true);

    try {
      await api.declineMatch(matchId);

      try {
        await api.leaveQueue();
      } catch {
        // 거절 API에서 이미 대기열을 제거한 경우에는 그대로 진행합니다.
      }

      alert("거절되었습니다.");
      navigate("/home", { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "매칭 거절에 실패했습니다.");
      setIsResponding(false);
    }
  };

  const goToResultFade = async (result: ResultType) => {
    if (isResponding) return;

    setIsResponding(true);

    try {
      if (matchId) {
        await api.completeMatch(matchId);
      }

      const matchQuery = matchId ? `&matchId=${matchId}` : "";
      navigate(`/game-result-fade?game=${selectedGame}&result=${result}${matchQuery}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게임 완료 처리에 실패했습니다.");
      setIsResponding(false);
    }
  };

  return (
    <main className="content matched-page">
      <header className="matched-header">
        <div className="matched-title-row">
          <h1>{allAccepted ? "준비 완료" : "매칭 완료!"}</h1>
          {allAccepted ? (
            <div className="matched-temp-actions">
              <button
                className="matched-temp-done"
                type="button"
                disabled={isResponding}
                onClick={() => goToResultFade("win")}
              >
                임시 승리
              </button>
              <button
                className="matched-temp-done matched-temp-done--lose"
                type="button"
                disabled={isResponding}
                onClick={() => goToResultFade("lose")}
              >
                임시 패배
              </button>
            </div>
          ) : null}
        </div>
        <p>{allAccepted ? "모든 팀원이 수락을 완료했어요" : "함께 플레이할 팀원을 찾았어요"}</p>
      </header>

      <section className="matched-team" aria-label="매칭된 팀원">
        {members.map((member, index) => {
          const accepted = isAccepted(member.accept_status);
          const bg = backgrounds[index % backgrounds.length];
          const profile = profiles[index % profiles.length];

          return (
            <article className="matched-card" key={member.user_id}>
              <img src={bg} alt="" className="matched-card__bg" />
              <div className="matched-card__shade" />
              <img src={profile} alt="" className="matched-card__profile" />
              {member.play_styles?.includes("discord") ? (
                <img src={discordIcon} alt="디스코드 사용 가능" className="matched-card__discord" />
              ) : null}

              <div className="matched-card__info">
                <div className="matched-card__name-row">
                  <strong>{member.nickname}</strong>
                  <img
                    src={member.voice_chat_enable ? micIcon : micOffIcon}
                    alt={member.voice_chat_enable ? "마이크 켜짐" : "마이크 꺼짐"}
                    className="matched-card__mic-inline"
                  />
                </div>

                <div className="matched-card__stats">
                  <span>
                    <img src={trophyIcon} alt="" />
                    {member.tier}
                  </span>
                  <span>
                    <img src={starIcon} alt="" className="matched-card__star" />
                    {member.manner_score.toFixed(1)}
                  </span>
                </div>
              </div>

              {accepted ? <div className="matched-card__accepted">수락완료</div> : null}
            </article>
          );
        })}
      </section>

      <div className="matched-actions">
        <button
          className="matched-reject"
          type="button"
          disabled={isResponding}
          onClick={handleDecline}
        >
          거절
        </button>
        <button
          className="gradient-btn matched-accept"
          type="button"
          disabled={isResponding}
          onClick={handleAccept}
        >
          수락
        </button>
      </div>
    </main>
  );
}

export default Matched;
