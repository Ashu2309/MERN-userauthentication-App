import React, { useState } from 'react'
import UserContext from "./UserContext";
import axios from "axios"
axios.defaults.baseURL = "http://localhost:8000";

const UserState = (props) => {
    const [username, setUsername] = useState(null);
    const state = {
        name: "Ashu",
        class: "TE A",
    };

    //authenticate
    const authenticate = async (username) => {
        try {
            return await axios.post('/api/authenticate', { username })
        } catch (error) {
            return { error: "Username doesnt exist !" }
        }
    }

    const getUser = async (username) => {
        try {
            const data = await axios.get(`/api/user/${username}`);
            return data;
        } catch (error) {
            return { error: "Password doesn't match !" }
        }
    }


    /** register user function */
    const registerUser = async (credentials) => {
        try {
            const response = await axios.post(`/api/register`,
                {
                    username: credentials.name.toString(),
                    email: credentials.email.toString(),
                    password: credentials.password.toString()
                },
                {
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });

            /** send email */
            if (response.status === 201) {
                await axios.post('/api/registerMail', { username: credentials.name.toString(), email: credentials.email.toString(), text: response.msg })
            }
            console.log(response.data)
            return { success: true, data: response.data };
        } catch (error) {
            console.log(error)
            return { success: false, error: error };
        }
    }
    // const register = async (name, email, password) => {
    //     console.log(name, email, password.toString())
    //     const response = await fetch(`http://localhost:8000/api/register`, {
    //         method: "POST",
    //         headers: {
    //             'Accept': '*/*',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             username: name.toString(),
    //             email: email.toString(),
    //             password: password.toString(),
    //             profile: ""
    //         }),
    //     });
    //     const json = await response.json();
    //     console.log(json)
    // }
    const verifyPassword = async (username, password) => {
        try {
            if (username) {
                const response = await axios.post('/api/login',
                    {
                        username: username.toString(),
                        password: password.toString()
                    },)
                return { success: true, data: response.data };
            } else {
                return { success: false, data: "error" };
            }
        } catch (error) {
            console.log(error)
            return { success: false, error: error };
        }
    }

    const updateUser = async (response) => {
        try {

            const token = await localStorage.getItem('token');
            const data = await axios.put('/api/updateuser',
                {
                    firstName: response.firstname.toString(),
                    lastName: response.lastname.toString(),
                    mobile: response.mobile,
                    address: response.address.toString(),

                }
                , { headers: { "Authorization": `Bearer ${token}` } });

            return { success: true, data: data };

        } catch (error) {
            return { success: false, error: error };

        }
    }

    const generateOTP = async (username) => {
        try {
            const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

            if (status === 201) {
                let data_user = await getUser(username);
                let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
                console.log(data_user.data.email)

                await axios.post('/api/registerMail', { username, email: data_user.data.email, text, subject: "Password Recovery OTP" })
            }
            console.log(code)
            return Promise.resolve(code);
        } catch (error) {
            return Promise.reject({ error });
        }
    }

    /** verify OTP */
    const verifyOTP = async ({ username, code }) => {
        try {
            const response = await axios.get('/api/verifyOTP', { params: { username, code } })
            return { "response": response.data, "success": true }
        } catch (error) {
            return { error, "success": false };
        }
    }

    /** reset password */
    const resetPassword = async ({ username, password }) => {
        try {
            const { data, status } = await axios.put('/api/resetPassword', { username, password }, {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            return Promise.resolve({ data, status })
        } catch (error) {
            return Promise.reject(error)
        }
    }





    return (
        <>
            <UserContext.Provider
                value={{ state, registerUser, verifyPassword, updateUser, generateOTP, verifyOTP, resetPassword, username, setUsername }}
            >{props.children}</UserContext.Provider>
        </>
    )
}

export default UserState