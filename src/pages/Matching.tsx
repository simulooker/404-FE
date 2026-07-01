import { useNavigate } from "react-router-dom";

function Matching() {
  const navigate = useNavigate();

  return (
    <main className="content" style={{ textAlign: "center", paddingTop: "50px" }}>
      <h2 style={{ color: "#7F56D9" }}>매칭 중...</h2>
      <p style={{ color: "#667085", lineHeight: 1.6 }}>
        실력과 성향을 분석해서
        <br />
        잘 맞는 팀원을 찾고 있어요
      </p>

      <div
        style={{
          margin: "56px auto",
          width: "150px",
          height: "150px",
          background: "#F4EBFF",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}
      >
        🎮
      </div>

      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>00:05</p>
        <p style={{ color: "#98A2B3", fontSize: "14px" }}>예상 대기 시간 0:23</p>
      </div>

      <button className="gradient-btn" type="button" onClick={() => navigate("/match-done")}>
        데모 매칭 완료
      </button>
      <button
        className="secondary-btn"
        type="button"
        onClick={() => navigate("/home")}
        style={{ marginTop: "12px", width: "100%" }}
      >
        대기열 나가기
      </button>
    </main>
  );
}

export default Matching;
