import { useNavigate } from "react-router-dom";
import leagueImg from "../assets/gamechoice/leagueoflegends.png";
import valorantImg from "../assets/gamechoice/valorant.png";
import overwatchImg from "../assets/gamechoice/overwatch.png";
import battlegroundImg from "../assets/gamechoice/battleground.png";
import fifaImg from "../assets/gamechoice/fifa.png";

const games = [
  { id: "leagueoflegends", name: "LEAGUE OF LEGENDS", image: leagueImg },
  { id: "valorant", name: "VALORANT", image: valorantImg },
  { id: "overwatch", name: "OVERWATCH", image: overwatchImg },
  { id: "battleground", name: "PUBG", image: battlegroundImg },
  { id: "fifa", name: "FIFA", image: fifaImg },
];

function GameChoice() {
  const navigate = useNavigate();

  return (
    <main className="content gamechoice-page">
      <section className="gamechoice-header">
        <h2 className="gamechoice-title">매칭 조건 설정</h2>
        <div className="gamechoice-divider" />
        <p className="gamechoice-label">
          게임 선택 <span className="gamechoice-required">*</span>
        </p>
      </section>

      <section className="gamechoice-list" aria-label="게임 선택">
        {games.map((game) => (
          <button
            key={game.name}
            type="button"
            className="gamechoice-card"
            onClick={() => navigate(`/match-setting?game=${game.id}`)}
            aria-label={game.name}
          >
            <img src={game.image} alt="" className="gamechoice-image" />
          </button>
        ))}
      </section>

      <button
        type="button"
        className="gamechoice-next"
        onClick={() => navigate("/match-setting?game=leagueoflegends")}
        aria-label="다음"
      >
        →
      </button>
    </main>
  );
}

export default GameChoice;
