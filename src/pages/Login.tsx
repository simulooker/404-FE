import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveAccessToken } from "../api/client";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await api.login({
        email: email.trim(),
        password,
      });

      saveAccessToken(result.access_token);
      navigate("/home", { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      alert("인증 메일을 받을 이메일을 먼저 입력해 주세요.");
      return;
    }

    setIsResending(true);

    try {
      const response = await api.resendVerification(email.trim());
      alert(response.message);
    } catch (error) {
      alert(error instanceof Error ? error.message : "인증 메일 재발송에 실패했습니다.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="content" style={loginPageStyle}>
      <section style={brandSectionStyle}>
        <img src={logo} alt="GameLink 로고" style={logoStyle} />
        <p style={taglineStyle}>게임으로 연결되는 플레이 메이트</p>
      </section>

      <section style={formSectionStyle}>
        <input
          type="email"
          placeholder="전남대 이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={inputStyle}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={inputStyle}
          autoComplete="current-password"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleLogin();
            }
          }}
        />

        <button type="button" className="gradient-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "로그인 중" : "로그인"}
        </button>

        <button
          type="button"
          style={helperTextStyle}
          onClick={() => navigate("/create-id")}
        >
          회원가입 하기
        </button>
        <button
          type="button"
          style={resendButtonStyle}
          disabled={isResending}
          onClick={() => void handleResendVerification()}
        >
          {isResending ? "인증 메일 재발송 중..." : "인증 메일 재발송"}
        </button>
      </section>
    </main>
  );
}

const loginPageStyle: CSSProperties = {
  paddingTop: "132px",
  textAlign: "center",
};

const brandSectionStyle: CSSProperties = {
  width: "100%",
  marginBottom: "18px",
};

const logoStyle: CSSProperties = {
  display: "block",
  width: "390px",
  maxWidth: "100%",
  height: "auto",
  objectFit: "contain",
  margin: "0 auto",
};

const taglineStyle: CSSProperties = {
  color: "#667085",
  fontSize: "11px",
  lineHeight: 1.4,
  margin: "-96px 0 0",
  position: "relative",
  zIndex: 1,
};

const formSectionStyle: CSSProperties = {
  width: "100%",
  maxWidth: "310px",
  margin: "0 auto",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  marginBottom: "12px",
  borderRadius: "999px",
  border: "1px solid #D0D5DD",
  boxSizing: "border-box",
  fontSize: "15px",
};

const helperTextStyle: CSSProperties = {
  marginTop: "18px",
  fontSize: "12px",
  color: "#98A2B3",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  padding: 0,
};

const resendButtonStyle: CSSProperties = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#667085",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  padding: 0,
};

export default Login;
