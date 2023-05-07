import { AxiosError } from "axios";
import { Component } from "react";
import Vacation from "../../Model/Vacation";
import jwtAxios from "../../Services/JwtAxios";
import { FaPencilAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "./EditVacations.css";
import ChangeVacation from "../ChangeVacation/ChangeVacation";


interface EditVacationsProps {
    logOutKey: () => void;
}

interface AdminPageState {
    vacationList: Vacation[];
    editId: number;
}

class EditVacations extends Component<EditVacationsProps, AdminPageState> {
    constructor(props: EditVacationsProps) {
        super(props);
        this.state = { vacationList: [], editId: -1 };
    }

    editVacation = (vacationId: number) => {
        this.setState({ editId: vacationId });
    }

    refreshUpdate = async () => { //refresh vacations after an edit
        this.componentDidMount();
    }

    cancelChanges = () => { //cancel selectiong on a vacation for editing
        this.setState({ editId: -1 });
    }

    deleteVacation = async (vacationId: number, deleteImage: string) => {//delete vacation and it's image
        try {
            const res = await jwtAxios.delete<any>(`http://localhost:3800/admin/delete/${vacationId}/${deleteImage}`);
            console.log(res.data);
        }
        catch (error) {
            let x = error as AxiosError;
            if (x.response?.status === 401)
                this.props.logOutKey();
            else
                console.log(`${x.response?.status} --- ${x.response?.data}`);
        }

        this.componentDidMount();//refresh vacations at last
    }

    componentDidMount = async () => {
        try {//bring vacations from DB
            const vacationList = await jwtAxios.get<Vacation[]>(`http://localhost:3800/user/vacations`);

            if (vacationList.data && vacationList.data.length > 0) {//if vacations were found at DB
                this.setState({ vacationList: vacationList.data, editId: -1 });
            }
        }
        catch (error) {
            let x = error as AxiosError;
            if (x.response?.status === 401)
                this.props.logOutKey();
            else
                console.log(`${x.response?.status} --- ${x.response?.data}`);
        }
    }

    getExactDate = (myDate: Date) => { //fixing dates for displaying
        let myNewDate = new Date(myDate);
        let day: string = String(myNewDate.getDate());
        if (day.length < 2)
            day = "0" + day;
        let month: string = String(myNewDate.getMonth() + 1);
        if (month.length < 2)
            month = "0" + month;
        let year = myNewDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    render(): JSX.Element {
        return <div className="EditVacations">
            <h1>Vacations Edit </h1>
            <div className="vacationContainer">
                {this.state.vacationList.map(vacation => {
                    if (this.state.editId != vacation.vacationId) return ( // if no editing that vacation
                        <div className="vacItem itemBorder" key={vacation.vacationId}>
                            <div className="vacationHeader">{vacation.destination}</div>
                            <div className="vacationImg">
                                {vacation.imageSrc ? <img src={`http://localhost:3800/user/images/${vacation.imageSrc}`} alt={vacation.destination.substring(0, 10)} width="130px" height="130px" />
                                    : null}
                            </div>
                            <div>
                                {vacation.description}
                            </div>
                            <div className="vacationDates">
                                {this.getExactDate(vacation.start)} - {this.getExactDate(vacation.end)}
                            </div>
                            {vacation.price}$
                            <FaPencilAlt className="editPencil" onClick={() => this.editVacation(vacation.vacationId)} />
                            <AiOutlineClose className="closeX" onClick={() => this.deleteVacation(vacation.vacationId, vacation.imageSrc)} />

                        </div>);
                    else //vacation selected for editing mode
                        return <ChangeVacation vacation={vacation} cancelChanges={this.cancelChanges} refreshUpdate={this.refreshUpdate} logOutKey={this.props.logOutKey} key={vacation.vacationId} />;    //Edit that vacation
                })}

            </div>
        </div>
    }
}

export default EditVacations;