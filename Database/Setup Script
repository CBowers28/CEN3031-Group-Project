#!/usr/bin/env python3
import os
import sys
import subprocess

def ensure_root():
    """Ensure the script runs as root or re-executes itself with sudo."""
    if os.geteuid() != 0:
        print("Elevating privileges with sudo...")
        os.execvp("sudo", ["sudo"] + sys.argv)

def run_psql(sql, user='postgres'):
    """Run a SQL command as the given postgres user."""
    try:
        result = subprocess.run(
            ['sudo', '-u', user, 'psql', '-c', sql],
            check=True, capture_output=True, text=True
        )
        print(f"Executed: {sql}\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Error executing SQL: {sql}\n{e.stderr}")
        sys.exit(1)

def append_line_if_missing(file_path, line_to_add):
    """Append line_to_add if it is not already present in the file."""
    with open(file_path, 'r') as f:
        content = f.read()
    if line_to_add not in content:
        with open(file_path, 'a') as f:
            f.write('\n' + line_to_add + '\n')
        print(f"Appended to {file_path}: {line_to_add}")
    else:
        print(f"Entry already present in {file_path}: {line_to_add}")

def restart_postgresql():
    """Restart PostgreSQL service."""
    print("Restarting PostgreSQL service...")
    try:
        subprocess.run(['systemctl', 'restart', 'postgresql'], check=True)
        print("PostgreSQL restarted successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to restart PostgreSQL: {e}")
        sys.exit(1)

def main():
    ensure_root()

    username = "admin"
    password = "admin"
    database = "user_auth"
    allowed_cidr = "0.0.0.0/0"  # Allow connections from any IPv4 address

    # 1. Set system-wide password_encryption to scram-sha-256
    run_psql("ALTER SYSTEM SET password_encryption = 'scram-sha-256';")

    # 2. Reload config to apply the change
    run_psql("SELECT pg_reload_conf();")

    # 3. Create user with password (encrypted with scram-sha-256 automatically)
    run_psql(f"CREATE USER {username} WITH PASSWORD '{password}';")

    # 4. Create the database
    run_psql(f"CREATE DATABASE {database};")

    # 5. Change owner of the database to the user (this grants full control)
    run_psql(f"ALTER DATABASE {database} OWNER TO {username};")

    # Path to pg_hba.conf for PostgreSQL 17 on Debian-based systems
    pg_hba_conf = "/etc/postgresql/17/main/pg_hba.conf"

    # 6. Add pg_hba.conf entry to allow user access from anywhere with scram-sha-256
    hba_line = f"host {database} {username} {allowed_cidr} scram-sha-256"
    append_line_if_missing(pg_hba_conf, hba_line)

    # 7. Restart PostgreSQL to apply config changes
    restart_postgresql()

if __name__ == "__main__":
    main()
