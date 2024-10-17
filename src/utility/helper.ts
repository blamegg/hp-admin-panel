import Cookies from "js-cookie";

// utils/timeFormatter.ts
export const formatTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
};

// set token
export function setTokenCookie(token: string) {
  const oneYear = 365;
  Cookies.set("token", token, {
    expires: oneYear,
    sameSite: "strict",
  });
}

// get token
export function getTokenCookie() {
  const token = Cookies.get("token");
  return token;
}

// remove token
export function removeTokenCookie() {
  Cookies.remove("token");
}
