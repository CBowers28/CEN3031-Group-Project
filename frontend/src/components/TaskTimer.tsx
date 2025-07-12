import React, { useState, useEffect } from 'react';
import styles from './TaskTimer.module.css';

interface TaskTimerProps {
    taskTitle: string;
    estimatedTime: string;
    onComplete: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ taskTitle, estimatedTime, onComplete }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        let interval: number;
        
        if (isStarted) {
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
    }, [isStarted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsStarted(true);
    };

    const handleComplete = () => {
        onComplete();
    };

    return (
        <div className={styles.timerContainer}>
            <div className={styles.timerHeader}>
                <h3 className={styles.taskTitle}>{taskTitle}</h3>
                <span className={styles.estimatedTime}>Est: {estimatedTime}</span>
            </div>

            {!isStarted ? (
                <div className={styles.readyState}>
                    <p className={styles.readyText}>Ready to begin</p>
                    <button 
                        className={styles.startButton}
                        onClick={handleStart}
                    >
                        Go
                    </button>
                </div>
            ) : (
                <div className={styles.activeState}>
                    <div className={styles.timerDisplay}>
                        <span className={styles.timeLabel}>Time Elapsed:</span>
                        <span className={styles.timeValue}>{formatTime(timeElapsed)}</span>
                    </div>
                    
                    <div className={styles.pointsDisplay}>
                        <span className={styles.pointsLabel}>Points Earned:</span>
                        <span className={styles.pointsValue}>{points}</span>
                    </div>

                    <button 
                        className={styles.completeButton}
                        onClick={handleComplete}
                    >
                        Complete Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskTimer; 