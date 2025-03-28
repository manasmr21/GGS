import axios from "axios";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"))
  
  const loginUser = async (data) => {
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email: data.useremail,
        password: data.password,
      });

      localStorage.setItem("token", data.token)

      setToken(localStorage.getItem("token"))

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUser = async(page)=>{
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`)
      setUsers(response.data.data)
      return response.data
    } catch (error) {
      console.log(error.message);
    }
  }

  const updateUser = async(updatedData, userID) =>{
    const response = await axios.put(`https://reqres.in/api/users/${userID}`, updatedData)

    if(response.status == 200){
      const updatedUsers = users.map((user) =>
        user.id === userID ? { ...user, ...response.data } : user
      );
      setUsers(updatedUsers);
    }

    return response.data

  }

  const deleteUser = async(userID)=>{
    try {
      const response = await axios.delete(`https://reqres.in/api/users/${userID}`)

      if(response.status == 204){
        const newUsers = users.filter(user=>{
          return user.id != userID
        })
        setUsers(newUsers);
      }

    } catch (error) {
      console.log(error.message)
    }
  }


  const logOut = ()=>{
    localStorage.removeItem("token")
    setToken(localStorage.getItem("token"))
  }


  return (
    <UserContext.Provider value={{ loginUser, fetchUser, updateUser, deleteUser,logOut, users, setUsers, token, setToken}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider