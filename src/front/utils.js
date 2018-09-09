const STEAMID_REGEXP = /^https:\/\/steamcommunity\.com\/profiles\/(\d+)/
const USERNAME_REGEXP = /^https:\/\/steamcommunity\.com\/id\/([^/#?]+)/

export const apiQueryFromUrl = (url) => {
  const username = url.match(USERNAME_REGEXP) && url.match(USERNAME_REGEXP)[1]
  const steamId = url.match(STEAMID_REGEXP) && url.match(STEAMID_REGEXP)[1]

  if (username) {
    return `name=${username}`
  }

  if (steamId) {
    return `id=${steamId}`
  }

  return null
}

export const getLocalStorageJSON = (key, defaultValue = null) => {
  if (!window.localStorage) {
    return defaultValue
  }

  if (!localStorage.getItem(key)) {
    return defaultValue
  }

  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (err) {
    console.error('Storage is malformed')
    console.error(err)
    return defaultValue
  }
}

export const setLocalStorageJSON = (key, value) => {
  if (!window.localStorage) {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(err)
  }
}
