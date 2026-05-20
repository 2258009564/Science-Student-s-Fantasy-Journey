// 理科生穿越之旅 - 主脚本
// 页面感知：根据当前页面只执行相关逻辑

// ---- 页面检测 ----
const currentPage = (() => {
  const path = window.location.pathname;
  if (path.includes("about.html")) return "about";
  if (path.includes("404.html")) return "404";
  return "index";
})();

// ---- 共享：IntersectionObserver（单例） ----
const createFadeObserver = (options = {}) => {
  const defaults = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { ...defaults, ...options });
  return observer;
};

// ---- 共享：平滑滚动 ----
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
};

// ---- 共享：3D 卡片悬停效果 ----
const init3DCardHover = (selector) => {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        card.style.transition = "transform 0.2s ease";
        card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.03), transparent 40%)`;

        rafId = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s ease, background-image 0.5s ease";
      card.style.backgroundImage = "";
    });
  });
};

// ---- 共享：预加载关键图片 ----
const preloadCriticalImages = () => {
  const imageUrls = [
    "https://img.freepik.com/free-vector/chinese-painting-background_52683-63125.jpg",
    "https://img.freepik.com/free-vector/hand-painted-watercolor-nature-background_23-2148941599.jpg",
    "https://img.freepik.com/free-vector/chinese-pattern-background_53876-90035.jpg",
  ];
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

// ================================================================
// INDEX 页面专属逻辑
// ================================================================
if (currentPage === "index") {
  const { createApp } = Vue;

  const app = createApp({
    data() {
      return {
        gameTitle: "理科生穿越之旅——枢焰光极",
        shortGameTitle: "理科生穿越之旅",
        gameVersion: "v1.2.1",
        gameSize: "32.8 GB",
        isScrolled: false,
        ticking: false,

        features: [
          {
            id: 1,
            iconClass: "ri-time-line",
            title: "沉浸式时空穿越",
            description: "体验从现代穿越到北宋的奇妙旅程，与历史名人沈括面对面交流，亲历古代科学探索的过程。",
          },
          {
            id: 2,
            iconClass: "ri-flask-line",
            title: "科学实验玩法",
            description: "通过互动实验验证古代科学原理，从小孔成像到磁针偏角，亲手操作并解锁物理学原理卡牌。",
          },
          {
            id: 3,
            iconClass: "ri-book-open-line",
            title: "史实与教育融合",
            description: "基于《梦溪笔谈》等历史文献，还原北宋时期的科学成就，在游戏中学习物理学知识。",
          },
          {
            id: 4,
            iconClass: "ri-compass-3-line",
            title: "探索开放世界",
            description: "在精心还原的北宋场景中自由探索，从小镇到汴京，再到梦溪园，体验古代中国的风貌。",
          },
          {
            id: 5,
            iconClass: "ri-movie-line",
            title: "分支剧情选择",
            description: "做出不同的选择将影响游戏进程和结局，多种结局等待发现，体验不同的历史可能性。",
          },
          {
            id: 6,
            iconClass: "ri-headphone-line",
            title: "古风音乐配乐",
            description: "原创古典音乐配乐，与游戏场景完美融合，让您沉浸在北宋的文化氛围中。",
          },
        ],
      };
    },

    methods: {
      downloadGame() {
        const downloadLink = "downloads/installer/MazeExplorer.exe";
        this.showDownloadModal(downloadLink);
        console.log("游戏下载已启动", {
          gameTitle: this.gameTitle,
          gameVersion: this.gameVersion,
          timestamp: new Date().toISOString(),
        });
      },

      showDownloadModal(downloadLink) {
        // 复用已有 style 或创建新的
        let modalStyle = document.getElementById("download-modal-style");
        if (!modalStyle) {
          modalStyle = document.createElement("style");
          modalStyle.id = "download-modal-style";
          modalStyle.textContent = `
            .download-modal {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(40, 30, 20, 0.85); backdrop-filter: blur(10px);
              display: flex; align-items: center; justify-content: center;
              z-index: 9999; opacity: 0; transition: opacity 0.3s ease;
            }
            .ancient-modal::before {
              content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
              background-image: url("https://img.freepik.com/free-vector/chinese-pattern-background_53876-90035.jpg");
              background-size: cover; opacity: 0.08; pointer-events: none;
            }
            .download-modal-content {
              background: #f8f4e9; border-radius: 12px; width: 90%; max-width: 500px;
              overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
              transform: translateY(20px) scale(0.98); transition: all 0.4s ease;
              will-change: transform; border: 1px solid #d4a76a; position: relative;
            }
            .ancient-modal-content::before {
              content: ""; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;
              border: 1px dashed rgba(139, 90, 43, 0.3); border-radius: 8px;
              pointer-events: none; z-index: 0;
            }
            .download-modal-header {
              padding: 20px; display: flex; justify-content: space-between; align-items: center;
              border-bottom: 1px solid rgba(139, 90, 43, 0.2);
              background: linear-gradient(135deg, #8b5a2b, #d4a76a);
            }
            .download-modal-header h3 {
              font-size: 22px; font-weight: 700; color: #f8f4e9; margin: 0;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            }
            .close-btn {
              background: none; border: none; font-size: 24px; cursor: pointer;
              color: rgba(255, 255, 255, 0.8); transition: color 0.2s ease;
            }
            .close-btn:hover { color: #fff; }
            .download-modal-body {
              padding: 35px 30px; text-align: center; position: relative; z-index: 1;
            }
            .download-animation {
              font-size: 80px; color: #8b5a2b; margin-bottom: 25px;
              animation: pulseGlow 1.5s infinite;
            }
            @keyframes pulseGlow {
              0%, 100% { transform: scale(1); opacity: 1; text-shadow: 0 0 10px rgba(139, 90, 43, 0.3); }
              50% { transform: scale(1.05); opacity: 0.9; text-shadow: 0 0 20px rgba(139, 90, 43, 0.5); }
            }
            .download-progress {
              height: 8px; background: rgba(0, 0, 0, 0.1); border-radius: 4px;
              margin: 25px 0; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .progress-bar {
              height: 100%; width: 0;
              background: linear-gradient(90deg, #8b5a2b, #d4a76a);
              border-radius: 4px; transition: width 0.2s linear;
              will-change: width; box-shadow: 0 0 10px rgba(139, 90, 43, 0.4);
            }
            .download-info-flex {
              display: flex; justify-content: space-between;
              font-size: 15px; color: #5a3921; font-style: italic;
            }
          `;
          document.head.appendChild(modalStyle);
        }

        const modal = document.createElement("div");
        modal.className = "download-modal ancient-modal";
        modal.innerHTML = `
          <div class="download-modal-content ancient-modal-content">
            <div class="download-modal-header">
              <h3>准备开始下载</h3>
              <button class="close-btn"><i class="ri-close-line"></i></button>
            </div>
            <div class="download-modal-body">
              <div class="download-animation"><i class="ri-download-cloud-2-line"></i></div>
              <p>《${this.gameTitle}》将在几秒钟后开始下载</p>
              <div class="download-progress"><div class="progress-bar"></div></div>
              <div class="download-info-flex">
                <p>文件大小: ${this.gameSize}</p>
                <p>版本: ${this.gameVersion}</p>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        requestAnimationFrame(() => {
          modal.style.opacity = "1";
          modal.querySelector(".download-modal-content").style.transform = "translateY(0) scale(1)";
        });

        // 进度条动画
        let progress = 0;
        const progressBar = modal.querySelector(".progress-bar");
        const progressInterval = setInterval(() => {
          progress += 2;
          progressBar.style.width = `${progress}%`;

          if (progress >= 100) {
            clearInterval(progressInterval);
            modal.querySelector(".download-animation i").className = "ri-arrow-down-circle-line";
            modal.querySelector(".download-animation").style.color = "#5a3921";
            modal.querySelector(".download-modal-body p").textContent = "下载即将开始，请稍候...";

            setTimeout(() => {
              const link = document.createElement("a");
              link.href = downloadLink;
              link.download = "理科生穿越之旅-安装程序.exe";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              modal.querySelector(".download-modal-body p").textContent = "下载已开始，您将在旅程中遇见古代智者沈括";
            }, 800);
          }
        }, 20);

        // 关闭
        const closeModal = () => {
          modal.style.opacity = "0";
          modal.querySelector(".download-modal-content").style.transform = "translateY(20px) scale(0.98)";
          setTimeout(() => {
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
            clearInterval(progressInterval);
          }, 300);
        };

        modal.querySelector(".close-btn").addEventListener("click", closeModal);
        modal.addEventListener("click", (e) => {
          if (e.target === modal) closeModal();
        });
      },

      handleScroll() {
        if (!this.ticking) {
          requestAnimationFrame(() => {
            this.isScrolled = window.scrollY > 50;
            this.ticking = false;
          });
          this.ticking = true;
        }
      },

      scrollToSection(sectionId) {
        const targetElement = document.querySelector(sectionId);
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
        }
      },
    },

    mounted() {
      console.log("游戏概况页面已加载 - 古风主题");

      // 滚动监听
      window.addEventListener("scroll", this.handleScroll, { passive: true });

      // 平滑滚动
      initSmoothScroll();

      // 统一的 fade-in Observer
      const observer = createFadeObserver();
      document
        .querySelectorAll(
          ".section, .fade-in, .ancient-feature-card, .ancient-chapter-card, .hero-content, .download-content"
        )
        .forEach((el) => observer.observe(el));

      // 页面加载动画
      requestAnimationFrame(() => {
        document.body.classList.add("loaded");
        setTimeout(() => {
          const heroContent = document.querySelector(".hero-content");
          if (heroContent) heroContent.classList.add("visible");
        }, 300);
      });

      // 章节卡片古风悬停
      const chapterCards = document.querySelectorAll(".chapter-card");
      chapterCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.borderColor = "var(--color-gold)";
          card.querySelector("h3")?.classList.add("highlight");
        });
        card.addEventListener("mouseleave", () => {
          card.style.borderColor = "";
          card.querySelector("h3")?.classList.remove("highlight");
        });
      });

      // 导航悬停
      const navLinks = document.querySelectorAll(".nav-link:not(.nav-highlight)");
      navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => link.classList.add("ancient-hover"));
        link.addEventListener("mouseleave", () => link.classList.remove("ancient-hover"));
      });

      // 3D 卡片悬停
      init3DCardHover(".feature-card, .chapter-card");

      // 视差滚动
      let parallaxTicking = false;
      window.addEventListener("scroll", () => {
        if (!parallaxTicking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            const heroSection = document.querySelector(".hero-section");
            if (heroSection) {
              heroSection.style.backgroundPositionY = `${scrollY * 0.2}px`;
            }

            const downloadSection = document.querySelector(".section-download");
            if (downloadSection) {
              downloadSection.style.backgroundPositionY = `${-scrollY * 0.1}px`;
            }

            const cloudDecorators = document.querySelectorAll(".cloud-decorator");
            cloudDecorators.forEach((cloud, index) => {
              const direction = index % 2 === 0 ? 1 : -1;
              cloud.style.transform = `translate(${scrollY * 0.03 * direction}px, ${scrollY * 0.01}px) rotate(${index * 10}deg)`;
            });

            parallaxTicking = false;
          });
          parallaxTicking = true;
        }
      }, { passive: true });

      // 浮动装饰元素（仅桌面端）
      if (window.innerWidth > 768) {
        const container = document.createElement("div");
        container.className = "ancient-floating-elements";
        container.setAttribute("aria-hidden", "true");

        const floatStyle = document.createElement("style");
        floatStyle.textContent = `
          .ancient-floating-elements {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 0; overflow: hidden;
          }
          .floating-element {
            position: absolute;
            background-image: url('https://img.freepik.com/free-vector/chinese-cloud-pattern_53876-88467.jpg');
            background-size: contain; background-repeat: no-repeat;
            opacity: 0.06; pointer-events: none; z-index: 0;
          }
          @keyframes float {
            0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.05; }
            90% { opacity: 0.02; }
            100% { transform: translateY(110vh) translateX(20vw) rotate(360deg); opacity: 0; }
          }
        `;
        document.head.appendChild(floatStyle);
        document.body.appendChild(container);

        const createFloatingElement = () => {
          const element = document.createElement("div");
          element.className = "floating-element";
          const size = 20 + Math.random() * 30;
          const startX = Math.random() * 100;
          const animationDuration = 15 + Math.random() * 25;

          element.style.width = `${size}px`;
          element.style.height = `${size}px`;
          element.style.left = `${startX}vw`;
          element.style.top = "-50px";
          element.style.animation = `float ${animationDuration}s linear forwards`;

          container.appendChild(element);
          setTimeout(() => {
            if (container.contains(element)) container.removeChild(element);
          }, animationDuration * 1000);
        };

        setInterval(createFloatingElement, 5000);
        for (let i = 0; i < 3; i++) {
          setTimeout(createFloatingElement, i * 2000);
        }
      }

      // 预加载关键图片
      setTimeout(preloadCriticalImages, 100);
    },

    beforeUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
    },
  }).mount("#app");
}
