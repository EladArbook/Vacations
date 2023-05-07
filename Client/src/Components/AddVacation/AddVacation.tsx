import { AxiosError } from "axios";
import { Component, KeyboardEvent, SyntheticEvent } from "react";
import jwtAxios from "../../Services/JwtAxios";
import "./AddVacation.css";

interface AddVacationProps {
    logOutKey: () => void;
}

interface AddVacationState {
    description: string;
    destination: string;
    image: any;
    start: Date;
    end: Date;
    price: number;
    overallError: string;
    uploading: boolean;
}

class AddVacation extends Component<AddVacationProps, AddVacationState>{
    constructor(props: AddVacationProps) {
        super(props);
        this.state = {
            description: "",
            destination: "",
            image: null,
            start: new Date('1990-01-01'),
            end: new Date('1990-01-01'),
            price: 0,
            overallError: "",
            uploading: false
        };
    }

    handleDestinationChange = (e: SyntheticEvent) => {
        let dest = (e.target as HTMLInputElement).value.replace(/[^a-z," "]/gi, '');
        if (dest.length > 0)
            dest = dest.charAt(0).toLocaleUpperCase() + dest.substring(1, dest.length);
        this.setState({ destination: dest, overallError: "" });
    }

    handleDescriptionChange = (e: SyntheticEvent) => {
        let desc = (e.target as HTMLInputElement).value.replace(/[^a-z," ", 0-9]/gi, '');
        this.setState({ description: desc, overallError: "" });
    }

    handleImageChange = (e: SyntheticEvent) => {
        const image = (e.target as HTMLInputElement).files;
        this.setState({ image: image });
    }

    handleStartChange = (e: SyntheticEvent) => {
        this.setState({ start: new Date((e.target as HTMLDataElement).value), overallError: "" });
    }

    handleEndChange = (e: SyntheticEvent) => {
        this.setState({ end: new Date((e.target as HTMLDataElement).value), overallError: "" });
    }

    handlePriceChange = (e: SyntheticEvent) => {
        this.setState({ price: Number((e.target as HTMLInputElement).value), overallError: "" });
    }

    HandleEnterKey = (e: KeyboardEvent) => { // add vacation
        if (e.key === 'Enter') {
            e.preventDefault();
            this.uploadVacation();
        }
    }

    lockInputs = () => { //while validating and adding the new vacation
        this.setState({ uploading: true });
    }

    uploadVacation = async () => {
        this.lockInputs();
        let errors = this.isError();
        if (errors)
            this.setState({ uploading: false, overallError: errors }); //validating vacation details
        else {
            try {
                const vacationDetails = {
                    description: this.state.description,
                    destination: this.state.destination,
                    start: this.state.start,
                    end: this.state.end,
                    price: this.state.price
                };
                const newVacation = new FormData();
                newVacation.append("image", this.state.image[0]);
                newVacation.append("vacation", JSON.stringify(vacationDetails));
                //add vacation to DB
                const res = await jwtAxios.post<any>(`http://localhost:3800/admin/`, newVacation);
                console.log(res.data);
                //ResetForm - show the user a success message:
                this.setState({
                    uploading: false,
                    overallError: "Vacation published!",
                    destination: "",
                    description: "",
                    image: null,
                    start: new Date('1990-01-01'),
                    end: new Date('1990-01-01'),
                    price: 0
                });
            }
            catch (error) {
                let x = error as AxiosError;
                if (x.response?.status === 401)
                    this.props.logOutKey();
                else {
                    console.log(`${x.response?.status} --- ${x.response?.data}`);
                    this.setState({ uploading: false, overallError: "An error occured" });
                }
            }
        }
    }

    isError = () => { //check for errors in new vacation details
        let errors: string = "";
        //validating if the ending date is after the starting date
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
        else if (first.getFullYear() == 1990)
            errors = "Start date is required";
        else if (second.getFullYear() == 1990)
            errors = "End date is required";
        else if (dateIssue)
            errors = "Vacation is over before it starts";
        else if (this.state.price <= 0)
            errors = "Price is required";
        else if (this.state.price > 99999)
            errors = "Price is too high";
        else if (!this.state.image)
            errors = "Image is required";
        else if (!this.getExtension())
            errors = "Upload file must be an image";

        if (errors)
            return errors;
        return "";
    }

    getExtension = () => {//checks file type by it's ending
        if (this.state.image[0] && this.state.image[0].name) {
            let extension = (this.state.image[0].name.split("."));
            extension = extension[extension.length - 1];
            if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "jfif" ||
                extension === "pjpeg" || extension === "pjp")
                return true;
            else
                return false;
        }
        else
            return false;
    }

    render(): JSX.Element {
        return <div className="AddVacation" onKeyUp={this.HandleEnterKey} >
            <h1>Add Vacation</h1>

            <div className="formArea">
                <table>
                    <tbody>
                        <tr>
                            <td>Destination:</td>
                            <td>
                                <input type="text" onChange={this.handleDestinationChange} value={this.state.destination} disabled={this.state.uploading} autoFocus={true} />
                            </td>
                        </tr>
                        <tr>
                            <td>Description:</td>
                            <td>
                                <input type="text" onChange={this.handleDescriptionChange} value={this.state.description} disabled={this.state.uploading} />
                            </td>
                        </tr>
                        <tr>
                            <td>Start date:</td>
                            <td>
                                <input type="Date" onChange={this.handleStartChange} disabled={this.state.uploading} />
                            </td>
                        </tr>
                        <tr>
                            <td>End date:</td>
                            <td>
                                {<input type="Date" onChange={this.handleEndChange} disabled={this.state.uploading} />}
                            </td>
                        </tr>
                        <tr>
                            <td>Price:</td>
                            <td>
                                <input type="number" value={this.state.price ? this.state.price : ""} onChange={this.handlePriceChange} disabled={this.state.uploading} />&nbsp;$
                            </td>
                        </tr>
                        <tr>
                            <td>Image:</td>
                            <td>
                                <input type="file" accept="image/*" className="imageAdd" onChange={this.handleImageChange} disabled={this.state.uploading} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <button className="uploadBtn" onClick={this.uploadVacation} disabled={this.state.uploading}>Publish</button>
                <br />

                {this.state.uploading ?
                    <span>processing..</span>
                    : null}

                {this.state.overallError ?
                    <span className="overallError">{this.state.overallError ? this.state.overallError : null}</span>
                    :
                    null}
                <br />
            </div>
        </div>
    }
}

export default AddVacation;