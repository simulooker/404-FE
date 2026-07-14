import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "../utils/preferences";

function NotificationSettings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(getNotificationPreferences);

  const updatePreferences = (next: NotificationPreferences) => {
    setPreferences(next);
    saveNotificationPreferences(next);
  };

  const toggleNotifications = async () => {
    if (preferences.enabled) {
      updatePreferences({ ...preferences, enabled: false });
      return;
    }

    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "denied") {
        alert("브라우저 설정에서 GameLink 알림 권한을 허용해주세요.");
        return;
      }
    }

    updatePreferences({ ...preferences, enabled: true });
  };

  const toggleItem = (key: keyof Omit<NotificationPreferences, "enabled">) => {
    updatePreferences({ ...preferences, [key]: !preferences[key] });
  };

  const sendTestNotification = () => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      alert("알림 권한을 먼저 허용해주세요.");
      return;
    }

    new Notification("GameLink", {
      body: "매칭이 완료됐어요. 수락 여부를 선택해주세요.",
      icon: `${import.meta.env.BASE_URL}favicon.svg`,
    });
  };

  const notificationItems = [
    { key: "matchFound" as const, title: "매칭 완료", description: "새로운 매칭이 잡혔을 때" },
    { key: "acceptDeadline" as const, title: "수락 마감", description: "매칭 수락 시간이 얼마 남지 않았을 때" },
    { key: "serviceUpdates" as const, title: "서비스 알림", description: "중요한 공지나 새로운 기능이 있을 때" },
  ];

  return (
    <main className="content settings-page settings-detail-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/settings")}>
          ←
        </button>
        <h1>알림 설정</h1>
      </header>

      <div className="settings-form">
        <div className="settings-toggle-row settings-toggle-row--primary">
          <div>
            <strong>앱 알림</strong>
            <span>GameLink에서 보내는 알림을 받습니다.</span>
          </div>
          <button
            type="button"
            className="settings-switch"
            role="switch"
            aria-checked={preferences.enabled}
            onClick={toggleNotifications}
          >
            <span />
          </button>
        </div>

        <section className="notification-options" aria-label="알림 종류">
          {notificationItems.map((item) => (
            <div key={item.key} className="settings-toggle-row">
              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
              <button
                type="button"
                className="settings-switch"
                role="switch"
                aria-checked={preferences.enabled && preferences[item.key]}
                disabled={!preferences.enabled}
                onClick={() => toggleItem(item.key)}
              >
                <span />
              </button>
            </div>
          ))}
        </section>

        <button
          type="button"
          className="settings-secondary-button"
          disabled={!preferences.enabled}
          onClick={sendTestNotification}
        >
          테스트 알림 보내기
        </button>
      </div>
    </main>
  );
}

export default NotificationSettings;
