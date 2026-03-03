// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;
window.IntersectionObserver = MockIntersectionObserver;

HTMLCanvasElement.prototype.getContext = () => ({
  canvas: document.createElement('canvas'),
  beginPath: () => {},
  lineWidth: 0,
  strokeStyle: '',
  lineTo: () => {},
  stroke: () => {},
  closePath: () => {},
  fillStyle: '',
  globalAlpha: 1,
  fillRect: () => {},
  filter: ''
});
