export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white border-b border-cream-300 py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-light text-forest-500 tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sage-500 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
