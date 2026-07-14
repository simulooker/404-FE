import { useState } from "react";
import { useNavigate } from "react-router-dom";
import discordIcon from "../assets/matched/discord.png";
import {
  getDiscordConnection,
  saveDiscordConnection,
} from "../utils/preferences";

function DiscordConnect() {
  const navigate = useNavigate();
  const storedConnection = getDiscordConnection();
  const [connected, setConnected] = useState(storedConnection.connected);
  const [username, setUsername] = useState(storedConnection.username);

  const handleConnect = () => {
    if (!username.trim()) {
      alert("Discord 사용자명을 입력해주세요.");
      return;
    }

    const connection = { connected: true, username: username.trim() };
    saveDiscordConnection(connection);
    setConnected(true);
  };

  const handleDisconnect = () => {
    saveDiscordConnection({ connected: false, username: "" });
    setConnected(false);
    setUsername("");
  };

  return (
    <main className="content settings-page settings-detail-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/settings")}>
          ←
        </button>
        <h1>디스코드 연결</h1>
      </header>

      <section className="discord-connect-panel">
        <img src={discordIcon} alt="Discord" className="discord-connect-icon" />
        <h2>{connected ? "연결됨" : "Discord 계정 연결"}</h2>
        <p>
          {connected
            ? `${username} 계정이 GameLink와 연결되어 있어요.`
            : "매칭된 팀원에게 Discord 사용 가능 여부를 표시할 수 있어요."}
        </p>

        {connected ? (
          <button type="button" className="settings-danger-button" onClick={handleDisconnect}>
            연결 해제
          </button>
        ) : (
          <>
            <label className="settings-field discord-username-field">
              <span>Discord 사용자명</span>
              <input
                type="text"
                value={username}
                placeholder="예: gamelink_user"
                autoCapitalize="none"
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <button type="button" className="discord-connect-button" onClick={handleConnect}>
              <img src={discordIcon} alt="" />
              Discord로 연결
            </button>
          </>
        )}
      </section>

      <p className="discord-connect-note">
        실제 서비스에서는 Discord OAuth 인증 페이지를 거쳐 안전하게 연결됩니다.
      </p>
    </main>
  );
}

export default DiscordConnect;
