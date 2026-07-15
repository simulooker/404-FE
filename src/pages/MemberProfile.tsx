import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, type MatchMemberSummary } from "../api/client";
import justLogo from "../assets/justlogo.png";
import { getProfileAvatar } from "../utils/profileAvatars";

function MemberProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const matchId = Number(searchParams.get("matchId"));
  const userId = Number(searchParams.get("userId"));
  const hasValidParams = Boolean(matchId && userId);
  const [member, setMember] = useState<MatchMemberSummary | null>(null);
  const [isLoading, setIsLoading] = useState(hasValidParams);

  useEffect(() => {
    if (!hasValidParams) return;

    let isMounted = true;

    api
      .getMatchMembers(matchId)
      .then((memberData) => {
        if (isMounted) {
          setMember(memberData.members.find((item) => item.user_id === userId) ?? null);
        }
      })
      .catch(() => {
        if (isMounted) setMember(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hasValidParams, matchId, userId]);

  return (
    <main className="content member-profile-page">
      <header className="settings-header member-profile-header">
        <button type="button" className="settings-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>프로필</h1>
      </header>

      {isLoading ? (
        <p className="member-profile-message">프로필을 불러오는 중입니다.</p>
      ) : member ? (
        <>
          <section className="member-profile-hero">
            <img src={justLogo} alt="" className="member-profile-brand" />
            <img
              src={getProfileAvatar(member.user_id)}
              alt={`${member.nickname} 프로필`}
              className="member-profile-avatar"
            />
            <h2>{member.nickname}</h2>
            <p>
              {member.college} · {member.department}
            </p>
          </section>

          <dl className="member-profile-details">
            <div>
              <dt>매너 점수</dt>
              <dd>★ {member.manner_score.toFixed(1)}</dd>
            </div>
            <div>
              <dt>티어</dt>
              <dd>{member.tier}</dd>
            </div>
            <div>
              <dt>포지션</dt>
              <dd>{member.assigned_role || member.position}</dd>
            </div>
            <div>
              <dt>음성 채팅</dt>
              <dd>{member.voice_chat_enable ? "가능" : "사용 안 함"}</dd>
            </div>
          </dl>

          <section className="member-profile-tags" aria-label="플레이스타일 태그">
            {(member.play_styles ?? []).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </section>
        </>
      ) : (
        <p className="member-profile-message">프로필 정보를 찾을 수 없습니다.</p>
      )}
    </main>
  );
}

export default MemberProfile;
