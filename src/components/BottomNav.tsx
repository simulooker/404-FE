import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import homeButton from "../assets/navigationbar/homebutton.png";
import homeButtonActive from "../assets/navigationbar/homebuttonactive.png";
import mainButton from "../assets/navigationbar/mainbutton.png";
import myPageButton from "../assets/navigationbar/mypagebutton.png";
import myPageButtonActive from "../assets/navigationbar/mypagebuttonactive.png";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPreparingMatch, setIsPreparingMatch] = useState(false);

  if (
    location.pathname === "/" ||
    location.pathname === "/create-id" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/matching" ||
    location.pathname === "/matched" ||
    location.pathname === "/game-result-fade" ||
    location.pathname === "/game-result"
  ) {
    return null;
  }

  const isHomeActive = location.pathname === "/home";
  const isMyPageActive =
    location.pathname === "/mypage" ||
    location.pathname === "/member-profile" ||
    location.pathname.startsWith("/settings");

  const handleHomeClick = async () => {
    if (location.pathname !== "/quick-messages") {
      navigate("/home");
      return;
    }

    try {
      const activeMatch = await api.getActiveMatch();

      if (activeMatch) {
        alert("완료된 매칭이 존재합니다.");
        return;
      }
    } catch {
      alert("완료된 매칭이 존재합니다.");
      return;
    }

    navigate("/home");
  };

  const handleMainClick = async () => {
    if (isPreparingMatch) return;

    setIsPreparingMatch(true);

    try {
      const activeMatch = await api.getActiveMatch();

      if (activeMatch) {
        navigate(`/quick-messages?game=${activeMatch.game}&matchId=${activeMatch.id}`);
        return;
      }

      const queueStatus = await api.getQueueStatus();

      if (queueStatus.in_queue) {
        await api.leaveQueue();
        alert("기존 매칭 대기열에서 나왔습니다. 새 매칭 조건을 설정해 주세요.");
      }

      navigate("/game-choice");
    } catch (error) {
      alert(error instanceof Error ? error.message : "기존 매칭 대기열을 정리하지 못했습니다.");
    } finally {
      setIsPreparingMatch(false);
    }
  };

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <button type="button" className="bottom-nav__button" aria-label="홈" onClick={() => void handleHomeClick()}>
        <img
          src={isHomeActive ? homeButtonActive : homeButton}
          alt=""
          className="bottom-nav__icon bottom-nav__icon--home"
        />
      </button>

      <button
        type="button"
        className="bottom-nav__button"
        aria-label="매칭"
        disabled={isPreparingMatch}
        onClick={() => void handleMainClick()}
      >
        <img src={mainButton} alt="" className="bottom-nav__icon bottom-nav__icon--main" />
      </button>

      <Link to="/mypage" className="bottom-nav__button" aria-label="마이페이지">
        <img
          src={isMyPageActive ? myPageButtonActive : myPageButton}
          alt=""
          className="bottom-nav__icon bottom-nav__icon--mypage"
        />
      </Link>
    </nav>
  );
}

export default BottomNav;
