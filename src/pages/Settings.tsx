import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../api/client";

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAccessToken();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <main className="content settings-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/mypage")}>
          ←
        </button>
        <h1>설정</h1>
      </header>

      <section className="settings-list" aria-label="설정 목록">
        <button
          type="button"
          className="settings-item"
          onClick={() => navigate("/settings/profile")}
        >
          <span>프로필 수정</span>
          <strong>›</strong>
        </button>
        <button
          type="button"
          className="settings-item"
          onClick={() => navigate("/settings/notifications")}
        >
          <span>알림 설정</span>
          <strong>›</strong>
        </button>
        <button
          type="button"
          className="settings-item"
          onClick={() => navigate("/settings/discord")}
        >
          <span>디스코드 연결</span>
          <strong>›</strong>
        </button>
        <button
          type="button"
          className="settings-item"
          onClick={() => navigate("/settings/game-accounts")}
        >
          <span>게임 아이디 등록</span>
          <strong>›</strong>
        </button>
        <button type="button" className="settings-item" onClick={handleLogout}>
          <span>로그아웃</span>
          <strong>›</strong>
        </button>
      </section>
    </main>
  );
}

export default Settings;
