import { useNavigate } from "react-router-dom";
import justLogo from "../assets/justlogo.png";
import mascot from "../assets/mascot.png";
import mascotRound from "../assets/mascotround.png";

function Matching() {
  const navigate = useNavigate();

  return (
    <main className="content matching-page">
      <button
        className="matching-temp-button"
        type="button"
        onClick={() => navigate("/matched")}
      >
        임시
      </button>

      <header className="matching-brand">
        <img src={justLogo} alt="GameLink 로고" className="matching-brand__logo" />
        <h1 className="matching-brand__title">
          <span className="matching-brand__game">Game</span>
          <span className="matching-brand__link">Link</span>
        </h1>
      </header>

      <section className="matching-copy">
        <h2>매칭 중..</h2>
        <p>
          실력과 성향을 분석하여
          <br />
          적합한 상대를 찾고 있어요
        </p>
      </section>

      <section className="matching-visual" aria-label="매칭 진행 중">
        <img src={mascotRound} alt="" className="matching-visual__round" />
        <img src={mascot} alt="GameLink 마스코트" className="matching-visual__mascot" />
      </section>

      <section className="matching-time">
        <p className="matching-time__current">00:05</p>
        <p className="matching-time__expected">예상 대기 시간 0:23</p>
      </section>

      <button
        className="gradient-btn matching-exit"
        type="button"
        onClick={() => navigate("/home")}
      >
        대기열 나가기
      </button>
    </main>
  );
}

export default Matching;
