document.addEventListener("DOMContentLoaded", () => {
  // ----- UTILITIES -----

  const STORAGE_KEY = "beth_blog_v1";

  function getStoredArticles() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }

  function escapeHtml(text = "") {
    return text.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  // ----- CONTACT FORM -----

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! We'll hit you back soon.");
      contactForm.reset();
    });
  }

  // ----- BLOG MODALS -----

  const blogModal = document.getElementById("blogModal");
  const openBlogBtn = document.getElementById("openBlogModal");
  const closeBlogBtn = document.getElementById("closeBlogModal");

  if (openBlogBtn && blogModal) {
    openBlogBtn.addEventListener("click", () =>
      blogModal.classList.remove("hide")
    );
  }
  if (closeBlogBtn && blogModal) {
    closeBlogBtn.addEventListener("click", () =>
      blogModal.classList.add("hide")
    );
  }

  const readModal = document.getElementById("readModal");
  const readTitle = document.getElementById("readTitle");
  const readBody = document.getElementById("readBody");
  const readAuthor = document.getElementById("readAuthor");
  const closeReadBtn = document.getElementById("closeReadModal");

  if (closeReadBtn && readModal) {
    closeReadBtn.addEventListener("click", () =>
      readModal.classList.add("hide")
    );
  }

  window.addEventListener("click", (e) => {
    if (e.target === blogModal) blogModal.classList.add("hide");
    if (e.target === readModal) readModal.classList.add("hide");
  });

  // ----- ADD BLOG -----

  const blogForm = document.getElementById("blogForm");
  if (blogForm) {
    blogForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(blogForm).entries());
      const stored = getStoredArticles();
      stored.unshift(data);
      saveArticles(stored);

      blogForm.reset();
      blogModal?.classList.add("hide");
      renderArticles();
      renderFeaturedArticle();
      alert("📝 Blog posted successfully!");
    });
  }

  // ----- RENDER BLOGS -----

  function renderArticles() {
    const blogGrid = document.getElementById("blogGrid");
    if (!blogGrid) return;

    const articles = getStoredArticles();

    blogGrid.innerHTML = articles
      .map(
        (a, i) => `
        <div class="blog-card" data-aos="fade-up" data-aos-delay="${i * 100}">
          <img src="${
            a.image?.trim() ? escapeHtml(a.image) : "assets/default-blog.jpg"
          }" alt="${escapeHtml(a.title)}">
          <div class="blog-info">
            <h3>${escapeHtml(a.title)}</h3>
            <p>${escapeHtml(a.body.substring(0, 100))}...</p>
            ${
              a.author ? `<p class="author">By ${escapeHtml(a.author)}</p>` : ""
            }
            <a href="#" class="btn-primary small read-more" data-index="${i}">Read More</a>
          </div>
        </div>
      `
      )
      .join("");

    document.querySelectorAll(".read-more").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = btn.dataset.index;
        const article = articles[idx];

        readTitle.textContent = article.title;
        readBody.textContent = article.body;
        readAuthor.textContent = article.author ? `By ${article.author}` : "";
        readModal.classList.remove("hide");
      });
    });
  }

  // ----- FEATURED ARTICLE -----

  function renderFeaturedArticle() {
    const container = document.getElementById("featuredArticle");
    if (!container) return;

    const articles = getStoredArticles();
    if (!articles.length) {
      container.innerHTML = "";
      return;
    }

    const latest = articles[0];
    const imgSrc = latest.image?.trim()
      ? escapeHtml(latest.image)
      : "assets/default-blog.jpg";

    container.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(latest.title)}">
      <div class="featured-info">
        <h3>${escapeHtml(latest.title)}</h3>
        <p>${escapeHtml(latest.body.substring(0, 200))}...</p>
        <a href="#" class="btn-primary small" id="featuredReadMore">Read More</a>
      </div>
    `;

    document
      .getElementById("featuredReadMore")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        readTitle.textContent = latest.title;
        readBody.textContent = latest.body;
        readAuthor.textContent = latest.author ? `By ${latest.author}` : "";
        readModal.classList.remove("hide");
      });
  }

  renderArticles();
  renderFeaturedArticle();

  // ----- MOBILE NAV -----

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("fa-bars");
      menuToggle.classList.toggle("fa-times");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove("active");
          menuToggle.classList.add("fa-bars");
          menuToggle.classList.remove("fa-times");
        }
      });
    });
  }

  // ----- PROPERTIES -----

  const properties = [
    {
      id: 1,
      title: "Luxury 5-Bedroom Villa",
      location: "Lekki, Lagos State",
      price: "#25,000,000",
      image: "/Housing_Image_1.jpg",
      gallery: ["/Housing_Image_1.jpg", "/PentHouse.jpg"],
      description: "A beautiful 5-bedroom villa with smart home features.",
      features: ["5 Bedrooms", "4 Bathrooms", "2 Parking Spaces", "600 sqm"],
    },
    {
      id: 2,
      title: "Modern Penthouse Apartment",
      location: "Arepo, Ogun State",
      price: "#7,000,000",
      image: "/Housing_Image_1.jpg",
      gallery: ["/Housing_Image_1.jpg", "/PentHouse.jpg"],
      description: "An elegant penthouse apartment offering comfort.",
      features: ["3 Bedrooms", "2 Bathrooms", "1 Parking Space", "250 sqm"],
    },
  ];

  // property cards → save selected

  document.querySelectorAll(".btn-view").forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".property-card");
      if (!card) return;

      const id = parseInt(card.dataset.id);
      const selected = properties.find((p) => p.id === id);
      localStorage.setItem("beth_selected_property", JSON.stringify(selected));
      window.location.href = "property.html";
    });
  });

  // property page population

  const property = JSON.parse(localStorage.getItem("beth_selected_property"));
  if (property) {
    document.getElementById("propertyTitle").textContent = property.title;
    document.getElementById("propertyPrice").textContent = property.price;
    document.getElementById("propertyLocation").textContent = property.location;
    document.getElementById("mainImage").src = property.image;
    document.querySelector(".desc").textContent = property.description;

    document.querySelector(".features").innerHTML = property.features
      .map((f) => `<li><i class="bx bx-check"></i> ${f}</li>`)
      .join("");

    document.querySelector(".thumbnail-row").innerHTML = property.gallery
      .map((img) => `<img src="${img}" class="thumb" alt="${property.title}">`)
      .join("");
  }
});
