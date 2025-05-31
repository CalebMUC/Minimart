import { children, createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [usercontextname,setUserName] = useState(localStorage.getItem('username'))

    const updateUser = (newusername) =>{
        setUserName(newusername)

        localStorage.setItem('username',newusername)
    };

    return(
        <UserContext.Provider value={{usercontextname,updateUser}}>
            {children}
        </UserContext.Provider>
    );
}