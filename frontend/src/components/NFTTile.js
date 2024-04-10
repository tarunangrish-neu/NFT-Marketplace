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
      <div className="border-2 border-gray-800 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg md:w-72 shadow-2xl transition-transform duration-300 transform scale-100 hover:scale-110 inset-0">
        <img
          src={IPFSUrl}
          alt=""
          className="z-0 w-96 h-80 rounded-lg object-cover"
          crossOrigin="anonymous"
        />
        <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20 z-10">
          <strong className="text-sm">{data.data.name}</strong>
          <p className="display-inline">{data.data.description}</p>
        </div>
      </div>
    </Link>
  );
}
export default NFTTile;
