
import './App.css';
import LoginBuilder from "../../components/LoginBuilder/LoginBuilder";
import SiderLayout from "../../hoc/Layout/Layout";
import {Route,Switch} from 'react-router-dom';
import UserContext from '../../Context/Context';
import React,{ useState }  from 'react';

const App=()=>{
  const [data,setData]=useState();
  const addUserData=(userData)=>{
      setData(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
  }
  return (
    <UserContext.Provider value={{
      data,
      addUserData,
    }}>
      <Switch>
          <Route exact path="/" component={LoginBuilder}/>
          <Route exact path="/dashboard"><SiderLayout keyitem="1"/></Route>
          <Route exact path="/dashboard/hoghoghi"><SiderLayout keyitem="1"/></Route>
          <Route exact path="/dashboard/tamin"><SiderLayout keyitem="2"/></Route>
          <Route exact path="/dashboard/listtamin"><SiderLayout keyitem="3"/></Route>
          <Route exact path="/dashboard/addperson"><SiderLayout keyitem="4"/></Route>
          <Route exact path="/dashboard/accidentlist"><SiderLayout keyitem="5"/></Route>
          <Route exact path="/dashboard/forumlist"><SiderLayout keyitem="56"/></Route>
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
