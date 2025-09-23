fetch("data/content.json")
  .then(res => res.json())
  .then(data => {
    // Featured Video on homepage
    const featured = document.getElementById("featured-video");
    if (featured && data.featured) {
      featured.innerHTML = `
        <h2>${data.featured.title}</h2>
        <iframe src="${data.featured.url}" frameborder="0" allowfullscreen></iframe>
      `;
    }

    // Video List
    const videoList = document.getElementById("video-list");
    if (videoList && data.videos) {
      data.videos.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("video-card");
        card.innerHTML = `
          <h3>${video.title}</h3>
          <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
        `;
        videoList.appendChild(card);
      });
    }

    // Blog List
    const blogList = document.getElementById("blog-list");
    if (blogList && data.blogs) {
      data.blogs.forEach(post => {
        const card = document.createElement("div");
        card.classList.add("blog-card");
        card.innerHTML = `
          <h3>${post.title}</h3>
          <small>${post.date}</small>
          <p>${post.excerpt}</p>
          <a href="${post.url}" class="btn">Read More</a>
        `;
        blogList.appendChild(card);
      });
    }
  })
  .catch(err => console.error("Error loading JSON:", err));
