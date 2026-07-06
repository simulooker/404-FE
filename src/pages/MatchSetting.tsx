import { useState } from "react";
import { useNavigate } from "react-router-dom";

const partySizes = [1, 2, 3, 4, 5];
const positions = ["탑", "정글", "미드", "원딜", "서포터"];

function MatchSetting() {
  const navigate = useNavigate();
  const [partySize, setPartySize] = useState(4);
  const [position, setPosition] = useState("미드");

  return (
    <main className="content">
      <h2 style={{ margin: "8px 0 18px" }}>매칭 조건 설정</h2>

      <section className="card">
        <p style={{ color: "#667085", marginTop: 0 }}>티어 범위</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
          <span>Gold III</span>
          <span>~</span>
          <span>Gold I</span>
        </div>
      </section>

      <section className="card">
        <p style={{ color: "#667085", marginTop: 0 }}>매칭 인원</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {partySizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setPartySize(size)}
              style={{
                padding: "8px 12px",
                background: partySize === size ? "#EEF4FF" : "#F2F4F7",
                border: partySize === size ? "1px solid #2970FF" : "1px solid transparent",
                borderRadius: "8px",
                color: partySize === size ? "#175CD3" : "#344054",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {size}명
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <p style={{ color: "#667085", marginTop: 0 }}>포지션</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {positions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPosition(item)}
              style={{
                border: position === item ? "1px solid #7F56D9" : "1px solid #D0D5DD",
                background: position === item ? "#F4EBFF" : "white",
                color: position === item ? "#6941C6" : "#344054",
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <button className="gradient-btn" type="button" onClick={() => navigate("/matching")}>
        매칭 시작
      </button>
    </main>
  );
}

export default MatchSetting;
