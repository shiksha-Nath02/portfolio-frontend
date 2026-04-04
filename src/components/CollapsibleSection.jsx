import { useState } from "react";
import { ChevronRight } from "lucide-react";

const CollapsibleSection = ({ id, title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!children) return null;

  return (
    <section id={id} className="scroll-mt-32 mb-20 group relative">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-2xl font-bold text-slate-100 hover:text-teal-400 transition-colors duration-200 focus:outline-none"
        >
          <ChevronRight
            className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          {title}
        </button>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-2 md:pl-8">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default CollapsibleSection;