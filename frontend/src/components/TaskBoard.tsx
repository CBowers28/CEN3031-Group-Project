import React, { useState } from 'react';
import styles from './TaskBoard.module.css';
import TaskCard from './TaskCard';

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

interface TaskBoardProps {
    onTaskComplete?: (taskId: string, tokensEarned: number) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ onTaskComplete }) => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Gym Workout',
            description: 'Complete a full body workout including cardio and strength training. Focus on proper form and progressive overload.',
            estimatedTime: '1hr',
            status: 'not-started',
            requiredMinutes: 60,
            completionMessage: 'You completed a powerful workout that strengthens both body and mind. Your dedication to physical fitness builds the foundation for all other achievements.',
            inspirationalQuote: 'The only bad workout is the one that didn\'t happen.'
        },
        {
            id: '2',
            title: 'Yoga Session',
            description: 'Practice vinyasa flow yoga focusing on flexibility, balance, and mindfulness. Include meditation at the end.',
            estimatedTime: '45min',
            status: 'not-started',
            requiredMinutes: 45,
            completionMessage: 'You embraced the ancient practice of yoga, connecting mind, body, and spirit. Your commitment to inner peace and flexibility will serve you in all aspects of life.',
            inspirationalQuote: 'Yoga is not about touching your toes, it\'s about what you learn on the way down.'
        },
        {
            id: '3',
            title: 'Light Study Sprint',
            description: 'Quick review session focusing on key concepts and flashcards. Perfect for refreshing memory and staying on top of material.',
            estimatedTime: '30min',
            status: 'not-started',
            requiredMinutes: 30,
            completionMessage: 'You completed a focused study sprint that keeps your knowledge sharp and your mind engaged. Every small step forward builds momentum toward your goals.',
            inspirationalQuote: 'Small progress is still progress.'
        },
        {
            id: '4',
            title: 'Deep Dive Study',
            description: 'Comprehensive study session with detailed note-taking, practice problems, and concept mapping. Break every 45 minutes.',
            estimatedTime: '1.5hr',
            status: 'not-started',
            requiredMinutes: 90,
            completionMessage: 'You completed an intensive study session that deepens your understanding and builds lasting knowledge. Your dedication to learning will open doors to endless possibilities.',
            inspirationalQuote: 'Education is the most powerful weapon which you can use to change the world.'
        },
        {
            id: '5',
            title: 'Study God Mode',
            description: 'Ultimate study marathon with full syllabus coverage, practice exams, and comprehensive review. Maximum focus and productivity.',
            estimatedTime: '3hr',
            status: 'not-started',
            requiredMinutes: 180,
            completionMessage: 'You achieved Study God Mode! Your marathon study session demonstrates extraordinary discipline and commitment. You\'ve proven that you can accomplish anything you set your mind to.',
            inspirationalQuote: 'The difference between ordinary and extraordinary is that little extra.'
        },
        {
            id: '6',
            title: 'Breathing Mastery',
            description: 'Guided breathing practice using the 4-7-8 technique: Inhale for 4 seconds, hold for 7, exhale for 8. Focus on deep, controlled breaths.',
            estimatedTime: '5sec',
            status: 'not-started',
            requiredMinutes: 0.083, // 5 seconds = 0.083 minutes
            completionMessage: 'You completed an important ancient practice that has a wide variety of benefits such as stress reduction, improved focus, better sleep, and enhanced emotional regulation. Your breath is your anchor to the present moment.',
            inspirationalQuote: 'Breathing is the greatest pleasure in life.'
        }
    ]);

    const handleTaskClick = (taskId: string) => {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, status: 'in-progress' as const };
                } else if (task.status === 'in-progress') {
                    // Move any other in-progress task back to not-started
                    return { ...task, status: 'not-started' as const };
                }
                return task;
            })
        );
    };

    const handleTaskReset = (taskId: string) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { ...task, status: 'not-started' as const }
                    : task
            )
        );
    };

    const handleTaskComplete = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            // Calculate tokens earned (1 token per minute of required time)
            const tokensEarned = Math.floor(task.requiredMinutes);
            
            setTasks(prevTasks => 
                prevTasks.map(t => 
                    t.id === taskId 
                        ? { ...t, status: 'done' as const }
                        : t
                )
            );

            // Notify parent component about completion and tokens earned
            if (onTaskComplete) {
                onTaskComplete(taskId, tokensEarned);
            }
        }
    };

    const getTasksByStatus = (status: Task['status']) => {
        return tasks.filter(task => task.status === status);
    };

    const columns = [
        { id: 'not-started', title: 'Available Tasks' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Completed' }
    ] as const;

    return (
        <div className={styles.taskBoard}>
            {columns.map((column) => (
                <div key={column.id} className={styles.column}>
                    <h3 className={styles.columnTitle}>
                        {column.title}
                    </h3>

                    {getTasksByStatus(column.id).map((task) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onClick={handleTaskClick}
                            onReset={handleTaskReset}
                            onComplete={handleTaskComplete}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;