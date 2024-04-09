import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";
import "./Navbar.css";
function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo} className="relative z-0">
      <div>
        <img
          src={IPFSUrl}
          alt=""
          className="z-0 w-96 h-80 rounded-lg object-cover"
          crossOrigin="anonymous"
        />
        <div>
          <strong>{data.data.name}</strong>
          <p>{data.data.description}</p>
        </div>
      </div>
    </Link>
  );
}
export default NFTTile;
