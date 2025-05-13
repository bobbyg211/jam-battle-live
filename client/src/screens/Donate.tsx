import logo from "../assets/jam-battle-logo.png";
import venmo from "../assets/MyVenmoQRCode.png";

export default function donate() {
  return (
    <div className="donate container">
      <div className="content">
        <div className="main">
          <img className="logo" src={logo} alt="Jam Battle Logo" />
          <h1>Please consider donating</h1>
          <h2 style={{ position: "relative", top: "-15px" }}>All proceeds go to the artists</h2>

          <span
            style={{
              fontSize: "28px",
              fontFamily: "sans-serif",
              position: "fixed",
              bottom: "0px",
              left: "50%",
              transform: "translate(-50%, 0)",
              width: "100%",
              textAlign: "center",
              background: "black",
              color: "white",
              padding: "10px",
              display: "block",
            }}
          >
            Follow @umamihousemusic for future events and updates!
          </span>
        </div>
        <div className="venmo">
          <img
            className="qr"
            src={venmo}
            alt="Venmo QR Code"
            style={{ position: "relative", top: "-20px" }}
          />
        </div>
      </div>
    </div>
  );
}
