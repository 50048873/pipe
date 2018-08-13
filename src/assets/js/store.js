import storage from 'good-storage'

const inspectedPath = '__inspectedPath__'

export function setItem (key, value) {
  return storage.set(key, value)
}

export function getItem (key) {
  return storage.get(key)
}

export function saveInspectedPath (position) {
  let arr = storage.get(inspectedPath, [])
  let len = arr.length
  let prev = arr[len - 1]
  if (prev) {
    if (prev.time === position.time) {
      return
    }
  }
  arr.push(position)
  storage.set(inspectedPath, arr)
  return arr
}
