import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 변경된 로그인 처리 함수
  const handleLogin = async () => {
    // 예외 처리: 이메일이나 비밀번호가 비어있으면 실행 안 함
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 1. 백엔드 로그인 API 주소로 POST 요청을 보냅니다.
      // (주소는 실제 백엔드 개발자가 만든 주소나 공공 API 주소로 변경해야 합니다)
      const response = await fetch(
        "https://gamematch-be.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email, // 사용자가 입력한 이메일 상태값
            password: password, // 사용자가 입력한 비밀번호 상태값
          }),
        },
      );

      // 2. 서버에서 보낸 응답을 확인합니다.
      const result = await response.json();

      if (response.ok) {
        // 로그인 성공 시!
        alert("로그인에 성공했습니다!");

        // 보통 서버에서 로그인 증표로 '토큰(Token)'을 줍니다. 이를 브라우저에 저장합니다.
        if (result.token) {
          localStorage.setItem("userToken", result.token);
        }

        // 메인 화면으로 이동
        navigate("/home");
      } else {
        // 서버에서 로그인 실패 오류를 보냈을 때 (비밀번호 틀림 등)
        alert(result.message || "로그인 정보가 올바르지 않습니다.");
      }
    } catch (error) {
      // 네트워크 에러 등 아예 서버와 통신이 실패했을 때
      console.error("로그인 통신 에러:", error);
      alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
        />

        <button type="button" className="gradient-btn" onClick={handleLogin}>
          로그인
        </button>

        <button
          type="button"
          style={helperTextStyle}
          onClick={() => navigate("/create-id")}
        >
          전남대 이메일 인증하기
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
  fontSize: "12px",
  lineHeight: 1.4,
  margin: "-105px 0 0",
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

export default Login;
