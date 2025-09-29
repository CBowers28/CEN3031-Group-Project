import React, { useState, useEffect } from 'react';
import styles from './TaskCard.module.css';

interface Task {
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    status: 'not-started' | 'in-progress' | 'done';
    requiredMinutes: number;
    completionMessage: string;
    inspirationalQuote: string;
}

interface TaskCardProps {   
    task: Task;
    onClick: (taskId: string) => void;
    onReset: (taskId: string) => void;
    onComplete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onReset, onComplete }) => { //
    const [isStarted, setIsStarted] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [points, setPoints] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval: number;
        
        if (isStarted && task.status === 'in-progress' && !isPaused) {
            interval = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;
                    // Award 1 point per minute (60 seconds)
                    if (newTime % 60 === 0) {
                        setPoints(prevPoints => prevPoints + 1);
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isStarted, task.status, isPaused]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const handleStart = (e: React.MouseEvent) => { //mouse events are usually used to monitor button clicks and change states
        e.stopPropagation(); // Prevent the main card click
        setIsStarted(true);
        setIsPaused(false);
    };

    const handlePause = (e: React.MouseEvent) => { //passed into onClick()
        e.stopPropagation(); // Prevent the main card click
        setIsPaused(true);
    };

    const handleResume = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main card click
        setIsPaused(false);
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main card click
        setIsStarted(false);
        setIsPaused(false);
        setTimeElapsed(0);
        setPoints(0);
        onReset(task.id);
    };

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the main card click
        // Stop the timer
        setIsStarted(false);
        setIsPaused(false);
        
        // Only award points if minimum time requirement is met
        const minutesElapsed = timeElapsed / 60; // Use decimal for sub-minute tasks
        const finalPoints = minutesElapsed >= task.requiredMinutes ? points : 0;
        
        // Call onComplete with the final points
        onComplete(task.id);
    };

    // Auto-complete when time requirement is met
    useEffect(() => {
        if (isStarted && !isPaused && task.status === 'in-progress') {
            const minutesElapsed = timeElapsed / 60;
            if (minutesElapsed >= task.requiredMinutes) {
                // Auto-complete the task
                setIsStarted(false);
                setIsPaused(false);
                onComplete(task.id);
            }
        }
    }, [timeElapsed, isStarted, isPaused, task.status, task.requiredMinutes, onComplete]);

    const isInProgress = task.status === 'in-progress';
    const isCompleted = task.status === 'done';
    const minutesElapsed = timeElapsed / 60; // Use decimal for sub-minute tasks
    const canComplete = minutesElapsed >= task.requiredMinutes;

    return (
        <div 
            className={`${styles.taskCard} ${isInProgress ? styles.inProgress : ''} ${isCompleted ? styles.completed : ''}`}
        >
            <div className={styles.taskHeader}>
                <h4 className={styles.taskTitle}>{task.title}</h4>
                <div className={styles.headerActions}>
                    <span className={styles.taskTime}>{task.estimatedTime}</span>
                    {!isInProgress && !isCompleted && (
                        <button 
                            className={styles.addButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(task.id);
                            }}
                        >
                            +
                        </button>
                    )}
                </div>
            </div>
            
            {!isCompleted && (
                <div className={styles.taskDescription}>
                    {task.description}
                    <div className={styles.cashDisplay}>
                        💰{Math.floor(task.requiredMinutes)}
                    </div>
                </div>
            )}

            {isCompleted && (
                <div className={styles.completionMessage}>
                    <h5>🎉 Congratulations!</h5>
                    <p>{task.completionMessage}</p>
                    <blockquote>"{task.inspirationalQuote}"</blockquote>
                </div>
            )}

            {isInProgress && (
                <div className={styles.timerSection}>
                    {!isStarted ? (
                        <div className={styles.readyState}>
                            <p className={styles.readyText}>Ready to begin</p>
                            <button 
                                className={styles.startButton}
                                onClick={handleStart}
                            >
                                Go
                            </button>
                            <button 
                                className={styles.resetButton}
                                onClick={handleReset}
                            >
                                I want another task
                            </button>
                        </div>
                    ) : (
                        <div className={styles.activeState}>
                            <div className={styles.timerDisplay}>
                                <span className={styles.timeLabel}>Time:</span>
                                <span className={styles.timeValue}>{formatTime(timeElapsed)}</span>
                            </div>
                            
                            <div className={styles.pointsDisplay}>
                                <span className={styles.pointsLabel}>Cogni Tokens:</span>
                                <span className={styles.pointsValue}>{points}</span>
                            </div>

                            <div className={styles.progressDisplay}>
                                <span className={styles.progressLabel}>Required: {task.requiredMinutes < 1 ? `${Math.round(task.requiredMinutes * 60)}sec` : `${task.requiredMinutes}min`}</span>
                                <span className={`${styles.progressValue} ${canComplete ? styles.completed : ''}`}>
                                    {task.requiredMinutes < 1 ? `${timeElapsed}/${Math.round(task.requiredMinutes * 60)}sec` : `${Math.floor(minutesElapsed)}/${task.requiredMinutes}min`}
                                </span>
                            </div>

                            {!isPaused ? (
                                <button 
                                    className={styles.pauseButton}
                                    onClick={handlePause}
                                >
                                    Pause
                                </button>
                            ) : (
                                <button 
                                    className={styles.resumeButton}
                                    onClick={handleResume}
                                >
                                    Resume
                                </button>
                            )}

                            <button 
                                className={`${styles.completeButton} ${!canComplete ? styles.disabled : ''}`}
                                onClick={handleComplete}
                                disabled={!canComplete}
                            >
                                {canComplete ? 'Complete Now' : `Need ${task.requiredMinutes < 1 ? Math.round((task.requiredMinutes - minutesElapsed) * 60) : Math.ceil(task.requiredMinutes - minutesElapsed)} more ${task.requiredMinutes < 1 ? 'seconds' : 'minutes'}`}
                            </button>

                            <button 
                                className={styles.quitButton}
                                onClick={handleReset}
                            >
                                Quitting already?
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCard; 