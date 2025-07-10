import os
import sys
import platform
import shutil
import subprocess

def ensure_root():
    if os.geteuid() != 0:
        print("This script must be run as root. Trying to elevate with sudo...")
        try:
            subprocess.run(['sudo', sys.executable] + sys.argv, check=True)
        except subprocess.CalledProcessError:
            print("Failed to elevate privileges with sudo.")
        sys.exit()

def is_postgresql_installed():
    return shutil.which("psql") is not None

def install_postgresql_linux():
    try:
        print("Updating package lists...")
        subprocess.run(["apt", "update"], check=True)
        print("Installing PostgreSQL...")
        subprocess.run(["apt", "install", "-y", "postgresql"], check=True)
        print("PostgreSQL installed successfully on Linux.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install PostgreSQL on Linux: {e}")

def install_postgresql_macos():
    try:
        if shutil.which("brew") is None:
            print("Homebrew is not installed. Please install Homebrew first: https://brew.sh/")
            return
        print("Updating Homebrew...")
        subprocess.run(["brew", "update"], check=True)
        print("Installing PostgreSQL...")
        subprocess.run(["brew", "install", "postgresql"], check=True)
        print("PostgreSQL installed successfully on macOS.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install PostgreSQL on macOS: {e}")

def main():
    ensure_root()

    if is_postgresql_installed():
        print("PostgreSQL is already installed.")
        return

    os_name = platform.system()
    if os_name == "Linux":
        install_postgresql_linux()
    elif os_name == "Darwin":
        install_postgresql_macos()
    elif os_name == "Windows":
        print("Windows detected. Please install PostgreSQL manually or via Chocolatey.")
    else:
        print(f"Unsupported OS: {os_name}")

if __name__ == "__main__":
    main()
