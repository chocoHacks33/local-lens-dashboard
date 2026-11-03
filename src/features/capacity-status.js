export function getCapacityStatus(event) {
  const capacity = Math.max(0, Number(event.capacity) || 0);
  const attending = Math.min(capacity, Math.max(0, Number(event.attending) || 0));
  const remaining = Math.max(0, capacity - attending);
  const percentage = capacity === 0 ? 0 : Math.round((attending / capacity) * 100);

  if (capacity === 0 || remaining === 0) {
    return { capacity, attending, remaining, percentage, level: "sold-out", label: "Sold out" };
  }

  if (remaining <= 10 || percentage >= 85) {
    return {
      capacity,
      attending,
      remaining,
      percentage,
      level: "limited",
      label: `${remaining} ${remaining === 1 ? "seat" : "seats"} left`
    };
  }

  return { capacity, attending, remaining, percentage, level: "available", label: "Places available" };
}
