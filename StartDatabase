import os
import sys
import platform
import subprocess
import shutil

def ensure_root():
    if os.geteuid() != 0:
        print("This script must be run as root. Trying to elevate with sudo...")
        try:
            subprocess.run(['sudo', sys.executable] + sys.argv, check=True)
        except subprocess.CalledProcessError:
            print("Failed to elevate privileges.")
        sys.exit()

def find_postgres_conf():
    # Try common locations
    locations = [
        "/etc/postgresql/",       # Debian-based, versioned dirs inside
        "/var/lib/pgsql/data/",   # CentOS/RHEL
        "/usr/local/var/postgres",# macOS Homebrew
    ]
    for base in locations:
        if os.path.isdir(base):
            # Try to find postgresql.conf inside
            for root, dirs, files in os.walk(base):
                if "postgresql.conf" in files:
                    return os.path.join(root, "postgresql.conf")
    # Last resort: try psql to find config
    try:
        result = subprocess.run(
            ["psql", "-t", "-P", "format=unaligned", "-c",
             "SHOW config_file;"],
            capture_output=True, text=True, check=True)
        path = result.stdout.strip()
        if os.path.isfile(path):
            return path
    except Exception:
        pass
    return None

def find_pg_hba_conf(postgres_conf_path):
    if not postgres_conf_path:
        return None
    # The pg_hba.conf is usually in the same dir or specified in postgresql.conf
    dir_path = os.path.dirname(postgres_conf_path)
    pg_hba_path = os.path.join(dir_path, "pg_hba.conf")
    if os.path.isfile(pg_hba_path):
        return pg_hba_path

    # Sometimes pg_hba.conf location is specified inside postgresql.conf
    with open(postgres_conf_path, "r") as f:
        for line in f:
            if line.strip().startswith("hba_file"):
                # format: hba_file = 'path'
                import re
                m = re.search(r"hba_file\s*=\s*'?\"?([^'\"]+)'?\"?", line)
                if m:
                    candidate = m.group(1)
                    # Make relative to config dir if needed
                    if not os.path.isabs(candidate):
                        candidate = os.path.join(dir_path, candidate)
                    if os.path.isfile(candidate):
                        return candidate
    return None

def modify_postgresql_conf(path):
    # Set listen_addresses = '*'
    modified = False
    lines = []
    with open(path, "r") as f:
        for line in f:
            if line.strip().startswith("listen_addresses"):
                lines.append("listen_addresses = '*'\n")
                modified = True
            else:
                lines.append(line)
    if not modified:
        # Append at the end if not found
        lines.append("\nlisten_addresses = '*'\n")
        modified = True
    with open(path, "w") as f:
        f.writelines(lines)
    print(f"Updated {path}: set listen_addresses = '*'")

def modify_pg_hba_conf(path):
    # Add or ensure line for all hosts to trust or md5 auth
    # e.g.:
    # host all all 0.0.0.0/0 md5
    # Check if line exists; if not append
    entry = "host all all 0.0.0.0/0 md5\n"
    with open(path, "r") as f:
        content = f.read()
    if entry.strip() not in content:
        with open(path, "a") as f:
            f.write("\n# Allow connections from any IP address\n")
            f.write(entry)
        print(f"Appended pg_hba.conf to allow all hosts with md5 auth")
    else:
        print("pg_hba.conf already allows connections from all IPs")

def restart_postgres_linux():
    # Try systemctl or service
    print("Restarting PostgreSQL service on Linux...")
    if shutil.which("systemctl"):
        subprocess.run(["systemctl", "restart", "postgresql"], check=False)
    else:
        subprocess.run(["service", "postgresql", "restart"], check=False)

def restart_postgres_macos():
    print("Restarting PostgreSQL service on macOS (Homebrew)...")
    subprocess.run(["brew", "services", "restart", "postgresql"], check=False)

def main():
    os_name = platform.system()

    if os_name == "Windows":
        print("Windows detected. Please use Services Manager to start PostgreSQL and configure postgresql.conf accordingly.")
        sys.exit(1)

    ensure_root()

    postgres_conf = find_postgres_conf()
    if not postgres_conf:
        print("Could not find postgresql.conf automatically. Please provide its path manually.")
        sys.exit(1)

    pg_hba_conf = find_pg_hba_conf(postgres_conf)
    if not pg_hba_conf:
        print("Could not find pg_hba.conf automatically. Please provide its path manually.")
        sys.exit(1)

    print(f"Using postgresql.conf: {postgres_conf}")
    print(f"Using pg_hba.conf: {pg_hba_conf}")

    modify_postgresql_conf(postgres_conf)
    modify_pg_hba_conf(pg_hba_conf)

    if os_name == "Linux":
        restart_postgres_linux()
    elif os_name == "Darwin":
        restart_postgres_macos()
    else:
        print(f"Unsupported OS: {os_name}")

    print("PostgreSQL should now be listening on all IP addresses at port 5432.")

if __name__ == "__main__":
    main()
