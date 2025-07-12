import subprocess
import platform
import shutil
import sys
import os
import venv

VENV_DIR = "/opt/flask_env"
APP_DIR = os.path.join(VENV_DIR, "flask_app")
PYTHON_PATH = os.path.join(VENV_DIR, "bin", "python")
ACTIVATE_PATH = os.path.join(VENV_DIR, "bin", "activate")

DB_USERNAME = "admin"
DB_PASSWORD = "admin"


def ensure_root():
    if os.name != "nt" and os.geteuid() != 0:
        print("Elevating to root...")
        os.execvp("sudo", ["sudo"] + sys.argv)


def run_command(command_list, ignore_error=False):
    try:
        print(f"Running: {' '.join(command_list)}")
        subprocess.run(command_list, check=True)
    except subprocess.CalledProcessError as e:
        if ignore_error:
            print(f"Ignored error: {e}")
        else:
            print(f"Command failed: {e}")
            sys.exit(1)


def detect_os():
    os_name = platform.system().lower()
    if os_name == "linux":
        try:
            with open("/etc/os-release") as f:
                os_info = f.read().lower()
            if "kali" in os_info:
                return "kali"
            elif "ubuntu" in os_info:
                return "ubuntu"
            elif "debian" in os_info:
                return "debian"
            elif "fedora" in os_info:
                return "fedora"
            elif "arch" in os_info:
                return "arch"
        except:
            pass
        return "linux"
    elif os_name == "darwin":
        return "macos"
    elif os_name == "windows":
        return "windows"
    return "unknown"


def install_pip_and_venv(os_id):
    if shutil.which("pip3") and os.path.exists("/usr/lib/python3/dist-packages/venv"):
        print("pip3 and venv already installed.")
        return

    print("Installing pip3 and python3-venv...")
    if os_id in ("ubuntu", "kali", "debian"):
        run_command(["apt", "update"])
        run_command(["apt", "install", "-y", "python3-pip", "python3-venv"])
    elif os_id == "fedora":
        run_command(["dnf", "install", "-y", "python3-pip", "python3-virtualenv"])
    elif os_id == "arch":
        run_command(["pacman", "-Sy", "--noconfirm", "python-pip", "python-virtualenv"])
    elif os_id == "macos":
        run_command(["brew", "install", "python"])
    elif os_id == "windows":
        print("On Windows, install Python from python.org and run this manually.")
        sys.exit(1)
    else:
        print(f"Unsupported OS for pip installation: {os_id}")
        sys.exit(1)


def install_python_packages_in_venv():
    if not os.path.exists(VENV_DIR):
        print(f"Creating virtual environment at {VENV_DIR}...")
        venv.create(VENV_DIR, with_pip=True)

    pip_path = os.path.join(VENV_DIR, "bin", "pip")

    print("Upgrading pip in virtual environment...")
    run_command([pip_path, "install", "--upgrade", "pip"])

    print("Installing Flask and psycopg2-binary in virtual environment...")
    run_command([pip_path, "install", "Flask", "psycopg2-binary", "flask-cors"])


def create_flask_app_files():
    os.makedirs(APP_DIR, exist_ok=True)

    # init_db.py
    init_db_code = f"""import os
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="user_auth",
    user="{DB_USERNAME}",
    password="{DB_PASSWORD}"
)

cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS login;')
cur.execute('''
    CREATE TABLE login (
        id serial PRIMARY KEY,
        email varchar(150) NOT NULL,
        password varchar(150) NOT NULL
    );
''')

cur.execute('INSERT INTO login (email, password) VALUES (%s, %s)',
            ('admin@admin.com', 'admin'))
conn.commit()
cur.close()
conn.close()
"""
    with open(os.path.join(APP_DIR, "init_db.py"), "w") as f:
        f.write(init_db_code)
    print("✅ Created flask_app/init_db.py")

    # app.py
    app_code = """import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        database='user_auth',
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD']
    )
    return conn

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Dummy user list (ideally you'd query your database here)
    users = [
        { "id": 1, "email": "admin@admin.com", "password": "admin" }
    ]

    for user in users:
        if user["email"] == email and user["password"] == password:
            return jsonify(success=True)

    return jsonify(success=False)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
"""
    with open(os.path.join(APP_DIR, "app.py"), "w") as f:
        f.write(app_code)
    print("✅ Created flask_app/app.py")


def create_runner_script():
    runner_script = f'''#!/bin/bash
source "{ACTIVATE_PATH}"
export DB_USERNAME="{DB_USERNAME}"
export DB_PASSWORD="{DB_PASSWORD}"

echo "🔁 Initializing database..."
{PYTHON_PATH} {APP_DIR}/init_db.py

echo "🚀 Starting Flask app..."
{PYTHON_PATH} {APP_DIR}/app.py
'''

    run_path = "/opt/flask_env/run_flask.sh"
    with open(run_path, "w") as f:
        f.write(runner_script)

    os.chmod(run_path, 0o755)
    print(f"\n✅ All set! Run your app with:\nsudo {run_path}")


def main():
    ensure_root()
    os_id = detect_os()
    print(f"Detected OS: {os_id}")

    install_pip_and_venv(os_id)
    install_python_packages_in_venv()
    create_flask_app_files()
    create_runner_script()

    # Automatically run it
    print("\n🚀 Running the Flask app setup script now...\n")
    subprocess.run(["sudo", "/opt/flask_env/run_flask.sh"], check=True)


if __name__ == "__main__":
    main()
