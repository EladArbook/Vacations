import axios, { AxiosError } from "axios";
import { Component, KeyboardEvent, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import UserData from "../../Model/UserData";
import "./LoginPage.css";

interface LoginPageProps {
    rollCallBack: (userRole: string) => void; //change role in app.tsx
}

interface LoginPageState {
    username: string;
    password: string;
    logingIn: boolean;
    loginMsg: string;
    showPass: boolean;
}

class LoginPage extends Component<LoginPageProps, LoginPageState>{
    constructor(props: LoginPageProps) {
        super(props);
        this.state = ({ username: "", password: "", loginMsg: "", logingIn: false, showPass: false, });
    }

    HandleUsernameChange = (e: SyntheticEvent) => {
        const userN = (e.target as HTMLInputElement).value.replace(/[^a-z,0-9]/gi, '');
        this.setState({ username: userN, loginMsg: "" });
    }

    HandlePasswordChange = (e: SyntheticEvent) => {
        const passW = (e.target as HTMLInputElement).value.replace(/[^a-z,0-9,!,@,#,$,%,^,&,*,_]/gi, '');
        this.setState({ password: passW, loginMsg: "" });
    }

    HandlePassShow = () => { // show/hide password
        if (this.state.showPass)
            this.setState({ showPass: false });
        else
            this.setState({ showPass: true });
    }

    HandleEnterKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.LogingIn();
        }
    }

    // let the user know login proccess is executed and prevent change of data
    lockInputs = () => {
        this.setState({ logingIn: true });
    }

    LogingIn = () => {
        this.lockInputs();
        let errors = "";
        if (!this.state.username)
            errors = "Username is required";
        else if (!this.state.password)
            errors = "Password is required";
        else if (this.state.username.length < 4 || this.state.username.length > 10)
            errors = "Username length is 4-10 characters";
        else if (this.state.password.length < 6 || this.state.password.length > 12)
            errors = "Password length is 6-12 characters";

        if (errors)
            this.setState({ loginMsg: errors, logingIn: false })
        else {
            this.LoginAsync();
        }
    }

    LoginAsync = async () => {
        try {
            const credentials = { username: this.state.username, password: this.state.password };
            const res = await axios.post<UserData>("http://localhost:3800/auth/login", credentials);
            if (res.data) { //if user's information is correct
                console.log("Login Success");
                localStorage.loginData = JSON.stringify(res.data); // save user's data

                let myDate = new Date();
                localStorage.loginTime = JSON.stringify(myDate); //save logged-in time

                let name = JSON.parse(localStorage.loginData).firstName;
                this.setState({ loginMsg: ` Welcome ${name} !` }); //hello message while redirecting
                let role = JSON.parse(localStorage.loginData).role;
                this.props.rollCallBack(role);
            }
            else {
                console.log("Login Failed");
                this.setState({ logingIn: false, loginMsg: "Please try again later" });
            }
        }
        catch (error) {
            let x = error as AxiosError;
            console.log(`${x.response?.status} --- ${x.response?.data}`);
            if (x.response?.status === 401)
                this.setState({ logingIn: false, loginMsg: "Invalid Username or Password" });
            else
                this.setState({ logingIn: false, loginMsg: "Please try again later" });
        }
    }

    render(): JSX.Element {
        return <div className="LoginPage" onKeyUp={this.HandleEnterKey}>
            <span>Login</span>
            <br />
            <div className="formArea">
                <table>
                    <tbody>
                        <tr>
                            <td>Username:</td>
                            <td><input type="text" onChange={this.HandleUsernameChange} value={this.state.username} disabled={this.state.logingIn} autoFocus={true} /></td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <input type={this.state.showPass ? "text" : "password"} onChange={this.HandlePasswordChange} value={this.state.password} disabled={this.state.logingIn} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="checkbox" className="showPassTgl" onChange={this.HandlePassShow} />
                                <span className="showPassSpn"> show password</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="btnGreen" onClick={this.LogingIn} disabled={this.state.logingIn}>Log in</button>
                <br />
                <br />
                {this.state.logingIn ?
                    <span>Logging in...</span>
                    : null}
                {this.state.loginMsg ?
                    <span className="inputError">{this.state.loginMsg}</span>
                    : null}
                <br />
                {!this.state.logingIn ?
                    <NavLink to="/register" className={"regMark"}>
                        New user? Register
                    </NavLink>
                    : null}
            </div>
        </div>
    }
}

export default LoginPage;