function createStars() {
  const starsContainer = document.getElementById("starsContainer")
  const starCount = 150

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div")
    star.className = "star"

    const size = Math.random() * 3 + 1
    star.style.width = size + "px"
    star.style.height = size + "px"
    star.style.left = Math.random() * 100 + "%"
    star.style.top = Math.random() * 100 + "%"
    star.style.animationDelay = Math.random() * 3 + "s"
    star.style.animationDuration = Math.random() * 2 + 2 + "s"

    starsContainer.appendChild(star)
  }

  for (let i = 0; i < 5; i++) {
    const shootingStar = document.createElement("div")
    shootingStar.className = "shooting-star"
    shootingStar.style.left = Math.random() * 100 + "%"
    shootingStar.style.top = Math.random() * 50 + "%"
    shootingStar.style.animationDelay = Math.random() * 5 + "s"
    shootingStar.style.animationDuration = Math.random() * 2 + 2 + "s"

    starsContainer.appendChild(shootingStar)
  }
}

createStars()

const diplomaWrapper = document.getElementById("diploma-wrapper")
const galaContainer = document.getElementById("gala-container")
const footer = document.getElementById("footer")
const musicControl = document.getElementById("musicControl")
const themeToggle = document.getElementById("themeToggle")
const music = document.getElementById("backgroundMusic")
const volumeUpIcon = document.getElementById("volumeUpIcon")
const volumeOffIcon = document.getElementById("volumeOffIcon")

document.body.classList.add("waiting")

diplomaWrapper.addEventListener("click", () => {
  const graduationCap = document.querySelector(".graduation-cap")

  // Add throwing animation
  graduationCap.classList.add("throwing")

  // Wait for animation to start before hiding wrapper
  setTimeout(() => {
    document.body.classList.remove("waiting")
    diplomaWrapper.classList.add("open")
    document.body.style.overflowY = "auto"
    if (galaContainer) galaContainer.classList.add("visible")
    footer.classList.add("visible")
    musicControl.classList.add("visible")
    themeToggle.classList.add("visible")

    music.play().catch((e) => console.error("La reproducción automática fue bloqueada."))

    if (music.muted) {
      volumeUpIcon.style.display = "none"
      volumeOffIcon.style.display = "block"
    } else {
      volumeUpIcon.style.display = "block"
      volumeOffIcon.style.display = "none"
    }
  }, 500)

  setTimeout(() => {
    diplomaWrapper.style.display = "none"
  }, 2500)
})

musicControl.addEventListener("click", () => {
  if (music.muted) {
    music.muted = false
    volumeUpIcon.style.display = "block"
    volumeOffIcon.style.display = "none"
  } else {
    music.muted = true
    volumeUpIcon.style.display = "none"
    volumeOffIcon.style.display = "block"
  }
})

const sunIcon = document.getElementById("themeIconSun")
const moonIcon = document.getElementById("themeIconMoon")
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
const waveOverlay = document.getElementById("wave-overlay")

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light")
    sunIcon.style.display = "none"
    moonIcon.style.display = "block"
    localStorage.setItem("theme", "light")
  } else {
    document.documentElement.setAttribute("data-theme", "dark")
    sunIcon.style.display = "block"
    moonIcon.style.display = "none"
    localStorage.setItem("theme", "dark")
  }
}

themeToggle.addEventListener("click", (e) => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark"
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  const targetBg = newTheme === "dark" ? "#0a0a0f" : "#faf8f0"

  waveOverlay.style.backgroundColor = targetBg
  waveOverlay.style.top = e.clientY - 0.5 + "px"
  waveOverlay.style.left = e.clientX - 0.5 + "px"
  waveOverlay.style.transform = "scale(0)"
  waveOverlay.style.transition = "transform 0s"

  requestAnimationFrame(() => {
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const maxDist = Math.max(
      Math.hypot(e.clientX, e.clientY),
      Math.hypot(viewportWidth - e.clientX, e.clientY),
      Math.hypot(e.clientX, viewportHeight - e.clientY),
      Math.hypot(viewportWidth - e.clientX, viewportHeight - e.clientY),
    )
    const scaleFactor = maxDist * 2

    waveOverlay.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
    waveOverlay.style.transform = `scale(${scaleFactor})`

    setTimeout(() => {
      applyTheme(newTheme)
    }, 600)

    setTimeout(() => {
      waveOverlay.style.transform = "scale(0)"
      waveOverlay.style.transition = "transform 0s"
    }, 750)
  })
})

const savedTheme = localStorage.getItem("theme")
if (savedTheme) {
  applyTheme(savedTheme)
} else {
  applyTheme("dark")
}
prefersDark.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(e.matches ? "dark" : "light")
  }
})

const dot = document.getElementById("cursor-dot")
const outline = document.getElementById("cursor-outline")

window.addEventListener("mousemove", (e) => {
  dot.style.left = e.clientX + "px"
  dot.style.top = e.clientY + "px"
  outline.style.left = e.clientX + "px"
  outline.style.top = e.clientY + "px"
})

setTimeout(() => {
  const hoverElements = document.querySelectorAll(
    "a, button, #diploma-wrapper, .music-control, .theme-toggle, .detail-item, .venue-image, .memory-item, .graduation-cap",
  )

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover")
    })
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover")
    })
  })
}, 100)

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
      if (entry.target.querySelector(".venue-gallery") || entry.target.querySelector(".memories-gallery")) {
        const items = entry.target.querySelectorAll(".venue-image, .memory-item")
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "0"
            item.style.transform = "translateY(20px)"
            item.style.transition = "all 0.5s ease-out"
            requestAnimationFrame(() => {
              item.style.opacity = "1"
              item.style.transform = "translateY(0)"
            })
          }, index * 100)
        })
      }
    }
  })
}, observerOptions)

// Observe all content sections
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section")
  sections.forEach((section) => {
    observer.observe(section)
  })
})

function initLightbox() {
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxClose = document.getElementById("lightbox-close")

  // Add click handlers to all gallery images
  const galleryImages = document.querySelectorAll(".venue-image img, .memory-item img")

  const allImageSources = Array.from(galleryImages).map((img) => img.src)
  let currentImageIndex = 0

  galleryImages.forEach((img, index) => {
    img.parentElement.addEventListener("click", () => {
      currentImageIndex = index
      lightbox.classList.add("active")
      lightboxImg.src = img.src
      document.body.style.overflow = "hidden"
    })
  })

  // Close lightbox
  lightboxClose.addEventListener("click", closeLightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  function closeLightbox() {
    lightbox.classList.remove("active")
    document.body.style.overflow = "auto"
  }

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox()
    }
  })

  let touchStartX = 0
  let touchEndX = 0

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left - next image
      currentImageIndex = (currentImageIndex + 1) % allImageSources.length
      lightboxImg.src = allImageSources[currentImageIndex]
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right - previous image
      currentImageIndex = (currentImageIndex - 1 + allImageSources.length) % allImageSources.length
      lightboxImg.src = allImageSources[currentImageIndex]
    }
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      if (e.key === "ArrowRight") {
        currentImageIndex = (currentImageIndex + 1) % allImageSources.length
        lightboxImg.src = allImageSources[currentImageIndex]
      } else if (e.key === "ArrowLeft") {
        currentImageIndex = (currentImageIndex - 1 + allImageSources.length) % allImageSources.length
        lightboxImg.src = allImageSources[currentImageIndex]
      }
    }
  })
}

// Initialize lightbox after diploma opens
setTimeout(() => {
  initLightbox()
}, 2500)

let ticking = false

function updateParallax() {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".venue-image, .memory-item")

  parallaxElements.forEach((el) => {
    const speed = 0.05
    const yPos = -(scrolled * speed)
    el.style.transform = `translateY(${yPos}px)`
  })

  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax)
    ticking = true
  }
})
