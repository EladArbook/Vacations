import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AddVacation from "../AddVacation/AddVacation";
import AdminReports from "../AdminReports/AdminReports";
import EditVacations from "../EditVacations/EditVacations";

interface AdminPageProps {
    logOutKey: () => void;
}

class AdminPage extends Component<AdminPageProps> {
    constructor(props: AdminPageProps) {
        super(props);
    }

    Routing = () => {
        return <Routes>
            {<Route path="/" element={<EditVacations logOutKey={this.props.logOutKey} />} />}
            {<Route path="/add" element={<AddVacation logOutKey={this.props.logOutKey} />} />}
            <Route path="/reports" element={<AdminReports logOutKey={this.props.logOutKey} />} />
            <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
    }

    render(): JSX.Element {
        return <div className="AdminPage">
            <this.Routing />
        </div >
    }
}

export default AdminPage;