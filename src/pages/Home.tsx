import { useNavigate } from "react-router-dom";
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
  {
    id: "leagueoflegends",
    name: "LEAGUE OF LEGENDS",
    image: lolImg,
  },
  {
    id: "valorant",
    name: "VALORANT",
    image: valorantImg,
  },
  {
    id: "battleground",
    name: "PUBG",
    image: pubgImg,
  },
  {
    id: "fifa",
    name: "FIFA",
    image: fifaImg,
  },
];

function Home() {
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
    <main className="content" style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
          <img
            src={justLogo}
            alt="GameLink 로고"
            style={{
              marginLeft: "-20px",
              width: "100px",
              height: "100px",
              objectFit: "contain",
            }}
          />
          <h1
            style={{
              marginLeft: "-20px",
              fontSize: "30px",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#111827" }}>Game</span>
            <span
              style={{
                background: "linear-gradient(90deg, #6b5cff 0%, #ff6bd6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Link
            </span>
          </h1>
        </div>

        <p style={{ margin: "12px 10px 0", fontSize: "24px", fontWeight: 700 }}>
          오늘은 무슨 게임을 하실건가요?
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {games.map((game) => {
          const isFifa = game.name === "FIFA";

          return (
          <button
            key={game.name}
            className="card"
            type="button"
            onClick={() => void handleGameSelect(game.id as GameId)}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              border: "none",
              padding: 0,
              cursor: "pointer",
              marginBottom: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${game.image})`,
                backgroundSize: "cover",
                backgroundPosition: isFifa ? "center top" : "center",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.65))",
                zIndex: 2,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "14px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 800,
                  textShadow: "0 1px 8px rgba(0,0,0,0.35)",
                  marginBottom: "20px",
                }}
              >
                {game.name}
              </span>
            </div>
          </button>
          );
        })}
      </div>
    </main>
  );
}

export default Home;
