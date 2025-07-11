import React from "react";
import TaskBoard from "../components/TaskBoard";

const MainDashboard: React.FC = () => {
    return (
        <div style={{display: 'flex', height: '100vh'}}>

            {/* Left: Task board (2/3 width) */}
            <div style={{ flex: 2, padding: '1rem' }}>
                <TaskBoard />
            </div>

            {/* Right: Future widigits, Points, Profile, etc. */}
            <div style={{flex: 1, padding: '1rem', backgroundColor: 'ffffff' }}>
                <h2> Other Info</h2>
            </div>
        </div>
    );
};

export default MainDashboard;