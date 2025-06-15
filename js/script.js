class SimpleRouter {
    constructor() {
        this.routes = {
            'home': 'pages/home.html',
            'about': 'pages/about.html',
            'projects': 'pages/projects.html'
        };
        this.init();
    }

    async init() {
        // Load navbar first
        await this.loadNavbar();
        
        // Setup navigation after navbar is loaded
        this.setupNavigation();
        
        // Set initial active state AFTER navbar is loaded
        
        this.setInitialActiveState();
        // Then load initial page
        this.loadPage('home');
    }

    async loadNavbar() {
        try {
            const response = await fetch('components/nav.html');
            if (!response.ok) throw new Error('Navbar not found');
            
            const html = await response.text();
            document.getElementById('navbar-container').innerHTML = html;
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.loadPage(page);
                this.setActiveNav(e.target);
            });
        });
    }

    // Add this new method
    setInitialActiveState() {
        // Wait a bit for the navbar to fully render
        setTimeout(() => {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                this.updateSliderPosition(homeLink);
            }
        }, 100); // Small delay to ensure navbar is rendered
    }

    async loadPage(page) {
        const contentDiv = document.getElementById('content');
        
        try {
            const response = await fetch(this.routes[page]);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            contentDiv.innerHTML = html;
            
            // Update page title
            document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} - chop`;
            
        } catch (error) {
            contentDiv.innerHTML = '<h2>Page not found</h2><p>Sorry, the requested page could not be loaded.</p>';
        }
    }

    setActiveNav(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the clicked link
        activeLink.classList.add('active');

        // Update slider position and width
        this.updateSliderPosition(activeLink);
    }

    updateSliderPosition(activeLink) {
      const container = document.querySelector('header .container');
      const linkRect = activeLink.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const leftPosition = linkRect.left - containerRect.left + (linkRect.width * -0.02);
      const width = linkRect.width * 1.035;

      container.style.setProperty('--slider-left', `${leftPosition}px`);
      container.style.setProperty('--slider-width', `${width}px`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleRouter();
});