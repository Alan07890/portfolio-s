/* =========================================
   ALANMATRIX® PORTFOLIO
   COMPLETE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. CUSTOM CURSOR
    ===================================== */

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (
        cursorDot &&
        cursorOutline &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let outlineX = mouseX;
        let outlineY = mouseY;

        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.querySelectorAll("a, button").forEach(element => {
            element.addEventListener("mouseenter", () => {
                cursorOutline.classList.add("hover");
            });

            element.addEventListener("mouseleave", () => {
                cursorOutline.classList.remove("hover");
            });
        });
    }


    /* =====================================
       2. HERO GRADIENT INTERACTION
    ===================================== */

    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".magnify");

    if (
        hero &&
        heroTitle &&
        window.matchMedia("(hover: hover) and (min-width: 801px)").matches
    ) {
        hero.addEventListener("pointermove", event => {
            const rect = heroTitle.getBoundingClientRect();

            const x = Math.max(
                0,
                Math.min(
                    100,
                    ((event.clientX - rect.left) / rect.width) * 100
                )
            );

            const y = Math.max(
                0,
                Math.min(
                    100,
                    ((event.clientY - rect.top) / rect.height) * 100
                )
            );

            heroTitle.style.setProperty("--mx", `${x}%`);
            heroTitle.style.setProperty("--my", `${y}%`);
        });
    }


    /* =====================================
       3. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle) {
        const mobilePanel = document.createElement("nav");

        mobilePanel.className = "mobile-panel";
        mobilePanel.setAttribute("aria-label", "Mobile navigation");

        mobilePanel.innerHTML = `
            <a href="#home">Home ↗</a>
            <a href="#about">About ↗</a>
            <a href="#work">Projects ↗</a>
            <a href="#education">Education ↗</a>
            <a href="#skills">Skills ↗</a>
            <a href="#contact">Contact ↗</a>
        `;

        document.body.appendChild(mobilePanel);

        function closeMobileMenu() {
            mobilePanel.classList.remove("show");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            mobilePanel.classList.toggle("show", !isOpen);
        });

        mobilePanel.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", event => {
            if (
                !mobilePanel.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================
       4. SMOOTH SCROLLING
    ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =====================================
       5. ACTIVE NAVIGATION
    ===================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".desktop-nav a");

    if ("IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            "#" + entry.target.id
                        ) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        }, {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        });

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }


    /* =====================================
       6. SCROLL REVEAL ANIMATIONS
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".about-grid, .quick-facts, .work-heading, " +
        ".project-card, .education-card, .skills-grid, " +
        ".cert-card, .language-list, " +
        ".contact-section h2, .contact-button"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("active");
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }


    /* =====================================
       7. INTERACTIVE EDUCATION TIMELINE
    ===================================== */

    const educationCards = document.querySelectorAll(".education-card");

    educationCards.forEach(card => {
        const toggleButton = card.querySelector(".education-toggle");

        if (!toggleButton) return;

        // Synchronize the initial HTML state.
        const initiallyActive = card.classList.contains("active");

        toggleButton.setAttribute(
            "aria-expanded",
            String(initiallyActive)
        );

        // Expand or collapse the selected education card.
        toggleButton.addEventListener("click", () => {
            const isCurrentlyOpen = card.classList.contains("active");

            // Close all other education cards.
            educationCards.forEach(otherCard => {
                otherCard.classList.remove("active");

                const otherButton = otherCard.querySelector(
                    ".education-toggle"
                );

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }
            });

            // Open the selected card if it was previously closed.
            if (!isCurrentlyOpen) {
                card.classList.add("active");

                toggleButton.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });


    /* =====================================
       8. PROJECT DETAILS DATA
    ===================================== */

    const projects = {

        cardofer: {
            number: "PROJECT / 01",

            title: "CARDO-FER",

            description:
                "CARDO-FER is an AI-integrated cardamom disease identification and fertilizer recommendation system developed to support cardamom farmers. Users select symptoms, and the application compares them with stored disease-symptom mappings to identify likely diseases and provide relevant guidance.",

            technologies: [
                "PHP",
                "Laravel",
                "MySQL",
                "HTML",
                "CSS",
                "Bootstrap 5",
                "JavaScript",
                "Git"
            ],

            features: [
                "Disease category management",
                "Disease symptom management",
                "Symptom-based disease identification",
                "AI-assisted recommendation support",
                "Fertilizer management",
                "Farmer field management",
                "Responsive user interface"
            ]
        },

        flavour: {
            number: "PROJECT / 02",

            title: "FLAVOUR-FIESTA",

            description:
                "FLAVOUR-FIESTA is a restaurant table and hall reservation system developed as a BCA project. It connects customers, restaurants and administrators through a centralized reservation platform.",

            technologies: [
                "Python",
                "Django",
                "MySQL",
                "HTML",
                "CSS",
                "Bootstrap",
                "JavaScript"
            ],

            features: [
                "Separate admin, restaurant and customer logins",
                "Restaurant registration and approval",
                "Restaurant browsing",
                "Food package management",
                "Table reservation",
                "Hall reservation",
                "Payment management",
                "Customer feedback",
                "Reports and location management"
            ]
        }

    };


    /* =====================================
       9. PROJECT DETAILS MODAL
    ===================================== */

    const projectModal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalNumber = document.getElementById("modalNumber");
    const modalDescription = document.getElementById("modalDescription");
    const modalTags = document.getElementById("modalTags");
    const modalFeatures = document.getElementById("modalFeatures");
    const modalClose = document.querySelector(".modal-close");
    const modalOverlay = document.querySelector(".modal-overlay");

    let lastFocusedElement = null;

    function openProject(projectKey, trigger) {
        const project = projects[projectKey];

        if (
            !project ||
            !projectModal ||
            !modalTitle ||
            !modalNumber ||
            !modalDescription ||
            !modalTags ||
            !modalFeatures
        ) {
            return;
        }

        lastFocusedElement = trigger || document.activeElement;

        modalNumber.textContent = project.number;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;

        // Add technology tags.
        modalTags.innerHTML = "";

        project.technologies.forEach(technology => {
            const tag = document.createElement("span");

            tag.textContent = technology;

            modalTags.appendChild(tag);
        });

        // Add project features.
        modalFeatures.innerHTML = "";

        project.features.forEach(feature => {
            const item = document.createElement("li");

            item.textContent = feature;

            modalFeatures.appendChild(item);
        });

        projectModal.classList.add("show");
        projectModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

        if (modalClose) {
            modalClose.focus();
        }
    }

    function closeProject() {
        if (!projectModal) return;

        projectModal.classList.remove("show");
        projectModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".project-button").forEach(button => {
        button.addEventListener("click", () => {
            openProject(button.dataset.project, button);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeProject);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeProject);
    }

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            projectModal &&
            projectModal.classList.contains("show")
        ) {
            closeProject();
        }
    });


    /* =====================================
       10. PROJECT IMAGE CHECK
    ===================================== */

    document.querySelectorAll(".project-art img").forEach(image => {
        image.addEventListener("error", () => {
            console.warn(
                "Project image could not load:",
                image.src
            );
        });
    });


    /* =====================================
       11. COPYRIGHT YEAR
    ===================================== */

    const copyright = document.querySelector(".copyright-year");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} ALANMATRIX®`;
    }


    /* =====================================
       INITIALIZATION
    ===================================== */

    console.log(
        "%c ALANMATRIX® ",
        "background:#e65332;color:white;padding:8px;font-weight:bold;"
    );

    console.log("Interactive portfolio initialized successfully.");

});