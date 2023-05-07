import { Component } from "react";
import AdminNav from "../AdminNav/AdminNav";
import GuestNav from "../GuestNav/GuestNav";
import "./HeaderBar.css";

interface HeaderBarProps {
    logOutKey: () => void;
}

class HeaderBar extends Component<HeaderBarProps> {
    constructor(props: HeaderBarProps) {
        super(props);
    }

    logOutBtn = () => { //delete local storage and navigate to login page
        return <span>
            <button className="logOutBtn" onClick={this.props.logOutKey}>Log out</button>
            &nbsp;&nbsp;
        </span >
    }

    render(): JSX.Element {

        if (localStorage.getItem("loginData")) { //Logged-in:
            return <div className="HeaderBar">

                <div className="NavBar">
                    &nbsp; Hello {JSON.parse(localStorage.loginData).firstName}!
                </div>

                <div className="NavBar">
                    {JSON.parse(localStorage.loginData).role === "user" ?
                        this.logOutBtn()
                        : null}
                    {JSON.parse(localStorage.loginData).role === "admin" ?
                        <AdminNav logOutBtn={this.props.logOutKey} />   
                        : null}
                </div>
            </div>
        }
        else { //Guest:
            return <div className="HeaderBar">
                <div className="NavBar">
                    &nbsp; Hello guest!
                </div>
                <div className="NavBar">
                    <GuestNav />
                </div>
            </div>
        }
    }
}

export default HeaderBar;