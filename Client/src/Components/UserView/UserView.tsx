import { Component } from "react";
import HeaderBar from "../HeaderBar/HeaderBar";
import VacationPage from "../VacationPage/VacationPage";

interface UserViewProps {
    logOutKey: () => void;
}

class UserView extends Component<UserViewProps> {
    constructor(props: UserViewProps) {
        super(props);
    }

    render(): JSX.Element {
        return <div>
            <HeaderBar logOutKey={this.props.logOutKey} />
            <VacationPage logOutKey={this.props.logOutKey} />
        </div>
    }
}

export default UserView;