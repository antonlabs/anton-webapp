export const getRightMarginFromElement = (element: HTMLElement) =>
  window.innerWidth - element.getBoundingClientRect().x;
