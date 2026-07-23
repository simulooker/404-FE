import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CreateID from "./pages/createID";
import DiscordConnect from "./pages/DiscordConnect";
import GameAccountSettings from "./pages/GameAccountSettings";
import GameChoice from "./pages/GameChoice";
import GameResultFade from "./pages/gameresultfade";
import GameResult from "./pages/GameResult";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Matched from "./pages/matched";
import Matching from "./pages/Matching";
import MatchSetting from "./pages/MatchSetting";
import MemberProfile from "./pages/MemberProfile";
import MyPage from "./pages/MyPage";
import NotificationSettings from "./pages/NotificationSettings";
import ProfileEdit from "./pages/ProfileEdit";
import QuickMessages from "./pages/QuickMessages";
import Settings from "./pages/Settings";
import EmailVerification from "./pages/EmailVerification";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element={<Login />} />
          <Route path="/create-id" element={<CreateID />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game-choice" element={<GameChoice />} />
          <Route path="/match-setting" element={<MatchSetting />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/matched" element={<Matched />} />
          <Route path="/quick-messages" element={<QuickMessages />} />
          <Route path="/game-result-fade" element={<GameResultFade />} />
          <Route path="/game-result" element={<GameResult />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/member-profile" element={<MemberProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile" element={<ProfileEdit />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/discord" element={<DiscordConnect />} />
          <Route path="/settings/game-accounts" element={<GameAccountSettings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
