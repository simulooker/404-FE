import type { CSSProperties } from "react";

function MyPage() {
  return (
    <main className="content">
      <section style={{ textAlign: "center", marginBottom: "30px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#EAECF0",
            borderRadius: "50%",
            margin: "0 auto 12px",
          }}
        />
        <h2 style={{ margin: 0 }}>하늘</h2>
        <p style={{ color: "#667085", fontSize: "14px" }}>물리학과 | ★ 4.5</p>
        <div style={{ marginTop: "8px" }}>
          <span style={tagStyle}>#친절해요</span>
          <span style={tagStyle}>#즐겜러</span>
        </div>
      </section>

      <h3>최근 활동</h3>
      {["승리", "패배", "승리"].map((result, index) => (
        <article
          key={result + "-" + index}
          className="card"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <div style={{ fontWeight: 800, color: result === "승리" ? "#1570EF" : "#D92D20" }}>
              {result}
            </div>
            <div style={{ fontSize: "12px", color: "#98A2B3" }}>{index + 1}시간 전</div>
          </div>
          <span>LOL</span>
        </article>
      ))}
    </main>
  );
}

const tagStyle: CSSProperties = {
  display: "inline-block",
  padding: "4px 8px",
  background: "#F2F4F7",
  borderRadius: "6px",
  fontSize: "12px",
  marginRight: "4px",
};

export default MyPage;
