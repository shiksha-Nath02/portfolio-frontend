import { useState, useEffect } from "react";

export default function useScrollSpy(sectionIds) {
const [activeId, setActiveId] = useState("");

useEffect(() => {
if (!sectionIds || sectionIds.length === 0) return;

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries.filter((entry) => entry.isIntersecting);
    if (visibleEntries.length > 0) {
      // Sort by their position in the DOM to ensure we pick the top-most visible
      visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      setActiveId(visibleEntries[0].target.id);
    }
  },
  { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
);

sectionIds.forEach((id) => {
  const element = document.getElementById(id);
  if (element) observer.observe(element);
});

return () => observer.disconnect();


}, [sectionIds]);

return activeId;
}
