// **************************************************
// Text Reveal
// Port of the Specto text-reveal engine (github.com/przly/Specto_TextReveal, src/RevealText.tsx) from React + Motion to
// plain JS + GSAP. Text is split per word or per detected line; each piece gets its own clip box and slides up out of
// it (200% -> -7%) with the engine's expo-out curve, staggered across the whole block.
//
//   by: 'word' - every word is its own mask
//   by: 'line' - the browser's actual line breaks are measured and every line is one mask. Re-measured on resize and
//                once the web fonts have loaded, like the engine's useDetectedLines.
//
// Usage, triggered once when scrolled into view (the engine's own IntersectionObserver trigger):
//   TextReveal.init(element, { by: 'line', duration: 1.3, stagger: 0.06, delay: 0, startIndex: 0, triggerMargin: 0 });
// Usage inside a GSAP timeline you control (e.g. a page intro):
//   const lines = TextReveal.split(element, 'line');
//   timeline.add(TextReveal.tween(element, { stagger: 0.06, startIndex: 0 }), 0);
// Elements that aren't text (each inside a parent with overflow hidden), with the same motion:
//   timeline.add(TextReveal.reveal(buttons, { stagger: 0.06 }), 0);
// **************************************************

const TextReveal = (() => {
	// The engine's easeExpoOut
	const easeExpoOut = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
	// Motion's 'easeOut', used by the engine's reduced-motion variant
	const easeOut = CustomEase.create('textRevealEaseOut', '0, 0, 0.58, 1');

	const defaults = { by: 'line', duration: 1.3, stagger: 0.06, delay: 0, startIndex: 0, triggerMargin: 0 };
	// Where each piece rests once revealed: the engine's slight overshoot
	const revealedY = -7;

	// Per element: { by, words, targets, tween, width }
	const states = new WeakMap();

	const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const span = (className, text) => {
		const element = document.createElement('span');
		element.className = className;
		element.textContent = text;
		return element;
	};

	// Word mode: a mask per word, with real collapsible spaces between them so the text wraps like normal text
	const buildWords = (element, words) => {
		element.textContent = '';

		return words.map((text, index) => {
			const wrap = span('text-reveal__word-wrap', '');
			const word = span('text-reveal__word', text);
			wrap.append(word);
			element.append(wrap);
			if (index < words.length - 1) element.append(span('text-reveal__space', ' '));
			return word;
		});
	};

	// Line mode: lay the words out as plain inline text, group them by their top edge (the browser's own wrapping at
	// the current width), then replace them with a mask per line. All in one task, so nothing in between is painted.
	const buildLines = (element, words) => {
		element.textContent = '';
		const measured = words.map((text, index) => {
			const word = span('text-reveal__measure-word', text);
			element.append(word);
			if (index < words.length - 1) element.append(' ');
			return word;
		});

		const lines = [];
		let lastTop = null;
		measured.forEach((word) => {
			const top = word.offsetTop;
			if (lastTop === null || Math.abs(top - lastTop) > 1) {
				lines.push([]);
				lastTop = top;
			}
			lines[lines.length - 1].push(word.textContent);
		});

		element.textContent = '';
		return lines.map((lineWords) => {
			const mask = span('text-reveal__line-mask', '');
			const line = span('text-reveal__line', lineWords.join(' '));
			mask.append(line);
			element.append(mask);
			return line;
		});
	};

	const build = (element, state) => {
		state.targets = state.by === 'word' ? buildWords(element, state.words) : buildLines(element, state.words);
		state.width = element.clientWidth;
		return state.targets;
	};

	// Line mode: the line breaks change with the width and the font, so rebuild when either does. A reveal that is
	// waiting or running keeps its pieces until it finishes, then the rebuild happens; rebuilt pieces of a finished
	// reveal are put straight at their revealed position.
	const watchLines = (element, state) => {
		const rebuild = () => {
			if (state.tween && state.tween.progress() < 1) {
				state.tween.eventCallback('onComplete', rebuild);
				return;
			}

			build(element, state);
			if (state.tween) gsap.set(state.targets, prefersReducedMotion() ? { opacity: 1 } : { yPercent: revealedY });
		};

		let frame = 0;
		const scheduleRebuild = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				if (element.clientWidth !== state.width) rebuild();
			});
		};

		new ResizeObserver(scheduleRebuild).observe(element);
		if (document.fonts) {
			document.fonts.ready.then(() => {
				state.width = null;
				scheduleRebuild();
			});
		}
	};

	// Splits element's text into masked words or lines and returns the pieces that move. The original line-height is
	// handed to them through --text-reveal-line-height (word mode zeroes the container's own), kept unitless so it
	// still scales when font-size changes at a breakpoint.
	const split = (element, by = defaults.by) => {
		if (states.has(element)) return states.get(element).targets;

		const style = getComputedStyle(element);
		const lineHeight = style.lineHeight === 'normal' ? 'normal' : parseFloat(style.lineHeight) / parseFloat(style.fontSize);
		const state = { by, words: element.textContent.split(/\s+/).filter(Boolean), targets: [], tween: null, width: null };

		element.style.setProperty('--text-reveal-line-height', lineHeight);
		element.classList.add('text-reveal', `text-reveal--${by}-mode`);

		states.set(element, state);
		build(element, state);
		if (by === 'line') watchLines(element, state);

		return state.targets;
	};

	// The engine's motion on any targets: from 200% below to endY (% of their own height), staggered so target i starts
	// at delay + (startIndex + i) * stagger, like the engine's variants. The start state renders as soon as the tween is
	// created, so the targets are hidden from then on. Reduced motion: the engine's short opacity fade instead.
	const animate = (targets, options = {}) => {
		const { duration, stagger, delay, startIndex, endY } = { ...defaults, endY: revealedY, ...options };

		if (prefersReducedMotion()) {
			const reducedStagger = Math.min(stagger, 0.05);
			return gsap.fromTo(
				targets,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.24, ease: easeOut, delay: delay + startIndex * reducedStagger, stagger: reducedStagger },
			);
		}

		return gsap.fromTo(
			targets,
			{ yPercent: 200 },
			{ yPercent: endY, duration, ease: easeExpoOut, delay: delay + startIndex * stagger, stagger },
		);
	};

	// The reveal of a split element as one GSAP tween
	const tween = (element, options = {}) => {
		const state = states.get(element);
		state.tween = animate(state.targets, options);
		return state.tween;
	};

	// The same reveal for elements that aren't text, e.g. buttons. Each one needs a mask: a parent with overflow
	// hidden or clip. They settle at 0 rather than the text's -7%, because a mask the exact height of its element
	// (unlike the text masks, which have room below) would cut off the top 7% of it.
	const reveal = (elements, options = {}) => animate(elements, { endY: 0, ...options });

	// Splits and reveals element once, the first time it crosses triggerMargin px before entering the viewport.
	// Scrolling back never resets or replays it. Until then the pieces are hidden.
	const init = (element, options = {}) => {
		const { by, triggerMargin } = { ...defaults, ...options };
		split(element, by);
		element.style.visibility = 'hidden';

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				tween(element, options);
				element.style.visibility = '';
			},
			{ rootMargin: `0px 0px ${triggerMargin}px 0px` },
		);

		observer.observe(element);
	};

	return { split, tween, reveal, init };
})();
