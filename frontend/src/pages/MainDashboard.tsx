import React, { useState } from "react";
import TaskBoard from "../components/TaskBoard";
import RewardsPanel from "../components/RewardsPanel";
import AppLock from "../components/AppLock";

const MainDashboard: React.FC = () => {
    const [totalTokens, setTotalTokens] = useState(0);
    const [todayTokens, setTodayTokens] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [isScreenTimeActive, setIsScreenTimeActive] = useState(false);
    const [isScreenTimePaused, setIsScreenTimePaused] = useState(false);

    const handleTaskComplete = (_taskId: string, tokensEarned: number) => {
        setTotalTokens(prev => prev + tokensEarned);
        setTodayTokens(prev => prev + tokensEarned);
        setCompletedTasks(prev => prev + 1);
        // Keep app lock active even after task completion
        // setHasActiveTask(false); // Removed this line
    };

    const handleTaskStatusChange = (_hasInProgressTask: boolean) => {
        // App lock stays on regardless of task status - no action needed
    };

    const handleTokenSpend = (tokensSpent: number) => {
        setTotalTokens(prev => prev - tokensSpent);
        // Screen time activation will be handled by onScreenTimeStateChange callback
    };

    const handlePauseStateChange = (isPaused: boolean) => {
        setIsScreenTimePaused(isPaused);
    };

    const handleScreenTimeStateChange = (isActive: boolean) => {
        setIsScreenTimeActive(isActive);
        // Reset pause state when screen time ends
        if (!isActive) {
            setIsScreenTimePaused(false);
        }
    };

    // App Lock should always be active UNLESS screen time is running AND not paused
    const shouldAppLockBeActive = !(isScreenTimeActive && !isScreenTimePaused);

    return (
        <div style={{
            display: 'flex', 
            minHeight: '100vh', 
            minWidth: '1900px', // Further reduced minimum width
            padding: '20px', 
            gap: '40px', // Much smaller gap
            background: '#f5f5dc',
            fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
            {/* Left: Task board */}
            <div style={{ 
                width: '1200px', // Keep TaskBoard width
                minWidth: '1200px',
                marginRight: '60px' // Reduced margin
            }}>
                <TaskBoard 
                    onTaskComplete={handleTaskComplete}
                    onTaskStatusChange={handleTaskStatusChange}
                />
            </div>

            {/* Right: Rewards Panel and App Lock */}
            <div style={{
                width: '450px',
                minWidth: '450px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                flexShrink: 0,
                marginLeft: '40px' // Much smaller left margin
            }}>
                <RewardsPanel 
                    totalTokens={totalTokens}
                    todayTokens={todayTokens}
                    completedTasks={completedTasks}
                    onTokenSpend={handleTokenSpend}
                    onPauseStateChange={handlePauseStateChange}
                    onScreenTimeStateChange={handleScreenTimeStateChange}
                />
                <AppLock isActive={shouldAppLockBeActive} />
            </div>
        </div>
    );
};

export default MainDashboard;