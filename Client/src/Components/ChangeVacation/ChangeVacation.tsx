import { Component, SyntheticEvent } from "react";
import Vacation from "../../Model/Vacation";
import "./ChangeVacation.css";
import moment from "moment"; //@@@@@@@@@@@@@@@@@ delete ?
import jwtAxios from "../../Services/JwtAxios";
import { AxiosError } from "axios";
import UpdateService from "../../Services/update-service";


interface ChangeVacationprops {
    vacation: Vacation;
    cancelChanges: () => void;
    refreshUpdate: () => void;
    logOutKey: () => void;
}

interface ChangeVacationState {
    destination: string
    description: string;
    start: Date;
    end: Date;
    price: number;
    overallError: string;
    image: any;
}

class ChangeVacation extends Component<ChangeVacationprops, ChangeVacationState> {
    constructor(props: ChangeVacationprops) {
        super(props);
        let startDate = new Date(this.props.vacation.start);
        startDate.setDate(startDate.getDate() + 1);
        let endDate = new Date(this.props.vacation.end);
        endDate.setDate(endDate.getDate() + 1);
        this.state = ({
            destination: this.props.vacation.destination,
            description: this.props.vacation.description,
            start: startDate,
            end: endDate,
            price: this.props.vacation.price,
            overallError: "",
            image: null
        });
    }

    private updateService = new UpdateService();

    handleDestChange = (e: SyntheticEvent) => {
        let dest = (e.target as HTMLInputElement).value.replace(/[^a-z," ",]/gi, '');
        if (dest.length > 0)
            dest = dest.charAt(0).toLocaleUpperCase() + dest.substring(1, dest.length);
        this.setState({ destination: dest, overallError: "" });
    }

    handleDescChange = (e: SyntheticEvent) => {
        let desc = (e.target as HTMLInputElement).value.replace(/[^a-z," ", 0-9]/gi, '');
        if (desc.length > 0)
            desc = desc.charAt(0).toLocaleUpperCase() + desc.substring(1, desc.length);
        this.setState({ description: desc, overallError: "" });
    }

    handleImageChange = (e: SyntheticEvent) => {
        const image = (e.target as HTMLInputElement).files;
        this.setState({ image: image });
    }

    handleStartChange = (e: SyntheticEvent) => {
        const newStart = new Date((e.target as HTMLInputElement).value);
        this.setState({ start: newStart, overallError: "" });
    }

    handleEndChange = (e: SyntheticEvent) => {
        const newEnd = new Date((e.target as HTMLInputElement).value);
        this.setState({ end: newEnd, overallError: "" });
    }

    handlePriceChange = (e: SyntheticEvent) => {
        this.setState({ price: Number((e.target as HTMLInputElement).value), overallError: "" })
    }

    checkChanges = () => {
        let errors: string = "";
        let dateIssue: boolean = false;
        const first = new Date(this.state.start);
        const second = new Date(this.state.end);
        if (first.getTime() >= second.getTime())
            dateIssue = true;

        if (this.state.destination.length <= 0)
            errors = "Destination is required";
        else if (this.state.destination.length < 2)
            errors = "Destination name is too short";
        else if (this.state.destination.length > 20)
            errors = "Destination max letters is 20";
        else if (this.state.description.length <= 0)
            errors = "Description is required";
        else if (this.state.description.length > 50)
            errors = "Destination max letters is 50";
        else if (dateIssue)
            errors = "Vacation is over before it starts";
        else if (this.state.price <= 0)
            errors = "Price is required";
        else if (this.state.price > 99999)
            errors = "Price is too high";
        else if (this.state.image && !this.getExtension())
            errors = "Upload file must be an image";

        if (errors)
            this.setState({ overallError: errors });
        else {
            this.saveChanges();
        }
    }

    getExtension = () => {//checks file type
        let extension = (this.state.image[0].name.split("."));
        extension = extension[extension.length - 1];
        if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "jfif" ||
            extension === "pjpeg" || extension === "pjp" || extension === "jpg")
            return true;
        else
            return false;
    }

    saveChanges = async () => {
        try {
            const patchVacation = {
                vacationId: this.props.vacation.vacationId,
                destination: this.state.destination,
                description: this.state.description,
                start: this.state.start,
                end: this.state.end,
                price: this.state.price,
                prevImage: this.props.vacation.imageSrc
            };
            const newVacation = new FormData();
            if (this.state.image)//send image?
                newVacation.append("image", this.state.image[0]);
            else
                newVacation.append("image", "sameImg");

            newVacation.append("vacation", JSON.stringify(patchVacation));

            await jwtAxios.patch<any>(`http://localhost:3800/admin/change`, newVacation);
            console.log("Patch OK");

            //render display to all followers
            this.updateService.connect();
            this.updateService.send(this.props.vacation.vacationId);
            let serverDisconnect = setInterval(() => {
                this.updateService.disconnect();
                clearInterval(serverDisconnect);
            }, 3000);
            //close that component
            this.props.refreshUpdate(); 
        }
        catch (error) {
            let x = error as AxiosError;
            if (x.response?.status === 401)
                this.props.logOutKey();
            else if (x.response?.status === 204 || x.response?.status === 400)
                console.log(`${x.response?.status} --- ${x.response?.data}`);
            else
                console.log(`Server is not responding`, error);

        }
    }

    render(): JSX.Element {
        return <div className="vacItem editBorder" >
            <div className="vacationHeader">
                <input type="text" className="destChange" value={this.state.destination} onChange={this.handleDestChange} autoFocus={true} />
            </div>
            <div className="editImg">
                {this.props.vacation.imageSrc ? <img src={`http://localhost:3800/user/images/${this.props.vacation.imageSrc}`} alt={this.props.vacation.destination} width="130px" height="130px" />
                    : null}
            </div>
            <div className="imageUpload">
                {<input type="file" onChange={this.handleImageChange} className="imageInput" />}
            </div>

            <div className="vacationDescription">
                <input type="text" value={this.state.description} onChange={this.handleDescChange} />
            </div>
            <div className="vacationDates">
                {<input type="Date" onChange={this.handleStartChange} defaultValue={moment(this.props.vacation.start).format('YYYY-MM-DD')}/* defaultValue={String(this.state.start).substring(0, 10)} */ />}
                <br />
                -
                <br />
                {<input type="Date" onChange={this.handleEndChange} defaultValue={moment(this.props.vacation.end).format('YYYY-MM-DD')} />}
            </div>
            <input type="number" className="priceChange" value={this.state.price ? this.state.price : ""} onChange={this.handlePriceChange} />$
            <br />
            <span className="overallError">{this.state.overallError ? this.state.overallError : null}</span>
            <button onClick={this.checkChanges} className="formBtn saveBtn">Save</button>
            <button onClick={this.props.cancelChanges} className="formBtn cancelBtn">Cancel</button>
        </div>
    }

}

export default ChangeVacation;