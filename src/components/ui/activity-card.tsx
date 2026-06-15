import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActivityCardProps {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  href?: string;
}

export function ActivityCard({ 
  title, 
  category, 
  description, 
  imageUrl,
  href = "#"
}: ActivityCardProps) {
  return (
    <div className="group flex flex-col h-full bg-resort-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-resort-sand">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-resort-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-resort-cocoa">
          {category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl text-resort-cocoa mb-3 group-hover:text-resort-terracotta transition-colors">{title}</h3>
        <p className="text-resort-cocoa/80 text-sm leading-relaxed mb-6 flex-grow">
          {description}
        </p>
        
        <Link 
          href={href} 
          className="inline-flex items-center space-x-2 text-resort-olive hover:text-resort-terracotta transition-colors text-xs font-bold tracking-widest uppercase"
        >
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
