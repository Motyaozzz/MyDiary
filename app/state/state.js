import { useReducer } from 'react'
import * as SecureStore from "expo-secure-store";

export function reducer(state, action) {
    switch (action.type) {
        case 'SIGN-UP': {
            const newState = { ...state }
            newState.loginErr = undefined

            const { password } = action.payload

            if (password.length < 4) {
               newState.loginErr = 'Пароль должен быть от 4-х символов'
               return newState
            }
            if (password.length > 32) {
               newState.loginErr = 'Пароль должен быть до 32-х символов'
               return newState
            }

            SecureStore.setItem('diaryPassword', action.payload.password)

            newState.isSigned = true
            newState.isLogged = true

            return newState
        }
         case 'SIGN-IN': {
            const newState = { ...state }
            newState.loginErr = undefined
            const password = SecureStore.getItem('diaryPassword')
            if (action.payload.password !== password){
               newState.loginErr = 'Неверный пароль'
               return newState
            }

            newState.isLogged = true

            return newState
         }
         case 'RESET-PASS': {
            const newState = { ...state }
            newState.loginErr = undefined
            newState.isLogged = false
            newState.isSigned = false
            return newState
         }
        default:
            return state
    }
}

export function init(initState) {
    const storedPassword = SecureStore.getItem('diaryPassword')

    const isLogged = false
    const isSigned = storedPassword !== null

    return {
        notes: [],
        isSigned,
        isLogged
    }
}