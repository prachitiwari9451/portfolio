import React, { useState, useEffect, useRef } from 'react';

// ==========================================================================
// REUSABLE INTERACTIVE COMPONENTS
// ==========================================================================

// Typewriter Text Effect for Hero section
function Typewriter({ words }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer;
    const activeWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

  return <span className="typewriter-text">{currentText}</span>;
}

// Counter animation for stats boxes
function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Skill Progress Bar component
function SkillBar({ name, percent }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percent);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [percent]);

  return (
    <div className="skill-item" ref={ref}>
      <div className="skill-info">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-bar" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}

// Card with mouse glow coordinates tracker
function GlowCard({ children, className = '', ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--pointer-x', `${x}px`);
    cardRef.current.style.setProperty('--pointer-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`glass-panel glow-card ${className}`}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {children}
    </div>
  );
}

// Scroll Reveal wrapper
function Reveal({ children, className = '', delay = '0ms' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': delay }}
    >
      {children}
    </div>
  );
}

// ==========================================================================
// MAIN APP COMPONENT
// ==========================================================================
export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Setup theme class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll events listener
  useEffect(() => {
    const handleScroll = () => {
      // 1. Scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // 2. Back to top visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // 3. Header scrolled state
      if (window.scrollY > 50) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Navigation Header */}
      <header className={`prachi-header ${headerScrolled ? 'scrolled' : ''}`}>
        <a className="prachi-logo" href="#top" aria-label="Prachi Tiwari - Home">
          <img src="/images/prachi_profile.jpg" alt="Prachi Tiwari portrait" />
          <span>Prachi Tiwari</span>
        </a>

        <nav className="prachi-nav" aria-label="Primary navigation">
          <a href="#about"><i className="fa-solid fa-user"></i> About</a>
          <a href="#services"><i className="fa-solid fa-gears"></i> Services</a>
          <a href="#projects"><i className="fa-solid fa-code-branch"></i> Projects</a>
          <a href="#experience"><i className="fa-solid fa-briefcase"></i> Experience</a>
          <a href="#contact"><i className="fa-solid fa-paper-plane"></i> Contact</a>
        </nav>

        <div className="prachi-header-right">
          {/* Theme Toggle Button */}
          <button id="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle Light/Dark Theme">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          <a href="https://github.com/prachitiwari9451/" className="icon-btn" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/prachi-tiwari-9b7ab2241" className="icon-btn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#contact" className="hire-btn">
            <i className="fa-solid fa-envelope"></i> Hire Me
          </a>
          <button className="menu-toggle" type="button" onClick={() => setIsMenuOpen(true)} aria-label="Open Navigation Menu">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <button className="mobile-menu-close" type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close Navigation Menu">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <a href="#about" onClick={handleMenuLinkClick}><i className="fa-solid fa-user"></i> About</a>
        <a href="#services" onClick={handleMenuLinkClick}><i className="fa-solid fa-gears"></i> Services</a>
        <a href="#projects" onClick={handleMenuLinkClick}><i className="fa-solid fa-code-branch"></i> Projects</a>
        <a href="#experience" onClick={handleMenuLinkClick}><i className="fa-solid fa-briefcase"></i> Experience</a>
        <a href="#contact" onClick={handleMenuLinkClick}><i className="fa-solid fa-paper-plane"></i> Contact</a>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* Hero Section */}
      <section className="hero" id="top">
        <div className="hero-radial-glow"></div>
        <div className="bg-glow-blob blob-primary" style={{ top: '-10%', right: '-10%' }}></div>
        <div className="bg-glow-blob blob-secondary" style={{ bottom: '-15%', left: '-10%' }}></div>
        <div className="hero-content">
          <Reveal>
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              ✨ Visual Storyteller &amp; Developer
            </div>
          </Reveal>

          <Reveal delay="100ms">
            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">Prachi Tiwari</span>
            </h1>
          </Reveal>

          <Reveal delay="200ms">
            <div className="hero-typewriter-container">
              I'm a&nbsp;
              <Typewriter
                words={[
                  'Backend Engineer',
                  '.NET Core Specialist',
                  'Visual Storyteller',
                  'Full-Stack Developer'
                ]}
              />
            </div>
          </Reveal>

          <Reveal delay="300ms">
            <p className="hero-description" style={{ maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
              Creating digital masterpieces with a touch of cinematic aesthetics.<br />
              Turning complex ideas into minimal, high-impact user experiences.
            </p>
          </Reveal>

          <Reveal delay="400ms">
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane"></i> Let's Talk
              </a>
              <a href="#projects" className="btn btn-outline">
                <i className="fa-solid fa-code-branch"></i> Selected Work
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About Me Section */}
      <section className="section" id="about">
        <div className="bg-glow-blob blob-accent" style={{ top: '20%', right: '-15%' }}></div>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">My Journey &amp; Core Focus</h2>
            <p className="section-subtitle">A backend-focused software engineer with a passion for database scaling and clean web services architecture.</p>
          </div>

          <div className="about-bento">
            {/* Bento Journey Card */}
            <GlowCard className="bento-journey">
              <h3 className="bento-card-title">
                <i className="fa-solid fa-book-open"></i> My Story
              </h3>
              <div className="about-story">
                <p>
                  I am a passionate <strong>Software Engineer</strong> with <strong>3+ years</strong> of hands-on experience in building scalable backend services, optimizing complex database workflows, and crafting modern full-stack web applications.
                </p>
                <p>
                  My engineering philosophy centers around <strong>performance</strong> and <strong>reliability</strong>. In my projects, I've designed and refined databases to achieve up to a <strong>40% latency reduction</strong>, integrated secure APIs with national portals, and managed large athletic/security registries.
                </p>
                <p>
                  Holding a <strong>B.Tech in Information Technology</strong>, I combine theoretical foundations with practical architecture patterns to build clean code structures that last.
                </p>
              </div>
            </GlowCard>

            {/* Bento Photo Card */}
            <GlowCard className="bento-photo">
              <div className="bento-photo-container">
                <img src="/images/prachi_profile.jpg" alt="Prachi Tiwari portrait photograph" />
              </div>
              <h3 style={{ marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>Prachi Tiwari</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Backend &amp; Full-Stack Engineer</p>
            </GlowCard>

            {/* Bento Skills Card */}
            <GlowCard className="bento-skills">
              <h3 className="bento-card-title">
                <i className="fa-solid fa-code"></i> Core Expertise
              </h3>
              <div className="skills-list">
                <SkillBar name="C# Programming" percent={95} />
                <SkillBar name="ASP.NET Core / MVC" percent={90} />
                <SkillBar name="SQL Server / Database Design" percent={85} />
                <SkillBar name="Web API &amp; Microservices" percent={80} />
              </div>
            </GlowCard>

            {/* Bento Stats Card */}
            <div className="bento-stats">
              <GlowCard className="stat-box">
                <span className="stat-num"><Counter end={3} suffix="+" /></span>
                <span className="stat-label">Years of Experience</span>
              </GlowCard>
              <GlowCard className="stat-box">
                <span className="stat-num"><Counter end={15} suffix="+" /></span>
                <span className="stat-label">Projects Completed</span>
              </GlowCard>
              <GlowCard className="stat-box">
                <span className="stat-num"><Counter end={40} suffix="%" /></span>
                <span className="stat-label">DB Latency Reduced</span>
              </GlowCard>
              <GlowCard className="stat-box">
                <span className="stat-num"><Counter end={99} suffix="%" /></span>
                <span className="stat-label">System Uptime</span>
              </GlowCard>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Services</span>
            <h2 className="section-title">Areas of Expertise</h2>
            <p className="section-subtitle">Delivering high-quality software architectures optimized for recruiter audits and business value.</p>
          </div>

          <div className="services-grid">
            <GlowCard className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <h3>Web Development</h3>
              <p>Building responsive, pixel-perfect web applications using React SPA or modern ASP.NET Core views, structured for seamless navigation, accessibility, and high visual appeal.</p>
            </GlowCard>

            <GlowCard className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-server"></i>
              </div>
              <h3>API Architecture</h3>
              <p>Designing secure, high-throughput RESTful endpoints using C#, Web APIs, and micro-ORMs like Dapper, complete with clean repository patterns and secure parameter validation.</p>
            </GlowCard>

            <GlowCard className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-database"></i>
              </div>
              <h3>Database Design</h3>
              <p>Writing optimized queries, structuring schemas, indexing, and implementing secure database logic in SQL Server and SQLite, achieving major response time optimizations.</p>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Selected Work Section (Horizontal Bento Case Studies) */}
      <section className="section" id="projects">
        <div className="bg-glow-blob blob-primary" style={{ bottom: '10%', left: '-15%' }}></div>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Selected Work</span>
            <h2 className="section-title">Case Studies &amp; Projects</h2>
            <p className="section-subtitle">A detailed look at key enterprise systems designed, optimized, and built to solve critical business problems.</p>
          </div>

          <div className="projects-list">
            {/* Project 1 */}
            <Reveal>
              <GlowCard className="project-card">
                <div className="project-left">
                  <div>
                    <span className="project-tag">Security &amp; Clearance</span>
                    <div className="project-brand-icon">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <h3 className="project-title">HP Vigilance Portal</h3>
                    <p className="project-desc">A premium, high-security clearance tracking system designed to manage credential audits and access clearance timelines.</p>
                  </div>
                  <div className="project-tech">
                    <span className="tech-badge">.NET Core</span>
                    <span className="tech-badge">C#</span>
                    <span className="tech-badge">SQL Server</span>
                    <span className="tech-badge">Redis</span>
                    <span className="tech-badge">Dapper</span>
                  </div>
                </div>
                <div className="project-right">
                  <div className="case-study-col features">
                    <h4 className="case-study-title"><i className="fa-solid fa-star"></i> Key Features</h4>
                    <ul className="case-study-list">
                      <li>Real-time role-based access audits</li>
                      <li>Secure clearance timeline tracking</li>
                      <li>Automated audit logging ledger</li>
                    </ul>
                  </div>
                  <div className="case-study-col challenges">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-exclamation"></i> Challenges</h4>
                    <ul className="case-study-list">
                      <li>Optimizing search logic across 10M+ history records</li>
                      <li>Ensuring zero data leakages in clearance logs</li>
                    </ul>
                  </div>
                  <div className="case-study-col impact">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-check"></i> Impact</h4>
                    <ul className="case-study-list">
                      <li>Achieved 99.99% operational uptime</li>
                      <li>Reduced clearance latency by 45%</li>
                      <li>Zero credential vulnerabilities detected</li>
                    </ul>
                  </div>
                </div>
              </GlowCard>
            </Reveal>

            {/* Project 2 */}
            <Reveal>
              <GlowCard className="project-card">
                <div className="project-left">
                  <div>
                    <span className="project-tag">Academic Scheduling</span>
                    <div className="project-brand-icon">
                      <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <h3 className="project-title">Vedanta Teaching</h3>
                    <p className="project-desc">An academic roster and scheduler services engine automating classroom scheduling and teacher allocations.</p>
                  </div>
                  <div className="project-tech">
                    <span className="tech-badge">ASP.NET Core</span>
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">PostgreSQL</span>
                    <span className="tech-badge">EF Core</span>
                  </div>
                </div>
                <div className="project-right">
                  <div className="case-study-col features">
                    <h4 className="case-study-title"><i className="fa-solid fa-star"></i> Key Features</h4>
                    <ul className="case-study-list">
                      <li>Automated teacher allocation engine</li>
                      <li>Roster sync with digital calendars</li>
                      <li>Timetable conflict checks</li>
                    </ul>
                  </div>
                  <div className="case-study-col challenges">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-exclamation"></i> Challenges</h4>
                    <ul className="case-study-list">
                      <li>Resolving overlapping classes under constrained hours</li>
                      <li>Integrating live edits with database scheduling</li>
                    </ul>
                  </div>
                  <div className="case-study-col impact">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-check"></i> Impact</h4>
                    <ul className="case-study-list">
                      <li>Saved 20+ admin hours weekly</li>
                      <li>100% scheduler conflict elimination</li>
                      <li>Improved class filling efficiency by 25%</li>
                    </ul>
                  </div>
                </div>
              </GlowCard>
            </Reveal>

            {/* Project 3 */}
            <Reveal>
              <GlowCard className="project-card">
                <div className="project-left">
                  <div>
                    <span className="project-tag">Athletic Credentials</span>
                    <div className="project-brand-icon">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <h3 className="project-title">SGFI Portal</h3>
                    <p className="project-desc">Athletic performance database integrated with DigiLocker for secure, verified student credential sharing.</p>
                  </div>
                  <div className="project-tech">
                    <span className="tech-badge">.NET Core</span>
                    <span className="tech-badge">C#</span>
                    <span className="tech-badge">SQLite</span>
                    <span className="tech-badge">Dapper</span>
                    <span className="tech-badge">DigiLocker API</span>
                  </div>
                </div>
                <div className="project-right">
                  <div className="case-study-col features">
                    <h4 className="case-study-title"><i className="fa-solid fa-star"></i> Key Features</h4>
                    <ul className="case-study-list">
                      <li>National DigiLocker mapping</li>
                      <li>Student sports credentials locker</li>
                      <li>Certificate auto-generation</li>
                    </ul>
                  </div>
                  <div className="case-study-col challenges">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-exclamation"></i> Challenges</h4>
                    <ul className="case-study-list">
                      <li>Synchronizing data securely with government APIs</li>
                      <li>Generating tamper-proof certification PDFs</li>
                    </ul>
                  </div>
                  <div className="case-study-col impact">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-check"></i> Impact</h4>
                    <ul className="case-study-list">
                      <li>Verified and seeded 50k+ certificates</li>
                      <li>Enabled instant student profile sharing</li>
                      <li>Reduced verification overhead by 90%</li>
                    </ul>
                  </div>
                </div>
              </GlowCard>
            </Reveal>

            {/* Project 4 */}
            <Reveal>
              <GlowCard className="project-card">
                <div className="project-left">
                  <div>
                    <span className="project-tag">Automation &amp; Tracking</span>
                    <div className="project-brand-icon">
                      <i className="fa-solid fa-location-crosshairs"></i>
                    </div>
                    <h3 className="project-title">Veerangana Portal</h3>
                    <p className="project-desc">GPS-enabled attendance verification and geo-fencing automation portal for security personnel.</p>
                  </div>
                  <div className="project-tech">
                    <span className="tech-badge">ASP.NET MVC</span>
                    <span className="tech-badge">C#</span>
                    <span className="tech-badge">SQL Server</span>
                    <span className="tech-badge">SignalR</span>
                    <span className="tech-badge">Google Maps API</span>
                  </div>
                </div>
                <div className="project-right">
                  <div className="case-study-col features">
                    <h4 className="case-study-title"><i className="fa-solid fa-star"></i> Key Features</h4>
                    <ul className="case-study-list">
                      <li>Live geo-fenced attendance lock</li>
                      <li>Real-time active tracking dashboards</li>
                      <li>Instant breach push alerts</li>
                    </ul>
                  </div>
                  <div className="case-study-col challenges">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-exclamation"></i> Challenges</h4>
                    <ul className="case-study-list">
                      <li>Optimizing mobile location polls to conserve battery</li>
                      <li>Offline state sync logic for check-ins</li>
                    </ul>
                  </div>
                  <div className="case-study-col impact">
                    <h4 className="case-study-title"><i className="fa-solid fa-circle-check"></i> Impact</h4>
                    <ul className="case-study-list">
                      <li>Eliminated proxy registrations entirely</li>
                      <li>Enabled instant reaction times for area breaches</li>
                      <li>Increased security staff efficiency by 35%</li>
                    </ul>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section" id="experience" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Education &amp; Milestones</span>
            <h2 className="section-title">Academic &amp; Professional Path</h2>
            <p className="section-subtitle">My academic credentials and software engineering milestones.</p>
          </div>

          <div className="academic-grid">
            <GlowCard className="academic-card">
              <div className="academic-icon">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="academic-year">2020 - 2024</span>
              <h3 className="academic-title">B.Tech in IT</h3>
              <h4 className="academic-inst">BSSITM / AKTU</h4>
              <p className="academic-desc">Graduated with a Bachelor of Technology in Information Technology. Focused on software engineering principles, algorithms, relational database systems, and object-oriented architectures.</p>
            </GlowCard>

            <GlowCard className="academic-card">
              <div className="academic-icon">
                <i className="fa-solid fa-award"></i>
              </div>
              <span className="academic-year">2017 - 2020</span>
              <h3 className="academic-title">Diploma in IT</h3>
              <h4 className="academic-inst">CSM Polytechnic</h4>
              <p className="academic-desc">Acquired foundational computer programming skills, scoring high marks in database design, networking, web development basics, and software structures.</p>
            </GlowCard>

            <GlowCard className="academic-card">
              <div className="academic-icon">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <span className="academic-year">2024 - Present</span>
              <h3 className="academic-title">Full-Stack Engineer</h3>
              <h4 className="academic-inst">Verified Projects Showcase</h4>
              <p className="academic-desc">Designing scalable web systems, optimizing backend databases, integrating microservices and Dapper, and writing clean, recruiters-audit-ready code.</p>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* Premium Two-Column Contact Section */}
      <section className="section" id="contact">
        <div className="bg-glow-blob blob-secondary" style={{ top: '30%', right: '-10%' }}></div>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Connect</span>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">Let's connect for roles, collaborations, or technical discussion.</p>
          </div>

          <div className="contact-grid">
            {/* Left Panel */}
            <GlowCard className="contact-info-panel">
              <div>
                <div className="recruiter-badge">
                  <span className="pulse-dot"></span>
                  Active &amp; Open for Roles
                </div>
                <h3 className="contact-header-text" style={{ marginTop: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  Let's Build <br />
                  <span className="gradient-text">Something Amazing</span> <br />
                  Together!
                </h3>
              </div>

              <div className="diamond-divider">
                <div className="diamond-line"></div>
                <div className="diamond-node"></div>
                <div className="diamond-line"></div>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connect Directly</p>
                <div className="connect-dock">
                  <a href="https://www.linkedin.com/in/prachi-tiwari-9b7ab2241" className="connect-btn linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="https://github.com/prachitiwari9451/" className="connect-btn github" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="mailto:prachitiwari9451@gmail.com" className="connect-btn email" aria-label="Send an Email">
                    <i className="fa-solid fa-envelope"></i>
                  </a>
                  <a href="tel:+918957964209" className="connect-btn phone" aria-label="Call Phone">
                    <i className="fa-solid fa-phone"></i>
                  </a>
                </div>
              </div>

              <div className="availability-banner">
                <div className="availability-icon">
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
                <div className="availability-text">
                  <h4>Available Immediately</h4>
                  <p>Open to both local (Lucknow/India) and remote roles.</p>
                </div>
              </div>
            </GlowCard>

            {/* Right Panel Card Grid */}
            <div className="contact-channels-grid">
              <GlowCard className="channel-card email" onClick={() => window.open('mailto:prachitiwari9451@gmail.com')}>
                <div className="channel-header">
                  <span className="channel-label">Email Channel</span>
                  <span className="channel-icon"><i className="fa-solid fa-envelope"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">prachitiwari9451@gmail.com</div>
                  <span className="channel-link">Send an Email <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>

              <GlowCard className="channel-card phone" onClick={() => window.open('tel:+918957964209')}>
                <div className="channel-header">
                  <span className="channel-label">Phone Channel</span>
                  <span className="channel-icon"><i className="fa-solid fa-phone"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">+91 8957964209</div>
                  <span className="channel-link">Call Me Now <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>

              <GlowCard className="channel-card location" onClick={() => window.open('https://maps.google.com/?q=Lucknow')}>
                <div className="channel-header">
                  <span className="channel-label">Location</span>
                  <span className="channel-icon"><i className="fa-solid fa-location-dot"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">Lucknow, India</div>
                  <span className="channel-link">View on Maps <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>

              <GlowCard className="channel-card linkedin" onClick={() => window.open('https://www.linkedin.com/in/prachi-tiwari-9b7ab2241', '_blank')}>
                <div className="channel-header">
                  <span className="channel-label">LinkedIn</span>
                  <span className="channel-icon"><i className="fa-brands fa-linkedin-in"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">Prachi Tiwari</div>
                  <span className="channel-link">Visit Profile <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>

              <GlowCard className="channel-card github" onClick={() => window.open('https://github.com/prachitiwari9451/', '_blank')}>
                <div className="channel-header">
                  <span className="channel-label">GitHub</span>
                  <span className="channel-icon"><i className="fa-brands fa-github"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">prachitiwari9451</div>
                  <span className="channel-link">View Profile <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>

              <GlowCard className="channel-card availability" onClick={() => window.open('mailto:prachitiwari9451@gmail.com?subject=Inquiry')}>
                <div className="channel-header">
                  <span className="channel-label">Availability</span>
                  <span className="channel-icon"><i className="fa-solid fa-calendar-check"></i></span>
                </div>
                <div className="channel-details">
                  <div className="channel-value">Full-Time / Freelance</div>
                  <span className="channel-link">Let's Talk <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </GlowCard>
            </div>
          </div>

          {/* Bottom Quote Banner */}
          <Reveal>
            <GlowCard className="quote-banner">
              <div className="quote-icon">
                <i className="fa-solid fa-star"></i>
              </div>
              <blockquote>
                <span>"Great things in business are never done by one person. They're done by </span>
                <strong className="gradient-text">a team of people</strong>.<span>"</span>
              </blockquote>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">&copy; {new Date().getFullYear()} Prachi Tiwari. All Rights Reserved. Designed with premium aesthetics.</p>
        </div>
      </footer>

      {/* Back to Top Floating Button */}
      <a href="#top" className={`back-to-top ${showBackToTop ? 'visible' : ''}`} aria-label="Scroll Back to Top">
        <i className="fa-solid fa-arrow-up"></i>
      </a>
    </>
  );
}
