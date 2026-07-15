import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type ProfileMeResponse } from "../api/client";
import justLogo from "../assets/justlogo.png";
import mascot from "../assets/mascot.png";
import background from "../assets/mypage/mypagebackground.png";
import profile from "../assets/mypage/profile.png";
import settingIcon from "../assets/mypage/setting.png";
import { getProfilePreferences } from "../utils/preferences";
import { getProfileAvatar } from "../utils/profileAvatars";

type MatchCardMember = {
  userId: number;
  nickname: string;
  avatar: string;
};

type MatchCard = {
  id: number | string;
  result: string;
  emoji: string;
  time: string;
  game: string;
  bg: string;
  members: MatchCardMember[];
};

function formatRelativeTime(value: string | null) {
  if (!value) return "시간 정보 없음";

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));

  if (elapsedMinutes < 1) return "방금 전";
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}시간 전`;

  return `${Math.floor(elapsedHours / 24)}일 전`;
}

function MyPage() {
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState<ProfileMeResponse | null>(null);
  const [profilePreferences] = useState(getProfilePreferences);
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);

  useEffect(() => {
    let isMounted = true;
    const profileRequest = api.getProfileMe();

    profileRequest
      .then((profileData) => {
        if (isMounted) {
          setProfileInfo(profileData);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProfileInfo(null);
        }
      });

    Promise.all([profileRequest, api.getMatchHistory()])
      .then(async ([currentProfile, history]) => {
        if (!isMounted) return;

        const cards = await Promise.all(
          history.items.map(async (item) => {
            let members: MatchCardMember[];

            try {
              const memberData = await api.getMatchMembers(item.match_id);
              members = memberData.members
                .filter((member) => member.user_id !== currentProfile.id)
                .map((member) => ({
                  userId: member.user_id,
                  nickname: member.nickname,
                  avatar: getProfileAvatar(member.user_id),
                }));
            } catch {
              members = [];
            }

            return {
            id: item.match_id,
            result: item.status === "completed" ? "게임 완료" : "매칭 확정",
            emoji: item.status === "completed" ? "🏆" : "",
            time: formatRelativeTime(item.completed_at ?? item.confirmed_at),
            game: item.game === "lol" ? "리그오브레전드" : item.game,
            bg:
              item.status === "completed"
                ? "#b7cff4"
                : "linear-gradient(180deg, #cfd8e8 0%, #9fb0ca 100%)",
              members,
            };
          }),
        );

        if (isMounted) {
          setMatchCards(cards);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="content mypage-page">
      <section className="mypage-brand-row">
        <div className="mypage-brand-mark">
          <img src={justLogo} alt="GameLink 로고" className="mypage-brand-mark__img" />
        </div>
        <h1 className="mypage-brand-title">
          <span className="mypage-brand-title__game">Game</span>
          <span className="mypage-brand-title__link">Match</span>
        </h1>
      </section>

      <section className="mypage-body">
        <div className="mypage-mascot-overlap">
          <img src={mascot} alt="" className="mypage-hero__mascot" />
        </div>

        <div className="mypage-profile-overlap">
          <div className="mypage-profile__avatar">
            <img src={profile} alt="프로필" className="mypage-profile__avatar-img" />
          </div>
        </div>

        <section className="mypage-hero">
          <img src={background} alt="" className="mypage-hero__bg" />
          <button
            type="button"
            className="mypage-hero__setting"
            aria-label="설정"
            onClick={() => navigate("/settings")}
          >
            <img src={settingIcon} alt="" className="mypage-hero__setting-icon" />
          </button>

          <div className="mypage-profile">
            <h2 className="mypage-profile__name">
              {profilePreferences.nickname || profileInfo?.nickname || "닉네임"}
            </h2>
            <p className="mypage-profile__meta">
              {profilePreferences.department || profileInfo?.department || "물리학과"}{" "}
              <span className="mypage-profile__star">★</span>{" "}
              {profileInfo?.manner_score?.toFixed(1) ?? "4.5"}
            </p>
            <div className="mypage-tags">
              {(profileInfo?.lol_profile?.play_styles ?? profilePreferences.playStyleTags).map((tag) => (
                <span key={tag} className="mypage-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <section className="mypage-matches" aria-label="최근 전적">
            {matchCards.length === 0 ? (
              <p className="mypage-matches__empty">아직 표시할 전적이 없어요.</p>
            ) : matchCards.map((card) => (
              <article
                key={card.id}
                className="mypage-match-card"
                style={{ background: card.bg }}
              >
                <div className="mypage-match-card__header">
                  <div className="mypage-match-card__title">
                    <span>{card.result}</span>
                    {card.emoji ? <span className="mypage-match-card__emoji">{card.emoji}</span> : null}
                  </div>
                  <div className="mypage-match-card__meta">
                    <span>{card.time}</span>
                    <span className="mypage-match-card__game">{card.game}</span>
                  </div>
                </div>
                <div className="mypage-match-card__members" aria-label="함께한 팀원">
                  {card.members.map((member) => (
                    <button
                      key={member.userId}
                      type="button"
                      className="mypage-match-card__member"
                      aria-label={`${member.nickname} 프로필 보기`}
                      onClick={() =>
                        navigate(`/member-profile?matchId=${card.id}&userId=${member.userId}`)
                      }
                    >
                      <img src={member.avatar} alt="" />
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
}

export default MyPage;
