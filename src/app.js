import { events } from "./data.js";
import { formatEventDate, formatMoney, sortEvents, summarizeEvents } from "./dashboard.js";
import { filterEventsByCategory, getEventCategories } from "./features/category-filter.js";

const eventGrid = document.querySelector("#event-grid");
const eventCount = document.querySelector("#event-count");
const ticketTotal = document.querySelector("#ticket-total");
const categoryCount = document.querySelector("#category-count");
const eventSummary = document.querySelector("#event-summary");
const today = document.querySelector("#today");
const categoryFilter = document.querySelector("#category-filter");

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
  eventSummary.textContent = `${summary.count} ${summary.count === 1 ? "event" : "events"} shown`;
  eventGrid.replaceChildren(...sortedEvents.map(createEventCard));
}

for (const category of getEventCategories(events)) {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryFilter.append(option);
}

categoryFilter.addEventListener("change", (event) => {
  renderDashboard(filterEventsByCategory(events, event.target.value));
});

today.dateTime = new Date().toISOString().slice(0, 10);
today.textContent = new Intl.DateTimeFormat("en-SG", {
  day: "numeric",
  month: "short",
  year: "numeric"
}).format(new Date());

renderDashboard(events);

