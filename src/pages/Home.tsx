import { useNavigate } from "react-router-dom";
import lolImg from "../assets/squareset/lolsquare.png";
import valorantImg from "../assets/squareset/valorantsquare.png";
import overwatchImg from "../assets/squareset/overwatchsquare.png";
import pubgImg from "../assets/squareset/pubgsquare.png";

const games = [
  {
    name: "LEAGUE OF LEGENDS",
    players: "1.4천 명 플레이 중",
    image: lolImg,
  },
  {
    name: "VALORANT",
    players: "1.1천 명 플레이 중",
    image: valorantImg,
  },
  {
    name: "OVERWATCH",
    players: "800명 플레이 중",
    image: overwatchImg,
  },
  {
    name: "PUBG",
    players: "800명 플레이 중",
    image: pubgImg,
  },
];
function Home() {
  const navigate = useNavigate();

  return (
    <main className="content" style={{ padding: "20px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 800,
          margin: "8px 0 24px",
          lineHeight: "1.4",
        }}
      >
        오늘은 어떤 게임을
        <br />
        함께할까요?
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {games.map((game) => (
          <button
            key={game.name}
            className="card"
            type="button"
            onClick={() => navigate("/match-setting")}
            style={{
              width: "140px",
              height: "140px", // 이미지 높이 고정
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden", // 이미지가 테두리를 벗어나지 않게
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {/* 배경 이미지 */}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${game.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />

            {/* 어두운 그라데이션 오버레이 (텍스트 가독성 확보) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
                zIndex: 2,
              }}
            />

            {/* 카드 내부 텍스트 */}
            <div
              style={{
                position: "relative",
                zIndex: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px",
                textAlign: "left",
              }}
            >
              {/* 플레이 중 배지 */}
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "white",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {game.players}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

export default Home;
