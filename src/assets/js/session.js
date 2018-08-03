import storage from 'good-storage'

export function setItem (key, value) {
  return storage.session.set(key, value)
}

export function getItem (key) {
  return storage.session.get(key)
}

export function clearItem (key) {
  return storage.session.remove(key)
}
