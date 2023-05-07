import "./SideBanner.css";

function SideBanner() { // for instructions
    return <div className="SideBanner">
        <div className="headerOfSide">Vacations Information</div>
        <br />

        <span className="instructions">Select Vacation</span>
        <div className="DownArrow"></div>

        <span className="instructions">Trig Follow</span>
        <div className="DownArrow"></div>

        <span className="instructions">Get Updates Live</span>
    </div>
}

export default SideBanner;