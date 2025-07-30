import logo from "../assets/jam-battle-logo.png";

export default function Setup() {
  return (
    <div className="setup container">
      <div className="content">
        <img className="logo" src={logo} alt="Jam Battle Logo" />
      </div>
    </div>
  );
}
