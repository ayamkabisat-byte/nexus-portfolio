import { useEffect, useRef } from 'react';
import { BOOKS } from '../data/content';
import { gsap } from '../lib/gsap';
import './WorksSection.css';

const ARC = [
  { x: -0.43, y: 0.1, rotateY: 58, rotateZ: -10, scale: 0.58, z: -210 },
  { x: -0.28, y: -0.05, rotateY: 40, rotateZ: -6, scale: 0.74, z: -110 },
  { x: -0.11, y: -0.15, rotateY: 17, rotateZ: -2, scale: 0.92, z: 0 },
  { x: 0.1, y: -0.14, rotateY: -15, rotateZ: 2, scale: 0.98, z: 30 },
  { x: 0.28, y: -0.04, rotateY: -39, rotateZ: 6, scale: 0.76, z: -100 },
  { x: 0.43, y: 0.11, rotateY: -58, rotateZ: 10, scale: 0.58, z: -210 },
];

export function WorksSection({ onOpenBook }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = stageRef.current;
      const cards = gsap.utils.toArray('.cinematic-book', deckRef.current);

      const dimensions = () => {
        const card = cards[0];
        return {
          width: stage.clientWidth,
          height: stage.clientHeight,
          cardWidth: card.offsetWidth,
          cardHeight: card.offsetHeight,
        };
      };

      const arcPose = (index, axis) => {
        const d = dimensions();
        const pose = ARC[index % ARC.length];
        if (axis === 'x') return d.width * pose.x;
        if (axis === 'y') return d.height * pose.y;
        return pose[axis];
      };

      const gridPose = (index, axis) => {
        const d = dimensions();
        const column = index % 3;
        const row = Math.floor(index / 3);
        const gapX = Math.min(64, d.width * 0.045);
        const gapY = Math.min(44, d.height * 0.055);
        if (axis === 'x') return (column - 1) * (d.cardWidth + gapX);
        return (row - 0.5) * (d.cardHeight + gapY) - 6;
      };

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 0.9,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        cards,
        {
          x: (index) => arcPose(index, 'x'),
          y: (index) => arcPose(index, 'y'),
          z: (index) => arcPose(index, 'z'),
          rotateY: (index) => arcPose(index, 'rotateY'),
          rotateZ: (index) => arcPose(index, 'rotateZ'),
          scale: (index) => arcPose(index, 'scale'),
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.18,
          stagger: 0.025,
        },
        0,
      );

      timeline.to(
        cards,
        {
          x: (index) => arcPose(index, 'x') - dimensions().width * 0.055,
          y: (index) => arcPose(index, 'y') - dimensions().height * 0.025,
          rotateY: (index) => arcPose(index, 'rotateY') * 0.72,
          rotateZ: (index) => arcPose(index, 'rotateZ') * 0.7,
          duration: 0.32,
          stagger: 0.018,
        },
        0.12,
      );

      timeline.to(
        cards,
        {
          x: (index) => gridPose(index, 'x'),
          y: (index) => gridPose(index, 'y'),
          z: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          duration: 0.82,
          stagger: 0.035,
          ease: 'power3.inOut',
        },
        0.38,
      );

      timeline.to('.works-display-copy', { opacity: 0, y: -20, duration: 0.24 }, 0.38);
      timeline.to('.works-grid-copy', { opacity: 1, y: 0, duration: 0.28 }, 0.82);
      timeline.to('.works-kinetic-title', { scale: 1.055, opacity: 0.035, duration: 0.7 }, 0.3);
      timeline.to('.works-progress-fill', { scaleX: 1, duration: 1.02 }, 0.05);

      return () => timeline.kill();
    });

    mm.add('(max-width: 860px), (prefers-reduced-motion: reduce)', () => {
      const cards = gsap.utils.toArray('.cinematic-book', deckRef.current);
      gsap.set(cards, { clearProps: 'all' });
      const reveal = gsap.fromTo(
        cards,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: deckRef.current,
            start: 'top 82%',
            once: true,
          },
        },
      );
      return () => reveal.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="works" ref={sectionRef} className="cinematic-works" aria-labelledby="works-title">
      <div ref={stageRef} className="cinematic-stage">
        <div className="works-ambient works-ambient-one" />
        <div className="works-ambient works-ambient-two" />
        <div className="works-orbit works-orbit-one" />
        <div className="works-orbit works-orbit-two" />

        <header className="works-stage-header">
          <div>
            <span className="works-kicker">Selected fiction / 2026</span>
            <h2 id="works-title">Featured Works</h2>
          </div>
          <span className="works-count">{String(BOOKS.length).padStart(2, '0')} novels</span>
        </header>

        <div className="works-kinetic-title" aria-hidden="true">
          STORIES BETWEEN<br />WORLDS
        </div>

        <div ref={deckRef} className="cinematic-deck">
          {BOOKS.map((book, index) => (
            <button
              key={book.id}
              type="button"
              className="cinematic-book"
              data-cursor="hover"
              aria-label={`Open ${book.title}`}
              onClick={() => onOpenBook(book)}
            >
              <span className="cinematic-book-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="cinematic-book-cover">
                <img
                  src={book.src}
                  alt={`${book.title} book cover`}
                  onError={(event) => {
                    if (!event.target.src.includes('placehold')) {
                      event.target.src = `https://placehold.co/400x600/0b1428/00F0FF?text=${book.title}`;
                    }
                  }}
                />
                <span className="cinematic-book-shine" />
              </span>
              <span className="cinematic-book-meta">
                <span className="cinematic-book-genre">{book.genre}</span>
                <strong>{book.title}</strong>
                <span className="cinematic-book-action">Open story <span aria-hidden="true">↗</span></span>
              </span>
            </button>
          ))}
        </div>

        <div className="works-display-copy">
          <p>Six stories moving through fractured realities, buried evidence, scent, memory, and power.</p>
          <span>Scroll to assemble the collection</span>
        </div>

        <div className="works-grid-copy" aria-hidden="true">
          <span>Collection assembled</span>
          <span>Choose a cover to enter its world</span>
        </div>

        <div className="works-progress" aria-hidden="true">
          <span className="works-progress-fill" />
        </div>
      </div>
    </section>
  );
}
