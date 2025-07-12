import React, { useState } from "react";
import TaskBoard from "../components/TaskBoard";
import RewardsPanel from "../components/RewardsPanel";

const MainDashboard: React.FC = () => {
    const [totalTokens, setTotalTokens] = useState(0);
    const [todayTokens, setTodayTokens] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);

    const handleTaskComplete = (taskId: string, tokensEarned: number) => {
        setTotalTokens(prev => prev + tokensEarned);
        setTodayTokens(prev => prev + tokensEarned);
        setCompletedTasks(prev => prev + 1);
    };

    return (
        <div style={{
            display: 'flex', 
            minHeight: '100vh', 
            padding: '1rem', 
            gap: '2rem',
            background: '#f5f5dc', /* Beige background */
            fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            overflowY: 'hidden', /* Prevent vertical scrolling */
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Left: Task board (2/3 width) */}
            <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                <TaskBoard onTaskComplete={handleTaskComplete} />
            </div>

            {/* Right: Rewards Panel */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <RewardsPanel 
                    totalTokens={totalTokens}
                    todayTokens={todayTokens}
                    completedTasks={completedTasks}
                />
            </div>
        </div>
    );
};

export default MainDashboard;