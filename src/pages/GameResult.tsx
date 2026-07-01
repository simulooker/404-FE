import { useState } from "react";
import { useNavigate } from "react-router-dom";

const team = ["하늘", "민준", "서연", "지호"];

function GameResult() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([0, 0, 0, 0]);

  const handleRating = (memberIndex: number, starIndex: number) => {
    const nextRatings = [...ratings];
    nextRatings[memberIndex] = starIndex + 1;
    setRatings(nextRatings);
  };

  return (
    <main className="content">
      <header style={{ textAlign: "center", padding: "10px 0" }}>
        <span style={{ fontWeight: 800, color: "#7F56D9" }}>GameLink</span>
      </header>

      <section style={{ textAlign: "center", margin: "20px 0" }}>
        <h2 style={{ margin: 0 }}>게임 완료</h2>
        <p style={{ color: "#667085", fontSize: "14px" }}>
          함께한 팀원에게 별점을 남겨주세요
        </p>
      </section>

      <section
        style={{
          background: "linear-gradient(135deg, #2970FF 0%, #004EEB 100%)",
          borderRadius: "16px",
          padding: "30px",
          textAlign: "center",
          color: "white",
          marginBottom: "24px",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏆</div>
        <h3 style={{ margin: 0, fontSize: "24px" }}>승리 5:3</h3>
      </section>

      <section>
        {team.map((name, memberIndex) => (
          <article
            key={name}
            className="card"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#EAECF0",
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontWeight: 700 }}>{name}</span>
            </div>
            <div style={{ display: "flex", gap: "3px" }} aria-label={name + " 별점"}>
              {[0, 1, 2, 3, 4].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => handleRating(memberIndex, starIndex)}
                  aria-label={String(starIndex + 1) + "점"}
                  style={{
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: starIndex < ratings[memberIndex] ? "#FDB022" : "#D0D5DD",
                    padding: "2px",
                  }}
                >
                  {starIndex < ratings[memberIndex] ? "★" : "☆"}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <button className="gradient-btn" type="button" onClick={() => navigate("/home")}>
        홈으로 돌아가기
      </button>
    </main>
  );
}

export default GameResult;
