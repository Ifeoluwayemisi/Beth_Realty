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
  const navItems = navLinks.querySelectorAll("a");
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      // close after clicking a link
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        menuToggle.classList.add("fa-bars");
        menuToggle.classList.remove("fa-times");
      }
    });
  });
}


// pagination
const listings = document.querySelectorAll(".property-card");
const itemsPerPage = 6;
let currentPage = 1;

function showPage(page) {
  listings.forEach((item, index) => {
    item.style.display =
      index >= (page - 1) * itemsPerPage && index < page * itemsPerPage
        ? "block"
        : "none";
  });
}

document.querySelectorAll(".pagination a").forEach((btn, index) => {
  btn.addEventListener("click", () => showPage(index + 1));
});

showPage(currentPage);

//listing and properties
const properties = [
  {
    id: 1,
    title: "Luxury 5-Bedroom Villa",
    location: "Lekki, Lagos State",
    price: "#25,000,000",
    image: "/Housing_Image_1.jpg",
    gallery: ["/Housing_Image_1.jpg", "/PentHouse.jpg"],
    description:
      "A beautiful 5-bedroom villa with smart home features, private pool, and a serene enviroment in Lekki.",
    features: ["5 Bedrooms", "4 Bathroom", "2 Parking Spaces", "600 sqm"],
  },
  {
    id: 2,
    title: "Modern Penthouse Apartment",
    location: "Arepo, Ogun State",
    price: "#7,000,000",
    image: "/Housing_Image_1.jpg",
    gallery: ["/Housing_Image_1.jpg", "/PentHouse.jpg"],
    description:
      "An elegant penthouse apartment offering comfort, privacy, and modern amenities.",
    features: ["3 Bedrooms", "2 Bathroom", "1 Parking Spaces", "250 sqm"],
  },

  // more properties soon
];

document.querySelectorAll(".btn-view").forEach((button) => {
  button.addEventListener("click", (e) => {
    const card = e.target.closest(".property-card");
    const id = parseInt(card.dataset.id);

    // find the property in array
    const selectedProperty = properties.find((p) => p.id === id);

    // saving to localstorage
    localStorage.setItem(
      "beth_selected_property",
      JSON.stringify(selectedProperty)
    );

    window.location.href = "property.html";
  });
});

// property
const property = JSON.parse(localStorage.getItem("beth_selected_property"));
if (property) {
  document.getElementById("propertyTitle").textContent = property.title;
  document.getElementById("propertyPrice").textContent = property.price;
  document.getElementById("propertyLocation").textContent = property.location;
  document.getElementById("mainImage").src = property.image;
  document.querySelector(".desc").textContent = property.description;

  const featureList = document.querySelector(".features");
  featureList.innerHTML = property.features
    .map((f) => `<li><i class="bx bx-check></i> ${f}</li>`)
    .join("");

  const thumbRow = document.querySelector(".thumbnail-row");
  thumbRow.innerHTML = property.gallery
    .map((img) => `<img src="${img}" class="thumb" alt="${property.title}">`)
    .join("");
}
