import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import logo from "../assets/mascot.png";

function CreateID() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !email.trim() ||
      !nickname.trim() ||
      !college.trim() ||
      !department.trim() ||
      !password.trim()
    ) {
      alert("이메일, 닉네임, 단과대학, 학부(과), 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      alert("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await api.register({
        email: email.trim(),
        nickname: nickname.trim(),
        password,
        college: college.trim(),
        department: department.trim(),
      });

      alert("가입 요청이 완료됐어요. 이메일 인증 후 로그인해주세요.");
      navigate("/", { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "아이디 만들기에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="content" style={pageStyle}>
      <section style={cardStyle}>
        <button type="button" style={backButtonStyle} onClick={() => navigate("/")}>
          ←
        </button>

        <div style={brandStyle}>
          <img src={logo} alt="GameLink 마스코트" style={logoStyle} />
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
          <input
            type="text"
            placeholder="단과대학 (예: 공과대학)"
            value={college}
            onChange={(event) => setCollege(event.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="학부(과) (예: 소프트웨어공학과)"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={inputStyle}
          />

          <button type="button" className="gradient-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "가입 요청 중" : "인증 메일 보내기"}
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
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "10px 24px 32px",
  backgroundColor: "#FFFFFF",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "340px",
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
  marginBottom: "4px",
};

const brandStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "18px",
};

const logoStyle: CSSProperties = {
  width: "230px",
  height: "auto",
  marginBottom: "-12px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 800,
  color: "#111827",
};

const descriptionStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "14px",
  color: "#667085",
  lineHeight: 1.5,
};

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
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
  boxSizing: "border-box",
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
