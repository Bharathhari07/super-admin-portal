// Stands in for an axios/fetch client while there is no real backend yet.
// Every function here simulates the shape of a real network call:
// - it waits a bit, like a real request would
// - it works off a deep copy of the "database" so mutations don't
//   accidentally leak into the dummy data module by reference
// - it can simulate an occasional failure so error handling in the
//   UI actually gets exercised
//
// Swapping this out later for real axios calls should only mean
// changing the contents of these functions, not the hooks that call them.

const NETWORK_DELAY_MS = 500

export function simulateDelay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(deepClone(value)), ms)
  })
}

export function simulateMutationDelay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(deepClone(value)), ms)
  })
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Occasionally rejects to exercise error-handling paths in the UI.
// Kept at a low rate so it doesn't get in the way during normal use/testing.
export function maybeFail(failRate = 0): void {
  if (failRate > 0 && Math.random() < failRate) {
    throw new Error('Network request failed. Please try again.')
  }
}