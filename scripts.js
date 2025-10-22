// Utility: Safe JSON parse
function getStoredArticles() {
  try {
    return JSON.parse(localStorage.getItem("beth_blog_v1")) || [];
  } catch {
    localStorage.removeItem("beth_blog_v1");
    return [];
  }
}

function savedArticles(articles) {
  localStorage.setItem("beth_blog_v1", JSON.stringify(articles));
}

// Utility: Escape HTML
function escapeHtml(text) {
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


// CONTACT FORM

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    contactForm.reset();
  });
}


// BLOG MODALS

const blogModal = document.getElementById("blogModal");
const openBlogBtn = document.getElementById("openBlogModal");
const closeBlogBtn = document.getElementById("closeBlogModal");

if (openBlogBtn && blogModal) {
  openBlogBtn.addEventListener("click", () =>
    blogModal.classList.remove("hide")
  );
}
if (closeBlogBtn && blogModal) {
  closeBlogBtn.addEventListener("click", () => blogModal.classList.add("hide"));
}

// Read Modal
const readModal = document.getElementById("readModal");
const readTitle = document.getElementById("readTitle");
const readBody = document.getElementById("readBody");
const readAuthor = document.getElementById("readAuthor");
const closeReadBtn = document.getElementById("closeReadModal");

if (closeReadBtn && readModal) {
  closeReadBtn.addEventListener("click", () => readModal.classList.add("hide"));
}

// Overlay click-to-close
window.addEventListener("click", (e) => {
  if (e.target === blogModal) blogModal.classList.add("hide");
  if (e.target === readModal) readModal.classList.add("hide");
});


// BLOG FORM SUBMIT

const blogForm = document.getElementById("blogForm");
if (blogForm) {
  blogForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const stored = getStoredArticles();
    stored.unshift(data);
    savedArticles(stored);
    form.reset();
    blogModal.classList.add("hide");
    renderArticles();
    renderFeaturedArticle();
    alert("📝 Blog added successfully!");
  });
}


// RENDER ARTICLES

function renderArticles() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  const articles = getStoredArticles();
  blogGrid.innerHTML = articles
    .map(
      (a, i) => `
    <div class="blog-card" data-aos="fade-up" data-aos-delay="${i * 100}">
      <img src="${
        a.image && a.image.trim() !== ""
          ? escapeHtml(a.image)
          : "assets/default-blog.jpg"
      }" alt="${escapeHtml(a.title)}">
      <div class="blog-info">
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.body.substring(0, 100))}...</p>
        ${a.author ? `<p class="author">By ${escapeHtml(a.author)}</p>` : ""}
        <a href="#" class="btn-primary small read-more" data-index="${i}">Read More</a>
      </div>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".read-more").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = btn.getAttribute("data-index");
      const article = articles[idx];
      readTitle.textContent = article.title;
      readBody.textContent = article.body;
      readAuthor.textContent = article.author ? `By ${article.author}` : "";
      readModal.classList.remove("hide");
    });
  });
}


// FEATURED ARTICLE

function renderFeaturedArticle() {
  const featuredContainer = document.getElementById("featuredArticle");
  if (!featuredContainer) return;

  const articles = getStoredArticles();
  if (articles.length === 0) {
    featuredContainer.innerHTML = "";
    return;
  }

  const latest = articles[0];
  const imgSrc =
    latest.image && latest.image.trim() !== ""
      ? escapeHtml(latest.image)
      : "assets/default-blog.jpg";
  featuredContainer.innerHTML = `
    <img src="${imgSrc}" alt="${escapeHtml(latest.title)}">
    <div class="featured-info">
      <h3>${escapeHtml(latest.title)}</h3>
      <p>${escapeHtml(latest.body.substring(0, 200))}...</p>
      <a href="#" class="btn-primary small" id="featuredReadMore">Read More</a>
    </div>
  `;

  document.getElementById("featuredReadMore").addEventListener("click", (e) => {
    e.preventDefault();
    readTitle.textContent = latest.title;
    readBody.textContent = latest.body;
    readAuthor.textContent = latest.author ? `By ${latest.author}` : "";
    readModal.classList.remove("hide");
  });
}

// Initial render
renderArticles();
renderFeaturedArticle();

// MOBILE NAVIGATION
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("fa-bars");
    menuToggle.classList.toggle("fa-times");
  });
}

// auto-close mobile nav on link click
if (navLinks) {
  const navItems = navLinks.querySelectorAll('a');
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      // close after clicking a link
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        menuToggle.classList.add('fa-bars');
        menuToggle.classList.remove('fa-times');
      }
    });
  });
}