
import './App.css';
import LoginBuilder from "../../components/LoginBuilder/LoginBuilder";
import SiderLayout from "../../hoc/Layout/Layout";
import {Route,Switch} from 'react-router-dom';

function App() {
  return (
      <Switch>
          <Route exact path="/" component={LoginBuilder}/>
          <Route exact path="/dashboard"><SiderLayout keyitem="1"/></Route>
          <Route exact path="/dashboard/hoghoghi"><SiderLayout keyitem="1"/></Route>
          <Route exact path="/dashboard/tamin"><SiderLayout keyitem="2"/></Route>
          <Route exact path="/dashboard/listtamin"><SiderLayout keyitem="3"/></Route>
          <Route exact path="/dashboard/addperson"><SiderLayout keyitem="4"/></Route>
      </Switch>
  );
}

export default App;
