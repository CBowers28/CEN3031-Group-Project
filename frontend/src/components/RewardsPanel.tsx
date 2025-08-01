import React from 'react';
import styles from './RewardsPanel.module.css';

interface RewardsPanelProps {
    totalTokens: number;
    todayTokens: number;
    completedTasks: number;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ totalTokens, todayTokens, completedTasks }) => {
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
                    <li>Tokens unlock screen time rewards</li>
                </ul>
            </div>
        </div>
    );
};

export default RewardsPanel; 