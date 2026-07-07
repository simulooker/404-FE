import { useNavigate } from "react-router-dom";
import discordIcon from "../assets/matched/discord.png";
import micIcon from "../assets/matched/mic.png";
import micOffIcon from "../assets/matched/micoff.png";
import starIcon from "../assets/matched/Star.png";
import trophyIcon from "../assets/matched/Trophy.png";
import bg1 from "../assets/profile/background/basic1.png";
import bg2 from "../assets/profile/background/basic2.png";
import bg3 from "../assets/profile/background/basic3.png";
import bg4 from "../assets/profile/background/basic4.png";
import profile1 from "../assets/profile/roundprofile/basic1.png";
import profile2 from "../assets/profile/roundprofile/basic2.png";
import profile3 from "../assets/profile/roundprofile/basic3.png";
import profile4 from "../assets/profile/roundprofile/basic4.png";

const members = [
  { tier: "Gold III", rating: "4.8", bg: bg1, profile: profile1, mic: true, discord: true },
  { tier: "Gold II", rating: "4.5", bg: bg2, profile: profile2, mic: true, discord: false },
  { tier: "Gold I", rating: "4.7", bg: bg3, profile: profile3, mic: false, discord: true },
  { tier: "Gold III", rating: "4.6", bg: bg4, profile: profile4, mic: true, discord: false },
];

function Matched() {
  const navigate = useNavigate();

  return (
    <main className="content matched-page">
      <header className="matched-header">
        <h1>매칭 완료!</h1>
        <p>함께 플레이할 팀원을 찾았어요</p>
      </header>

      <section className="matched-team" aria-label="매칭된 팀원">
        {members.map((member, index) => (
          <article className="matched-card" key={member.tier + index}>
            <img src={member.bg} alt="" className="matched-card__bg" />
            <div className="matched-card__shade" />
            <img src={member.profile} alt="" className="matched-card__profile" />
            {member.discord ? (
              <img src={discordIcon} alt="디스코드 사용 가능" className="matched-card__discord" />
            ) : null}

            <div className="matched-card__info">
              <div className="matched-card__name-row">
                <strong>닉네임</strong>
                <img
                  src={member.mic ? micIcon : micOffIcon}
                  alt={member.mic ? "마이크 켜짐" : "마이크 꺼짐"}
                  className="matched-card__mic-inline"
                />
              </div>

              <div className="matched-card__stats">
                <span>
                  <img src={trophyIcon} alt="" />
                  {member.tier}
                </span>
                <span>
                  <img src={starIcon} alt="" className="matched-card__star" />
                  {member.rating}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="matched-actions">
        <button className="matched-reject" type="button" onClick={() => navigate("/home")}>
          거절
        </button>
        <button className="gradient-btn matched-accept" type="button" onClick={() => navigate("/game-result")}>
          수락
        </button>
      </div>
    </main>
  );
}

export default Matched;
