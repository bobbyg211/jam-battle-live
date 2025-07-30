import { useState } from "react";
import { Link } from "react-router";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import {
  Menu as Hamburger,
  Home,
  Settings,
  EmojiEvents,
  VolunteerActivism,
} from "@mui/icons-material";

export default function GlobalNav() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="hover-area left"></div>
      <div className="hover-area right"></div>
      <div className="global-nav">
        <IconButton
          className="glow-btn menu-open"
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
        >
          <Hamburger />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose} component={Link} to="/">
            <Home sx={{ mr: 1 }} /> Home
          </MenuItem>

          <MenuItem onClick={handleClose} component={Link} to="/setup">
            <Settings sx={{ mr: 1 }} /> Setup
          </MenuItem>

          <MenuItem onClick={handleClose} component={Link} to="/bracket">
            <EmojiEvents sx={{ mr: 1 }} /> Bracket
          </MenuItem>

          <MenuItem onClick={handleClose} component={Link} to="/donate">
            <VolunteerActivism sx={{ mr: 1 }} /> Donate
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}
