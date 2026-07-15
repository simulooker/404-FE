import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, type MatchEvaluationItem } from "../api/client";
import justLogo from "../assets/justlogo.png";
import trophy from "../assets/trophy.png";
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

type Teammate = {
  id: number | string;
  name: string;
  bg: string;
  profile: string;
};

const demoTeammates: Teammate[] = [
  { id: "user-1", name: "닉네임", bg: bg1, profile: profile1 },
  { id: "user-2", name: "닉네임", bg: bg2, profile: profile2 },
  { id: "user-3", name: "닉네임", bg: bg3, profile: profile3 },
  { id: "user-4", name: "닉네임", bg: bg4, profile: profile4 },
];

function ratingToMannerDelta(rating: number): -1 | 0 | 1 {
  if (rating <= 2) return -1;
  if (rating === 3) return 0;
  return 1;
}

function GameResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const result = searchParams.get("result") === "lose" ? "lose" : "win";
  const matchIdParam = searchParams.get("matchId");
  const matchId = matchIdParam ? Number(matchIdParam) : null;
  const [teammates, setTeammates] = useState<Teammate[]>(demoTeammates);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;

    Promise.all([api.getMatchMembers(matchId), api.getProfileMe()])
      .then(([memberData, profileData]) => {
        if (!isMounted) return;

        setTeammates(
          memberData.members
            .filter((member) => member.user_id !== profileData.id)
            .map((member, index) => ({
              id: member.user_id,
              name: member.nickname,
              bg: backgrounds[index % backgrounds.length],
              profile: profiles[index % profiles.length],
            })),
        );
      })
      .catch(() => {
        if (isMounted) {
          alert("팀원 정보를 불러오지 못했습니다.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [matchId]);

  const handleRating = (memberId: number | string, rating: number) => {
    setRatings((current) => ({ ...current, [String(memberId)]: rating }));
  };

  const handleExit = async () => {
    if (!matchId) {
      navigate("/home");
      return;
    }

    const hasMissingRating = teammates.some((member) => !ratings[String(member.id)]);

    if (hasMissingRating) {
      alert("모든 팀원의 별점을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const evaluations: MatchEvaluationItem[] = teammates.map((member) => ({
        target_user_id: Number(member.id),
        manner_delta: ratingToMannerDelta(ratings[String(member.id)]),
      }));

      await api.evaluateMatch(matchId, evaluations);
      navigate("/home", { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "팀원 평가 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="content game-result-page">
      <section className="game-result-brand">
        <div className="game-result-brand__mark">
          <img src={justLogo} alt="GameMatch 로고" />
        </div>
        <h1 className="game-result-brand__title">
          <span>Game</span>
          <strong>Match</strong>
        </h1>
      </section>

      <section className="game-result-heading">
        <h2>게임 완료</h2>
        <p>
          게임이 완료 되었습니다
          <br />
          별점을 선택해주세요
        </p>
      </section>

      <section className={`game-result-score game-result-score--${result}`} aria-label="게임 결과">
        <img src={trophy} alt="" className="game-result-score__trophy" />
        <div>
          <strong>{result === "win" ? "승리" : "패배"}</strong>
          <span>5:3</span>
        </div>
      </section>

      <section className="game-result-ratings" aria-label="팀원 별점">
        {teammates.map((member) => {
          const rating = ratings[String(member.id)] ?? 0;

          return (
            <article className="game-result-card" key={member.id}>
              <img src={member.bg} alt="" className="game-result-card__bg" />
              <div className="game-result-card__shade" />
              <img src={member.profile} alt="" className="game-result-card__profile" />
              <strong className="game-result-card__name">{member.name}</strong>
              <div className="game-result-stars" aria-label={`${member.name} 별점`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="game-result-star"
                    aria-label={`${star}점`}
                    aria-pressed={star <= rating}
                    onClick={() => handleRating(member.id, star)}
                  >
                    {star <= rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <button
        className="gradient-btn game-result-exit"
        type="button"
        disabled={isSubmitting}
        onClick={handleExit}
      >
        {isSubmitting ? "제출 중" : "나가기"}
      </button>
    </main>
  );
}

export default GameResult;
