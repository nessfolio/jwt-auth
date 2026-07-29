'use client'

import Image from "next/image";
import LoginForm from "@/src/components/LoginForm";
import {useEffect, useState} from "react";
import {useStore} from "@/src/store/store";
import {IUser} from "@/src/models/IUser";
import UserService from "@/src/services/UserService";

export default function Home() {
    const {isAuth, user, logout, checkAuth, isLoading} = useStore()
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            checkAuth()
        }

    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (isAuth) {
        return (
            <div>
                <h1>{isAuth ? `Authorized: ${user.email}`: `Unauthorized`}</h1>
                <h1>{user.isActivated ? `Account is activated` : `Please activate your account`}</h1>
                <button onClick={() => logout()}>Log out</button>
                <div>
                    <br/><br/>
                    <button onClick={() => getUsers()}>get users</button>
                    {users.map(user => (
                        <div key={user.id}>{user.email}</div>
                    ))}
                </div>
            </div>
        )
    }


  return (
      <div>
        <LoginForm/>
      </div>
  );
}
