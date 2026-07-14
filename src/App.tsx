import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CreateID from "./pages/createID";
import DiscordConnect from "./pages/DiscordConnect";
import GameChoice from "./pages/GameChoice";
import GameResultFade from "./pages/gameresultfade";
import GameResult from "./pages/GameResult";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MatchDone from "./pages/MatchDone";
import Matched from "./pages/matched";
import Matching from "./pages/Matching";
import MatchSetting from "./pages/MatchSetting";
import MyPage from "./pages/MyPage";
import NotificationSettings from "./pages/NotificationSettings";
import ProfileEdit from "./pages/ProfileEdit";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element={<Login />} />
          <Route path="/create-id" element={<CreateID />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game-choice" element={<GameChoice />} />
          <Route path="/match-setting" element={<MatchSetting />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/matched" element={<Matched />} />
          <Route path="/match-done" element={<MatchDone />} />
          <Route path="/game-result-fade" element={<GameResultFade />} />
          <Route path="/game-result" element={<GameResult />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile" element={<ProfileEdit />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/discord" element={<DiscordConnect />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
