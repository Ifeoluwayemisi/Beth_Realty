// Contact Form
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  alert('Thank you for reaching out! We will get back to you soon.');
  this.reset();
});

// Escape HTML
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (m) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[m]));
}

// Blog Modal
const blogModal = document.getElementById('blogModal');
document.getElementById('openBlogModal').addEventListener('click', ()=> blogModal.classList.remove('hide'));
document.getElementById('closeBlogModal').addEventListener('click', ()=> blogModal.classList.add('hide'));

// Read Modal
const readModal = document.getElementById('readModal');
const readTitle = document.getElementById('readTitle');
const readBody = document.getElementById('readBody');
const readAuthor = document.getElementById('readAuthor');
document.getElementById('closeReadModal').addEventListener('click', () => readModal.classList.add('hide'));

// Blog Form Submit
document.getElementById('blogForm').addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const stored = JSON.parse(localStorage.getItem('beth_blog_v1') || '[]');
  stored.unshift(data);
  localStorage.setItem('beth_blog_v1', JSON.stringify(stored));
  form.reset();
  blogModal.classList.add('hide');
  renderArticles();
  renderFeaturedArticle();
});

// Render Articles + Read More
function renderArticles() {
  const blogGrid = document.getElementById('blogGrid');
  const articles = JSON.parse(localStorage.getItem('beth_blog_v1') || '[]');
  blogGrid.innerHTML = articles.map((a, i) => `
    <div class="blog-card" data-aos="fade-up" data-aos-delay="${i*100}">
      ${a.image ? `<img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}">` : ''}
      <div class="blog-info">
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.body.substring(0, 100))}...</p>
        ${a.author ? `<p class="author">By ${escapeHtml(a.author)}</p>` : ''}
        <a href="#" class="btn-primary small read-more" data-index="${i}">Read More</a>
      </div>
    </div>
  `).join('');

  // Add Read More listeners
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = btn.getAttribute('data-index');
      const article = articles[idx];
      readTitle.textContent = article.title;
      readBody.textContent = article.body;
      readAuthor.textContent = article.author ? `By ${article.author}` : '';
      readModal.classList.remove('hide');
    });
  });
}

// Render Featured Article
function renderFeaturedArticle() {
  const featuredContainer = document.getElementById('featuredArticle');
  const articles = JSON.parse(localStorage.getItem('beth_blog_v1') || '[]');
  if (articles.length === 0) { featuredContainer.innerHTML = ''; return; }
  const latest = articles[0];
  featuredContainer.innerHTML = `
    ${latest.image ? `<img src="${escapeHtml(latest.image)}" alt="${escapeHtml(latest.title)}">` : ''}
    <div class="featured-info">
      <h3>${escapeHtml(latest.title)}</h3>
      <p>${escapeHtml(latest.body.substring(0, 200))}...</p>
      <a href="#" class="btn-primary small" id="featuredReadMore">Read More</a>
    </div>
  `;

  document.getElementById('featuredReadMore').addEventListener('click', (e) => {
    e.preventDefault();
    readTitle.textContent = latest.title;
    readBody.textContent = latest.body;
    readAuthor.textContent = latest.author ? `By ${latest.author}` : '';
    readModal.classList.remove('hide');
  });
}

// Initial render
renderArticles();
renderFeaturedArticle();
