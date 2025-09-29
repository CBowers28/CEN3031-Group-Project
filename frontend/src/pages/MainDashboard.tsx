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
            height: '100vh', 
            padding: '1rem', 
            gap: '2rem',
            background: '#f5f5dc', /* Beige background */
            fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            overflowX: 'auto', /* Allow horizontal scrolling */
            overflowY: 'hidden' /* Prevent vertical scrolling */
        }}>
            {/* Task board - fixed width to ensure proper column display */}
            <div style={{ minWidth: '1200px', display: 'flex', flexShrink: 0 }}>
                <TaskBoard onTaskComplete={handleTaskComplete} />
            </div>

            {/* Rewards Panel - fixed width, accessible via horizontal scroll */}
            <div style={{ minWidth: '350px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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