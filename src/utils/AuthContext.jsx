import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserOnload();
    }, []);

    const getUserOnload = async () => {
        try {
            const accountDetails = await account.get();  
            console.log(accountDetails)
            setUser(accountDetails)
        } catch (error) {
            console.info(error);
        }
        setLoading(false);
    };

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();

        try {
            const response = await account.createEmailPasswordSession(credentials.email, credentials.password);
            console.log(response);
            const accountDetails = await account.get();  
            setUser(accountDetails);

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserLogout = async () => {
        try {
            await account.deleteSession("current");  
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserRegister = async (e,credentials) => {
        e.preventDefault()

        if(credentials.password1 !== credentials.password2) {
            alert('Passwords do not match!')
            return
        }

        try{
            const response = await account.create(ID.unique(),
            credentials.email, 
            credentials.password1,
            credentials.name)

            console.log(response)

            await account.createEmailPasswordSession(credentials.email, credentials.password1)
            const accountDetails = await account.get();  
            console.log(accountDetails)
            setUser(accountDetails)
            navigate('/')

            
        }
        catch(error){
            console.error(error)
        }
       
    };

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
        handleUserRegister,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
