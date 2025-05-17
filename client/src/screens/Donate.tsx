// import logo from "../assets/jam-battle-logo.png";
// import qr from "../assets/alfred-venmo.png";
// import qr from "../assets/robert-venmo.png";
import qr from "../assets/malik-gofundme.jpg";
import malik from "../assets/fighters/malik.png";

export default function Donate() {
  return (
    <div className="donate container">
      <div className="content">
        {/* <img className="logo" src={logo} alt="Jam Battle Logo" /> */}
        <div className="main">
          <div className="details">
            <h1 style={{ fontSize: "50px" }}>Please consider donating</h1>
            <h2 style={{ position: "relative", top: "-15px" }}>
              All proceeds go to Malik's GoFundMe
            </h2>
          </div>
          <img className="malik" src={malik} alt="Malik" />
          <div className="follow">Follow @umamihousemusic for future events and updates!</div>
        </div>
        <div className="venmo">
          <img className="qr" src={qr} style={{ position: "relative", top: "-20px" }} />
        </div>
      </div>
    </div>
  );
}
