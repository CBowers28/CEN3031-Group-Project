import React from 'react';

const TaskBoard: React.FC = () => {
    const columns = ['Not Started', 'In Progress', 'Done'];

    return (
        <div
            style={{
                display: 'flex',
                flex: 1, // Take up full height
                gap: '1rem',
                height: '90vh',
                width: '66vw',
                marginTop: '5rem'
            }}
        >
            {columns.map((col) => (
                <div
                    key={col}
                    style={{
                        flex: 1,
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        minWidth: 0,
                    }}
                >
                    {/* 🔥 Add your title here */}
                    <h3
                        style={{
                            textAlign: 'center',
                            color: '#000',
                            marginTop: 0,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid #ccc', // 👈 this creates the bar
                        }}
                    >
                        {col}
                    </h3>

                    {/* You can later add task cards below here */}
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;