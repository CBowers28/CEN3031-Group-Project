import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'taskmanager',
    'user': 'admin',
    'password': 'admin',
    'port': '5432'
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify(status="healthy", message="Backend server is running")

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify(success=False, message="Username and password required"), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        cursor.execute('SELECT id, username, email FROM users WHERE username = %s AND password = %s', 
                      (username, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({
                'success': True, 
                'message': "Login successful",
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2]
                }
            })
        else:
            return jsonify(success=False, message="Invalid credentials"), 401

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify(success=False, message="Username and password required"), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE username = %s', (username,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify(success=False, message="Username already exists"), 400

        # Create new user
        cursor.execute('INSERT INTO users (username, password, email) VALUES (%s, %s, %s) RETURNING id',
                      (username, password, email))
        user_id = cursor.fetchone()[0]

        # Create rewards record for new user
        cursor.execute('INSERT INTO rewards (user_id, points, level) VALUES (%s, %s, %s)',
                      (user_id, 0, 1))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify(success=True, message="Registration successful")

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get tasks for a user"""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify(success=False, message="User ID required"), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, title, description, status, priority, created_at, updated_at 
            FROM tasks 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        ''', (user_id,))
        
        tasks = []
        for row in cursor.fetchall():
            tasks.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'status': row[3],
                'priority': row[4],
                'created_at': row[5].isoformat() if row[5] else None,
                'updated_at': row[6].isoformat() if row[6] else None
            })

        cursor.close()
        conn.close()

        return jsonify(success=True, tasks=tasks)

    except Exception as e:
        print(f"Get tasks error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description', '')
    priority = data.get('priority', 'medium')

    if not user_id or not title:
        return jsonify(success=False, message="User ID and title required"), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO tasks (user_id, title, description, priority) 
            VALUES (%s, %s, %s, %s) 
            RETURNING id
        ''', (user_id, title, description, priority))
        
        task_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify(success=True, message="Task created", task_id=task_id)

    except Exception as e:
        print(f"Create task error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status')
    priority = data.get('priority')

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        
        # Build update query dynamically
        updates = []
        values = []
        if title is not None:
            updates.append("title = %s")
            values.append(title)
        if description is not None:
            updates.append("description = %s")
            values.append(description)
        if status is not None:
            updates.append("status = %s")
            values.append(status)
        if priority is not None:
            updates.append("priority = %s")
            values.append(priority)
        
        if updates:
            updates.append("updated_at = CURRENT_TIMESTAMP")
            values.append(task_id)
            
            query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = %s"
            cursor.execute(query, values)
            
            if cursor.rowcount == 0:
                cursor.close()
                conn.close()
                return jsonify(success=False, message="Task not found"), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify(success=True, message="Task updated")

    except Exception as e:
        print(f"Update task error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        cursor.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify(success=False, message="Task not found"), 404

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify(success=True, message="Task deleted")

    except Exception as e:
        print(f"Delete task error: {e}")
        return jsonify(success=False, message="Server error"), 500

@app.route('/api/rewards/<int:user_id>', methods=['GET'])
def get_rewards(user_id):
    """Get rewards for a user"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify(success=False, message="Database connection failed"), 500

        cursor = conn.cursor()
        cursor.execute('SELECT points, level FROM rewards WHERE user_id = %s', (user_id,))
        reward = cursor.fetchone()
        cursor.close()
        conn.close()

        if reward:
            return jsonify(success=True, rewards={
                'points': reward[0],
                'level': reward[1]
            })
        else:
            return jsonify(success=False, message="User rewards not found"), 404

    except Exception as e:
        print(f"Get rewards error: {e}")
        return jsonify(success=False, message="Server error"), 500

if __name__ == '__main__':
    print("=== Task Manager Backend ===")
    print("Starting Flask server on http://localhost:5000")
    print("Default admin login: admin / admin")
    print("API endpoints:")
    print("  POST /api/login - User login")
    print("  POST /api/register - User registration")
    print("  GET /api/tasks - Get user tasks")
    print("  POST /api/tasks - Create new task")
    print("  PUT /api/tasks/<id> - Update task")
    print("  DELETE /api/tasks/<id> - Delete task")
    print("  GET /api/rewards/<user_id> - Get user rewards")
    print("  GET /api/health - Health check")
    print("=" * 30)
    
    app.run(host='0.0.0.0', port=5000, debug=True) 