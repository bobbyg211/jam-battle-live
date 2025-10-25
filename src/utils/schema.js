// App.jsx (inside where you mount the provider)
const ROUTE_MAP = {
  home: "",
  setup: "setup",
  donate: "donate",
  battle: "battle",
  stages: "stages",
  fighters: "fighters",
  bracket: "bracket",
};

const schema = {
  currentScreen: {
    default: "home",
    validate: (v) => typeof v === "string" && v in ROUTE_MAP,
    onChange: (value, { navigate, location }) => {
      if (location.pathname.startsWith("/admin")) return;
      const target = `/display/${ROUTE_MAP[value]}`;
      if (location.pathname !== target) navigate(target);
    },
  },
};

export { schema };
