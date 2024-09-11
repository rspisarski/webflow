gsap.registerPlugin(ScrollTrigger);

// Marquee Stuff
const initializeMarquee = (marquee) => {
  if (!marquee) return;

  const direction = marquee.getAttribute("data-direction") || "left";
  const marqueeContent = marquee.firstChild;
  // Set a fixed duration for both marquees

  let duration =
    parseFloat(marquee.getAttribute("data-duration-per-item")) || 10; // Fixed duration in seconds
  let loop = parseFloat(marquee.getAttribute("data-loop")) || -1; // Fixed duration in seconds

  const itemList = marquee.querySelector(".js-marquee_list");
  if (itemList) {
    const childrenCount = itemList.children.length;
    duration *= childrenCount; // Multiply the duration by the number of direct children
  }

  if (!marqueeContent) return;

  // Clone marquee content
  const marqueeContentClone = marqueeContent.cloneNode(true);
  marquee.append(marqueeContentClone);

  let tween;

  const playMarquee = () => {
    let progress = tween ? tween.progress() : 0;
    tween && tween.progress(0).kill();

    tween = gsap.fromTo(
      marquee,
      { xPercent: direction === "left" ? 50 : -50 },
      {
        xPercent: 0,
        duration,
        ease: "none",
        repeat: loop,
      }
    );
    tween.progress(progress);
  };

  playMarquee();

  window.addEventListener("resize", debounce(playMarquee));
}; // end marquee stuff

// Debounce Function
const debounce = (func, delay = 500) => {
  let timer;
  return function (event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(event);
    }, delay);
  };
}; // end debounce

// Initialize all marquees on the page
document.querySelectorAll('[wb-data="marquee"]').forEach((marquee) => {
  ScrollTrigger.create({
    trigger: marquee,
    start: "-400px 100%", // Adjust this as needed
    end: "bottom", // Adjust this as needed
    onEnter: () => {
      // Check if the marquee is already initialized
      if (!marquee.hasAttribute("data-initialized")) {
        initializeMarquee(marquee);
        marquee.setAttribute("data-initialized", "true"); // Mark it as initialized
      }
    },
  });
});

$(document).ready(function () {
  // Initial setup: Hide the content, set aria-hidden to true, and make it non-focusable
  $(".home-services_card_text")
    .hide()
    .attr("aria-hidden", "true")
    .attr("tabindex", "-1");

  // Function to show content
  function showContent(element) {
    element
      .stop(true, true)
      .slideDown(300)
      .attr("aria-hidden", "false")
      .attr("tabindex", "0");
  }

  // Function to hide content
  function hideContent(element) {
    element
      .stop(true, true)
      .slideUp(300)
      .attr("aria-hidden", "true")
      .attr("tabindex", "-1");
  }

  // Detect touch device
  function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  // Handle hover and focus based on device type
  $(".home-services_card").each(function () {
    var $this = $(this);
    var $text = $this.find(".home-services_card_text");

    if (isTouchDevice()) {
      // On touch devices, use click
      $this.off("mouseenter mouseleave focusin focusout");
      $this.click(function (e) {
        var isVisible = $text.is(":visible");

        if (isVisible) {
          hideContent($text);
        } else {
          showContent($text);
        }

        // Prevent click from triggering other default actions
        e.stopPropagation();
      });
    } else {
      // On non-touch devices, use hover and focus
      $this
        .hover(
          function () {
            // On hover in (desktop)
            showContent($text);
          },
          function () {
            // On hover out (desktop)
            hideContent($text);
          }
        )
        .focusin(function () {
          // On focus in (keyboard users)
          showContent($text);
        })
        .focusout(function () {
          // On focus out (keyboard users)
          hideContent($text);
        });
    }
  });

  // Optional: Close content when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".home-services_card").length) {
      $(".home-services_card_text").each(function () {
        if ($(this).is(":visible")) {
          hideContent($(this));
        }
      });
    }
  });
});

// Fade in elements animation
const fadeInElementsAnimation = () => {
  const elements = gsap.utils.toArray(
    '[data-fade-in="true"]:not(.fade-in-complete)'
  );
  elements.forEach((elem) => {
    // console.log(elem.dataset);
    let fadeDelay = 0.25;
    if (elem.dataset.fadeDelay > 0) {
      fadeDelay = elem.dataset.fadeDelay / 1000;
    }
    const anim = gsap.to(
      elem,
      // { autoAlpha: 0 },
      {
        duration: 0.75,
        delay: fadeDelay,
        autoAlpha: 1,
        ease: Power1.easeIn,
        onComplete: function () {
          elem.classList.add("fade-in-complete");
        },
      }
    );

    ScrollTrigger.create({
      trigger: elem,
      start: "top bottom-=5%",
      animation: anim,
      toggleActions: "play none none none",
      once: true,
      id: "fade-in-trigger", // Assign an ID to identify these triggers
    });
  });
}; // end fade in elements animation

gsap.from(".home-services_list_collection-card", {
  y: 100, // Move the elements 50px down initially
  opacity: 0, // Start with an opacity of 0 (invisible)
  stagger: 0.3, // Stagger the animation for each card by 0.2 seconds
  duration: 1, // Duration of the animation for each card
  delay: 1,
  ease: "power2.out", // Ease function for a smooth animation
  scrollTrigger: {
    trigger: ".home-services_list-wrapper", // Trigger the animation when this element comes into view
    start: "top 80%", // Start the animation when the top of the trigger hits 80% of the viewport height
    toggleActions: "play none none none", // Play the animation when it enters the viewport, do nothing on other events
  },
});

function animateButtons() {
  // Select all button elements within the .hero container
  const buttons = document.querySelectorAll(".hero .button");

  gsap.fromTo(
    buttons,
    {
      y: 100, // Initial position: 100px down
      opacity: 0, // Initial opacity: 0 (invisible)
    },
    {
      y: 0, // Final position: 0px (default position)
      opacity: 1, // Final opacity: 1 (fully visible)
      delay: 2.5, // Delay before starting the animation
      stagger: 0.2, // Stagger the animation for each element by 0.4 seconds
      duration: 1, // Duration of the animation for each element
      ease: "power2.out", // Ease function for a smooth animation
    }
  );
}

function fadeUpOnScroll() {
  document.querySelectorAll("[data-g-fade-up]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        y: 100, // Initial position: 100px down
        opacity: 0, // Initial opacity: 0 (invisible)
      },
      {
        y: 0, // Final position: 0px (default position)
        opacity: 1, // Final opacity: 1 (fully visible)
        delay: element.dataset.gDelay ? parseFloat(element.dataset.gDelay) : 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

console.log('file edited);

// Call the function to initialize animations for elements with data-g-fade-up
window.addEventListener("DOMContentLoaded", () => {
  fadeUpOnScroll();
  animateButtons();
});
