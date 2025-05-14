// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = (function() {
  let store = {}
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn(key => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})

// Mock ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
})
