import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type ProfileMeResponse } from "../api/client";
import {
  getProfilePreferences,
  saveProfilePreferences,
} from "../utils/preferences";

const PLAY_STYLE_TAGS = [
  "즐겜",
  "승리우선",
  "친목",
  "초보환영",
];

function ProfileEdit() {
  const navigate = useNavigate();
  const storedProfile = getProfilePreferences();
  const [nickname, setNickname] = useState(storedProfile.nickname);
  const [department, setDepartment] = useState(storedProfile.department);
  const [selectedTags, setSelectedTags] = useState(
    storedProfile.playStyleTags.filter((tag) => PLAY_STYLE_TAGS.includes(tag)),
  );
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(storedProfile.voiceChatEnabled);
  const [serverProfile, setServerProfile] = useState<ProfileMeResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .getProfileMe()
      .then((profile) => {
        setServerProfile(profile);
        setNickname((current) => current || profile.nickname);
        setDepartment((current) => current || profile.department);
        setVoiceChatEnabled(profile.voice_chat_enable);
        setSelectedTags((current) =>
          current.length > 0 ? current : (profile.lol_profile?.play_styles ?? []).slice(0, 3),
        );
      })
      .catch(() => undefined);
  }, []);

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

  const handleSave = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!department.trim()) {
      alert("학부(과)를 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      await api.updateProfileMe({
        department: department.trim(),
        voice_chat_enable: voiceChatEnabled,
      });

      await api.updateGameSettings({
        primary_position: serverProfile?.lol_profile?.primary_position ?? "ANYTHING",
        secondary_position: serverProfile?.lol_profile?.secondary_position ?? "ANYTHING",
        play_styles: selectedTags,
      });

      saveProfilePreferences({
        nickname: nickname.trim(),
        department: department.trim(),
        playStyleTags: selectedTags,
        voiceChatEnabled,
      });
      navigate("/mypage", { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : "프로필 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
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

      <button
        type="button"
        className="gradient-btn settings-save"
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? "저장 중" : "저장"}
      </button>
    </main>
  );
}

export default ProfileEdit;
