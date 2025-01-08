import React, { useContext, useReducer } from 'react'

import { reducer, init } from './state'

const StateContext = React.createContext(null)

export function StateContextProvider({
   children
}) {
   const [state, dispatch] = useReducer(reducer, {}, init)

   return <StateContext.Provider value={{ state, dispatch }}>
      {children}
   </StateContext.Provider>
}

export function useStateContext() {
   const context = useContext(StateContext)

   if (context === null) {
      throw new Error('StateContext usage outside of context scope')
   }

   return context
}