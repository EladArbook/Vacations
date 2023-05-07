import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import AdminPage from "../AdminPage/AdminPage";
import HeaderBar from "../HeaderBar/HeaderBar";

interface AdminViewProps {
    logOutKey: () => void;
}

class AdminView extends Component<AdminViewProps> {
    constructor(props: AdminViewProps) {
        super(props);
        this.state = ({});
    }

    render(): JSX.Element {
        return <div>
            <BrowserRouter>
                <HeaderBar logOutKey={this.props.logOutKey} />
                <AdminPage logOutKey={this.props.logOutKey} />
            </BrowserRouter>
        </div>
    }

}

export default AdminView;