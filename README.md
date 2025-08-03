# NEPSIS - Next-Generation Productivity Task Tracker

> **Transforming productivity through gamified task management and intelligent distraction blocking**

## What is NEPSIS?

**NEPSIS** is an innovative productivity application that combines behavioral psychology with cutting-edge web technology to create the ultimate focus management system. Our platform gamifies productivity by introducing a token-based reward economy where users earn "cogni cash" for completing tasks, which can then be spent in our integrated reward store to unlock temporary screen time breaks.

The app features a revolutionary **App Lock system** that actively blocks distracting websites during work sessions, ensuring users maintain laser-focus on their productivity goals. With intelligent website monitoring, customizable block lists, and a sophisticated reward economy, NEPSIS transforms the struggle against digital distractions into an engaging, achievement-driven experience.

## Technical Architecture

### **Frontend Operation**

Our frontend is built on **React 19.1.0** with **TypeScript**, providing a type-safe, high-performance user experience powered by **Vite** for lightning-fast development and build processes.

#### **Core Components:**
- **MainDashboard**: Central hub coordinating all application state and component interactions
- **TaskBoard**: Smart task management with visual status tracking (Available → In Progress → Completed)
- **RewardsPanel**: Gamified token economy with reward store integration and screen time management
- **AppLock**: Revolutionary website blocking system with real-time monitoring and custom block lists

#### **Advanced Features:**
- **CSS Modules**: Modular styling system ensuring component isolation and maintainable code
- **Real-time State Management**: React hooks managing complex timer states, token transactions, and app lock coordination
- **Website Blocking Service**: Singleton pattern implementation for efficient cross-tab website monitoring
- **Responsive Design**: Optimized layouts for all screen sizes with intelligent component spacing

#### **Reward Store Integration:**
Our sophisticated reward economy allows users to spend earned tokens on screen time breaks with a **2:1 ratio** (2 tokens = 1 minute of screen time). The system features:
- Real-time countdown timers with pause/resume functionality
- Automatic app lock deactivation during active screen time
- Intelligent pause detection that re-engages app lock when timers are paused
- Complete state synchronization between reward system and blocking mechanisms

### **Backend Infrastructure**

The backend leverages **Python Flask** framework with **PostgreSQL** database for robust, scalable server-side operations.

#### **Core Architecture:**
- **User Authentication System**: Secure login and session management with encrypted user data
- **Database Operations**: PostgreSQL integration for persistent storage of user profiles, task history, and token balances
- **RESTful API Design**: Clean, standardized endpoints for frontend-backend communication
- **Real-time Data Sync**: Efficient data transfer protocols ensuring seamless user experience

#### **Database Schema:**
- **Users Table**: Authentication credentials, profile information, and account settings
- **Tasks Table**: Task definitions, completion history, and productivity analytics
- **Tokens Table**: Transaction history, earning records, and reward store purchases
- **Settings Table**: User preferences, custom block lists, and app configurations

#### **Security Features:**
- **Data Encryption**: Secure password hashing and sensitive data protection
- **Session Management**: Token-based authentication with automatic session expiration
- **SQL Injection Prevention**: Parameterized queries and input validation
- **CORS Configuration**: Proper cross-origin resource sharing for secure API access

## Getting Started

### **Prerequisites:**
- **Node.js** (v18+) for frontend development
- **Python** (v3.9+) for backend operations
- **PostgreSQL** (v13+) for database management

### **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

### **Backend Setup:**
```bash
cd Database
python SetupScript.py
python StartDatabase.py
```

## Key Features

### **Gamified Productivity System**
- Earn tokens for every minute of task completion
- Special demo task providing 60 cogni cash in just 5 seconds
- Progressive reward structure encouraging longer focus sessions
- Achievement tracking with motivational completion messages

### **Intelligent App Lock Technology**
- **Always-On Protection**: App lock remains active by default, ensuring maximum focus
- **Smart Deactivation**: Only disables during active, unpaused screen time sessions
- **Instant Re-engagement**: Automatically reactivates when timers are paused or expired
- **Custom Block Lists**: User-controlled website blocking with easy add/remove functionality
- **Visual Blocking Interface**: Professional overlays with motivational messaging and clear instructions

### **Revolutionary Reward Store**
- **Token Economy**: Spend earned cogni cash on temporary screen time breaks
- **Balanced Exchange Rate**: 2:1 ratio ensures productivity is properly rewarded
- **Timer Management**: Full pause/resume controls with state preservation
- **Automatic Integration**: Seamless coordination between reward purchases and app lock deactivation

## The NEPSIS Experience

1. **Focus Session**: Select a task to begin focused work with automatic app lock activation
2. **Distraction Blocking**: Attempt to visit blocked sites and receive motivational redirects
3. **Task Completion**: Finish tasks to earn tokens and build your cogni cash balance
4. **Reward Shopping**: Spend tokens in the reward store for well-deserved screen time breaks
5. **Controlled Breaks**: Enjoy purchased screen time with full timer controls and automatic app lock re-engagement

## Project Status

**Current Branch**: `reward-store-integration`  
**Sprint Focus**: Complete reward store implementation with screen time purchase system

### **Recent Achievements:**
- Full app lock integration with pause state management
- Complete reward store with token-to-screen-time conversion
- Demo task implementation for user onboarding
- Advanced timer controls with pause/resume functionality
- Seamless state synchronization across all components

---

## Important Links

**Project Backlog**: https://docs.google.com/spreadsheets/d/17hs1WFMi4d0R3836j7-CnwriTo3vkSlqKJUTjtMnPvk/edit?usp=sharing

---

*NEPSIS - Where productivity meets innovation. Transform your work habits, eliminate distractions, and achieve your goals through intelligent task management and behavioral psychology.*
