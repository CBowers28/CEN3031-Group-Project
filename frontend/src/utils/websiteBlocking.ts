// Website blocking utility functions
// In a real implementation, this would be part of a browser extension

export interface BlockedSite {
    id: string;
    url: string;
    name: string;
}

class WebsiteBlockingService {
    private static instance: WebsiteBlockingService;
    private blockedSites: BlockedSite[] = [];
    private isBlocking: boolean = false;
    private checkInterval: number | null = null;

    private constructor() {}

    public static getInstance(): WebsiteBlockingService {
        if (!WebsiteBlockingService.instance) {
            WebsiteBlockingService.instance = new WebsiteBlockingService();
        }
        return WebsiteBlockingService.instance;
    }

    public setBlockedSites(sites: BlockedSite[]): void {
        this.blockedSites = sites;
    }

    public startBlocking(): void {
        if (this.isBlocking) return;
        
        this.isBlocking = true;
        console.log('🔒 Website blocking activated');
        
        // Start monitoring current tab/window
        this.checkInterval = setInterval(() => {
            this.checkCurrentSite();
        }, 1000);

        // For demonstration purposes, we'll also create a visual indicator
        this.createBlockingIndicator();
    }

    public stopBlocking(): void {
        if (!this.isBlocking) return;
        
        this.isBlocking = false;
        console.log('🔓 Website blocking deactivated');
        
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        this.removeBlockingIndicator();
    }

    private checkCurrentSite(): void {
        const currentUrl = window.location.href.toLowerCase();
        
        for (const site of this.blockedSites) {
            const siteUrl = site.url.toLowerCase();
            
            // Check if current URL contains the blocked site
            if (currentUrl.includes(siteUrl)) {
                this.blockCurrentSite(site);
                return;
            }
        }
    }

    private blockCurrentSite(site: BlockedSite): void {
        // Create blocking overlay
        this.createBlockingOverlay(site);
        
        // Log the blocking attempt
        console.log(`🚫 Blocked access to ${site.name} (${site.url})`);
        
        // In a browser extension, you could:
        // - Redirect to a different page
        // - Close the tab
        // - Replace page content
        // - Show a blocking message
    }

    private createBlockingOverlay(site: BlockedSite): void {
        // Remove any existing overlay
        this.removeBlockingOverlay();

        const overlay = document.createElement('div');
        overlay.id = 'nepsis-blocking-overlay';
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
                <h2 style="font-size: 1.5rem; margin-bottom: 2rem; color: #8fbc8f;">${site.name}</h2>
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
                <p style="font-size: 0.8rem; color: #95a5a6;">
                    Blocked at ${currentTime} by NEPSIS App Lock
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
    }

    private removeBlockingOverlay(): void {
        const overlay = document.getElementById('nepsis-blocking-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
    }

    private createBlockingIndicator(): void {
        const indicator = document.createElement('div');
        indicator.id = 'nepsis-blocking-indicator';
        indicator.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: #e74c3c !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            z-index: 999998 !important;
            font-family: 'Inter', Arial, sans-serif !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        `;
        indicator.textContent = '🔒 NEPSIS Active';
        
        document.body.appendChild(indicator);
    }

    private removeBlockingIndicator(): void {
        const indicator = document.getElementById('nepsis-blocking-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    public isCurrentlyBlocking(): boolean {
        return this.isBlocking;
    }

    public getBlockedSites(): BlockedSite[] {
        return [...this.blockedSites];
    }
}

export default WebsiteBlockingService;
