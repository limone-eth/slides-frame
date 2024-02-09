export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://slides-frame.vercel.app/"
    : "http://localhost:3001";
