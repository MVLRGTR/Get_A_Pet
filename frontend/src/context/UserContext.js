import { createContext } from "react"
import useAuth from "../hooks/useAuth"

const Context = createContext()

function UserProvider({children}){
    const {authenticated,register,logout,login,primaryLogin,ForgotPasswordUser} = useAuth()

    return(
        <Context.Provider value={{authenticated,register,logout,login,primaryLogin,ForgotPasswordUser}}>
            {children}
        </Context.Provider>
    )
}

export {Context,UserProvider}