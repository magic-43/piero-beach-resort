interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({ 
  subtitle, 
  title, 
  align = "center", 
  theme = "light",
  className = "" 
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  
  return (
    <div className={`mb-10 md:mb-16 ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {subtitle && (
        <span className={`block text-sm tracking-[0.2em] uppercase mb-4 font-semibold ${isDark ? "text-resort-sand" : "text-resort-olive"}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl leading-tight ${isDark ? "text-resort-white" : "text-resort-cocoa"}`}>
        {title}
      </h2>
    </div>
  );
}
