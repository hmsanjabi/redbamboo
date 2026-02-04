        const plate = document.getElementById('morphing-plate');
        const leaf = document.getElementById('hero-leaf');
        const heroText = document.getElementById('hero-brand-container');
        const coreHeader = document.querySelector('header');
        const charLeft = document.getElementById('char-left');
        const charRight = document.getElementById('char-right');
        const scrollContainer = document.getElementById('scroll-container');
        const headerGlow = document.getElementById('header-corner-glow');
        const finalMarkDesktop = document.getElementById('final-mark-desktop');
        const finalMarkMobile = document.getElementById('final-mark-mobile');
        const headerLogoText = document.getElementById('header-logo-text');
        const headerLogoTextLink = document.getElementById('header-logo-text-link');
        const copyrightBar = document.getElementById('copyright-bar');
        
        const desktopTarget = document.getElementById('logo-mark-target-desktop');
        const mobileTarget = document.getElementById('logo-mark-target-mobile');
        
        const headerBg = document.getElementById('dynamic-header-bg');
        const colorOverlay = document.getElementById('header-color-overlay');
        const headerTable = document.getElementById('header-inner-table');
        const slotLeft = document.getElementById('header-slot-left');
        const slotRight = document.getElementById('header-slot-right');
        const fixedFrame = document.getElementById('fixed-page-frame');
        const mainTable = document.getElementById('main-content-table');
        const gridRows = document.querySelectorAll('.grid-row');
        const gridCells = document.querySelectorAll('.grid-cell');
        const fadeElements = document.querySelectorAll('.fade-in-content');

        // Mobile Menu Elements
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const menuIconOpen = document.getElementById('menu-icon-open');
        const menuIconClose = document.getElementById('menu-icon-close');

        function toggleMobileMenu() {
            const isActive = mobileMenuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            headerTable.classList.toggle('menu-active');
            
            if (isActive) {
                menuIconOpen.classList.add('hidden');
                menuIconClose.classList.remove('hidden');
                // Ensure header border is visible
                headerTable.style.borderColor = 'var(--brand-red)';
                slotLeft.style.borderColor = 'var(--brand-red)';
                slotRight.style.borderColor = 'var(--brand-red)';
            } else {
                menuIconOpen.classList.remove('hidden');
                menuIconClose.classList.add('hidden');
                // Re-evaluate borders based on scroll if menu closed
                handleScrollBorders();
            }
        }

        function handleMobileNavLink(e, targetPath) {
            e.preventDefault();
            const link = e.currentTarget;
            link.classList.add('active-tap');
            setTimeout(() => {
                window.location.href = targetPath;
            }, 450);
        }

        function closeCookieNotice() { document.getElementById('cookie-notice').style.display = 'none'; }

        function updateDeliveryStatus() {
            const statusDot = document.getElementById('status-dot');
            const statusDotMobile = document.getElementById('status-dot-mobile');
            const statusText = document.getElementById('status-text');
            
            const londonTimeStr = new Date().toLocaleString("en-GB", { timeZone: "Europe/London", hour: 'numeric', minute: 'numeric', hour12: false });
            const [hour, minute] = londonTimeStr.split(':').map(Number);
            const currentTimeValue = hour * 100 + minute;
            const isOpen = currentTimeValue >= 1800 && currentTimeValue <= 2130;
            
            const dotClass = isOpen ? 'status-dot open' : 'status-dot closed';
            const textMsg = isOpen ? 'Delivery: Open Now' : 'Delivery: Closed';

            if (statusDot) statusDot.className = dotClass;
            if (statusDotMobile) statusDotMobile.className = dotClass + ' absolute -top-1 -right-1 !m-0';
            if (statusText) statusText.innerText = textMsg;
        }

        function handleScrollBorders() {
            if (mobileMenuOverlay.classList.contains('active')) return;

            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const vh = window.innerHeight;
            const morphEnd = vh - 100;
            let progress = Math.min(Math.max(scrollY / morphEnd, 0), 1);
            const swapThreshold = 0.98;
            
            const borderColor = progress >= swapThreshold ? 'var(--brand-red)' : 'transparent';
            headerTable.style.borderColor = borderColor;
            slotLeft.style.borderColor = borderColor;
            slotRight.style.borderColor = borderColor;
            mainTable.style.borderColor = borderColor;
            fixedFrame.style.borderColor = borderColor;
            copyrightBar.style.borderColor = borderColor;
            gridRows.forEach(row => row.style.borderColor = borderColor);
            gridCells.forEach(cell => cell.style.borderColor = borderColor);
        }

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const isMobile = vw <= 1024;
            const morphEnd = vh - 100; 
            let progress = Math.min(Math.max(scrollY / morphEnd, 0), 1);

            const targetHeaderHeight = 100;
            const currentH = vh - (vh - targetHeaderHeight) * progress;
            headerBg.style.height = `${currentH}px`;
            colorOverlay.style.opacity = progress;

            const headerPercent = (targetHeaderHeight / currentH) * 100;
            const vastStart = 100 - (progress * 85); 
            const safeMaskStart = Math.max(headerPercent, vastStart);
            
            const maskCSS = `linear-gradient(to bottom, black 0%, black ${safeMaskStart}%, transparent 100%)`;
            headerBg.style.webkitMaskImage = maskCSS;
            headerBg.style.maskImage = maskCSS;

            const textFadeProgress = Math.min(progress * 2, 1);
            heroText.style.opacity = 1 - textFadeProgress;
            heroText.style.transform = `translateY(${progress * -50}px)`;

            leaf.style.opacity = Math.max(1 - (progress * 4), 0);
            scrollContainer.style.opacity = Math.max(1 - (progress * 5), 0);
            headerGlow.style.opacity = 1 - progress;

            const charFadeOut = Math.max(1 - (progress * 2.5), 0);
            charLeft.style.opacity = charFadeOut;
            charRight.style.opacity = charFadeOut;
            
            const driftBase = isMobile ? 20 : 60;
            const driftOut = progress * driftBase; 
            charLeft.style.transform = `translateY(-50%) translateX(-${driftOut}px)`;
            charRight.style.transform = `translateY(-50%) translateX(${driftOut}px)`;

            const swapThreshold = 0.98;
            const moveProgress = Math.min(progress / swapThreshold, 1);

            const activeTarget = isMobile ? mobileTarget : desktopTarget;
            const targetRect = activeTarget.getBoundingClientRect();
            
            const startX = vw / 2;
            const startY = vh * 0.45;
            const startSize = isMobile ? Math.min(vw * 0.60, vh * 0.36) : vh * 0.6;
            
            const endX = targetRect.left + (targetRect.width / 2);
            const endY = targetRect.top + (targetRect.height / 2);
            const endSize = targetRect.width;

            if (progress === 0) {
                plate.style.left = '50%';
                plate.style.top = '45%';
                plate.style.width = isMobile ? 'min(60vw, 36vh)' : '60vh';
                plate.style.height = isMobile ? 'min(60vw, 36vh)' : '60vh';
                plate.style.opacity = '1';
                plate.style.filter = 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))';
            } else {
                plate.style.left = `${startX + (endX - startX) * moveProgress}px`;
                plate.style.top = `${startY + (endY - startY) * moveProgress}px`;
                plate.style.width = `${startSize + (endSize - startSize) * moveProgress}px`;
                plate.style.height = `${startSize + (endSize - startSize) * moveProgress}px`;
                plate.style.filter = `drop-shadow(0 ${20 * (1-progress)}px ${40 * (1-progress)}px rgba(0,0,0,${0.25 * (1 - progress)}))`;
            }

            if (progress >= swapThreshold) {
                plate.style.opacity = '0'; 
                if(!isMobile) {
                    finalMarkDesktop.style.opacity = '1';
                    headerLogoText.style.opacity = '1'; 
                    headerLogoText.style.transform = 'translateX(0)';
                    desktopTarget.style.pointerEvents = 'auto';
                    headerLogoTextLink.style.pointerEvents = 'auto';
                } else {
                    finalMarkMobile.style.opacity = '1';
                    mobileTarget.style.pointerEvents = 'auto';
                }
            } else {
                if (progress > 0) plate.style.opacity = '1'; 
                finalMarkDesktop.style.opacity = '0';
                finalMarkMobile.style.opacity = '0';
                if(!isMobile) {
                    headerLogoText.style.opacity = '0'; 
                    headerLogoText.style.transform = 'translateX(-10px)';
                    desktopTarget.style.pointerEvents = 'none';
                    headerLogoTextLink.style.pointerEvents = 'none';
                } else {
                    mobileTarget.style.pointerEvents = 'none';
                }
            }

            const borderColor = progress >= swapThreshold ? 'var(--brand-red)' : 'transparent';
            headerTable.style.borderColor = borderColor;
            slotLeft.style.borderColor = borderColor;
            slotRight.style.borderColor = borderColor;
            mainTable.style.borderColor = borderColor;
            fixedFrame.style.borderColor = borderColor;
            copyrightBar.style.borderColor = borderColor;
            gridRows.forEach(row => row.style.borderColor = borderColor);
            gridCells.forEach(cell => cell.style.borderColor = borderColor);

            const scrollBottom = window.pageYOffset + vh;
            const docHeight = document.documentElement.scrollHeight;
            const distToBottom = docHeight - scrollBottom;

            if (distToBottom < 22) { fixedFrame.style.opacity = '0'; } 
            else { fixedFrame.style.opacity = '1'; }
        });

        const observer = new IntersectionObserver((entries) => { 
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); 
        }, { threshold: 0.1 });
        fadeElements.forEach(el => observer.observe(el));
        updateDeliveryStatus();
        setInterval(updateDeliveryStatus, 60000);
