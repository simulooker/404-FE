import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const teammates = [
  { id: "user-1", name: "닉네임", bg: bg1, profile: profile1 },
  { id: "user-2", name: "닉네임", bg: bg2, profile: profile2 },
  { id: "user-3", name: "닉네임", bg: bg3, profile: profile3 },
  { id: "user-4", name: "닉네임", bg: bg4, profile: profile4 },
];

function GameResult() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRating = (memberId: string, rating: number) => {
    setRatings((current) => ({ ...current, [memberId]: rating }));
  };

  return (
    <main className="content game-result-page">
      <section className="game-result-brand">
        <div className="game-result-brand__mark">
          <img src={justLogo} alt="GameLink 로고" />
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

      <section className="game-result-score" aria-label="게임 결과">
        <img src={trophy} alt="" className="game-result-score__trophy" />
        <div>
          <strong>승리</strong>
          <span>5:3</span>
        </div>
      </section>

      <section className="game-result-ratings" aria-label="팀원 별점">
        {teammates.map((member) => {
          const rating = ratings[member.id] ?? 0;

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

      <button className="gradient-btn game-result-exit" type="button" onClick={() => navigate("/home")}>
        나가기
      </button>
    </main>
  );
}

export default GameResult;
