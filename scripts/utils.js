export function parseSecondsToDateString(seconds) {
  const minutes = Math.floor(seconds / (60 * 60));
  const secs = seconds % 60;
  return seconds > 0
    ? `${minutes < 10 ? "0" + minutes : minutes}:${
        secs < 10 ? "0" + secs : secs
      }`
    : "00:00";
}
