import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

const lolTiers = [
  "Iron IV",
  "Iron III",
  "Iron II",
  "Iron I",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Emerald IV",
  "Emerald III",
  "Emerald II",
  "Emerald I",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Master",
  "Grandmaster",
  "Challenger",
];

const valorantTiers = [
  "Iron 1",
  "Iron 2",
  "Iron 3",
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Ascendant 1",
  "Ascendant 2",
  "Ascendant 3",
  "Immortal 1",
  "Immortal 2",
  "Immortal 3",
  "Radiant",
];

const pubgTiers = [
  "Bronze V",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver V",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold V",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum V",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Diamond V",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Master",
];

const fifaTiers = [
  "Division 10",
  "Division 9",
  "Division 8",
  "Division 7",
  "Division 6",
  "Division 5",
  "Division 4",
  "Division 3",
  "Division 2",
  "Division 1",
  "Elite",
];

const gameConfigs = {
  leagueoflegends: {
    name: "리그 오브 레전드",
    rankLabel: "내 티어 설정",
    ranks: lolTiers,
    minDefault: "Gold III",
    partySizes: [1, 2, 3, 4, 5],
    partyDefault: 4,
    optionLabel: "포지션 선택",
    options: ["미드", "탑", "정글", "원딜", "서폿"],
    optionDefault: "미드",
  },
  valorant: {
    name: "발로란트",
    rankLabel: "내 랭크 설정",
    ranks: valorantTiers,
    minDefault: "Gold 1",
    partySizes: [1, 2, 3, 4, 5],
    partyDefault: 5,
    optionLabel: "역할 선택",
    options: ["타격대", "척후대", "감시자", "전략가", "상관없음"],
    optionDefault: "상관없음",
  },
  battleground: {
    name: "배틀그라운드",
    rankLabel: "내 티어 설정",
    ranks: pubgTiers,
    minDefault: "Gold III",
    partySizes: [1, 2, 3, 4],
    partyDefault: 4,
    optionLabel: "",
    options: [],
    optionDefault: "상관없음",
  },
  fifa: {
    name: "FIFA",
    rankLabel: "내 디비전 설정",
    ranks: fifaTiers,
    minDefault: "Division 5",
    partySizes: [1, 2, 3, 4],
    partyDefault: 1,
    optionLabel: "",
    options: [],
    optionDefault: "상관없음",
  },
};

type GameKey = keyof typeof gameConfigs;
type OpenRank = "rank" | null;

function isGameKey(value: string | null): value is GameKey {
  return Boolean(value && value in gameConfigs);
}

function toBackendTier(rank: string) {
  const upperRank = rank.toUpperCase();

  if (upperRank.includes("IRON")) return "IRON";
  if (upperRank.includes("BRONZE")) return "BRONZE";
  if (upperRank.includes("SILVER")) return "SILVER";
  if (upperRank.includes("GOLD")) return "GOLD";
  if (upperRank.includes("PLATINUM")) return "PLATINUM";
  if (upperRank.includes("EMERALD")) return "EMERALD";
  if (upperRank.includes("DIAMOND")) return "DIAMOND";
  if (upperRank.includes("MASTER")) return "MASTER";
  if (upperRank.includes("GRANDMASTER")) return "GRANDMASTER";
  if (upperRank.includes("CHALLENGER") || upperRank.includes("RADIANT") || upperRank.includes("ELITE")) {
    return "CHALLENGER";
  }

  return "UN_RANKED";
}

function toBackendPosition(value: string) {
  const positionMap: Record<string, string> = {
    탑: "TOP",
    정글: "JUNGLE",
    미드: "MID",
    원딜: "ADC",
    서폿: "SUPPORT",
    공격: "ADC",
    운영: "MID",
    생존: "SUPPORT",
    파밍: "JUNGLE",
    돌격: "TOP",
    지원: "SUPPORT",
    타격대: "ADC",
    척후대: "JUNGLE",
    감시자: "SUPPORT",
    전략가: "MID",
    압박: "ADC",
    점유: "MID",
    역습: "JUNGLE",
    밸런스: "ANYTHING",
    상관없음: "ANYTHING",
  };

  return positionMap[value] ?? "ANYTHING";
}

function MatchSetting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedGame = searchParams.get("game");
  const selectedGame: GameKey = isGameKey(requestedGame) ? requestedGame : "leagueoflegends";
  const config = gameConfigs[selectedGame];

  const [selectedRank, setSelectedRank] = useState(config.minDefault);
  const [openRank, setOpenRank] = useState<OpenRank>(null);
  const [partySize, setPartySize] = useState(config.partyDefault);
  const [option, setOption] = useState(config.optionDefault);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderRankDropdown = (
    id: Exclude<OpenRank, null>,
    value: string,
    onSelect: (rank: string) => void,
    label: string,
  ) => {
    const isOpen = openRank === id;

    return (
      <div className="match-setting-tier-select">
        <button
          type="button"
          className="match-setting-tier-button"
          aria-label={label}
          aria-expanded={isOpen}
          onClick={() => setOpenRank(isOpen ? null : id)}
        >
          <span>{value}</span>
          <span className="match-setting-tier-arrow" aria-hidden="true" />
        </button>

        {isOpen ? (
          <div className="match-setting-tier-menu" role="listbox" aria-label={label}>
            {config.ranks.map((rank) => (
              <button
                key={rank}
                type="button"
                className="match-setting-tier-option"
                aria-selected={rank === value}
                onClick={() => {
                  onSelect(rank);
                  setOpenRank(null);
                }}
              >
                {rank}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (selectedGame !== "leagueoflegends") {
      alert("현재 백엔드는 리그 오브 레전드 매칭만 지원합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const matchCriteria = {
        game: selectedGame,
        tier: selectedRank,
        partySize,
        option,
      };

      sessionStorage.setItem("matchCriteria", JSON.stringify(matchCriteria));

      const profile = await api.getProfileMe();

      await api.updateGameSettings({
        tier: toBackendTier(selectedRank),
        primary_position: toBackendPosition(option),
        secondary_position: "ANYTHING",
        play_styles: profile.lol_profile?.play_styles ?? [],
      });

      const queue = await api.joinQueue();
      const matchingPath = `/matching?game=${selectedGame}&queueId=${queue.id}`;
      navigate(matchingPath);
    } catch (error) {
      alert(error instanceof Error ? error.message : "매칭 대기열 참가에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="content match-setting-page">
      <header className="match-setting-header">
        <h2 className="match-setting-title">매칭 조건 설정</h2>
        <p className="match-setting-game-name">{config.name}</p>
        <div className="match-setting-divider" />
      </header>

      <section className="match-setting-section">
        <p className="match-setting-label">{config.rankLabel}</p>
        <div className="match-setting-tier-row">
          {renderRankDropdown("rank", selectedRank, setSelectedRank, "내 랭크")}
        </div>
      </section>

      <section className="match-setting-section match-setting-section--people">
        <p className="match-setting-label">
          매칭 인원 선택 <span className="match-setting-required">*</span>
        </p>
        <div className="match-setting-under-line" />
        <div className="match-setting-people-row">
          <select
            className="match-setting-select match-setting-select--people"
            value={partySize}
            onChange={(event) => setPartySize(Number(event.target.value))}
            aria-label="매칭 인원"
          >
            {config.partySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="match-setting-unit">명</span>
        </div>
      </section>

      {config.options.length > 0 ? (
        <section className="match-setting-section match-setting-section--position">
          <p className="match-setting-label">{config.optionLabel}</p>
          <div className="match-setting-position-row">
            {config.options.map((item) => (
              <button
                key={item}
                type="button"
                className="match-setting-position"
                onClick={() => setOption(item)}
                aria-pressed={option === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <button
        className="gradient-btn match-setting-submit"
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "대기 중" : "완료"}
      </button>
    </main>
  );
}

export default MatchSetting;
