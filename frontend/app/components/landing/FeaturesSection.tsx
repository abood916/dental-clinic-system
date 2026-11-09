"use client";

export default function FeaturesSection() {
  const features = [
    {
      icon: "👤",
      title: "Patient Records",
      description: "Comprehensive intake, digital records, and full treatment histories for every patient.",
    },
    {
      icon: "📅",
      title: "Schedule Management",
      description: "Real-time availability, drag-and-drop scheduling, and quick appointment tracking.",
    },
    {
      icon: "📊",
      title: "Financial Tools",
      description: "Itemized billing, expense management, auto profit tracking, and real-time revenue summaries.",
    },
  ];

  return (
    <section id="features" className="w-full bg-slate-200/60 py-12 lg:py-16 px-4 sm:px-8 lg:px-16 border-t border-b border-slate-300/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything You Need to Run Your Clinic
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Powerful features packed into a clean, intuitive interface.
          </p>
        </div>

        {/* Grid Container: Responsive for Mobile, Tablet, and Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0f172a] text-white flex items-center justify-center text-xl mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}