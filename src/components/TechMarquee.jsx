"use client";

const techItems = [
  "Python", "TensorFlow", "YOLO", "5G / O-RAN", "AWS", "Docker",
  "Raspberry Pi", "STM32", "C++", "MATLAB", "Computer Vision",
  "Edge AI", "Flutter", "Firebase", "Linux", "Hailo AI",
];

const techItemsRow2 = [
  "srsRAN", "Open5GS", "USRP B210", "Deep Learning", "Flask",
  "PCB Design", "Solidworks", "KiCad", "GitHub Actions", "Meta Llama",
  "CST Studio", "RF Design", "Cisco DevNet", "Streamlit", "DynamoDB", "Lambda",
];

function MarqueeRow({ items, direction = "left" }) {
  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-r from-[#f8f7f4] dark:from-[#0a0a0a] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 bg-gradient-to-l from-[#f8f7f4] dark:from-[#0a0a0a] to-transparent" />

      <div className={`flex gap-3 md:gap-4 w-max ${animClass}`}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 hover:border-purple-500/50 hover:text-purple-500 dark:hover:text-purple-300 hover:bg-purple-500/5 transition-all duration-300 cursor-default whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="py-8 md:py-12 px-4 md:px-8 lg:px-16">
      {/* Glassmorphism card with animated gradient border */}
      <div
        className="rounded-2xl p-[1px] animate-border-flow"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.45) 0%, rgba(255,255,255,0.06) 35%, rgba(59,130,246,0.45) 65%, rgba(168,85,247,0.45) 100%)",
          backgroundSize: "300% 300%",
        }}
      >
        <div className="rounded-2xl bg-[#f8f7f4]/85 dark:bg-[#0a0a0a]/85 backdrop-blur-sm overflow-hidden py-6">
          <div className="space-y-3 md:space-y-4">
            <MarqueeRow items={techItems} direction="left" />
            <MarqueeRow items={techItemsRow2} direction="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
