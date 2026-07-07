import { useState } from "react";
import { useNavigate } from "react-router-dom";

const partySizes = [1, 2, 3, 4, 5];
const tiers = [
  "Iron IV",
  "Bronze IV",
  "Silver IV",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum IV",
  "Emerald IV",
];
const positions = ["미드", "탑", "정글", "원딜", "서폿"];

function MatchSetting() {
  const navigate = useNavigate();
  const [minTier, setMinTier] = useState("Gold III");
  const [maxTier, setMaxTier] = useState("Gold I");
  const [partySize, setPartySize] = useState(4);
  const [waitTime, setWaitTime] = useState(10);
  const [position, setPosition] = useState("미드");

  return (
    <main className="content match-setting-page">
      <header className="match-setting-header">
        <h2 className="match-setting-title">매칭 조건 설정</h2>
        <div className="match-setting-divider" />
      </header>

      <section className="match-setting-section">
          <p className="match-setting-label">티어 범위 설정</p>
          <div className="match-setting-tier-row">
            <select
              className="match-setting-select match-setting-select--tier"
              value={minTier}
              onChange={(event) => setMinTier(event.target.value)}
              aria-label="최소 티어"
            >
              {tiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>

            <span className="match-setting-wave">~</span>

            <select
              className="match-setting-select match-setting-select--tier"
              value={maxTier}
              onChange={(event) => setMaxTier(event.target.value)}
              aria-label="최대 티어"
            >
              {tiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
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
              {partySizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="match-setting-unit">명</span>
          </div>
      </section>

      <section className="match-setting-section match-setting-section--wait">
          <p className="match-setting-label">
            대기 허용 시간 <span className="match-setting-required">*</span>
          </p>
          <div className="match-setting-wait-row">
            <input
              className="match-setting-range"
              type="range"
              min="5"
              max="30"
              step="5"
              value={waitTime}
              onChange={(event) => setWaitTime(Number(event.target.value))}
              aria-label="대기 허용 시간"
            />
            <span className="match-setting-wait-value">{waitTime}분</span>
          </div>
      </section>

      <section className="match-setting-section match-setting-section--position">
          <p className="match-setting-label">포지션 선택</p>
          <div className="match-setting-position-row">
            {positions.map((item) => (
              <button
                key={item}
                type="button"
                className="match-setting-position"
                onClick={() => setPosition(item)}
                aria-pressed={position === item}
              >
                {item}
              </button>
            ))}
          </div>
      </section>

      <button
        className="gradient-btn match-setting-submit"
        type="button"
        onClick={() => navigate("/matching")}
      >
        완료
      </button>
    </main>
  );
}

export default MatchSetting;
