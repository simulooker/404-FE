import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import justLogo from "../assets/justlogo.png";
import lolImg from "../assets/squareset/lolsquare.png";
import valorantImg from "../assets/squareset/valorantsquare.png";
import pubgImg from "../assets/squareset/pubgsquare.png";
import fifaImg from "../assets/squareset/fifasquare.png";
import {
  GAME_ACCOUNT_REQUIRED_MESSAGE,
  hasRegisteredGameAccount,
  type GameId,
} from "../utils/gameAccounts";

const games = [
  { id: "leagueoflegends", name: "LEAGUE OF LEGENDS", image: lolImg },
  { id: "valorant", name: "VALORANT", image: valorantImg },
  { id: "battleground", name: "PUBG", image: pubgImg },
  { id: "fifa", name: "FIFA", image: fifaImg },
];

const onlineGameKeys: Record<GameId, string> = {
  leagueoflegends: "lol",
  valorant: "valorant",
  battleground: "pubg",
  fifa: "fc_online",
};

function getRequestFailureLabel(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("credential") || message.includes("authenticated")) {
    return "로그인 정보 확인 필요";
  }

  return fallback;
}

function Home() {
  const navigate = useNavigate();
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number> | null>(null);
  const [isOnlineLoading, setIsOnlineLoading] = useState(true);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOnlineCounts = () => {
      api.getOnlineCounts()
        .then((response) => {
          if (!isMounted) return;

          setOnlineCounts(
            Object.fromEntries(response.games.map((game) => [game.game, game.online_count])),
          );
          setOnlineError(null);
        })
        .catch((error) => {
          if (isMounted) {
            setOnlineCounts(null);
            setOnlineError(getRequestFailureLabel(error, "인원 정보 없음"));
          }
        })
        .finally(() => {
          if (isMounted) setIsOnlineLoading(false);
        });
    };

    loadOnlineCounts();
    const pollingId = window.setInterval(loadOnlineCounts, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(pollingId);
    };
  }, []);

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
    <main className="content home-page">
      <header className="home-header">
        <div className="home-brand">
          <img src={justLogo} alt="GameLink 로고" />
          <h1><span>Game</span><strong>Link</strong></h1>
        </div>
        <p>오늘은 무슨 게임을 하실건가요?</p>
      </header>

      <section className="home-game-grid" aria-label="게임 선택">
        {games.map((game) => {
          const gameId = game.id as GameId;
          const onlineCount = onlineCounts?.[onlineGameKeys[gameId]];
          const onlineLabel = isOnlineLoading
            ? "인원 불러오는 중"
            : onlineError ?? `${onlineCount ?? 0}명 플레이 중`;

          return (
            <button
              key={game.name}
              className="home-game-card"
              type="button"
              onClick={() => void handleGameSelect(gameId)}
            >
              <img
                src={game.image}
                alt=""
                className={`home-game-card__image${gameId === "fifa" ? " home-game-card__image--fifa" : ""}`}
              />
              <span className="home-game-card__shade" />
              <span className="home-game-card__name">{game.name}</span>
              <span className="home-game-card__online">{onlineLabel}</span>
            </button>
          );
        })}
      </section>

      <button className="gradient-btn home-ranking-button" type="button" onClick={() => navigate("/ranking")}>
        랭킹 보기
      </button>
    </main>
  );
}

export default Home;
