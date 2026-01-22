gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const spotlightSection = document.querySelector(".spotlight");
  const projectIndex = document.querySelector(".project-index h1");
  const projectImgs = document.querySelectorAll(".project-img");
  const projectImagesContainer = document.querySelector(".project-images");
  const projectNames = document.querySelectorAll(".project-names p");
  const projectNamesContainer = document.querySelector(".project-names");
  const totalProjectCount = projectNames.length;

  const spotlightSectionHeight = spotlightSection.offsetHeight;
  const spotlightSectionPadding = parseFloat(
    getComputedStyle(spotlightSection).padding,
  );

  const projectIndexHeight = projectIndex.offsetHeight;
  const containerHeight = projectNamesContainer.offsetHeight;
  const imagesHeight = projectImagesContainer.offsetHeight;

  const moveDistanceIndex =
    spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;

  const moveDistanceNames =
    spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;

  const moveDistanceImages = window.innerHeight - imagesHeight;

  const imgActivationThreshold = window.innerHeight / 2;

  ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const currentIndex = Math.min(
        Math.floor(progress * totalProjectCount) + 1,
        totalProjectCount,
      );

      projectIndex.textContent = `${String(currentIndex).padStart(
        2,
        "0",
      )}/${String(totalProjectCount).padStart(2, "0")}`;

      gsap.set(projectIndex, {
        y: progress * moveDistanceIndex,
      });

      gsap.set(projectImagesContainer, {
        y: progress * moveDistanceImages,
      });

      projectImgs.forEach((img) => {
        const imgRect = img.getBoundingClientRect();
        const imgTop = imgRect.top;
        const imgBottom = imgRect.bottom;

        if (
          imgTop <= imgActivationThreshold &&
          imgBottom >= imgActivationThreshold
        ) {
          gsap.set(img, {
            opacity: 1,
          });
        } else {
          gsap.set(img, {
            opacity: 0.5,
          });
        }
      });

      projectNames.forEach((p, index) => {
        const startProgress = index / totalProjectCount;
        const endProgress = (index + 1) / totalProjectCount;

        const projectProgress = Math.max(
          0,
          Math.min(
            1,
            (progress - startProgress) / (endProgress - startProgress),
          ),
        );

        gsap.set(p, {
          y: -projectProgress * moveDistanceNames,
        });

        if (projectProgress > 0 && projectProgress < 1) {
          gsap.set(p, {
            color: "#fff",
          });
        } else {
          gsap.set(p, {
            color: "#4a4a4a",
          });
        }
      });
    },
  });
});
