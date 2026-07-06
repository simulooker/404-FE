import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import GameChoice from "./pages/GameChoice";
import GameResult from "./pages/GameResult";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MatchDone from "./pages/MatchDone";
import Matching from "./pages/Matching";
import MatchSetting from "./pages/MatchSetting";
import MyPage from "./pages/MyPage";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game-choice" element={<GameChoice />} />
          <Route path="/match-setting" element={<MatchSetting />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/match-done" element={<MatchDone />} />
          <Route path="/game-result" element={<GameResult />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
