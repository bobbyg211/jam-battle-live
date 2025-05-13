import logo from "../assets/jam-battle-logo.png";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { MatchupsContext } from "../contexts/MatchupsContext";
import { useLocation } from "react-router-dom";

export default function Bracket() {
  const location = useLocation();
  const { state } = location;
  const { match, winner } = state || {};
  const { matchups, setMatchups } = useContext(MatchupsContext) || {}; // Access matchups from context

  console.log(match, winner, matchups);

  useEffect(() => {
    console.log("match:", match);
    console.log("winner:", winner);
    console.log("matchups.matches:", matchups?.matches || {});

    if (
      match &&
      winner &&
      matchups &&
      setMatchups &&
      Object.values(matchups.matches).some((m) => m.match === match)
    ) {
      console.log("Condition is true, updating matchups...");

      setMatchups((prevMatchups) => {
        const updatedMatches = { ...prevMatchups.matches };
        const matchKey = Object.keys(updatedMatches).find(
          (key) => updatedMatches[key as keyof typeof updatedMatches].match === match
        );

        if (matchKey) {
          updatedMatches[matchKey as keyof typeof updatedMatches].winner = winner;

          // Update fighters for subsequent matches
          updatedMatches.match5.fighter1.name =
            updatedMatches.match1.winner.name || updatedMatches.match5.fighter1.name;
          updatedMatches.match5.fighter2.name =
            updatedMatches.match2.winner.name || updatedMatches.match5.fighter2.name;

          updatedMatches.match6.fighter1.name =
            updatedMatches.match3.winner.name || updatedMatches.match6.fighter1.name;
          updatedMatches.match6.fighter2.name =
            updatedMatches.match4.winner.name || updatedMatches.match6.fighter2.name;

          updatedMatches.match7.fighter1.name =
            updatedMatches.match5.winner.name || updatedMatches.match7.fighter1.name;
          updatedMatches.match7.fighter2.name =
            updatedMatches.match6.winner.name || updatedMatches.match7.fighter2.name;
        }

        return { ...prevMatchups, matches: updatedMatches };
      });
    } else {
      console.log("Condition is false, not updating matchups.");
    }
  }, [location.key]); // Run every time the page is visited

  if (!matchups) {
    return <div>Loading...</div>; // Handle case where context is not yet available
  }

  return (
    <div className="bracket container">
      <div className="content">
        <img className="logo" src={logo} alt="Jam Battle Logo" />
        <div className="left initial column">
          <div className="match match1">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match1.fighter1.name === matchups.matches.match1.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match1.winner.name && (
                <h3>{matchups.matches.match1.fighter1.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match1.fighter2.name === matchups.matches.match1.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match1.winner.name && (
                <h3>{matchups.matches.match1.fighter2.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            {!matchups.matches.match1.winner.name && (
              <Link
                to="/fighters"
                state={{
                  fighter1: matchups.matches.match1.fighter1,
                  fighter2: matchups.matches.match1.fighter2,
                  match: matchups.matches.match1.match,
                }}
                className="glow-btn fight"
              >
                Fight
              </Link>
            )}
          </div>
          <div className="match match2">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match2.fighter1.name === matchups.matches.match2.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match2.winner.name && (
                <h3>{matchups.matches.match2.fighter1.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match2.fighter2.name === matchups.matches.match2.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match2.winner.name && (
                <h3>{matchups.matches.match2.fighter2.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            {!matchups.matches.match2.winner.name && (
              <Link
                to="/fighters"
                state={{
                  fighter1: matchups.matches.match2.fighter1,
                  fighter2: matchups.matches.match2.fighter2,
                  match: matchups.matches.match2.match,
                }}
                className="glow-btn fight"
              >
                Fight
              </Link>
            )}
          </div>
        </div>
        <div className="left semis column">
          <div className="match match5">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match5.fighter1.name === matchups.matches.match5.winner.name &&
                matchups.matches.match5.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match5.fighter1.name.replace(/-/g, " ")}</h3>
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match5.fighter2.name === matchups.matches.match5.winner.name &&
                matchups.matches.match5.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match5.fighter2.name.replace(/-/g, " ")}</h3>
            </div>
            {matchups.matches.match1.winner.name &&
              matchups.matches.match2.winner.name &&
              !matchups.matches.match5.winner.name && (
                <Link
                  to="/battle"
                  state={{
                    fighter1: matchups.matches.match1.winner,
                    fighter2: matchups.matches.match2.winner,
                    match: matchups.matches.match5.match,
                  }}
                  className="glow-btn fight"
                >
                  Fight
                </Link>
              )}
          </div>
        </div>
        <div className="center finals column">
          <h3 className="final">FINALS</h3>
          <div className="match match7">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match7.fighter1.name === matchups.matches.match7.winner.name &&
                matchups.matches.match7.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match7.fighter1.name.replace(/-/g, " ")}</h3>
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match7.fighter2.name === matchups.matches.match7.winner.name &&
                matchups.matches.match7.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match7.fighter2.name.replace(/-/g, " ")}</h3>
            </div>
            {matchups.matches.match5.winner.name &&
              matchups.matches.match6.winner.name &&
              !matchups.matches.match7.winner.name && (
                <Link
                  to="/battle"
                  state={{
                    fighter1: matchups.matches.match5.winner,
                    fighter2: matchups.matches.match6.winner,
                    match: matchups.matches.match7.match,
                  }}
                  className="glow-btn fight"
                >
                  Fight
                </Link>
              )}
          </div>
        </div>
        <div className="right semis column">
          <div className="match match6">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match6.fighter1.name === matchups.matches.match6.winner.name &&
                matchups.matches.match6.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match6.fighter1.name.replace(/-/g, " ")}</h3>
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match6.fighter2.name === matchups.matches.match6.winner.name &&
                matchups.matches.match6.winner.name !== ""
                  ? "winner"
                  : ""
              }`}
            >
              <h3>{matchups.matches.match6.fighter2.name.replace(/-/g, " ")}</h3>
            </div>
            {matchups.matches.match3.winner.name &&
              matchups.matches.match4.winner.name &&
              !matchups.matches.match6.winner.name && (
                <Link
                  to="/battle"
                  state={{
                    fighter1: matchups.matches.match3.winner,
                    fighter2: matchups.matches.match4.winner,
                    match: matchups.matches.match6.match,
                  }}
                  className="glow-btn fight"
                >
                  Fight
                </Link>
              )}
          </div>
        </div>
        <div className="right initial column">
          <div className="match match3">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match3.fighter1.name === matchups.matches.match3.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match3.winner.name && (
                <h3>{matchups.matches.match3.fighter1.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match3.fighter2.name === matchups.matches.match3.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match3.winner.name && (
                <h3>{matchups.matches.match3.fighter2.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            {!matchups.matches.match3.winner.name && (
              <Link
                to="/fighters"
                state={{
                  fighter1: matchups.matches.match3.fighter1,
                  fighter2: matchups.matches.match3.fighter2,
                  match: matchups.matches.match3.match,
                }}
                className="glow-btn fight"
              >
                Fight
              </Link>
            )}
          </div>
          <div className="match match4">
            <div
              className={`fighter fighter1 ${
                matchups.matches.match4.fighter1.name === matchups.matches.match4.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match4.winner.name && (
                <h3>{matchups.matches.match4.fighter1.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            <div
              className={`fighter fighter2 ${
                matchups.matches.match4.fighter2.name === matchups.matches.match4.winner.name
                  ? "winner"
                  : ""
              }`}
            >
              {matchups.matches.match4.winner.name && (
                <h3>{matchups.matches.match4.fighter2.name.replace(/-/g, " ")}</h3>
              )}
            </div>
            {!matchups.matches.match4.winner.name && (
              <Link
                to="/fighters"
                state={{
                  fighter1: matchups.matches.match4.fighter1,
                  fighter2: matchups.matches.match4.fighter2,
                  match: matchups.matches.match4.match,
                }}
                className="glow-btn fight"
              >
                Fight
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
