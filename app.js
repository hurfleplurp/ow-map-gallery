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
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightbox = document.getElementById("closeLightbox");

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
    });

    fragment.append(clone);
  });

  gallery.append(fragment);
}

closeLightbox.addEventListener("click", () => {
  lightbox.close();
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

renderGallery();
