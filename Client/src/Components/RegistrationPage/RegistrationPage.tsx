import { Component, KeyboardEvent, SyntheticEvent } from "react";
import axios, { AxiosError } from 'axios';
import { NavLink } from "react-router-dom";
import "./RegistrationPage.css";

interface RegistrationPageState {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    overallError: string,
    registering: boolean;
    showPass: boolean;
}

class RegistrationPage extends Component<{}, RegistrationPageState> {
    constructor(props: {}) {
        super(props);
        this.state = ({
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            overallError: "",
            registering: false,
            showPass: false
        });
    }

    HandleFirstNameChange = (e: SyntheticEvent) => {
        let firstN = (e.target as HTMLInputElement).value.replace(/[^a-z," "]/gi, '');
        if (firstN.length > 0)
            firstN = firstN.charAt(0).toLocaleUpperCase() + firstN.substring(1, firstN.length);
        this.setState({ firstName: firstN, overallError: "" });
    }

    HandleLastNameChange = (e: SyntheticEvent) => {
        let lastN = (e.target as HTMLInputElement).value.replace(/[^a-z," "]/gi, '');
        if (lastN.length > 0)
            lastN = lastN.charAt(0).toLocaleUpperCase() + lastN.substring(1, lastN.length);
        this.setState({ lastName: lastN, overallError: "" });
    }

    HandleUsernameChange = (e: SyntheticEvent) => {
        const userN = (e.target as HTMLInputElement).value.replace(/[^a-z,0-9]/gi, '');
        this.setState({ username: userN, overallError: "" });
        //this.setState({ username: (e.target as HTMLInputElement).value, overallError: "" });
    }

    HandlePasswordChange = (e: SyntheticEvent) => {
        const passW = (e.target as HTMLInputElement).value.replace(/[^a-z,0-9,!,@,#,$,%,^,&,*,_]/gi, '');
        this.setState({ password: passW, overallError: "" });
    }

    HandleEnterKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.Registering();
        }
    }

    HandlePassShow = () => {// show/hide password
        if (this.state.showPass)
            this.setState({ showPass: false });
        else
            this.setState({ showPass: true });
    }

    // let the user know login proccess is executed and prevent change of data
    lockInputs = () => {
        this.setState({ registering: true });
    }

    Registering = () => { //check for errors in user details
        let errors: string = "";

        if (!this.state.firstName)
            errors = "First name is required";
        else if (this.state.firstName.length < 2)
            errors = "First name should be at least 2 characters";
        else if (this.state.firstName.length > 20)
            errors = "First name max characters = 20";
        else if (!this.state.lastName)
            errors = "Last name is required";
        else if (this.state.lastName.length < 2)
            errors = "Last name should be at least 2 characters";
        else if (this.state.lastName.length > 20)
            errors = "Last name max characters = 20";
        else if (!this.state.username)
            errors = "Username is required";
        else if (this.state.username.length < 4 || this.state.username.length > 10)
            errors = "Username should be between 4-10 characters";
        else if (!this.state.password)
            errors = "Password is required";
        else if (this.state.password.length < 6 || this.state.password.length > 12)
            errors = "Password should be between 6-12 characters";


        if (errors)
            this.setState({ overallError: errors })
        else {
            this.lockInputs();
            this.RegisterAsync();
        }
    }

    RegisterAsync = async () => {
        try {
            let newUser: any = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                username: this.state.username,
                password: this.state.password
            };
            //registering user
            const res = await axios.post<boolean>("http://localhost:3800/auth/register", newUser);
            if (res.data === true) {
                console.log("Register Success");
                this.setState({
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    overallError: "Registration is completed. You can login now!",
                    registering: false
                });
            }
            else {
                this.setState({ overallError: "Username is already exist", registering: false });
            }
        }
        catch (error) {
            let x = error as AxiosError;
            console.log(`${x.response?.status} --- ${x.message}`);
            this.setState({ registering: false });
        }
    }

    render(): JSX.Element {

        return <div className="RegistrationPage" onKeyUp={this.HandleEnterKey}>
            <span>Registration</span>
            <br />
            <div className="formArea">
                <table>
                    <tbody>
                        <tr>
                            <td>Username:</td>
                            <td><input type="text" onChange={this.HandleUsernameChange} value={this.state.username} disabled={this.state.registering} /></td>
                        </tr>
                        <tr>
                            <td>First Name:</td>
                            <td><input type="text" onChange={this.HandleFirstNameChange} value={this.state.firstName} disabled={this.state.registering} autoFocus={true} /></td>
                        </tr>
                        <tr>
                            <td>Last Name:</td>
                            <td><input type="text" onChange={this.HandleLastNameChange} value={this.state.lastName} disabled={this.state.registering} /></td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td><input type={this.state.showPass ? "text" : "password"} onChange={this.HandlePasswordChange} value={this.state.password} disabled={this.state.registering} /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="checkbox" className="showPassTgl" onChange={this.HandlePassShow} />
                                <span className="showPassSpn"> show password </span>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <button className="btnGreen" onClick={this.Registering} disabled={this.state.registering}>Register</button>
                <br />

                {this.state.registering ?
                    <span>processing..</span>
                    : null}

                {this.state.overallError ?
                    <span className="inputError">{this.state.overallError}</span>
                    :
                    null}
                <br />
                {!this.state.registering ?
                    <NavLink to="/reister" className={"regMark"}>
                        Already a user? Log in
                    </NavLink>
                    : null}
                <br />

            </div>

        </div >
    }

}

export default RegistrationPage;