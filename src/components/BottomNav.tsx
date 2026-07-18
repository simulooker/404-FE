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

  if (
    location.pathname === "/" ||
    location.pathname === "/create-id" ||
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
      // 매칭 상태를 확인하지 못한 경우에도 게임 중인 채팅방을 유지합니다.
      alert("완료된 매칭이 존재합니다.");
      return;
    }

    navigate("/home");
  };

  const handleMainClick = async () => {
    try {
      const activeMatch = await api.getActiveMatch();

      if (activeMatch) {
        navigate(`/quick-messages?game=${activeMatch.game}&matchId=${activeMatch.id}`);
        return;
      }
    } catch {
      // 활성 매칭이 없거나 상태 확인에 실패하면 일반 매칭 시작 화면으로 이동합니다.
    }

    navigate("/game-choice");
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

      <button type="button" className="bottom-nav__button" aria-label="매칭" onClick={() => void handleMainClick()}>
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
