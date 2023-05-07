
import { AxiosError } from 'axios';
import { Component } from 'react';
import AdminView from './Components/AdminView/AdminView';
import UserView from './Components/UserView/UserView';
import GuestView from './Components/GuestView/GuestView';
import jwtAxios from "./Services/JwtAxios"
import './App.css';

interface AppState {
  role: string;
}
class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = ({ role: "" });
  }

  logOut = () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("loginTime");
    console.log("User is logged out");
    this.setState({ role: "" });
  }

  changeUserByCallback = (userRole: string) => {
    this.setState({ role: userRole });
  }

  componentDidMount = async () => {
    if (localStorage.getItem("loginData") && localStorage.getItem("loginTime")) {
      let currentDate = new Date();
      let lastLoginTime = new Date(JSON.parse(localStorage.loginTime));

      //checking when was last login ?
      if (currentDate.getTime() - lastLoginTime.getTime() < 3600000) { 
        try {
          const role: string = JSON.parse(localStorage.loginData).role;
          const res = await jwtAxios.get<string>(`http://localhost:3800/${role}`);
          console.log(res.data); //@@@@@@@@@@@@@@@@@@@@@@@@@@@
          this.setState({ role: role });
        }
        catch (err) {
          let x = err as AxiosError;
          //console.log(`${x.response?.status} --- ${x.response?.data}`);
          console.log("Your session is timed out");

          if (localStorage.loginData)
            this.logOut();
        }
      }
      else
        this.logOut();
    }
  }

  render(): JSX.Element {
    return <div className="App">
      {this.state.role === "admin" ? <AdminView logOutKey={this.logOut} /> : null}
      {this.state.role === "user" ? <UserView logOutKey={this.logOut} /> : null}

      {localStorage.getItem("loginData") ? null : <GuestView rollCallBack={this.changeUserByCallback} />}
    </div >
  }
}

export default App;