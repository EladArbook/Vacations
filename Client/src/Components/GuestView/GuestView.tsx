import { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import HeaderBar from "../HeaderBar/HeaderBar";
import LoginPage from "../LoginPage/LoginPage";
import RegistrationPage from "../RegistrationPage/RegistrationPage";

interface GuestViewProps {
    rollCallBack: (userRole: string) => void; //change role in app.tsx
}

class GuestView extends Component<GuestViewProps> {
    constructor(props: GuestViewProps) {
        super(props);
        this.state = ({});
    }

    Routing = () => {
        return <Routes>
            <Route path="/" element={<LoginPage rollCallBack={this.props.rollCallBack} />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
    }

    render(): JSX.Element {
        return <div className="GuestView">
            <BrowserRouter>
                <HeaderBar logOutKey={() => { }} />{/* guest can't log out! */}
                <this.Routing />
            </BrowserRouter>
        </div>
    }
}

export default GuestView;