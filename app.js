const maps = [
  {
    name: "Dorado",
    mode: "Escort",
    imageUrl: "https://lh3.googleusercontent.com/d/1MIRAhJArAPm7dbl70H7ExN8owlHrwzv7"
  }
  // Add more map objects here as your collection grows.
  // Example:
  // {
  //   name: "King's Row",
  //   mode: "Hybrid",
  //   imageUrl: "https://lh3.googleusercontent.com/d/YOUR_IMAGE_ID"
  // }
];

const gallery = document.getElementById("gallery");
const template = document.getElementById("mapCardTemplate");
const lightbox = document.getElementById("lightbox");
const lightboxViewport = document.getElementById("lightboxViewport");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightbox = document.getElementById("closeLightbox");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const zoomReset = document.getElementById("zoomReset");

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const ZOOM_STEP = 0.22;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let baseOffsetX = 0;
let baseOffsetY = 0;

function applyTransform() {
  lightboxImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  zoomReset.textContent = `${Math.round(scale * 100)}%`;
}

function clampOffsets() {
  const viewportWidth = lightboxViewport.clientWidth;
  const viewportHeight = lightboxViewport.clientHeight;
  const imageWidth = lightboxImage.clientWidth * scale;
  const imageHeight = lightboxImage.clientHeight * scale;

  const minX = Math.min(0, viewportWidth - imageWidth);
  const minY = Math.min(0, viewportHeight - imageHeight);

  offsetX = Math.min(0, Math.max(minX, offsetX));
  offsetY = Math.min(0, Math.max(minY, offsetY));
}

function setScale(nextScale, anchorX, anchorY) {
  const boundedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
  if (boundedScale === scale) {
    return;
  }

  const viewportRect = lightboxViewport.getBoundingClientRect();
  const pivotX = (anchorX ?? viewportRect.left + viewportRect.width / 2) - viewportRect.left;
  const pivotY = (anchorY ?? viewportRect.top + viewportRect.height / 2) - viewportRect.top;

  const imageX = (pivotX - offsetX) / scale;
  const imageY = (pivotY - offsetY) / scale;

  scale = boundedScale;
  offsetX = pivotX - imageX * scale;
  offsetY = pivotY - imageY * scale;

  clampOffsets();
  applyTransform();
}

function resetZoom() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  applyTransform();
}

function renderGallery() {
  const fragment = document.createDocumentFragment();

  maps.forEach((map) => {
    const clone = template.content.cloneNode(true);
    const button = clone.querySelector(".map-button");
    const img = clone.querySelector("img");
    const heading = clone.querySelector("h2");
    const type = clone.querySelector(".map-type");

    img.src = map.imageUrl;
    img.alt = `${map.name} overhead map`;

    heading.textContent = map.name;
    type.textContent = map.mode;

    button.addEventListener("click", () => {
      lightboxImage.src = map.imageUrl;
      lightboxImage.alt = `${map.name} full-resolution map`;
      lightboxTitle.textContent = `${map.name} • ${map.mode}`;
      lightbox.showModal();
      resetZoom();
    });

    fragment.append(clone);
  });

  gallery.append(fragment);
}

closeLightbox.addEventListener("click", () => {
  lightbox.close();
});

zoomIn.addEventListener("click", () => {
  setScale(scale + ZOOM_STEP);
});

zoomOut.addEventListener("click", () => {
  setScale(scale - ZOOM_STEP);
});

zoomReset.addEventListener("click", () => {
  resetZoom();
});

lightboxImage.addEventListener("load", () => {
  resetZoom();
});

lightboxViewport.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setScale(scale + delta, event.clientX, event.clientY);
  },
  { passive: false }
);

lightboxViewport.addEventListener("pointerdown", (event) => {
  if (scale <= MIN_SCALE) {
    return;
  }

  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  baseOffsetX = offsetX;
  baseOffsetY = offsetY;
  lightboxViewport.classList.add("is-dragging");
  lightboxViewport.setPointerCapture(event.pointerId);
});

lightboxViewport.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  offsetX = baseOffsetX + (event.clientX - dragStartX);
  offsetY = baseOffsetY + (event.clientY - dragStartY);
  clampOffsets();
  applyTransform();
});

lightboxViewport.addEventListener("pointerup", (event) => {
  if (!isDragging) {
    return;
  }

  isDragging = false;
  lightboxViewport.classList.remove("is-dragging");
  lightboxViewport.releasePointerCapture(event.pointerId);
});

lightboxViewport.addEventListener("pointercancel", () => {
  isDragging = false;
  lightboxViewport.classList.remove("is-dragging");
});

lightbox.addEventListener("click", (event) => {
  const rect = lightbox.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    lightbox.close();
  }
});

lightbox.addEventListener("close", () => {
  isDragging = false;
  lightboxViewport.classList.remove("is-dragging");
});

renderGallery();
