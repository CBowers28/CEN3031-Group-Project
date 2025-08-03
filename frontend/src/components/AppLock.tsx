import React, { useState, useEffect } from 'react';
import styles from './AppLock.module.css';
import WebsiteBlockingService from '../utils/websiteBlocking';
import type { BlockedSite } from '../utils/websiteBlocking';

interface AppLockProps {
    isActive: boolean;
}

const AppLock: React.FC<AppLockProps> = ({ isActive }) => {
    const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
        {
            id: '1',
            url: 'instagram.com',
            name: 'Instagram'
        }
    ]);
    const [newSiteUrl, setNewSiteUrl] = useState('');
    const [newSiteName, setNewSiteName] = useState('');
    const [isBlocking, setIsBlocking] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const blockingService = WebsiteBlockingService.getInstance();

    // Start blocking when app is active and user has tasks in progress
    useEffect(() => {
        blockingService.setBlockedSites(blockedSites);
        
        if (isActive && blockedSites.length > 0) {
            setIsBlocking(true);
            blockingService.startBlocking();
        } else {
            setIsBlocking(false);
            blockingService.stopBlocking();
        }

        return () => {
            blockingService.stopBlocking();
        };
    }, [isActive, blockedSites, blockingService]);

    const addSite = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSiteUrl.trim() && newSiteName.trim()) {
            const newSite: BlockedSite = {
                id: Date.now().toString(),
                url: newSiteUrl.trim(),
                name: newSiteName.trim()
            };
            setBlockedSites(prev => [...prev, newSite]);
            setNewSiteUrl('');
            setNewSiteName('');
        }
    };

    const removeSite = (id: string) => {
        setBlockedSites(prev => prev.filter(site => site.id !== id));
    };

    const showBlockingDemo = () => {
        setShowDemo(true);
        // Create the blocking overlay demo
        const overlay = document.createElement('div');
        overlay.id = 'nepsis-demo-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
            color: white !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 999999 !important;
            font-family: 'Inter', Arial, sans-serif !important;
            text-align: center !important;
            padding: 2rem !important;
            box-sizing: border-box !important;
        `;

        const currentTime = new Date().toLocaleTimeString();
        
        overlay.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #e74c3c;">Website Blocked</h1>
                <h2 style="font-size: 1.5rem; margin-bottom: 2rem; color: #8fbc8f;">Instagram</h2>
                <p style="font-size: 1.2rem; margin-bottom: 1rem; line-height: 1.6;">
                    This website is blocked while you're working on your tasks.
                </p>
                <p style="font-size: 1rem; margin-bottom: 2rem; color: #bdc3c7;">
                    Complete your current task in NEPSIS to unlock access.
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p style="margin: 0; font-size: 0.9rem; color: #ecf0f1;">
                        💡 <strong>Tip:</strong> Use this time to focus on your productivity goals!
                    </p>
                </div>
                <button 
                    onclick="document.getElementById('nepsis-demo-overlay').remove(); document.body.style.overflow = '';"
                    style="
                        background: #3498db; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 6px; 
                        font-size: 1rem; 
                        cursor: pointer;
                        margin-bottom: 1rem;
                    "
                >
                    Close Demo
                </button>
                <p style="font-size: 0.8rem; color: #95a5a6;">
                    Blocked at ${currentTime} by NEPSIS App Lock
                </p>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Auto-close after 10 seconds
        setTimeout(() => {
            const demoOverlay = document.getElementById('nepsis-demo-overlay');
            if (demoOverlay) {
                demoOverlay.remove();
                document.body.style.overflow = '';
                setShowDemo(false);
            }
        }, 10000);
    };

    return (
        <div className={styles.appLockContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>🔒 App Lock</h3>
                <div className={styles.statusIndicator}>
                    <span className={`${styles.statusDot} ${isBlocking ? styles.active : ''}`}></span>
                    <span className={styles.statusText}>
                        {isBlocking ? 'Blocking Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className={styles.blockedSitesList}>
                <h4 className={styles.sectionTitle}>Blocked Websites</h4>
                {blockedSites.length === 0 ? (
                    <p className={styles.emptyMessage}>No sites blocked yet</p>
                ) : (
                    <div className={styles.sitesList}>
                        {blockedSites.map(site => (
                            <div key={site.id} className={styles.siteItem}>
                                <div className={styles.siteInfo}>
                                    <span className={styles.siteName}>{site.name}</span>
                                    <span className={styles.siteUrl}>{site.url}</span>
                                </div>
                                <button 
                                    className={styles.removeButton}
                                    onClick={() => removeSite(site.id)}
                                    title="Remove site"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={addSite} className={styles.addSiteForm}>
                <h4 className={styles.sectionTitle}>Add Website to Block</h4>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Website name (e.g., Instagram)"
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="URL (e.g., instagram.com)"
                        value={newSiteUrl}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.addButton}>
                        Add Site
                    </button>
                </div>
            </form>

            <div className={styles.infoSection}>
                <h4 className={styles.sectionTitle}>ℹ️ How It Works</h4>
                <ul className={styles.infoList}>
                    <li>Blocking activates when you start tasks</li>
                    <li>Complete tasks to unlock access</li>
                    <li>Helps maintain focus during work</li>
                </ul>
                
                {isBlocking && (
                    <div style={{ marginTop: '15px', padding: '10px', background: '#f0f8ff', borderRadius: '6px', border: '1px solid #87ceeb' }}>
                        <h5 style={{ margin: '0 0 8px 0', color: '#2c5282' }}>🧪 Test Blocking:</h5>
                        <button 
                            onClick={showBlockingDemo}
                            style={{ 
                                background: '#3182ce',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginBottom: '8px'
                            }}
                        >
                            Show Instagram Blocking Demo
                        </button>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                            This will show how the blocking overlay appears when trying to access Instagram
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppLock;
