export const initStarwind = () => {
  document.dispatchEvent(new CustomEvent('starwind:init'));
};
