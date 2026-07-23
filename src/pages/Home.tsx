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

function getRankLabel(gameId: GameId, rank: number | null, isLoading: boolean) {
  if (gameId !== "leagueoflegends") return "랭킹 정보 없음";
  if (isLoading) return "순위 불러오는 중";
  return rank ? `랭킹 ${rank}위` : "랭킹 정보 없음";
}

function getRequestFailureLabel(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("credential") || message.includes("authenticated")) {
    return "로그인 정보 확인 필요";
  }

  return fallback;
}

function Home() {
  const navigate = useNavigate();
  const [myRank, setMyRank] = useState<number | null>(null);
  const [isRankingLoading, setIsRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number> | null>(null);
  const [isOnlineLoading, setIsOnlineLoading] = useState(true);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    api.getMyRanking()
      .then((response) => {
        if (isMounted) {
          setMyRank(response.rank);
          setRankingError(null);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMyRank(null);
          setRankingError(getRequestFailureLabel(error, "랭킹 정보 없음"));
        }
      })
      .finally(() => {
        if (isMounted) setIsRankingLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
          <h1 style={{ marginLeft: "-20px", fontSize: "30px", fontWeight: 800, lineHeight: 1 }}>
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
          const gameId = game.id as GameId;
          const isFifa = gameId === "fifa";
          const onlineCount = onlineCounts?.[onlineGameKeys[gameId]];
          const rankLabel = rankingError ?? getRankLabel(gameId, myRank, isRankingLoading);
          const onlineLabel = isOnlineLoading
            ? "인원 불러오는 중"
            : onlineError ?? `${onlineCount ?? 0}명 플레이 중`;

          return (
            <button
              key={game.name}
              className="card"
              type="button"
              onClick={() => void handleGameSelect(gameId)}
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
                  inset: 0,
                  background: "linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.65))",
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "14px 9px",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: 800,
                    textShadow: "0 1px 8px rgba(0,0,0,0.35)",
                  }}
                >
                  {game.name}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "2px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "12px",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    textShadow: "0 1px 8px rgba(0,0,0,0.45)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{rankLabel}</span>
                  <span>{onlineLabel}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

export default Home;
