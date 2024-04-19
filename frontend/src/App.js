import "./App.css";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import SellNFT from "./components/SellNFT";
import NFTPage from "./components/NFTpage";
import Hero from "./components/Hero/Hero";

import { HashRouter, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <HashRouter>
        <Route path="/" element={<Hero />} />
        <Route path="/Marketplace" element={<Marketplace />} />
        <Route path="/nftPage" element={<NFTPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellNFT" element={<SellNFT />} />
      </HashRouter>
    </div>
  );
}

export default App;
