import s from "./home.module.css";

/* Draft pull-quotes pending client sign-off (BUILD-PROMPT §4.2) — rendered as
 * editorial copy only; deliberately NOT emitted as Review schema until real
 * attributed reviews are verified (schema integrity flag, §6). */
const REVIEWS = [
  {
    quote:
      "They stripped my 570S back to the shell and gave it back better than the showroom. You can see the obsession in every panel.",
    who: "James · McLaren 570S",
    source: "Google",
  },
  {
    quote:
      "Someone went into the back of me and I was dreading the whole thing. Taras handled the insurer, kept me updated, and the car came back like it never happened.",
    who: "Priya · Range Rover Sport",
    source: "Google",
  },
  {
    quote:
      "The carbon work is on another level. Bespoke kit, perfect fit, and they actually understand these cars.",
    who: "Deniz · Brabus G-Wagon",
    source: "Facebook",
  },
  {
    quote:
      "Kerbed both wheels and scuffed the bumper the week before a wedding. Booked me in, sorted it, and you'd never know. Proper people.",
    who: "Michael · BMW M4",
    source: "Google",
  },
  {
    quote:
      "Full respray on my Continental — the colour match and finish are flawless. Worth every mile of the drive to Wembley.",
    who: "Sofia · Bentley Continental",
    source: "Facebook",
  },
  {
    quote:
      "Honest quote, no upsell, and they treated my Golf with the same care as the supercars in the unit. Can't fault them.",
    who: "Tom · VW Golf",
    source: "Google",
  },
];

/** Community / Reviews — the dark chapter between the light sections:
 *  editorial serif pull-quotes over hairlines (SC Group restraint). */
export default function Reviews() {
  return (
    <section
      id="reviews"
      className={s.dark}
      data-theme="dark"
      aria-label="What our clients say"
    >
      <div className={s.inner}>
        <div>
          <p className={s.kicker} data-reveal="kicker">
            <span className={s.kickerIndex}>03</span>Community
          </p>
          <h2 className={s.h2} data-reveal="headline">
            Trusted with the cars people love&nbsp;most.
          </h2>
          <div className={s.aggregate} data-reveal="rise">
            <span className={s.aggregateNum}>96%</span>
            <span className={s.aggregateLine}>
              would recommend RT&nbsp;Performance
            </span>
            <span className={s.aggregateSub}>
              Based on 20 verified reviews · Google &amp; Facebook
            </span>
          </div>
        </div>

        <div className={s.track}>
          {REVIEWS.map((r) => (
            <figure key={r.who} className={s.card} data-reveal="rise">
              <span className={s.stars} aria-label="5 out of 5 stars">
                ★★★★★
              </span>
              <blockquote className={s.quote}>
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className={s.attribution}>
                {r.who} · <span className={s.source}>{r.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
