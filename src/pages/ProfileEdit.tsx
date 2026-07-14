import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import {
  getProfilePreferences,
  saveProfilePreferences,
} from "../utils/preferences";

const PLAY_STYLE_TAGS = [
  "즐겜",
  "빡겜",
  "소통형",
  "조용한 플레이",
  "초보 환영",
  "팀플레이",
  "리더형",
  "전략형",
];

function ProfileEdit() {
  const navigate = useNavigate();
  const storedProfile = getProfilePreferences();
  const [nickname, setNickname] = useState(storedProfile.nickname);
  const [department, setDepartment] = useState(storedProfile.department);
  const [selectedTags, setSelectedTags] = useState(storedProfile.playStyleTags);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(storedProfile.voiceChatEnabled);

  useEffect(() => {
    if (nickname && department) return;

    api
      .getProfileMe()
      .then((profile) => {
        setNickname((current) => current || profile.nickname);
        setDepartment((current) => current || profile.department);
        setVoiceChatEnabled((current) => current || profile.voice_chat_enable);
      })
      .catch(() => undefined);
  }, [department, nickname]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
      return;
    }

    if (selectedTags.length >= 3) {
      alert("플레이스타일 태그는 최대 3개까지 선택할 수 있어요.");
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    saveProfilePreferences({
      nickname: nickname.trim(),
      department: department.trim(),
      playStyleTags: selectedTags,
      voiceChatEnabled,
    });
    navigate("/mypage", { replace: true });
  };

  return (
    <main className="content settings-page settings-detail-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={() => navigate("/settings")}>
          ←
        </button>
        <h1>프로필 수정</h1>
      </header>

      <div className="settings-form">
        <label className="settings-field">
          <span>닉네임</span>
          <input
            type="text"
            value={nickname}
            maxLength={12}
            placeholder="닉네임을 입력하세요"
            onChange={(event) => setNickname(event.target.value)}
          />
          <small>{nickname.length}/12</small>
        </label>

        <label className="settings-field">
          <span>학부(과)</span>
          <input
            type="text"
            value={department}
            placeholder="학부(과)를 입력하세요"
            onChange={(event) => setDepartment(event.target.value)}
          />
        </label>

        <section className="settings-fieldset">
          <div className="settings-fieldset__heading">
            <span>플레이스타일 태그</span>
            <small>{selectedTags.length}/3</small>
          </div>
          <div className="profile-tag-options">
            {PLAY_STYLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="profile-tag-option"
                aria-pressed={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        <div className="settings-toggle-row">
          <div>
            <strong>음성 채팅 가능</strong>
            <span>매칭된 팀원에게 음성 채팅 가능 여부를 표시합니다.</span>
          </div>
          <button
            type="button"
            className="settings-switch"
            role="switch"
            aria-checked={voiceChatEnabled}
            onClick={() => setVoiceChatEnabled(!voiceChatEnabled)}
          >
            <span />
          </button>
        </div>
      </div>

      <button type="button" className="gradient-btn settings-save" onClick={handleSave}>
        저장
      </button>
    </main>
  );
}

export default ProfileEdit;
