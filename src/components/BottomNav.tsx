import { Link, useLocation } from "react-router-dom";
import homeButton from "../assets/navigationbar/homebutton.png";
import homeButtonActive from "../assets/navigationbar/homebuttonactive.png";
import mainButton from "../assets/navigationbar/mainbutton.png";
import myPageButton from "../assets/navigationbar/mypagebutton.png";
import myPageButtonActive from "../assets/navigationbar/mypagebuttonactive.png";

function BottomNav() {
  const location = useLocation();

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
    location.pathname === "/mypage" || location.pathname.startsWith("/settings");

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <Link to="/home" className="bottom-nav__button" aria-label="홈">
        <img
          src={isHomeActive ? homeButtonActive : homeButton}
          alt=""
          className="bottom-nav__icon bottom-nav__icon--home"
        />
      </Link>

      <Link to="/game-choice" className="bottom-nav__button" aria-label="매칭">
        <img src={mainButton} alt="" className="bottom-nav__icon bottom-nav__icon--main" />
      </Link>

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
