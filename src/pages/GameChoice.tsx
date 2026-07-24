import { useNavigate } from "react-router-dom";
import leagueImg from "../assets/gamechoice/leagueoflegends.png";
import valorantImg from "../assets/gamechoice/valorant.png";
import battlegroundImg from "../assets/gamechoice/battleground.png";
import fifaImg from "../assets/gamechoice/fifa.png";
import {
  GAME_ACCOUNT_REQUIRED_MESSAGE,
  hasRegisteredGameAccount,
  type GameId,
} from "../utils/gameAccounts";

const games = [
  { id: "leagueoflegends", name: "LEAGUE OF LEGENDS", image: leagueImg },
  { id: "valorant", name: "VALORANT", image: valorantImg },
  { id: "battleground", name: "PUBG", image: battlegroundImg },
  { id: "fifa", name: "FIFA", image: fifaImg },
];

function GameChoice() {
  const navigate = useNavigate();

  const handleGameSelect = async (gameId: GameId) => {
    try {
      if (!(await hasRegisteredGameAccount(gameId))) {
        alert(GAME_ACCOUNT_REQUIRED_MESSAGE);
        return;
      }
      navigate(`/match-setting?game=${gameId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "게임 계정 정보를 확인하지 못했습니다.");
    }
  };

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
            onClick={() => void handleGameSelect(game.id as GameId)}
            aria-label={game.name}
          >
            <img src={game.image} alt="" className="gamechoice-image" />
          </button>
        ))}
      </section>

    </main>
  );
}

export default GameChoice;
