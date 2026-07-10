import justLogo from "../assets/justlogo.png";
import { useNavigate } from "react-router-dom";
import mascot from "../assets/mascot.png";
import background from "../assets/mypage/mypagebackground.png";
import profile from "../assets/mypage/profile.png";
import settingIcon from "../assets/mypage/setting.png";

const matchCards = [
  { result: "승리", emoji: "🏆", time: "32분 전", bg: "#b7cff4" },
  { result: "패배", emoji: "", time: "1시간 전", bg: "#f3b9bb" },
  { result: "승리", emoji: "🏆", time: "1시간 32분 전", bg: "linear-gradient(180deg, #cfd8e8 0%, #9fb0ca 100%)" },
  { result: "패배", emoji: "", time: "2시간 전", bg: "#f3b9bb" },
  { result: "승리", emoji: "🏆", time: "3시간 전", bg: "#b7cff4" },
];

function MyPage() {
  const navigate = useNavigate();

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
            <h2 className="mypage-profile__name">닉네임</h2>
            <p className="mypage-profile__meta">
              물리학과 <span className="mypage-profile__star">★</span> 4.5
            </p>
            <div className="mypage-tags">
              <span className="mypage-tag">#빡겜러</span>
              <span className="mypage-tag">#즐겜러</span>
            </div>
          </div>

          <section className="mypage-matches" aria-label="최근 전적">
            {matchCards.map((card) => (
              <article
                key={card.result + card.time}
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
                    <span className="mypage-match-card__game">리그오브레전드</span>
                  </div>
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
