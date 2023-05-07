import { AxiosError } from "axios";
import { Component } from "react";
import jwtAxios from "../../Services/JwtAxios";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from "chart.js/auto"
import "./AdminReports.css";

interface AdminReportsProps {
    logOutKey: () => void;
}

interface AdminReportsState {
    reports: { vacationId: number, destination: string, followers: number }[];
    isEmpty: boolean;
}

class AdminReports extends Component<AdminReportsProps, AdminReportsState>{
    constructor(props: AdminReportsProps) {
        super(props);
        this.state = ({ reports: [], isEmpty: false });
    }

    componentDidMount = async () => {
        try { //get vacations follower count where followers > 0
            const res = await jwtAxios.get<any>(`http://localhost:3800/admin/reports`);
            let empty = false;
            if (res.data.length <= 0)
                empty = true;
            this.setState({ reports: res.data, isEmpty: empty });
        }
        catch (error) {
            let x = error as AxiosError;
            if (x.response?.status === 401)
                this.props.logOutKey();
            else
                console.log(`${x.response?.status} --- ${x.response?.data}`);
        }
    }

    chartData = () => {
        return/* data= */ {
            labels: this.state.reports.map(rep => rep.destination),
            datasets: [
                {
                    label: "Followers Count",
                    data: this.state.reports.map(rep => rep.followers),
                    barPercentage: 0.4,
                    backgroundColor: 'rgba(56, 232, 21, 0.4)',
                    hoverBackgroundColor: 'rgba(56, 232, 21, 0.7)',
                    borderColor: 'rgb(56, 232, 21)',
                    borderWidth: 1,
                    borderRadius: 5,
                },
            ],
        }
    }

    BarChart = () => {
        return <div className="chartJS">
            <Bar data={this.chartData()} options={{ maintainAspectRatio: false }} />
        </div>
    }

    render(): JSX.Element {
        ChartJS.register(CategoryScale);

        return <div className="AdminReports">
            <h1>Vacation Followers</h1>
            <div>
                {this.state.reports.length > 0 ?
                    this.BarChart()
                    : null}
                {this.state.isEmpty ?
                    <div className="noFollowers">There are still no followers at all.</div>
                    : null}
            </div>

        </div>
    }
}

export default AdminReports;