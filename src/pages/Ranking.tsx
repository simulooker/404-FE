import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type RankingEntry } from "../api/client";
import { getProfileAvatar } from "../utils/profileAvatars";

function formatTier(entry: RankingEntry) {
  if (entry.tier === "UNRANKED") return "언랭크";

  const tier = `${entry.tier.charAt(0)}${entry.tier.slice(1).toLowerCase()}`;
  const division = entry.rank_division ? ` ${entry.rank_division}` : "";
  const points = entry.league_points === null ? "" : ` ${entry.league_points}LP`;

  return `${tier}${division}${points}`;
}

function Ranking() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const showFullName = (entry: RankingEntry) => {
    const riotId = entry.riot_id ? `\n롤 아이디: ${entry.riot_id}` : "";
    alert(`닉네임: ${entry.nickname}${riotId}`);
  };

  useEffect(() => {
    let isMounted = true;

    api.getLolRanking()
      .then((response) => {
        if (isMounted) setEntries(response.items);
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : "랭킹 정보를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="content ranking-page">
      <header className="ranking-header">
        <button type="button" className="ranking-back" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
          ←
        </button>
        <div>
          <h1>랭킹</h1>
          <p>리그 오브 레전드</p>
        </div>
      </header>

      <section className="ranking-list" aria-label="랭킹 목록">
        {isLoading ? <p className="ranking-message">랭킹 정보를 불러오는 중입니다.</p> : null}
        {error ? <p className="ranking-message">{error}</p> : null}
        {!isLoading && !error && entries.length === 0 ? <p className="ranking-message">표시할 랭킹이 없습니다.</p> : null}
        {entries.map((entry) => (
          <article className="ranking-item" key={entry.user_id}>
            <strong className={`ranking-item__rank ranking-item__rank--${Math.min(entry.rank, 4)}`}>{entry.rank}</strong>
            <img src={getProfileAvatar(entry.user_id)} alt="" className="ranking-item__avatar" />
            <div className="ranking-item__profile">
              <button
                type="button"
                className="ranking-item__name-row"
                onClick={() => showFullName(entry)}
                aria-label={`${entry.nickname} 전체 이름 보기`}
              >
                <strong>{entry.nickname}</strong>
                {entry.riot_id ? <span>{entry.riot_id}</span> : null}
              </button>
              <span>{entry.primary_position}</span>
            </div>
            <span className="ranking-item__tier">{formatTier(entry)}</span>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Ranking;
