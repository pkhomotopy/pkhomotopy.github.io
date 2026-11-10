(function () {
  "use strict";

  const seminar = window.SIYUAN_SEMINAR;
  let boundaryRefreshTimer;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function eventStart(talk) {
    const time = /^\d{2}:\d{2}$/.test(talk.time || "") ? talk.time : "23:59";
    return new Date(`${talk.date}T${time}:00+08:00`);
  }

  function eventEnd(talk) {
    const start = eventStart(talk);
    if (!talk.time) return start;

    const duration = Number(talk.durationMinutes) || seminar.defaultDurationMinutes || 120;
    return new Date(start.getTime() + duration * 60 * 1000);
  }

  function formatDate(talk, includeWeekday) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: seminar.timeZone,
      weekday: includeWeekday ? "long" : undefined,
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(eventStart(talk));
  }

  function formatMonth(talk) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: seminar.timeZone,
      month: "short",
    }).format(eventStart(talk));
  }

  function formatDay(talk) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: seminar.timeZone,
      day: "2-digit",
    }).format(eventStart(talk));
  }

  function formatTime(talk) {
    if (!talk.time) return "";

    return new Intl.DateTimeFormat("en-US", {
      timeZone: seminar.timeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(eventStart(talk));
  }

  function dateTimeValue(talk) {
    return talk.time ? `${talk.date}T${talk.time}:00+08:00` : talk.date;
  }

  function titleOf(talk) {
    return talk.title?.trim() || "Title to be announced";
  }

  function talkUrl(talk) {
    const prefix = document.body.dataset.rootPath || "";
    return `${prefix}${seminar.yearPath}#${encodeURIComponent(talk.id)}`;
  }

  function dateBlock(talk, past) {
    return `
      <div class="talk-date${past ? " talk-date--past" : ""}" aria-hidden="true">
        <span class="talk-date__month">${escapeHtml(formatMonth(talk))}</span>
        <span class="talk-date__day">${escapeHtml(formatDay(talk))}</span>
      </div>`;
  }

  function talkMeta(talk) {
    const items = [
      `<span><strong>Date:</strong> <time datetime="${escapeHtml(dateTimeValue(talk))}">${escapeHtml(formatDate(talk, false))}</time></span>`,
    ];

    const time = formatTime(talk);
    if (time) {
      items.push(`<span><strong>Time:</strong> ${escapeHtml(time)}, ${escapeHtml(seminar.timeZoneLabel)}</span>`);
    }

    if (talk.location?.trim()) {
      items.push(`<span><strong>Location:</strong> ${escapeHtml(talk.location)}</span>`);
    }

    return `<div class="talk-meta" aria-label="Talk details">${items.join("")}</div>`;
  }

  function abstractParagraphs(abstract) {
    return String(abstract || "")
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
      .join("");
  }

  function resourceLinks(resources) {
    if (!Array.isArray(resources) || resources.length === 0) return "";

    const links = resources
      .filter((resource) => resource?.label && resource?.url)
      .map((resource) => {
        const url = resolveResourceUrl(resource.url);
        if (!url) return "";
        const external = /^https?:\/\//i.test(url);
        const attributes = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeHtml(url)}"${attributes}>${escapeHtml(resource.label)}</a>`;
      })
      .filter(Boolean);

    if (links.length === 0) return "";
    return `<p class="resource-links"><strong>Resources:</strong> ${links.join('<span aria-hidden="true">·</span>')}</p>`;
  }

  function resolveResourceUrl(value) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || /^(?:mailto:|\/|#)/i.test(url)) return url;
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "";

    const prefix = document.body.dataset.rootPath || "";
    return `${prefix}${url.replace(/^\.\//, "")}`;
  }

  function detailsPanel(talk, featured) {
    const abstract = abstractParagraphs(talk.abstract);
    const resources = resourceLinks(talk.resources);
    if (!abstract && !resources) return "";

    let summary = "View resources";
    if (abstract && resources) summary = featured ? "See full abstract and resources" : "View abstract and resources";
    else if (abstract) summary = featured ? "See full abstract" : "View abstract";

    return `
      <details class="talk-details">
        <summary>${summary}</summary>
        <div class="talk-details__body">${abstract}${resources}</div>
      </details>`;
  }

  function statusTags(talk, featured) {
    const tags = [];
    if (talk.cancelled) tags.push('<span class="status-tag status-tag--cancelled">Cancelled</span>');
    else if (featured) tags.push('<span class="status-tag">Next talk</span>');

    if (talk.location?.trim()) {
      tags.push(`<span class="in-person-tag">In person · ${escapeHtml(talk.location)}</span>`);
    }

    return tags.length ? `<div class="talk-status-row">${tags.join("")}</div>` : "";
  }

  function fullTalkCard(talk, options) {
    const featured = Boolean(options?.featured);
    const past = Boolean(options?.past);
    const classes = ["talk-card"];
    if (featured) classes.push("talk-card--featured");
    if (past) classes.push("talk-card--past");

    return `
      <article id="${escapeHtml(talk.id)}" class="${classes.join(" ")}">
        ${dateBlock(talk, past)}
        <div class="talk-card__content">
          ${statusTags(talk, featured)}
          <p class="talk-speaker">${escapeHtml(talk.speaker)}</p>
          <p class="talk-affiliation">${escapeHtml(talk.affiliation)}</p>
          <h3>${escapeHtml(titleOf(talk))}</h3>
          ${talkMeta(talk)}
          ${detailsPanel(talk, featured)}
        </div>
      </article>`;
  }

  function homeFeaturedCard(talk) {
    const hasDetails = Boolean(talk.abstract?.trim()) || (talk.resources?.length || 0) > 0;
    const action = hasDetails ? "Read the full abstract" : "View the full schedule";

    return `
      <article class="talk-card talk-card--featured">
        ${dateBlock(talk, false)}
        <div class="talk-card__content">
          ${statusTags(talk, true)}
          <p class="talk-speaker">${escapeHtml(talk.speaker)}</p>
          <p class="talk-affiliation">${escapeHtml(talk.affiliation)}</p>
          <h3>${escapeHtml(titleOf(talk))}</h3>
          ${talkMeta(talk)}
          <p class="talk-card__action"><a class="text-link" href="${escapeHtml(talkUrl(talk))}">${action}</a></p>
        </div>
      </article>`;
  }

  function compactUpcoming(talk) {
    const time = formatTime(talk);
    const meta = time ? `${time}, ${seminar.timeZoneLabel}` : "Time to be announced";

    return `
      <a class="upcoming-preview" href="${escapeHtml(talkUrl(talk))}">
        <span class="upcoming-preview__date" aria-hidden="true">
          <small>${escapeHtml(formatMonth(talk))}</small><strong>${escapeHtml(formatDay(talk))}</strong>
        </span>
        <span class="upcoming-preview__content">
          ${talk.cancelled ? '<span class="upcoming-preview__status status-tag status-tag--cancelled">Cancelled</span>' : ""}
          <time class="visually-hidden" datetime="${escapeHtml(dateTimeValue(talk))}">${escapeHtml(formatDate(talk, false))}. </time>
          <span class="upcoming-preview__speaker">${escapeHtml(talk.speaker)} <small>${escapeHtml(talk.affiliation)}</small></span>
          <span class="upcoming-preview__title">${escapeHtml(titleOf(talk))}</span>
          <span class="upcoming-preview__meta">${escapeHtml(meta)}</span>
        </span>
        <span class="upcoming-preview__arrow" aria-hidden="true">→</span>
      </a>`;
  }

  function emptyState(message) {
    return `<div class="schedule-empty"><p>${escapeHtml(message)}</p></div>`;
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }

  function isValidTime(value) {
    if (!value) return true;
    if (!/^\d{2}:\d{2}$/.test(value)) return false;
    const [hour, minute] = value.split(":").map(Number);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  }

  function validTalks() {
    if (!seminar || !Array.isArray(seminar.talks)) return { talks: [], invalidCount: 0 };

    const seen = new Set();
    let invalidCount = 0;
    const talks = seminar.talks
      .filter((talk) => talk && talk.published !== false)
      .filter((talk) => {
        const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(talk.id || "")
          && Boolean(talk.speaker)
          && isValidDate(talk.date)
          && isValidTime(talk.time)
          && !seen.has(talk.id);
        if (!valid) console.error("Invalid or duplicate seminar talk record:", talk);
        if (!valid) invalidCount += 1;
        if (valid) seen.add(talk.id);
        return valid;
      })
      .sort((a, b) => eventStart(a) - eventStart(b));

    return { talks, invalidCount };
  }

  function showDataWarning(invalidCount) {
    document.querySelectorAll(".schedule-data-warning").forEach((warning) => warning.remove());
    if (!invalidCount) return;

    const seminarNote = document.querySelector(".seminar-note");
    if (!seminarNote) return;

    const warning = document.createElement("div");
    warning.className = "schedule-data-warning";
    warning.setAttribute("role", "status");
    warning.textContent = "Schedule notice: one or more talk records could not be displayed. Please contact the organizers.";
    seminarNote.insertAdjacentElement("afterend", warning);
  }

  function scheduleBoundaryRefresh(talks, now) {
    window.clearTimeout(boundaryRefreshTimer);
    const nextBoundary = talks
      .map(eventEnd)
      .filter((date) => date > now)
      .sort((a, b) => a - b)[0];

    if (!nextBoundary) return;
    const oneDay = 24 * 60 * 60 * 1000;
    const delay = Math.min(nextBoundary.getTime() - now.getTime() + 1000, oneDay);
    boundaryRefreshTimer = window.setTimeout(render, Math.max(delay, 1000));
  }

  function renderHomepage(talks, now) {
    const nextSlot = document.getElementById("home-next-talk");
    if (!nextSlot) return;

    const future = talks.filter((talk) => eventEnd(talk) >= now);
    const next = future.find((talk) => !talk.cancelled);
    const later = future.filter((talk) => talk !== next);
    const nextDate = document.getElementById("home-next-date");

    if (next) {
      nextDate.textContent = formatDate(next, true);
      nextSlot.innerHTML = homeFeaturedCard(next);
    } else {
      nextDate.textContent = "";
      nextSlot.innerHTML = emptyState("The next talk has not yet been announced.");
    }

    const laterSection = document.getElementById("home-upcoming-section");
    const laterSlot = document.getElementById("home-upcoming-talks");
    if (laterSection && laterSlot) {
      laterSection.hidden = later.length === 0;
      laterSlot.innerHTML = later.slice(0, 2).map(compactUpcoming).join("");
    }
  }

  function renderYearPage(talks, now) {
    const nextSlot = document.getElementById("year-next-talk");
    if (!nextSlot) return;

    const future = talks.filter((talk) => eventEnd(talk) >= now);
    const past = talks.filter((talk) => eventEnd(talk) < now).reverse();
    const next = future.find((talk) => !talk.cancelled);
    const later = future.filter((talk) => talk !== next);
    const nextDate = document.getElementById("year-next-date");

    if (next) {
      nextDate.textContent = formatDate(next, true);
      nextSlot.innerHTML = fullTalkCard(next, { featured: true, past: false });
    } else {
      nextDate.textContent = "";
      nextSlot.innerHTML = emptyState("The next talk has not yet been announced.");
    }

    const laterSection = document.getElementById("later-talks-section");
    const laterSlot = document.getElementById("year-upcoming-talks");
    if (laterSection && laterSlot) {
      laterSection.hidden = later.length === 0;
      laterSlot.innerHTML = later.map((talk) => fullTalkCard(talk, { featured: false, past: false })).join("");
    }

    const pastSlot = document.getElementById("year-past-talks");
    if (pastSlot) {
      pastSlot.innerHTML = past.length
        ? past.map((talk) => fullTalkCard(talk, { featured: false, past: true })).join("")
        : emptyState("No past talks are listed for this academic year yet.");
    }
  }

  function openTargetedTalk() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const talk = document.getElementById(id);
    if (!talk || !talk.classList.contains("talk-card")) return;

    const details = talk.querySelector("details");
    if (details) details.open = true;
    requestAnimationFrame(() => talk.scrollIntoView({ block: "start" }));
  }

  function finishRendering() {
    if (window.MathJax?.Hub?.Queue) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, document.body], openTargetedTalk);
    } else {
      openTargetedTalk();
    }
  }

  function showDataError() {
    ["home-next-talk", "year-next-talk", "year-past-talks"].forEach((id) => {
      const slot = document.getElementById(id);
      if (slot) slot.innerHTML = emptyState("The schedule is temporarily unavailable. Please contact the organizers.");
    });
  }

  function render() {
    if (!seminar || !Array.isArray(seminar.talks)) {
      showDataError();
      return;
    }

    const result = validTalks();
    const talks = result.talks;
    const now = new Date();
    showDataWarning(result.invalidCount);
    renderHomepage(talks, now);
    renderYearPage(talks, now);
    finishRendering();
    scheduleBoundaryRefresh(talks, now);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }

  window.addEventListener("hashchange", openTargetedTalk);
})();
