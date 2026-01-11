gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

let scrollDirection = "down";
let lastScrollY = 0;

lenis.on("scroll", ({ scroll }) => {
  scrollDirection = scroll > lastScrollY ? "down" : "up";
  lastScrollY = scroll;
});

const heroImg = document.querySelector(".hero-img");
const lottieContainer = document.querySelector(".lottie");

const lottieAnimation = lottie.loadAnimation({
  container: lottieContainer,
  path: "Walking Tiger.json",
  renderer: "svg",
  autoplay: false,
});

const heroImgInitialWidth = heroImg.offsetWidth;
const heroImgTargetWidth = 300;

ScrollTrigger.create({
  trigger: ".about",
  start: "top bottom",
  end: "top 30%",
  scrub: 1,
  onUpdate: (self) => {
    const heroImgCurrentWidth =
      heroImgInitialWidth -
      self.progress * (heroImgInitialWidth - heroImgTargetWidth);
    gsap.set(heroImg, { width: `${heroImgCurrentWidth}px` });
  },
});

let isAnimationPaused = false;

ScrollTrigger.create({
  trigger: ".about",
  start: "top 30%",
  end: "bottom top",
  scrub: 1,
  onUpdate: (self) => {
    const lottieOffset = self.progress * window.innerHeight * 1.1;

    isAnimationPaused = self.progress > 0;

    gsap.set(lottieContainer, {
      y: -lottieOffset,
      rotateY: scrollDirection === "up" ? -180 : 0,
    });
  },
});

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: 1,
  onUpdate: (self) => {
    if (!isAnimationPaused) {
      const scrollDistance = self.scroll() - self.start;
      const pixelsPerFrame = 3;
      const frame =
        Math.floor(scrollDistance / pixelsPerFrame) %
        lottieAnimation.totalFrames;
      lottieAnimation.goToAndStop(frame, true);
    }

    gsap.set(lottieContainer, {
      rotateY: scrollDirection === "up" ? -180 : 0,
    });
  },
});
