export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetters(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}