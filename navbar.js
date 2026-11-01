/**
 * Catering Bunda Rahma – Shared Navigation & Sidebar Logic
 * Responsive mobile drawer, keyboard accessibility, and state management
 */
(function () {
  function initNav() {
    // 1. Customer Top Navbar
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('nav');
    var setOpen = null;

    if (burger && nav) {
      setOpen = function (isOpen) {
        nav.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        burger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
      };

      burger.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!nav.classList.contains('open'));
      });

      document.addEventListener('click', function (e) {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
          setOpen(false);
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      });

      window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
        if (e.matches) {
          setOpen(false);
        }
      });
    }

    // Active Navigation & Section Indicator
    if (nav) {
      var aboutSection = document.getElementById('tentang');
      var langgananSection = document.getElementById('langganan');
      var navLinks = nav.querySelectorAll('a:not(.btn-nav):not(.btn)');
      var tentangLink = null;
      var berandaLink = null;
      var langgananLink = null;

      for (var i = 0; i < navLinks.length; i++) {
        var text = (navLinks[i].textContent || '').trim().toLowerCase();
        if (text === 'beranda') {
          berandaLink = navLinks[i];
        } else if (text === 'tentang') {
          tentangLink = navLinks[i];
        } else if (text === 'langganan') {
          langgananLink = navLinks[i];
        }
      }

      if (!tentangLink) tentangLink = nav.querySelector('a[href*="#tentang"]');
      if (!langgananLink) langgananLink = nav.querySelector('a[href*="#langganan"]');
      if (!berandaLink) berandaLink = nav.querySelector('a[href*="Landing Page.html"]:not([href*="#"])');

      var setActiveLink = function (activeLink) {
        if (!activeLink) return;
        for (var k = 0; k < navLinks.length; k++) {
          navLinks[k].classList.remove('active');
          navLinks[k].removeAttribute('aria-current');
        }
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
      };

      if (aboutSection || langgananSection) {
        var isClickScrolling = false;
        var clickScrollTimer = null;

        var startClickScroll = function () {
          isClickScrolling = true;
          clearTimeout(clickScrollTimer);
          clickScrollTimer = setTimeout(function () {
            isClickScrolling = false;
          }, 900);
        };

        // 1. Initial State based on URL Hash
        if (window.location.hash === '#langganan' && langgananSection) {
          setActiveLink(langgananLink);
          setTimeout(function () {
            langgananSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else if (window.location.hash === '#tentang' && aboutSection) {
          setActiveLink(tentangLink);
          setTimeout(function () {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          setActiveLink(berandaLink);
        }

        // 2. Click on "Langganan"
        if (langgananLink && langgananSection) {
          langgananLink.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveLink(langgananLink);
            startClickScroll();
            try {
              if (history.pushState) {
                history.pushState(null, '', '#langganan');
              } else {
                window.location.hash = '#langganan';
              }
            } catch (err) {
              window.location.hash = '#langganan';
            }
            langgananSection.scrollIntoView({ behavior: 'smooth' });
            if (setOpen) setOpen(false);
          });
        }

        // 3. Click on "Tentang"
        if (tentangLink && aboutSection) {
          tentangLink.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveLink(tentangLink);
            startClickScroll();
            try {
              if (history.pushState) {
                history.pushState(null, '', '#tentang');
              } else {
                window.location.hash = '#tentang';
              }
            } catch (err) {
              window.location.hash = '#tentang';
            }
            aboutSection.scrollIntoView({ behavior: 'smooth' });
            if (setOpen) setOpen(false);
          });
        }

        // 4. Click on "Beranda"
        if (berandaLink) {
          berandaLink.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveLink(berandaLink);
            startClickScroll();
            try {
              if (history.pushState) {
                history.pushState(null, '', window.location.pathname.split('/').pop() || 'Catering Bunda Rahma – Landing Page.html');
              } else {
                window.location.hash = '';
              }
            } catch (err) {
              window.location.hash = '';
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (setOpen) setOpen(false);
          });
        }

        // 5. Click on Brand Logo in Header
        var brandLink = document.querySelector('.site-header .brand');
        if (brandLink) {
          brandLink.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveLink(berandaLink);
            startClickScroll();
            try {
              if (history.pushState) {
                history.pushState(null, '', window.location.pathname.split('/').pop() || 'Catering Bunda Rahma – Landing Page.html');
              } else {
                window.location.hash = '';
              }
            } catch (err) {
              window.location.hash = '';
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }

        // 6. Back/Forward browser history hashchange
        window.addEventListener('hashchange', function () {
          if (window.location.hash === '#langganan' && langgananSection) {
            setActiveLink(langgananLink);
            startClickScroll();
            langgananSection.scrollIntoView({ behavior: 'smooth' });
          } else if (window.location.hash === '#tentang' && aboutSection) {
            setActiveLink(tentangLink);
            startClickScroll();
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveLink(berandaLink);
          }
        });

        // 7. Scroll Spy
        var onScroll = function () {
          if (isClickScrolling) return;
          var scrollY = window.pageYOffset || document.documentElement.scrollTop;
          var headerThreshold = 150;

          if (langgananSection) {
            var langgananRect = langgananSection.getBoundingClientRect();
            if (langgananRect.top <= headerThreshold && langgananRect.bottom >= 120) {
              setActiveLink(langgananLink);
              return;
            }
          }

          if (aboutSection) {
            var aboutRect = aboutSection.getBoundingClientRect();
            if (aboutRect.top <= headerThreshold && aboutRect.bottom >= 100) {
              setActiveLink(tentangLink);
              return;
            }
          }

          if (scrollY < 180) {
            setActiveLink(berandaLink);
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
      }

      // Auth Button Logic (Default: Masuk, Saat Login: Keluar)
      var authBtn = nav.querySelector('.btn-nav');
      if (authBtn) {
        var isAuthPage = window.location.pathname.indexOf('Login.html') !== -1 ||
                         window.location.pathname.indexOf('Registrasi.html') !== -1;

        if (!isAuthPage) {
          var updateAuthBtn = function () {
            var isLoggedIn = false;
            try {
              isLoggedIn = localStorage.getItem('brahma_logged_in') === 'true';
            } catch (e) {}

            if (isLoggedIn) {
              authBtn.textContent = 'Keluar';
              authBtn.className = 'btn-nav btn-nav-logout';
              authBtn.setAttribute('href', 'Catering Bunda Rahma – Login.html');
              authBtn.setAttribute('title', 'Keluar dari akun');
            } else {
              authBtn.textContent = 'Masuk';
              authBtn.className = 'btn-nav';
              authBtn.setAttribute('href', 'Catering Bunda Rahma – Login.html');
              authBtn.setAttribute('title', 'Masuk ke akun');
            }
          };

          updateAuthBtn();

          authBtn.addEventListener('click', function (e) {
            var isLoggedIn = false;
            try {
              isLoggedIn = localStorage.getItem('brahma_logged_in') === 'true';
            } catch (err) {}

            if (isLoggedIn) {
              e.preventDefault();
              try {
                localStorage.removeItem('brahma_logged_in');
                localStorage.removeItem('brahma_user_role');
                localStorage.removeItem('brahma_user_email');
              } catch (err) {}
              updateAuthBtn();
              // Jika sedang tidak di Landing Page, alihkan kembali ke Landing Page
              var path = window.location.pathname;
              if (path.indexOf('Landing Page.html') === -1 && path.indexOf('index.html') === -1) {
                window.location.href = 'Catering Bunda Rahma – Landing Page.html';
              }
            }
          });
        }
      }

      // Close mobile drawer if any other link is clicked
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a') && setOpen) {
          setOpen(false);
        }
      });
    }

    // 2. Admin / Dashboard Sidebar
    var dashBurger = document.getElementById('dashBurger');
    var dashSidebar = document.getElementById('dashSidebar');
    var dashBackdrop = document.getElementById('dashBackdrop');
    var dashClose = document.getElementById('dashSidebarClose');

    if (dashSidebar) {
      var setDashOpen = function (isOpen) {
        dashSidebar.classList.toggle('open', isOpen);
        if (dashBackdrop) dashBackdrop.classList.toggle('show', isOpen);
        if (dashBurger) {
          dashBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          dashBurger.setAttribute('aria-label', isOpen ? 'Tutup sidebar' : 'Buka sidebar');
        }
        document.body.style.overflow = isOpen && window.innerWidth <= 960 ? 'hidden' : '';
      };

      if (dashBurger) {
        dashBurger.addEventListener('click', function (e) {
          e.stopPropagation();
          setDashOpen(!dashSidebar.classList.contains('open'));
        });
      }

      if (dashClose) {
        dashClose.addEventListener('click', function () {
          setDashOpen(false);
        });
      }

      if (dashBackdrop) {
        dashBackdrop.addEventListener('click', function () {
          setDashOpen(false);
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dashSidebar.classList.contains('open')) {
          setDashOpen(false);
        }
      });

      window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) {
        if (e.matches) {
          setDashOpen(false);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
