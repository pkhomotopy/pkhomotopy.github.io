/*
 * ROUTINE SEMINAR UPDATES HAPPEN IN THIS FILE ONLY.
 *
 * - Keep each id unique, lowercase, and hyphenated.
 * - Enter dates as YYYY-MM-DD and times as HH:MM in Beijing time.
 * - String.raw preserves LaTeX such as \(K(n)\) inside titles and abstracts.
 * - Set published to false to hide a record from the rendered pages.
 * - This repository is public: never place confidential drafts in this file.
 * - Do not edit seminar-render.js for ordinary schedule changes.
 */

window.SIYUAN_SEMINAR = {
  academicYear: "2026–2027",
  timeZone: "Asia/Shanghai",
  timeZoneLabel: "Beijing time",
  defaultDurationMinutes: 120,
  yearPath: "years/2026-2027/",

  talks: [
    {
      id: "sven-van-nigtevecht",
      date: "2026-10-18",
      time: "",
      durationMinutes: 120,
      speaker: "Sven van Nigtevecht",
      affiliation: "University of Bonn",
      title: String.raw`Synthetic modular forms`,
      abstract: String.raw`Topological modular forms play an essential role in modern homotopy theory, in particular in computations of the homotopy groups of spheres. This requires an understanding of the homotopy groups of tmf. In this talk, I will explain a longstanding circularity in the literature on this computation, and a resolution of it through the use of a synthetic spectrum called Smf (synthetic modular forms). The construction of Smf is part of a larger result that lifts spectral sequences to synthetic spectra, allowing for comparisons to Adams--Novikov spectral sequences as well as a host of computational techniques to be applied. This is joint work with Christian Carrick and Jack Davies.`,
      location: "",
      resources: [
        { label: "YouTube", url: "https://www.youtube.com/watch?v=qKvSvxU31dU" },
        { label: "Bilibili", url: "https://www.bilibili.com/video/BV1dbnw6XEqW/" },
      ],
      cancelled: false,
      published: true,
    },

    {
      id: "william-balderrama",
      date: "2026-11-02",
      time: "",
      durationMinutes: 120,
      speaker: "William Balderrama",
      affiliation: "University of Bonn",
      title: String.raw`Smooth knots in the metastable range via orthogonal calculus`,
      abstract: String.raw`The homotopy groups of spheres are closely tied to classification problems in differential topology. Seminal work of Haefliger gave a homotopy classification of the smooth knot group \(C_n^q = \pi_0 \mathrm{Emb}(S^n,S^{n+q})\) in codimension \(q\geq 3\) in terms of the fiber of the unstable \(J\)-homomorphism. I will describe how this classification may be combined with the methods of Weiss's orthogonal calculus to identify the groups \(C_n^q\) in the metastable range \(n \leq 3(q-2)\) with the homotopy groups of a certain Thom spectrum over \(BO(2)\).`,
      location: "",
      resources: [],
      cancelled: false,
      published: true,
    },

    {
      id: "yingxin-li",
      date: "2026-11-16",
      time: "16:00",
      durationMinutes: 120,
      speaker: "Yingxin Li",
      affiliation: "Nankai University",
      title: String.raw`An equivariant Landweber exact functor theorem`,
      abstract: String.raw`Chromatic homotopy theory studies the periodic phenomena in stable homotopy theory through formal groups. For a compact abelian Lie group \(G\), these ideas admit natural \(G\)-equivariant refinements. In this talk, I will give an overview of \(G\)-equivariant formal groups, and then give an equivariant version of the Landweber exact functor theorem, which provides a criterion for when a \(G\)-formal group law over a graded ring \(R\) can be realized by a \(G\)-equivariant complex oriented cohomology theory. As an application, I will discuss the Landweber exactness of \(G\)-formal groups arising from non-equivariant formal group laws and from elliptic curves.`,
      location: "",
      resources: [],
      cancelled: false,
      published: true,
    },

    {
      id: "rin-ray",
      date: "2026-11-30",
      time: "16:00",
      durationMinutes: 120,
      speaker: "Rin Ray",
      affiliation: "University of Münster",
      title: String.raw`Title to be announced`,
      abstract: "",
      location: "",
      resources: [],
      cancelled: false,
      published: true,
    },

    {
      id: "ben-knudsen",
      date: "2026-12-15",
      time: "10:00",
      durationMinutes: 120,
      speaker: "Ben Knudsen",
      affiliation: "Colorado State University",
      title: String.raw`Title to be announced`,
      abstract: "",
      location: "",
      resources: [],
      cancelled: false,
      published: true,
    },

    // NEW TALK TEMPLATE — copy this block and paste it above this comment.
    /*
    {
      id: "firstname-lastname",
      date: "2027-01-01",
      time: "16:00",
      durationMinutes: 120,
      speaker: "Speaker name",
      affiliation: "University",
      title: String.raw`Title to be announced`,
      abstract: String.raw`Paste the abstract here. LaTeX such as \(K(n)\) works normally.`,
      location: "",
      resources: [
        // { label: "YouTube", url: "https://..." },
      ],
      cancelled: false,
      published: true,
    },
    */
  ],
};
