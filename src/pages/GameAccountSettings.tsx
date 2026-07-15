import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import fifaLogo from "../assets/squareset/fifasquare.png";
import lolLogo from "../assets/squareset/lolsquare.png";
import pubgLogo from "../assets/squareset/pubgsquare.png";
import valorantLogo from "../assets/squareset/valorantsquare.png";

const games = [
  {
    id: "leagueoflegends",
    name: "리그 오브 레전드",
    logo: lolLogo,
    label: "Riot ID",
    placeholder: "게임이름#태그라인",
  },
  {
    id: "valorant",
    name: "발로란트",
    logo: valorantLogo,
    label: "Riot ID",
    placeholder: "게임이름#태그라인",
  },
  {
    id: "battleground",
    name: "배틀그라운드",
    logo: pubgLogo,
    label: "게임 닉네임",
    placeholder: "배틀그라운드 닉네임",
  },
  {
    id: "fifa",
    name: "FIFA",
    logo: fifaLogo,
    label: "감독명",
    placeholder: "게임 내 감독명",
  },
] as const;

type GameId = (typeof games)[number]["id"];

function GameAccountSettings() {
  const navigate = useNavigate();
  const [openGame, setOpenGame] = useState<GameId | null>("leagueoflegends");
  const [gameIds, setGameIds] = useState<Record<GameId, string>>({
    leagueoflegends: "",
    valorant: "",
    battleground: "",
    fifa: "",
  });
  const [registeredGames, setRegisteredGames] = useState<GameId[]>([]);
  const [savingGame, setSavingGame] = useState<GameId | null>(null);
  const [riotVerificationCode, setRiotVerificationCode] = useState("");

  useEffect(() => {
    api
      .getProfileMe()
      .then((profile) => {
        const riotId = profile.lol_profile?.riot_id;

        if (riotId) {
          setGameIds((current) => ({ ...current, leagueoflegends: riotId }));
          setRegisteredGames(["leagueoflegends"]);
        }
      })
      .catch(() => undefined);
  }, []);

  const handleRegister = async (gameId: GameId) => {
    if (gameId !== "leagueoflegends") {
      alert("이 게임의 아이디 등록 API는 아직 준비되지 않았습니다.");
      return;
    }

    if (!riotVerificationCode.trim()) {
      alert("LoL 클라이언트의 Third Party Code를 입력해주세요.");
      return;
    }

    setSavingGame(gameId);

    try {
      const profile = await api.syncRiotProfile(
        gameIds[gameId].trim(),
        riotVerificationCode.trim(),
      );
      const riotId = profile.lol_profile?.riot_id ?? gameIds[gameId].trim();
      setGameIds((current) => ({ ...current, [gameId]: riotId }));
      setRegisteredGames((current) =>
        current.includes(gameId) ? current : [...current, gameId],
      );
      alert("Riot ID와 티어가 등록되었습니다.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Riot ID 등록에 실패했습니다.");
    } finally {
      setSavingGame(null);
    }
  };

  return (
    <main className="content settings-page game-account-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/settings")}>
          ←
        </button>
        <h1>게임 아이디 등록</h1>
      </header>

      <section className="game-account-list" aria-label="게임별 아이디">
        {games.map((game) => {
          const isOpen = openGame === game.id;

          return (
            <article key={game.id} className="game-account-item">
              <button
                type="button"
                className="game-account-summary"
                aria-expanded={isOpen}
                onClick={() => setOpenGame(isOpen ? null : game.id)}
              >
                <img src={game.logo} alt="" className="game-account-logo" />
                <span className="game-account-name">{game.name}</span>
                <span className="game-account-status">
                  {registeredGames.includes(game.id) ? "등록됨" : "미등록"}
                </span>
                <span className="game-account-chevron" aria-hidden="true">
                  {isOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {isOpen ? (
                <div className="game-account-editor">
                  {game.id === "leagueoflegends" ? (
                    <>
                      <label htmlFor="riot-verification-code">Third Party Code</label>
                      <input
                        id="riot-verification-code"
                        className="game-account-verification"
                        type="text"
                        value={riotVerificationCode}
                        placeholder="LoL 클라이언트 Third Party Code"
                        autoCapitalize="none"
                        autoComplete="off"
                        onChange={(event) => setRiotVerificationCode(event.target.value)}
                      />
                    </>
                  ) : null}
                  <label htmlFor={`${game.id}-account`}>{game.label}</label>
                  <div className="game-account-input-row">
                    <input
                      id={`${game.id}-account`}
                      type="text"
                      value={gameIds[game.id]}
                      placeholder={game.placeholder}
                      autoCapitalize="none"
                      autoComplete="off"
                      onChange={(event) =>
                        setGameIds((current) => ({
                          ...current,
                          [game.id]: event.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      disabled={
                        !gameIds[game.id].trim() ||
                        savingGame === game.id ||
                        (game.id === "leagueoflegends" && !riotVerificationCode.trim())
                      }
                      onClick={() => handleRegister(game.id)}
                    >
                      {savingGame === game.id ? "처리 중" : "등록"}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default GameAccountSettings;
