import { useNavigate } from "react-router-dom";

const members = [
  { name: "하늘", tier: "Gold II", rating: 4.3 },
  { name: "민준", tier: "Gold I", rating: 4.1 },
  { name: "서연", tier: "Gold II", rating: 4.5 },
  { name: "지호", tier: "Gold I", rating: 4.8 },
];

function MatchDone() {
  const navigate = useNavigate();

  return (
    <main className="content">
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h2 style={{ color: "#7F56D9", margin: "0 0 8px" }}>매칭 완료!</h2>
        <p style={{ color: "#667085", margin: 0 }}>함께 플레이할 팀원이 준비됐어요</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {members.map((member) => (
          <article key={member.name} className="card" style={{ textAlign: "center", padding: "20px 10px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "#F2F4F7",
                borderRadius: "50%",
                margin: "0 auto 10px",
              }}
            />
            <div style={{ fontWeight: 800 }}>{member.name}</div>
            <div style={{ fontSize: "13px", color: "#667085" }}>{member.tier}</div>
            <div style={{ fontSize: "12px", color: "#FDB022" }}>★ {member.rating}</div>
          </article>
        ))}
      </div>

      <button
        className="gradient-btn"
        type="button"
        onClick={() => navigate("/game-result")}
        style={{ marginTop: "16px" }}
      >
        게임 결과 입력
      </button>
    </main>
  );
}

export default MatchDone;
