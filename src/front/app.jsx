import React from 'react'

import SelectFriends from './select-friends/index.jsx'
import Party from './party/index.jsx'
import RecommendedGames from './recommended-games/index.jsx'

export const App = () => {
  return <>
    <SelectFriends />
    <Party />
    <RecommendedGames />
  </>
}
