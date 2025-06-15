class SimpleRouter {
  constructor() {
      this.routes = {
          'home': 'pages/home.html',
          'about': 'pages/about.html',
          'projects': 'pages/projects.html'
      };
      this.init();
  }

  init() {
      // Load initial page
      this.loadPage('home');
      
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
      document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
      });
      activeLink.classList.add('active');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SimpleRouter();
});