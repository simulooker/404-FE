import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/justlogo.png";

function CreateID() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !nickname.trim()) {
      alert("전남대 이메일과 닉네임을 입력해주세요.");
      return;
    }

    alert("인증 메일을 보냈습니다. 메일함을 확인해주세요.");
  };

  return (
    <main className="content" style={pageStyle}>
      <section style={cardStyle}>
        <button type="button" style={backButtonStyle} onClick={() => navigate("/")}>
          ←
        </button>

        <div style={brandStyle}>
          <img src={logo} alt="GameLink 로고" style={logoStyle} />
          <h1 style={titleStyle}>아이디 만들기</h1>
          <p style={descriptionStyle}>전남대 이메일로 인증하고 GameLink를 시작해보세요.</p>
        </div>

        <div style={formStyle}>
          <input
            type="email"
            placeholder="전남대 이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            style={inputStyle}
          />

          <button type="button" className="gradient-btn" onClick={handleSubmit}>
            인증 메일 보내기
          </button>

          <button type="button" style={loginButtonStyle} onClick={() => navigate("/")}>
            로그인으로 돌아가기
          </button>
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 24px",
  backgroundColor: "#FFFFFF",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "360px",
  position: "relative",
};

const backButtonStyle: CSSProperties = {
  width: "36px",
  height: "36px",
  border: "none",
  backgroundColor: "transparent",
  color: "#111827",
  fontSize: "28px",
  lineHeight: 1,
  cursor: "pointer",
  padding: 0,
  marginBottom: "42px",
};

const brandStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "34px",
};

const logoStyle: CSSProperties = {
  width: "86px",
  height: "auto",
  marginBottom: "18px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 800,
  color: "#111827",
};

const descriptionStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: "14px",
  color: "#667085",
  lineHeight: 1.5,
};

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "48px",
  border: "1px solid #D0D5DD",
  borderRadius: "24px",
  padding: "0 20px",
  fontSize: "15px",
  outline: "none",
  color: "#111827",
  backgroundColor: "#FFFFFF",
};

const loginButtonStyle: CSSProperties = {
  border: "none",
  backgroundColor: "transparent",
  color: "#98A2B3",
  fontSize: "12px",
  cursor: "pointer",
  padding: "2px 0",
};

export default CreateID;
