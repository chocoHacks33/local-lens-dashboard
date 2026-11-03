import { events } from "./data.js";
import { formatEventDate, formatMoney, sortEvents, summarizeEvents } from "./dashboard.js";
import { createCalendarFile, getCalendarFilename } from "./features/calendar-export.js";

const eventGrid = document.querySelector("#event-grid");
const eventCount = document.querySelector("#event-count");
const ticketTotal = document.querySelector("#ticket-total");
const categoryCount = document.querySelector("#category-count");
const eventSummary = document.querySelector("#event-summary");
const today = document.querySelector("#today");

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function downloadEventCalendar(event) {
  const blob = new Blob([createCalendarFile(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getCalendarFilename(event);
  link.click();
  URL.revokeObjectURL(url);
}

function createEventCard(event) {
  const article = document.createElement("article");
  article.className = "event-card";

  const calendarDate = new Date(event.startsAt);
  const dateBlock = document.createElement("time");
  dateBlock.className = "event-date";
  dateBlock.dateTime = event.startsAt;
  appendTextElement(dateBlock, "span", "", calendarDate.toLocaleDateString("en-SG", { month: "short" }));
  appendTextElement(dateBlock, "span", "", calendarDate.toLocaleDateString("en-SG", { day: "numeric" }));

  const content = document.createElement("div");
  appendTextElement(content, "h3", "", event.title);
  appendTextElement(content, "p", "event-meta", `${formatEventDate(event.startsAt)} · ${event.venue} · ${formatMoney(event.price)}`);
  appendTextElement(content, "p", "event-description", event.description);

  const footer = document.createElement("div");
  footer.className = "event-card-footer";
  appendTextElement(footer, "span", "category", event.category);
  const calendarButton = appendTextElement(footer, "button", "event-action", "Add to calendar");
  calendarButton.type = "button";
  calendarButton.setAttribute("aria-label", `Add ${event.title} to calendar`);
  calendarButton.addEventListener("click", () => downloadEventCalendar(event));
  content.append(footer);

  article.append(dateBlock, content);
  return article;
}

function renderDashboard(items) {
  const sortedEvents = sortEvents(items);
  const summary = summarizeEvents(sortedEvents);

  eventCount.textContent = String(summary.count);
  ticketTotal.textContent = formatMoney(summary.ticketTotal);
  categoryCount.textContent = String(summary.categoryCount);
  eventSummary.textContent = `${summary.count} curated events`;
  eventGrid.replaceChildren(...sortedEvents.map(createEventCard));
}

today.dateTime = new Date().toISOString().slice(0, 10);
today.textContent = new Intl.DateTimeFormat("en-SG", {
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(new Date());

renderDashboard(events);

