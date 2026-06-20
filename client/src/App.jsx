import { useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'




function App() {
  const [users,setUsers]=useState([]);
  const [filterUser,setFilterUser]=useState([]);
  const [isModelOpen,setIsModelOpen]=useState(false);
  const [userData,setUserData]=useState({name:"",age:"",city:""});
  const getAllUsers=async()=>{
    await axios.get("http://localhost:8000/users").then((res)=>{
      console.log(res.data);
      setUsers(res.data);
      setFilterUser(res.data);
    });
  }

  useEffect(()=>{
    getAllUsers();
  },[]);
  const handleChange=(e)=>{
    const searchText=e.target.value.toLowerCase();
    const filteredUsers=users.filter((user)=>{
      return user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText);
    });
    setFilterUser(filteredUsers);
  }
  const handleDelete= async(id)=>{
    const isConfirmed=window.confirm("Are you sure you want to delete this user?");
    if(!isConfirmed){
      return;
    }else{
    await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
      console.log(res.data);
      setFilterUser(res.data);
    });
  }}
  const handleAddRecord=()=>{
    setUserData({name:"",age:"",city:""});
    setIsModelOpen(true);
  }
  const handleData=(e)=>{
    setUserData({...userData,[e.target.id]:e.target.value});
  }
  const handleAddUser=async(e)=>{
    e.preventDefault();
    await axios.post("http://localhost:8000/users",userData).then((res)=>{
      console.log(res.data);
      setFilterUser(res.data);
      setIsModelOpen(false);
    });
  }
 const closeModel=()=>{
  setIsModelOpen(false)
  getAllUsers();
 }
const handleRecord=async(user)=>{
  setUserData(user);
  setIsModelOpen(true);
}
const handleSubmit=async(e)=>{
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
    console.log(res.data);
  });
  }else{
    return console.error("No user Id found");
  }
 
  setIsModelOpen(false);
  getAllUsers();
}
  return (
    
    <>
     <div className="container">
      <h3>Crud Application</h3>
      <div className="input-search">
        <input type="search" placeholder="Search..." onChange={handleChange} />
        <button className="btn green" onClick={handleAddRecord}>Add Record</button>
      </div>
     <table className="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Age</th>
          <th>City</th>
           <th>Update</th>
           <th>Delete</th>

        </tr>
      </thead>
      <tbody>
       { filterUser && filterUser.map((user,index)=>(
         <tr key={user.id}>
           <td>{index+1}</td>
           <td>{user.name}</td>
           <td>{user.age}</td>
           <td>{user.city}</td>
           <td><button className='btn green' onClick={()=>handleRecord(user)}>Edit</button></td>
           <td><button className='btn red' onClick={()=>handleDelete(user.id)}>Delete</button></td>
         </tr>
       ))}
      </tbody>
     </table>
     {isModelOpen && (
      <div className="model">
        <div className="model-content">
        <span className='close' onClick={closeModel}>#</span>
          <h3>{userData.id ? "Edit User" : "Add User"}</h3>
          <div className='input-group'>
            <label htmlFor="name">Name</label>
            <input type="text"   name= "name" id='name' placeholder='Enter Name' value={userData.name} onChange={handleData} />
          </div>
          <div className='input-group'>
            <label htmlFor="age">Age</label>
            <input type="number" name="age" id='age' placeholder='Enter Age' value={userData.age} onChange={handleData} />
          </div>
          <div className='input-group'>
            <label htmlFor="city">City</label>
            <input type="text" name="city" id='city' placeholder='Enter City' value={userData.city} onChange={handleData} />
            <button className='btn green' onClick={userData.id ? handleSubmit : handleAddUser}>
              {userData.id ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      </div>
     )}
     </div>
      
    </>
  )
}

export default App
