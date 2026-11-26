// Landing module (homepage hero), cloned from the corporate site (mgml-www.specto.work) and refined.
// Intro: the background logo fades in; the title reveals word by word, then the text line by line and the buttons
// (Specto text-reveal engine, 01-atoms/text-reveal); then the images rise and wipe open from the bottom, left to right. It waits for the web fonts (capped), so the title never
// swaps font mid-rise.
// Scroll: each image moves down 100px or 200px (the corporate site uses 50px or 100px) over the first viewport height of
// scroll, locked to the scroll position (no trailing; the corporate site's random 0.6s to 1.2s transition on each image
// was removed on purpose). The photo, zoomed to 1.25, also drifts from -10% to 10% inside its frame.
// The corporate site drives the scroll with ScrollMagic; ScrollTrigger with the same start, end and scrub replaces it.
// Reduced motion: no parallax (the photos keep their zoom), and the intro is short opacity fades with no movement.
// Block scope: every component file is concatenated into one bundle, so nothing here may leak to the top level.
{
	const landingModule = document.querySelector('.landing-module');

	if (landingModule) {
		// Hide the intro elements only now that JS is running, so without JS the hero is simply visible.
		// Module scripts run after parsing, before the browser has had a reason to paint the hero.
		landingModule.classList.add('is-intro');

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Strong ease-out (easeOutQuart), the curve the corporate site uses for this intro
		const introEase = CustomEase.create('landingModuleIntro', '0.25, 1, 0.5, 1');
		// Longest the intro waits for the web fonts before starting anyway
		const fontWaitCap = 600;
		// Seconds between the title's words starting (the engine's per-word recommendation), between the text's lines
		// starting (the engine's per-line default is 0.06, a bit more here), and between the buttons starting
		const wordStagger = 0.02;
		const lineStagger = 0.1;
		const buttonStagger = 0.06;

		// d-none / d-md-none copies take no space and must not take a stagger slot
		const visible = (elements) => [...elements].filter((element) => element.getClientRects().length > 0);

		// From the very top of the page (scroll 0) over one viewport height of scroll, locked to it. The corporate site
		// starts when the hero reaches the top of the viewport instead, which leaves the first ~106px of scroll (the
		// header above the hero) with no movement.
		const parallaxScroll = () => ({
			start: 0,
			end: () => window.innerHeight,
			scrub: true,
		});

		const startParallax = () => {
			landingModule.querySelectorAll('.landing-module__image-inner').forEach((inner, index) => {
				// The frame moves down
				gsap.to(inner, {
					y: [1, 2, 4, 5, 7].includes(index) ? '100px' : '200px',
					ease: 'none',
					scrollTrigger: parallaxScroll(),
				});

				// The photo drifts down inside its frame too, from -10% to 10% of its height (it is zoomed to 1.25 in CSS,
				// which leaves 12.5% spare either way, so the frame's edge never shows)
				gsap.fromTo(
					inner.querySelector('img'),
					{ yPercent: -10 },
					{ yPercent: 10, ease: 'none', scrollTrigger: parallaxScroll() },
				);
			});
		};

		const playIntro = () => {
			const bgLogo = landingModule.querySelector('.landing-module__bg-logo');
			const title = landingModule.querySelector('.landing-module__title h1');
			// Mobile and desktop copies of the text exist; only the one shown is revealed
			const [text] = visible(landingModule.querySelectorAll('.landing-module__text-inner'));
			const buttons = visible(landingModule.querySelectorAll('.landing-module__button-item'));
			// Left to right on screen, not in markup order
			const images = visible(landingModule.querySelectorAll('.landing-module__image')).sort(
				(a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left,
			);

			// Specto text-reveal engine (01-atoms/text-reveal): the title per word, the text per line, the buttons with the
			// same motion inside their .landing-module__button-wrap masks. The text and buttons start together, carrying
			// on from the title's last word (the engine's startIndex chaining), so it all reads as one sequence. The
			// engine handles reduced motion itself (an opacity fade).
			const titleWords = TextReveal.split(title, 'word');
			if (text) TextReveal.split(text, 'line');

			const timeline = gsap.timeline();
			// Tweens render their start state as they are created, so removing the hiding class right after shows every
			// element already in its start position, with no frame in between
			timeline.add(TextReveal.tween(title, { stagger: wordStagger }), 0);
			// Both start right after the title's last word: the title's word count in the title's stagger steps, expressed
			// as a startIndex in each one's own stagger steps
			const afterTitle = titleWords.length * wordStagger;
			if (text) timeline.add(TextReveal.tween(text, { stagger: lineStagger, startIndex: afterTitle / lineStagger }), 0);
			timeline.add(TextReveal.reveal(buttons, { stagger: buttonStagger, startIndex: afterTitle / buttonStagger }), 0);

			if (reducedMotion) {
				timeline.from([bgLogo, ...images], { opacity: 0, duration: 0.2, ease: 'none' }, 0);
				landingModule.classList.remove('is-intro');
				return;
			}

			timeline.from(bgLogo, { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0);
			// The clip only exists during this wipe, cleared at the end: the scroll parallax moves each photo inside its
			// .landing-module__image box, and a clip left on that box would cut the photo's bottom off as it moves
			timeline.fromTo(
				images,
				{ y: 75, clipPath: 'inset(100% 0% 0% 0%)' },
				{ y: 0, clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.065, duration: 0.7, ease: introEase, clearProps: 'clipPath,transform' },
				0.4,
			);
			landingModule.classList.remove('is-intro');
		};

		document.addEventListener('DOMContentLoaded', () => {
			if (!reducedMotion) startParallax();

			const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
			const cap = new Promise((resolve) => setTimeout(resolve, fontWaitCap));
			Promise.race([fontsReady, cap]).then(playIntro);
		});
	}
}
