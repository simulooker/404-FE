import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/home", label: "홈" },
  { to: "/matching", label: "매칭", featured: true },
  { to: "/mypage", label: "마이" },
];

function BottomNav() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.to ||
          (item.to === "/matching" &&
            ["/match-setting", "/match-done", "/game-result"].includes(
              location.pathname,
            ));

        return (
          <Link
            key={item.to}
            to={item.to}
            className={[
              "bottom-nav__link",
              item.featured ? "bottom-nav__link--featured" : "",
              isActive ? "bottom-nav__link--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
