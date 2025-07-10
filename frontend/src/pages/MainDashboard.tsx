import React from "react";

const MainDashboard: React.FC = () => {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            padding: '2rem',
            backgroundColor: '#c1bfc0'
        }}>
           <h1 style={{ textAlign: 'center', color: 'black'}}> Nepsis: A Better Way To Live</h1>
           <p style={{color: 'black'}}> This is the main landing page after login</p>
        </div>
    );
};

export default MainDashboard;