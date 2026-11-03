import { events } from "./data.js";
import { formatEventDate, formatMoney, sortEvents, summarizeEvents } from "./dashboard.js";
import { getCapacityStatus } from "./features/capacity-status.js";

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

  const capacity = getCapacityStatus(event);
  const capacityStatus = document.createElement("div");
  capacityStatus.className = "capacity-status";
  capacityStatus.dataset.level = capacity.level;

  const capacityCopy = document.createElement("div");
  capacityCopy.className = "capacity-copy";
  appendTextElement(capacityCopy, "strong", "", capacity.label);
  appendTextElement(capacityCopy, "span", "", `${capacity.attending} of ${capacity.capacity} attending`);

  const capacityTrack = document.createElement("div");
  capacityTrack.className = "capacity-track";
  capacityTrack.setAttribute("role", "progressbar");
  capacityTrack.setAttribute("aria-label", `Attendance for ${event.title}`);
  capacityTrack.setAttribute("aria-valuemin", "0");
  capacityTrack.setAttribute("aria-valuemax", String(capacity.capacity));
  capacityTrack.setAttribute("aria-valuenow", String(capacity.attending));
  const capacityFill = document.createElement("div");
  capacityFill.className = "capacity-fill";
  capacityFill.style.width = `${capacity.percentage}%`;
  capacityTrack.append(capacityFill);
  capacityStatus.append(capacityCopy, capacityTrack);
  content.append(capacityStatus);
  appendTextElement(content, "span", "category", event.category);

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

