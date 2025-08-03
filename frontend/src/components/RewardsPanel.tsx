import React, { useState, useEffect } from 'react';
import styles from './RewardsPanel.module.css';

interface RewardsPanelProps {
    totalTokens: number;
    todayTokens: number;
    completedTasks: number;
    onTokenSpend?: (amount: number) => void;
    onPauseStateChange?: (isPaused: boolean) => void;
    onScreenTimeStateChange?: (isActive: boolean) => void;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ 
    totalTokens, 
    todayTokens, 
    completedTasks,
    onTokenSpend,
    onPauseStateChange,
    onScreenTimeStateChange 
}) => {
    const [screenTimeRemaining, setScreenTimeRemaining] = useState(0); // in seconds
    const [isPaused, setIsPaused] = useState(false);
    const [isScreenTimeActive, setIsScreenTimeActive] = useState(false);

    // Convert seconds to minutes for display
    const remainingMinutes = Math.floor(screenTimeRemaining / 60);
    const remainingSeconds = screenTimeRemaining % 60;

        // Screen time countdown effect
    useEffect(() => {
        let interval: number | null = null;
        
        if (isScreenTimeActive && !isPaused && screenTimeRemaining > 0) {
            interval = setInterval(() => {
                setScreenTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsScreenTimeActive(false);
                        setIsPaused(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isScreenTimeActive, isPaused, screenTimeRemaining]);

    // Notify parent when pause state changes
    useEffect(() => {
        if (onPauseStateChange && isScreenTimeActive) {
            onPauseStateChange(isPaused);
        }
    }, [isPaused, isScreenTimeActive, onPauseStateChange]);

    // Notify parent when screen time state changes
    useEffect(() => {
        if (onScreenTimeStateChange) {
            onScreenTimeStateChange(isScreenTimeActive);
        }
    }, [isScreenTimeActive, onScreenTimeStateChange]);

    const purchaseScreenTime = (minutes: number) => {
        const tokensRequired = minutes * 2; // 1:2 ratio (1 min screen time costs 2 tokens)
        
        if (tokensRequired <= totalTokens) {
            if (onTokenSpend) {
                onTokenSpend(tokensRequired);
            }
            setScreenTimeRemaining(screenTimeRemaining + (minutes * 60));
            setIsScreenTimeActive(true);
            setIsPaused(false);
        }
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const screenTimeOptions = [
        { minutes: 5, tokens: 10, label: '5 Minutes' },
        { minutes: 15, tokens: 30, label: '15 Minutes' },
        { minutes: 30, tokens: 60, label: '30 Minutes' },
        { minutes: 60, tokens: 120, label: '1 Hour' }
    ];
    return (
        <div className={styles.rewardsPanel}>
            <h2 className={styles.panelTitle}>🎯 Rewards Dashboard</h2>
            
            <div className={styles.tokenSection}>
                <div className={styles.tokenCard}>
                    <h3 className={styles.tokenTitle}>Total Cogni Cash</h3>
                    <div className={styles.tokenAmount}>{totalTokens}</div>
                </div>
                
                <div className={styles.tokenCard}>
                    <h3 className={styles.tokenTitle}>Today's Cash</h3>
                    <div className={styles.tokenAmount}>{todayTokens}</div>
                </div>
            </div>

            {/* Screen Time Status */}
            {isScreenTimeActive && (
                <div className={styles.screenTimeStatus}>
                    <h3 className={styles.screenTimeTitle}>📱 Screen Time Active</h3>
                    <div className={styles.timeDisplay}>
                        {remainingMinutes}:{remainingSeconds.toString().padStart(2, '0')}
                    </div>
                    <button 
                        className={`${styles.pauseButton} ${isPaused ? styles.paused : ''}`}
                        onClick={togglePause}
                    >
                        {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                    </button>
                    <p className={styles.statusNote}>
                        {isPaused ? 'Timer paused - App Lock active' : 'App Lock disabled while timer runs'}
                    </p>
                </div>
            )}

            {/* Reward Store */}
            <div className={styles.rewardStore}>
                <h3 className={styles.storeTitle}>🛒 Reward Store</h3>
                <p className={styles.storeDescription}>
                    Trade Cogni Cash for screen time! (2 tokens = 1 minute)
                </p>
                
                <div className={styles.storeGrid}>
                    {screenTimeOptions.map((option) => (
                        <button
                            key={option.minutes}
                            className={`${styles.storeItem} ${totalTokens < option.tokens ? styles.disabled : ''}`}
                            onClick={() => purchaseScreenTime(option.minutes)}
                            disabled={totalTokens < option.tokens}
                        >
                            <div className={styles.itemLabel}>{option.label}</div>
                            <div className={styles.itemCost}>{option.tokens} tokens</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.statsSection}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Tasks Completed:</span>
                    <span className={styles.statValue}>{completedTasks}</span>
                </div>
                
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Average per Task:</span>
                    <span className={styles.statValue}>
                        {completedTasks > 0 ? Math.round(totalTokens / completedTasks) : 0} tokens
                    </span>
                </div>
            </div>

            <div className={styles.infoSection}>
                <h4 className={styles.infoTitle}>💡 How to Earn More</h4>
                <ul className={styles.infoList}>
                    <li>Complete tasks to earn 1 token per minute</li>
                    <li>Longer tasks = more tokens</li>
                    <li>Consistency builds your token balance</li>
                    <li>Spend tokens to unlock screen time rewards</li>
                </ul>
            </div>
        </div>
    );
};

export default RewardsPanel; 