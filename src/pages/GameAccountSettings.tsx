import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type ProfileMeResponse } from "../api/client";
import fifaLogo from "../assets/squareset/fifasquare.png";
import lolLogo from "../assets/squareset/lolsquare.png";
import pubgLogo from "../assets/squareset/pubgsquare.png";
import valorantLogo from "../assets/squareset/valorantsquare.png";
import {
  formatLolTier,
  getGameAccountId,
  getLocalGameAccounts,
  saveLocalGameAccount,
  type GameId,
} from "../utils/gameAccounts";

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
  const [profileInfo, setProfileInfo] = useState<ProfileMeResponse | null>(null);
  const [isRefreshingTier, setIsRefreshingTier] = useState(false);

  useEffect(() => {
    api
      .getProfileMe()
      .then((profile) => {
        const localAccounts = getLocalGameAccounts(profile.id);
        setProfileInfo(profile);
        setGameIds({
          leagueoflegends: getGameAccountId(profile, "leagueoflegends", localAccounts),
          valorant: getGameAccountId(profile, "valorant", localAccounts),
          battleground: getGameAccountId(profile, "battleground", localAccounts),
          fifa: getGameAccountId(profile, "fifa", localAccounts),
        });
        setRegisteredGames(
          games
            .map((game) => game.id)
            .filter((gameId) => Boolean(getGameAccountId(profile, gameId, localAccounts))),
        );
      })
      .catch(() => undefined);
  }, []);

  const handleRegister = async (gameId: GameId) => {
    if (gameId !== "leagueoflegends") {
      if (!profileInfo) {
        alert("사용자 정보를 불러온 뒤 다시 시도해주세요.");
        return;
      }

      saveLocalGameAccount(profileInfo.id, gameId, gameIds[gameId].trim());
      setRegisteredGames((current) =>
        current.includes(gameId) ? current : [...current, gameId],
      );
      alert("게임 아이디가 등록되었습니다.");
      return;
    }

    setSavingGame(gameId);

    try {
      const profile = await api.syncRiotProfile(gameIds[gameId].trim());
      const riotId = profile.lol_profile?.riot_id ?? gameIds[gameId].trim();
      setProfileInfo(profile);
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

  const handleRefreshTier = async () => {
    if (!profileInfo?.lol_profile?.riot_id || isRefreshingTier) return;

    setIsRefreshingTier(true);

    try {
      const profile = await api.refreshRiotTier();
      setProfileInfo(profile);
      alert("티어 정보를 새로고침했습니다.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "티어 정보를 새로고침하지 못했습니다.");
    } finally {
      setIsRefreshingTier(false);
    }
  };

  return (
    <main className="content settings-page game-account-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/settings")}>
          ←
        </button>
        <h1>게임 아이디 설정</h1>
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
                <span className="game-account-state">
                  {game.id === "leagueoflegends" && registeredGames.includes(game.id) ? (
                    <span className="game-account-tier">{profileInfo ? formatLolTier(profileInfo) : ""}</span>
                  ) : null}
                  <span className="game-account-status">
                    {registeredGames.includes(game.id) ? "등록됨" : "미등록"}
                  </span>
                </span>
                <span className="game-account-chevron" aria-hidden="true">
                  {isOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {isOpen ? (
                <div className="game-account-editor">
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
                        savingGame === game.id
                      }
                      onClick={() => handleRegister(game.id)}
                    >
                      {savingGame === game.id ? "처리 중" : "등록"}
                    </button>
                  </div>
                  {game.id === "leagueoflegends" && profileInfo?.lol_profile?.riot_id ? (
                    <button
                      type="button"
                      className="game-account-refresh"
                      disabled={isRefreshingTier}
                      onClick={handleRefreshTier}
                    >
                      {isRefreshingTier ? "새로고침 중" : "티어 새로고침"}
                    </button>
                  ) : null}
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
