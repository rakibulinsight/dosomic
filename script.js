document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navItems = document.querySelector('.nav-items');
    const servicesDropdown = document.querySelector('.services-dropdown');
    const servicesTrigger = servicesDropdown.querySelector('.services-trigger');
    const megaMenu = document.querySelector('.mega-menu');
    const serviceCategories = document.querySelectorAll('.service-category');
    let isMenuOpen = false;

    // Add touch ripple effect
    function createRipple(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();

        ripple.className = 'ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;

        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Add animation delay to nav items
    const navLinks = navItems.children;
    Array.from(navLinks).forEach((link, index) => {
        link.style.setProperty('--item-index', index);
    });

    // Mobile menu toggle with smooth transitions
    mobileMenuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        const icon = mobileMenuToggle.querySelector('i');

        if (isMenuOpen) {
            icon.className = 'fas fa-times';
            navItems.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Animate nav items sequentially
            Array.from(navItems.children).forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        } else {
            icon.className = 'fas fa-bars';

            // Fade out nav items
            Array.from(navItems.children).forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });

            // Wait for fade out animation before hiding menu
            setTimeout(() => {
                navItems.classList.remove('active');
                document.body.style.overflow = '';
            }, 300);

            // Reset all expanded menus
            megaMenu.classList.remove('active');
            servicesTrigger.classList.remove('active');
            serviceCategories.forEach(category => {
                category.querySelector('.service-list').classList.remove('active');
                category.querySelector('.service-header').classList.remove('active');
            });
        }
    });

    // Handle services dropdown on mobile with smooth transitions
    servicesTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            megaMenu.classList.toggle('active');
            servicesTrigger.classList.toggle('active');

            // Scroll to show mega menu if needed
            if (megaMenu.classList.contains('active')) {
                setTimeout(() => {
                    megaMenu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        }
    });

    // Enhanced mobile touch interactions for service categories
    serviceCategories.forEach(category => {
        const header = category.querySelector('.service-header');
        const list = category.querySelector('.service-list');
        const viewAll = category.querySelector('.view-all');

        header.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const isExpanded = list.classList.contains('active');

                // Smooth collapse of other categories
                serviceCategories.forEach(otherCategory => {
                    if (otherCategory !== category) {
                        const otherList = otherCategory.querySelector('.service-list');
                        const otherHeader = otherCategory.querySelector('.service-header');
                        const otherViewAll = otherCategory.querySelector('.view-all');

                        if (otherList.classList.contains('active')) {
                            otherList.style.height = '0';
                            setTimeout(() => {
                                otherList.classList.remove('active');
                                otherHeader.classList.remove('active');
                                if (otherViewAll) otherViewAll.style.display = 'none';
                            }, 300);
                        }
                    }
                });

                // Expand/collapse current category
                if (!isExpanded) {
                    list.classList.add('active');
                    header.classList.add('active');
                    if (viewAll) viewAll.style.display = 'inline-flex';

                    // Scroll into view if needed
                    setTimeout(() => {
                        list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    list.style.height = '0';
                    setTimeout(() => {
                        list.classList.remove('active');
                        header.classList.remove('active');
                        if (viewAll) viewAll.style.display = 'none';
                    }, 300);
                }

                // Add touch ripple effect
                createRipple(e, header);
            }
        });

        // Add touch feedback for list items
        const listItems = category.querySelectorAll('.service-list li');
        listItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    createRipple(e, item);
                }
            });
        });
    });

    // Improved window resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Reset mobile menu state
                navItems.classList.remove('active');
                megaMenu.classList.remove('active');
                servicesTrigger.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = '';
                isMenuOpen = false;

                // Reset all categories
                serviceCategories.forEach(category => {
                    const list = category.querySelector('.service-list');
                    const viewAll = category.querySelector('.view-all');
                    list.classList.remove('active');
                    list.style.height = '';
                    if (viewAll) viewAll.style.display = '';
                });

                // Reset nav items animation state
                Array.from(navItems.children).forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                });
            }
        }, 250);
    });

    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !servicesDropdown.contains(e.target) && !megaMenu.contains(e.target)) {
            megaMenu.classList.remove('active');
            servicesTrigger.classList.remove('active');
        }
    });

    // Prevent body scroll when mobile menu is open
    document.addEventListener('touchmove', (e) => {
        if (isMenuOpen && !navItems.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Add hover effects for service items
    serviceCategories.forEach(category => {
        const listItems = category.querySelectorAll('.service-list li');
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.transition = 'transform 0.3s ease';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    });

    // Add intersection observer for fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    serviceCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(category);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(0, 102, 204, 0.2);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});