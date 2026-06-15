import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  href: string;
  imageUrl: string;
  size?: "large" | "small";
}

export function CategoryCard({ title, href, imageUrl, size = "small" }: CategoryCardProps) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-2xl shadow-sm ${size === "large" ? "aspect-[4/5] md:aspect-[2/1]" : "aspect-[4/5] md:aspect-square"}`}>
      <Image 
        src={imageUrl} 
        alt={title} 
        fill 
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col items-start text-left">
        <h3 className="text-resort-white font-serif text-2xl md:text-4xl mb-4">{title}</h3>
        <div className="flex items-center text-resort-sand font-medium text-sm tracking-widest uppercase">
          Explore <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
