import { NavLink } from "react-router-dom";

function GuestNav() {

    return <nav>

        <NavLink to="/" style={({ isActive }) => ({
            background: isActive ? 'rgb(84, 205, 84)' : 'transparent',
            color: 'white'
        })}>Log in</NavLink>

        &nbsp;&nbsp;|&nbsp;&nbsp;

        <NavLink to="/register" style={({ isActive }) => ({
            background: isActive ? 'rgb(84, 205, 84)' : 'transparent',
            color: 'white'
        })}>Register</NavLink>
        &nbsp;&nbsp;

    </nav >
}

export default GuestNav;