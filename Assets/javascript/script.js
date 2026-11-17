/* =========================================
   ALANMATRIX® PORTFOLIO
   COMPLETE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       0. KINETIC NAME INTRO — ALAN MURALEEDHARAN
       Scramble → glitch → reveal → cinematic exit
    ===================================== */
    const introScreen = document.getElementById("introScreen");
    const introSkip = document.getElementById("introSkip");
    const introName = document.getElementById("introName");
    const introCounter = document.getElementById("introCounter");
    const introStatus = document.getElementById("introStatus");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let introSeen = false;
    try { introSeen = sessionStorage.getItem("am-intro-seen") === "1"; } catch (e) {}

    if (introScreen && introSeen) {
        introScreen.remove();
    } else if (introScreen) {
        try { sessionStorage.setItem("am-intro-seen", "1"); } catch (e) {}
        document.body.classList.add("intro-active");
        let introClosed = false;
        let scrambleTimer = null;
        let sequenceTimer = null;
        const finalName = "ALAN MURALEEDHARAN";
        const glyphs = "アイウエオカキクケコ0123456789<>/\\*+!?";
        const closeIntro = () => {
            if (introClosed) return;
            introClosed = true;
            window.clearInterval(scrambleTimer);
            window.clearTimeout(sequenceTimer);
            introScreen.classList.add("is-leaving");
            document.body.classList.remove("intro-active");
            window.setTimeout(() => introScreen.remove(), 1150);
        };
        if (introSkip) introSkip.addEventListener("click", closeIntro);

        if (prefersReducedMotion) {
            if (introName) introName.textContent = finalName;
            closeIntro();
        } else if (introName) {
            let frame = 0;
            const totalFrames = 34;
            introName.classList.add("is-scrambling");
            scrambleTimer = window.setInterval(() => {
                frame++;
                const resolved = Math.floor((frame / totalFrames) * finalName.length);
                const output = [...finalName].map((char, index) => {
                    if (char === " ") return "\u00a0";
                    if (index < resolved) return char;
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                }).join("");
                introName.textContent = output;
                if (frame === 12) {
                    introName.classList.add("is-glitching");
                    if (introStatus) introStatus.textContent = "DECODING CREATIVE IDENTITY";
                    if (introCounter) introCounter.textContent = "02 / 04";
                }
                if (frame === 23) {
                    if (introStatus) introStatus.textContent = "REVEALING NAME";
                    if (introCounter) introCounter.textContent = "03 / 04";
                }
                if (frame >= totalFrames) {
                    window.clearInterval(scrambleTimer);
                    introName.textContent = finalName;
                    introName.classList.remove("is-scrambling", "is-glitching");
                    introName.classList.add("is-revealed");
                    if (introStatus) introStatus.textContent = "WELCOME TO MY PORTFOLIO";
                    if (introCounter) introCounter.textContent = "04 / 04";
                    sequenceTimer = window.setTimeout(closeIntro, 1250);
                }
            }, 48);
            sequenceTimer = window.setTimeout(closeIntro, 5200);
        }
    }

    // Split headings into words → characters. Words stay unbreakable and
    // real spaces are kept as text nodes, so wrapping and spacing are preserved.
    const kineticTargets = document.querySelectorAll(
        ".hero-copy .magnify, .hero-copy .second-line, .about-content h2, .work-heading h2, .skills-head h2, .education-heading h2, .language-list h2, .contact-section h2"
    );
    kineticTargets.forEach((element) => {
        if (element.dataset.splitDone === "true") return;
        element.setAttribute("aria-label", element.textContent.replace(/\s+/g, " ").trim());
        let charIndex = 0;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach((node) => {
            const fragment = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach((part) => {
                if (part === "") return;
                if (/^\s+$/.test(part)) {
                    fragment.appendChild(document.createTextNode(" "));
                    return;
                }
                const word = document.createElement("span");
                word.className = "word";
                word.setAttribute("aria-hidden", "true");
                [...part].forEach((character) => {
                    const span = document.createElement("span");
                    span.className = "char";
                    span.style.setProperty("--char-index", charIndex++);
                    span.textContent = character;
                    word.appendChild(span);
                });
                fragment.appendChild(word);
            });
            node.parentNode.replaceChild(fragment, node);
        });
        element.classList.add("char-reveal");
        element.dataset.splitDone = "true";
    });

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const kineticObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    kineticObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        kineticTargets.forEach((element) => kineticObserver.observe(element));
    } else {
        kineticTargets.forEach((element) => element.classList.add("is-visible"));
    }

    /* =====================================
       2. HERO GRADIENT — per-letter slice of one shared gradient
       (background-clip:text on a parent skips animated children, so each
        letter paints its own slice, measured so the slices line up.)
    ===================================== */

    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".magnify");
    const heroWords = heroTitle ? [...heroTitle.querySelectorAll(".word")] : [];

    function measureHeroWords() {
        heroWords.forEach(word => {
            word.style.setProperty("--ww", `${word.offsetWidth}px`);
            word.querySelectorAll(".char").forEach(char => {
                char.style.setProperty("--cx", `${char.offsetLeft}px`);
            });
        });
    }
    measureHeroWords();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureHeroWords);
    window.addEventListener("load", measureHeroWords);
    window.addEventListener("resize", measureHeroWords, { passive: true });

    if (
        hero &&
        heroWords.length &&
        window.matchMedia("(hover: hover) and (min-width: 801px)").matches
    ) {
        let heroFrame = null;
        hero.addEventListener("pointermove", event => {
            if (heroFrame) return;
            heroFrame = requestAnimationFrame(() => {
                heroFrame = null;
                heroWords.forEach(word => {
                    const rect = word.getBoundingClientRect();
                    word.style.setProperty("--mx", `${event.clientX - rect.left}px`);
                    word.style.setProperty("--my", `${event.clientY - rect.top}px`);
                });
            });
        }, { passive: true });
        hero.addEventListener("pointerleave", () => {
            heroWords.forEach(word => word.style.setProperty("--mx", "-999px"));
        });
    }


    /* =====================================
       2B. INTERACTIVE SKILL ROBOT
       Click the robot or a floating skill chip.
    ===================================== */
    const botStage = document.querySelector(".bot-stage");
    const pixelBot = document.querySelector(".pixel-bot");
    const botSpeech = document.querySelector(".bot-speech");
    const skillOrbit = document.querySelector(".bot-skill-orbit");

    if (botStage && pixelBot && botSpeech && skillOrbit) {
        const botSkills = [
            ["PHP", "I know PHP — a language I use to build dynamic web applications."],
            ["Laravel", "I know Laravel 13 — routing, MVC, migrations, Eloquent and backend development."],
            ["Python", "I know Python — for programming, data handling and machine learning."],
            ["JavaScript", "I know JavaScript — interactive interfaces, DOM operations and web behaviour."],
            ["HTML", "I know HTML — semantic structure for accessible websites."],
            ["CSS", "I know CSS — responsive layouts, animations and polished visual experiences."],
            ["Bootstrap 5", "I know Bootstrap 5 — responsive components and grid layouts."],
            ["MySQL", "I know MySQL — relational databases, queries and data management."],
            ["Flask", "I know Flask — building lightweight Python web applications and ML interfaces."],
            ["Pandas", "I know Pandas — cleaning, exploring and preparing datasets."],
            ["Scikit-learn", "I know Scikit-learn — training and evaluating machine-learning models."],
            ["Random Forest", "I have worked with Random Forest for the Heart Disease Prediction project."],
            ["Git & GitHub", "I use Git and GitHub for version control and project collaboration."],
            ["Data Analysis", "I know the basics of data analysis, exploratory analysis and dataset preparation."]
        ];
        let selectedSkill = -1;
        let dragging = false, moved = false, startX = 0, startY = 0;
        let rotationY = -13, rotationX = -5;

        botSkills.forEach(([name, detail], index) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "bot-skill-chip";
            chip.textContent = name;
            chip.setAttribute("aria-label", `Ask robot about ${name}`);
            const angle = (-90 + index * (360 / botSkills.length)) * Math.PI / 180;
            chip.style.setProperty("--skill-x", `${50 + Math.cos(angle) * 43}%`);
            chip.style.setProperty("--skill-y", `${50 + Math.sin(angle) * 39}%`);
            chip.addEventListener("click", event => {
                event.stopPropagation();
                showSkill(index, true);
            });
            skillOrbit.appendChild(chip);
        });

        const chips = [...skillOrbit.querySelectorAll(".bot-skill-chip")];
        function showSkill(index, speak) {
            selectedSkill = (index + botSkills.length) % botSkills.length;
            const [name, detail] = botSkills[selectedSkill];
            botSpeech.textContent = `I KNOW ${name.toUpperCase()}! ${detail}`;
            chips.forEach((chip, i) => {
                chip.classList.toggle("is-active", i === selectedSkill);
                chip.setAttribute("aria-pressed", String(i === selectedSkill));
            });
            botStage.classList.add("is-happy");
            pixelBot.setAttribute("aria-pressed", "true");
            if (speak && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(`${name}. ${detail}`);
                utterance.rate = 1.02;
                utterance.pitch = 1.12;
                window.speechSynthesis.speak(utterance);
            }
        }

        pixelBot.addEventListener("pointerdown", event => {
            if (event.pointerType === "mouse" || event.pointerType === "touch") {
                dragging = true; moved = false;
                startX = event.clientX; startY = event.clientY;
                pixelBot.setPointerCapture?.(event.pointerId);
            }
        });
        pixelBot.addEventListener("pointermove", event => {
            if (!dragging) return;
            const dx = event.clientX - startX, dy = event.clientY - startY;
            if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
            rotationY = Math.max(-65, Math.min(65, rotationY + dx * .5));
            rotationX = Math.max(-28, Math.min(28, rotationX - dy * .32));
            startX = event.clientX; startY = event.clientY;
            pixelBot.style.animation = "none";
            pixelBot.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        });
        const stopDrag = () => { dragging = false; };
        pixelBot.addEventListener("pointerup", stopDrag);
        pixelBot.addEventListener("pointercancel", stopDrag);
        pixelBot.addEventListener("click", () => {
            if (moved) { moved = false; return; }
            showSkill(selectedSkill + 1, true);
        });
        botStage.addEventListener("pointermove", event => {
            if (dragging || !window.matchMedia("(pointer:fine)").matches) return;
            const rect = botStage.getBoundingClientRect();
            const look = (event.clientX - rect.left) / rect.width - .5;
            if (rotationY === -13) pixelBot.style.transform = `rotateX(-5deg) rotateY(${-13 + look * 16}deg)`;
        }, { passive: true });
        botStage.addEventListener("pointerleave", () => {
            if (!dragging && rotationY === -13) pixelBot.style.transform = "";
        });
        // Rotate the highlighted skill automatically so visitors notice the interaction.
        let autoIndex = 0;
        const autoTimer = window.setInterval(() => {
            if (!document.hidden && !botStage.matches(":hover")) {
                autoIndex = (autoIndex + 1) % botSkills.length;
                chips.forEach((chip, i) => chip.classList.toggle("is-orbit-highlight", i === autoIndex));
            }
        }, 1800);
        window.addEventListener("pagehide", () => window.clearInterval(autoTimer), { once: true });
        showSkill(0, false);
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
        ".section-kicker, .about-profile, .quick-facts, .work-heading, " +
        ".project-card, .education-card, .skills-head, .skill-card, " +
        ".cert-card, .language-list, .education-heading, .education-footer, " +
        ".contact-overline, .contact-button, .contact-details"
    );

    // Stagger siblings that enter together (skill cards, quick facts…).
    document.querySelectorAll(".skills-bento").forEach(grid => {
        grid.querySelectorAll(".skill-card").forEach((card, i) => {
            card.style.setProperty("--d", `${(i % 3) * 90}ms`);
            card.querySelectorAll(".skill-chip").forEach((chip, j) => chip.style.setProperty("--i", j));
        });
    });

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
        const initiallyActive = card.classList.contains("is-open");

        toggleButton.setAttribute(
            "aria-expanded",
            String(initiallyActive)
        );

        // Expand or collapse the selected education card.
        toggleButton.addEventListener("click", () => {
            const isCurrentlyOpen = card.classList.contains("is-open");

            // Close all other education cards.
            educationCards.forEach(otherCard => {
                otherCard.classList.remove("is-open");

                const otherButton = otherCard.querySelector(
                    ".education-toggle"
                );

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }
            });

            // Open the selected card if it was previously closed.
            if (!isCurrentlyOpen) {
                card.classList.add("is-open");

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

        heart: {
            number: "PROJECT / 02",
            title: "HEART DISEASE PREDICTION",
            description:
                "A machine-learning-powered web platform for heart disease risk prediction. The application accepts patient health and lifestyle inputs, processes them using a Random Forest model, and presents the prediction through a Flask-based web interface.",
            technologies: [
                "Python",
                "Flask",
                "Pandas",
                "Scikit-learn",
                "Random Forest",
                "Bootstrap",
                "HTML",
                "CSS",
                "JavaScript"
            ],
            features: [
                "Patient health and lifestyle data input",
                "Data handling and analysis with Pandas",
                "Random Forest classification model",
                "Heart disease risk prediction",
                "Web-based prediction interface",
                "Prediction results presentation"
            ]
        },

        flavour: {
            number: "PROJECT / 03",

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

        // Wait a tick: the dialog is still visibility:hidden on this frame.
        if (modalClose) {
            window.setTimeout(() => modalClose.focus(), 150);
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
        if (!projectModal || !projectModal.classList.contains("show")) return;

        if (event.key === "Escape") {
            closeProject();
            return;
        }

        // Keep keyboard focus inside the dialog while it is open.
        if (event.key === "Tab") {
            const focusable = projectModal.querySelectorAll("a[href], button:not([disabled])");
            if (!focusable.length) return;
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });


    /* =====================================
       10. PROJECT IMAGE CHECK
    ===================================== */

    document.querySelectorAll(".project-media img").forEach(image => {
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
       12. TECH MARQUEE — pause on hover / focus
    ===================================== */

    const marquee = document.querySelector(".tech-marquee");
    const marqueeTrack = document.querySelector(".tech-track");
    if (marquee && marqueeTrack) {
        marquee.addEventListener("pointerenter", () => marqueeTrack.style.animationPlayState = "paused");
        marquee.addEventListener("pointerleave", () => marqueeTrack.style.animationPlayState = "running");
        marquee.addEventListener("focusin", () => marqueeTrack.style.animationPlayState = "paused");
        marquee.addEventListener("focusout", () => marqueeTrack.style.animationPlayState = "running");
    }

    /* =====================================
       13. SCROLL PROGRESS + NAV STATE
    ===================================== */
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);
    const topbar = document.querySelector(".topbar");
    let scrollTicking = false;

    function onScroll() {
        scrollTicking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        progressBar.style.transform = `scaleX(${ratio})`;
        if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", () => {
        if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* =====================================
       14. SPOTLIGHT CARDS (cursor-tracking glow)
    ===================================== */
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    document.querySelectorAll(".education-card-content, .cert-card").forEach(el => el.classList.add("spot"));

    if (finePointer && !prefersReducedMotion) {
        let spotFrame = null, spotEvent = null;
        document.addEventListener("pointermove", event => {
            spotEvent = event;
            if (spotFrame) return;
            spotFrame = requestAnimationFrame(() => {
                spotFrame = null;
                const card = spotEvent.target.closest && spotEvent.target.closest(".spot");
                if (!card) return;
                const rect = card.getBoundingClientRect();
                card.style.setProperty("--px", `${spotEvent.clientX - rect.left}px`);
                card.style.setProperty("--py", `${spotEvent.clientY - rect.top}px`);
            });
        }, { passive: true });

        /* ambient glow that eases toward the cursor */
        const glow = document.createElement("div");
        glow.className = "ambient-pointer";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);
        let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, glowRunning = false;
        function glowLoop() {
            gx += (tx - gx) * .08; gy += (ty - gy) * .08;
            glow.style.transform = `translate(${gx - 170}px, ${gy - 170}px)`;
            if (Math.abs(tx - gx) + Math.abs(ty - gy) > .5) requestAnimationFrame(glowLoop);
            else glowRunning = false;
        }
        window.addEventListener("pointermove", event => {
            tx = event.clientX; ty = event.clientY;
            if (!glowRunning) { glowRunning = true; requestAnimationFrame(glowLoop); }
        }, { passive: true });
        glow.style.left = "0"; glow.style.top = "0";
        glow.style.opacity = ".3";
    }

    /* =====================================
       15. MAGNETIC BUTTONS
    ===================================== */
    if (finePointer && !prefersReducedMotion) {
        document.querySelectorAll(".round-link, .contact-button, .project-button, .modal-contact, .text-link").forEach(el => {
            el.classList.add("magnetic");
            el.addEventListener("pointermove", event => {
                const rect = el.getBoundingClientRect();
                const dx = (event.clientX - rect.left - rect.width / 2) / rect.width;
                const dy = (event.clientY - rect.top - rect.height / 2) / rect.height;
                el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });
    }

    /* =====================================
       16. PROJECT MEDIA — tabs + hover scroll-preview
    ===================================== */
    const mediaPanes = document.querySelectorAll("[data-media]");

    function measurePan(pane) {
        pane.querySelectorAll(".shot").forEach(img => {
            const overflow = Math.max(0, img.offsetHeight - pane.clientHeight);
            img.style.setProperty("--pan", overflow);
        });
    }

    mediaPanes.forEach(pane => {
        const shots = [...pane.querySelectorAll(".shot")];
        const tabs = [...pane.querySelectorAll(".media-tabs button")];
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const index = Number(tab.dataset.shot);
                shots.forEach((shot, i) => shot.classList.toggle("is-on", i === index));
                tabs.forEach(t => {
                    const on = t === tab;
                    t.classList.toggle("is-on", on);
                    t.setAttribute("aria-selected", String(on));
                });
                measurePan(pane);
            });
        });
        shots.forEach(img => {
            if (img.complete) measurePan(pane);
            else img.addEventListener("load", () => measurePan(pane), { once: true });
        });
    });
    let panResize = null;
    window.addEventListener("resize", () => {
        clearTimeout(panResize);
        panResize = setTimeout(() => mediaPanes.forEach(measurePan), 150);
    }, { passive: true });
    window.addEventListener("load", () => mediaPanes.forEach(measurePan));

    /* =====================================
       INITIALIZATION
    ===================================== */

    console.log(
        "%c ALANMATRIX® ",
        "background:#e65332;color:white;padding:8px;font-weight:bold;"
    );

    console.log("Interactive portfolio initialized successfully.");

});