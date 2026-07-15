import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import trophy from "../assets/trophy.png";
import battlegroundSquare from "../assets/squareset/pubgsquare.png";
import fifaSquare from "../assets/squareset/fifasquare.png";
import leagueSquare from "../assets/squareset/lolsquare.png";
import valorantSquare from "../assets/squareset/valorantsquare.png";
import battlegroundBg from "../assets/resultfadebg/battleground.png";
import fifaBg from "../assets/resultfadebg/fifa.png";
import leagueBg from "../assets/resultfadebg/leagueoflegends.png";
import valorantBg from "../assets/resultfadebg/valorant.png";

const games = {
  leagueoflegends: { name: "LEAGUE OF LEGENDS", image: leagueSquare, background: leagueBg },
  valorant: { name: "VALORANT", image: valorantSquare, background: valorantBg },
  battleground: { name: "PUBG", image: battlegroundSquare, background: battlegroundBg },
  fifa: { name: "FIFA", image: fifaSquare, background: fifaBg },
};

type GameKey = keyof typeof games;
type ResultType = "win" | "lose";

function isGameKey(value: string | null): value is GameKey {
  return Boolean(value && value in games);
}

function GameResultFade() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedGame = searchParams.get("game");
  const gameKey: GameKey = isGameKey(requestedGame) ? requestedGame : "valorant";
  const result: ResultType = searchParams.get("result") === "lose" ? "lose" : "win";
  const matchId = searchParams.get("matchId");
  const game = games[gameKey];

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const matchQuery = matchId ? `&matchId=${matchId}` : "";
      navigate(`/game-result?game=${gameKey}&result=${result}${matchQuery}`, { replace: true });
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [gameKey, matchId, navigate, result]);

  return (
    <main className={`game-result-fade-page game-result-fade-page--${result}`}>
      <img src={game.background} alt="" className="game-result-fade-bg" />
      <div className="game-result-fade-gradient" />

      <section className="game-result-fade-content" aria-label="게임 완료 전환 화면">
        <article className="game-result-fade-game-card">
          <img src={game.image} alt={game.name} />
        </article>

        <h1>게임 완료</h1>

        <section className="game-result-fade-score">
          <img src={trophy} alt="" />
          <div>
            <strong>{result === "win" ? "승리" : "패배"}</strong>
            <span>5:3</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default GameResultFade;
