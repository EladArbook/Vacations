import { AxiosError } from "axios";
import { Component } from "react";
import Vacation from "../../Model/Vacation";
import jwtAxios from "../../Services/JwtAxios";
import UpdateService from "../../Services/update-service";
import "./VacationPage.css";

interface VacationPageProps {
    logOutKey: () => void;
}
interface VacationPageState {
    vacationList: Vacation[];
    followList: number[];
    lockButtons: boolean;
}

class VacationPage extends Component<VacationPageProps, VacationPageState>{
    constructor(props: VacationPageProps) {
        super(props);
        this.state = { vacationList: [], followList: [], lockButtons: false };
    }

    private updateService = new UpdateService();

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

    componentDidMount = async () => {
        if (localStorage.getItem("loginData")) {
            try {
                const vacationList = await jwtAxios.get<Vacation[]>(`http://localhost:3800/user/vacations`);//get all vacations
                const userId = JSON.parse(localStorage.loginData).userId;

                const userFollowList = await jwtAxios.get<any>(`http://localhost:3800/user/followedVacations/${userId}`); //get followed vacations
                const followedVacations = JSON.parse(userFollowList.data[0]["vacationFollowed"]);

                if (localStorage.getItem("vacationFollowed"))
                    localStorage.removeItem("vacationFollowed");
                localStorage.vacationFollowed = JSON.stringify(followedVacations);

                //connect to live updates for only followed-vacations
                if (!this.updateService?.socket)
                    this.updateService.connect();

                this.updateService.socket?.on("new-info", (vacationId) => {
                    if (localStorage.getItem("loginData") && JSON.parse(localStorage.loginData).role === "user") {//"user"
                        if (localStorage.getItem("vacationFollowed") &&
                            JSON.parse(localStorage.vacationFollowed).indexOf(vacationId) >= 0) {
                            this.componentDidMount(); // refresh vacations and following vacation list
                        }
                    }
                });

                if (vacationList.data && vacationList.data.length > 0) {//rendering display if there're any vacations
                    this.setState({ vacationList: vacationList.data, followList: followedVacations });
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
    }

    disableButtons = () => {
        this.setState({ lockButtons: true });
    }

    // follow / unfollow vacation
    followVacation = async (vacationId: number, followCount: number) => {
        if (!this.state.lockButtons) { //disable follow/unfollow buttons for 1 second
            this.disableButtons();
            let lockTimeOut = setTimeout(() => {
                this.setState({ lockButtons: false })
                clearTimeout(lockTimeOut);
            }, 1000);

            if (localStorage.getItem("loginData")) {
                try {
                    const userId: number = JSON.parse(localStorage.loginData).userId;
                    let vacationFollowed = this.state.followList;
                    let vacationIndex: number = vacationFollowed.indexOf(vacationId);

                    if (vacationIndex >= 0) { // is vacation already followed ?
                        vacationFollowed.splice(vacationIndex, 1); //unfollow   
                        followCount--;
                        console.log("Unfollowing vacation");
                    }
                    else {
                        vacationFollowed.push(vacationId);//following vacation
                        followCount++;
                        console.log("Following vacation");
                    }

                    localStorage.vacationFollowed = JSON.stringify(vacationFollowed);//for live update
                    let stateFollowing = "[" + String(vacationFollowed) + "]";
                    await jwtAxios.patch<any>(`http://localhost:3800/user/follow`, { //update user's follow list
                        userId: userId,
                        vacationsToFollow: stateFollowing
                    });

                    let newVacationList: Vacation[] = this.state.vacationList; // Add/Sub follower in state
                    for (let i = 0; i < newVacationList.length; i++) {
                        if (newVacationList[i].vacationId === vacationId) {
                            newVacationList[i].followers = followCount;
                            break;
                        }
                    }
                    const userFollow = { vacationId: vacationId, followers: followCount };
                    await jwtAxios.patch<any>(`http://localhost:3800/user/followers`, userFollow); // Add/Sub follower in DB

                    this.setState({ vacationList: newVacationList, followList: vacationFollowed });
                }
                catch (error) {
                    let x = error as AxiosError;
                    if (x.response?.status === 401)
                        this.props.logOutKey();
                    else if (x.response?.status === 400)
                        console.log(`${x.response?.status} --- ${x.response?.data}`);
                    else
                        console.log(`Server is not responding`);
                    this.setState({});
                }
            }
            else
                this.props.logOutKey();
        }
    }

    changeNumOfFollowers = async (vacationId: number, followers: number) => { // +1 / -1 follower to vacation
        try {

            const userFollow = { vacationId: vacationId, followers: followers };

            await jwtAxios.patch<any>(`http://localhost:3800/user/followers`, userFollow); // Add/Sub follower in DB

            let newVacationList: Vacation[] = this.state.vacationList; // Add/Sub follower in state
            for (let i = 0; i < newVacationList.length; i++) {
                if (newVacationList[i].vacationId === vacationId) {
                    newVacationList[i].followers = followers;
                    break;
                }
            }
            return newVacationList;
        }
        catch (err) {

            let x = err as AxiosError;
            if (x.response?.status === 401)
                this.props.logOutKey();
            else if (x.response?.status === 400)
                console.log(`${x.response?.status} --- ${x.response?.data}`);
            else
                console.log(`Server is not responding`);
            return this.state.vacationList;
        }
    }


    render(): JSX.Element {

        return <div className="VacationPage">
            <h1>Vacations</h1>
            <div className="vacationContainer">
                {this.state.vacationList.length <= 0 && 1 ?
                    <div className="vacationItem">Stay tuned for new vacations!</div>
                    : null}
                {this.state.vacationList.map(vacation => {
                    if (this.state.followList.indexOf(vacation.vacationId) >= 0)
                        return (
                            <div className="vacationItem" key={vacation.vacationId}>
                                <div className="vacationHeader">{vacation.destination}</div>

                                <div className="vacationImg">
                                    {vacation.imageSrc ? <img src={`http://localhost:3800/user/images/${vacation.imageSrc}`} alt={vacation.destination} width="130px" height="130px" />
                                        : null}
                                </div>
                                <div className="vacationDescription">
                                    {vacation.description}
                                </div>
                                <div className="vacationDates">
                                    {/* {String(vacation.start).substring(0, 10)} - {String(vacation.end).substring(0, 10)} */}
                                    {this.getExactDate(vacation.start)} - {this.getExactDate(vacation.end)}
                                </div>
                                {vacation.price}$
                                <br />
                                <div className="numOfFollowers">{vacation.followers} Followers</div>
                                <button className={this.state.followList.indexOf(vacation.vacationId) >= 0 ? "followBtn followedVacation" : "followBtn unfollowedVacation"}
                                    onClick={() => this.followVacation(vacation.vacationId, vacation.followers)}>F</button>
                            </div>)
                })}
                {this.state.vacationList.map(vacation => {
                    if (this.state.followList.indexOf(vacation.vacationId) < 0)
                        return (
                            <div className="vacationItem" key={vacation.vacationId}>
                                <div className="vacationHeader">{vacation.destination}</div>

                                <div className="vacationImg">
                                    {vacation.imageSrc ? <img src={`http://localhost:3800/user/images/${vacation.imageSrc}`} alt={vacation.destination} width="130px" height="130px" />
                                        : null}
                                </div>
                                <div className="vacationDescription">
                                    {vacation.description}
                                </div>
                                <div className="vacationDates">
                                    {/* {String(vacation.start).substring(0, 10)} - {String(vacation.end).substring(0, 10)} */}
                                    {this.getExactDate(vacation.start)}-{this.getExactDate(vacation.end)}
                                </div>
                                {vacation.price}$
                                <br />
                                <div className="numOfFollowers">{vacation.followers} Followers</div>
                                <button className={this.state.followList.indexOf(vacation.vacationId) >= 0 ? "followBtn followedVacation" : "followBtn unfollowedVacation"}
                                    onClick={() => this.followVacation(vacation.vacationId, vacation.followers)} >F</button>
                            </div>)
                })}
            </div>
        </div >
    }
}

export default VacationPage;