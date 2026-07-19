import s from "./home.module.css";

/* Quotes are drafts pending client sign-off — not emitted as schema.
   The section closes on a "Leave a review" CTA → RT's Google listing. */
const QUOTES = [
  {
    text: "They stripped my 570S back to the shell and gave it back better than the showroom.",
    who: "James · McLaren 570S · Google",
  },
  {
    text: "Taras handled the insurer, kept me updated, and the car came back like it never happened.",
    who: "Priya · Range Rover Sport · Google",
  },
  {
    text: "The carbon work is on another level. Bespoke kit, perfect fit.",
    who: "Deniz · Brabus G-Wagon · Facebook",
  },
  {
    text: "My Golf got the same care as the supercars in the unit. Can't fault them.",
    who: "Tom · VW Golf · Google",
  },
  {
    text: "Full respray on my Continental — the colour match and finish are flawless.",
    who: "Sofia · Bentley Continental · Facebook",
  },
  {
    text: "Kerbed both wheels the week before a wedding. Sorted it — you'd never know.",
    who: "Michael · BMW M4 · Google",
  },
];

/** 03 · Community — the reviews float continuously across the orange field
 *  (a marquee), quotes set in serif italic to set them apart from the grotesk.
 *  Content is real HTML; reduced motion halts the drift into a static row. */
export default function Reviews() {
  // duplicate the set so the marquee loops seamlessly at -50%
  const loop = [...QUOTES, ...QUOTES];

  return (
    <section
      id="reviews"
      className={`${s.chapter} ${s.chapterShort} ${s.orange} ${s.reviewsSection}`}
      data-theme="dark"
      data-chapter="Community"
      aria-label="What our clients say"
    >
      <div className={s.reviewsHead}>
        <p className={s.reviewsTitle} data-reveal="kicker">
          Community
        </p>
      </div>

      <div className={s.marquee}>
        <div className={s.track}>
          {loop.map((q, i) => (
            <figure className={s.rcard} key={i} aria-hidden={i >= QUOTES.length}>
              <p className={s.rquote}>&ldquo;{q.text}&rdquo;</p>
              <figcaption className={s.rwho}>{q.who}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <p className={s.reviewsMeta} data-reveal="rise">
        <a
          className={s.reviewLink}
          href="https://www.google.com/maps/search/?api=1&query=RT+Performance+Wembley+HA9+0LH"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave a review ↗
        </a>
      </p>
    </section>
  );
}
