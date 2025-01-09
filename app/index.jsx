import { useEffect } from 'react'

import { StateContextProvider, useStateContext } from './state/context'
import { SignUp } from './(auth)/sign-up'
import { SignIn } from './(auth)/sign-in'
import "../global.css";


import { useRouter } from 'expo-router';

function HomeScreen() {
   const router = useRouter();
   useEffect(() => {
      router.replace("/MyDiaries");
   }, [router]);
}

function AuthGuard({ children }) {
   const { state } = useStateContext()

   if (!state.isSigned) {
      return <SignUp />
   }

   if (!state.isLogged) {
      return <SignIn />
   }

   return children
}

export default function App() {
   return (
         <StateContextProvider>
            <AuthGuard>
               <HomeScreen/>
            </AuthGuard>
         </StateContextProvider>
   )
}