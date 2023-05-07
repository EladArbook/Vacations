import { Component } from "react";
import { NavLink } from "react-router-dom";

interface AdminNavProps {
    logOutBtn: () => void;
}

class AdminNav extends Component<AdminNavProps>{
    constructor(props: AdminNavProps) {
        super(props);
    }

    render(): JSX.Element {
        return <nav>
            <NavLink to="/" style={({ isActive }) => ({
                background: isActive ? 'rgb(84, 205, 84)' : 'transparent',
                color: 'white'
            })}>Edit&nbsp;Vacations</NavLink>

            &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;

            <NavLink to="/add" style={({ isActive }) => ({
                background: isActive ? 'rgb(84, 205, 84)' : 'transparent',
                color: 'white'
            })}>Add&nbsp;Vacation</NavLink>

            &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;

            <NavLink to="/reports" style={({ isActive }) => ({
                background: isActive ? 'rgb(84, 205, 84)' : 'transparent',
                color: 'white'
            })}>Reports</NavLink>

            &nbsp;&nbsp;|&nbsp;&nbsp;

            <button onClick={this.props.logOutBtn} className="logOutBtn">Log Out</button>

        </nav >
    }
}

export default AdminNav;