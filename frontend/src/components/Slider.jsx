// Slider.jsx – simple Bootstrap carousel for homepage
import React from "react";

// You can replace these URLs with any free‑stock farmer images you prefer.
const images = [
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    caption: "Adopting modern irrigation saves water and boosts yields",
    alt: "Irrigation field",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    caption: "Precision farming with drones monitors crop health",
    alt: "Drone over crops",
  },
  {
    src: "https://images.unsplash.com/photo-1514516871370-7ef6fb5e6c33?w=1600&q=80",
    caption: "Smart sensors guide fertilizer use for optimal profit",
    alt: "Sensors in a field",
  },
];

const Slider = () => {
  return (
    <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to={idx}
            className={idx === 0 ? "active" : undefined}
            aria-current={idx === 0 ? "true" : undefined}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`carousel-item ${idx === 0 ? "active" : ""}`}
          >
            <img
              src={img.src}
              className="d-block w-100"
              alt={img.alt}
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
              <p>{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;
