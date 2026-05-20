// 关于我们页面的专用脚本

(function () {
  window.__aboutJsLoaded = true;

  // 团队成员 3D 悬停
  const teamCards = document.querySelectorAll(".team-member-card");
  teamCards.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        card.style.transition = "transform 0.1s ease";
        card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.03), transparent 40%)`;

        rafId = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transform = "";
      card.style.transition = "transform 0.3s ease, background-image 0.3s ease";
      card.style.backgroundImage = "";
    });
  });

  // 项目卡片视差
  const projectCard = document.querySelector(".project-card");
  if (projectCard) {
    projectCard.addEventListener("mousemove", (e) => {
      const rect = projectCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;

      const moveX = (xPercent - 0.5) * 10;
      const moveY = (yPercent - 0.5) * 10;

      const projectImage = projectCard.querySelector(".project-image");
      const projectInfo = projectCard.querySelector(".project-info");

      if (projectImage) projectImage.style.transform = `translate(${moveX * -1}px, ${moveY * -1}px)`;
      if (projectInfo) projectInfo.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    });

    projectCard.addEventListener("mouseleave", () => {
      const projectImage = projectCard.querySelector(".project-image");
      const projectInfo = projectCard.querySelector(".project-info");
      if (projectImage) projectImage.style.transform = "";
      if (projectInfo) projectInfo.style.transform = "";
    });
  }

  // fade-in observer — 用 requestIdleCallback 或 setTimeout 确保布局完成后再观察
  const initFadeObserver = () => {
    const fadeElements = document.querySelectorAll(
      ".tech-card, .project-card, .project-showcase, .mission-stats, .contact-method, .contact-content, .section-header, .mission-text, .mission-image, .team-member-card, .team-leader"
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      fadeElements.forEach((el) => observer.observe(el));

      // fallback: 2 秒后如果 observer 没触发，强制显示所有元素
      setTimeout(() => {
        fadeElements.forEach((el) => {
          if (!el.classList.contains("visible")) {
            el.classList.add("visible");
          }
        });
      }, 2000);
    } else {
      // 不支持 IntersectionObserver，直接显示
      fadeElements.forEach((el) => el.classList.add("visible"));
    }
  };

  // 等待下一帧确保布局已完成
  requestAnimationFrame(() => {
    requestAnimationFrame(initFadeObserver);
  });

  // 页面加载动画
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
    setTimeout(() => {
      const aboutHero = document.querySelector(".about-hero-content");
      if (aboutHero) aboutHero.classList.add("visible");
    }, 300);
  });

  // 粒子效果
  const heroParticles = document.querySelector(".hero-particles");
  if (heroParticles) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("span");
      particle.classList.add("particle");
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      const size = Math.random() * 10 + 1;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.animationDuration = Math.random() * 10 + 8 + "s";
      particle.style.animationDelay = Math.random() * 5 + "s";
      heroParticles.appendChild(particle);
    }
  }

  // 平滑滚动（about 页面专属的锚点导航）
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
})();
