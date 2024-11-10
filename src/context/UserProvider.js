import { useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

const url = "http://localhost:3001";


export default function UserProvider({ children }) {
    const UserFromSessionStorage = sessionStorage.getItem('user');
    const [user, setUser] = useState(UserFromSessionStorage ? JSON.parse(UserFromSessionStorage) : { email: '', password: '' });

    const signUp = async () => {
        const json = JSON.stringify(user);
        const headers = { headers: { 'Content-Type': 'application/json' } };
    
        try {
            await axios.post(`${url}/user/register`, json, headers);
            setUser({ email: '', password: '' });
        } catch (error) {
            console.error("Sign Up Error:", error); // Log the full error object
            const message = error.response?.data?.error || "Registration failed. Please try again.";
            throw new Error(message);
        }
    };
    
    const signIn = async () => {
        const json = JSON.stringify(user);
        const headers = { headers: {'Content-Type': 'application/json'}};
    
        try {
            const response = await axios.post(`${url}/user/login`, json, headers);
            setUser(response.data);
            sessionStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Sign In Error:", error); // Log the full error object
            const message = error.response?.data?.error || "Login failed. Please check your credentials.";
            throw new Error(message);
        }
    };
    
    

    return (
        <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
            {children}
        </UserContext.Provider>

    )
}