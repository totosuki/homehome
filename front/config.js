// environment
// "development" || "production"
const ENV = "production";

let env = {
  BASE_URL: "",
};

if (ENV === "development") {
  env.BASE_URL = "http://localhost:8000";
} else if (ENV === "production") {
  env.BASE_URL = "https://homehome.help";
}
