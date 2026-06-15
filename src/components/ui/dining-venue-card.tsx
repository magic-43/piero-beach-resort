import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface DiningVenueCardProps {
  title: string;
  category: string;
  description: string;
  hours: string;
  imageUrl: string;
  href?: string;
}

export function DiningVenueCard({ 
  title, 
  category, 
  description, 
  hours, 
  imageUrl,
  href = "#"
}: DiningVenueCardProps) {
  return (
    <div className="group bg-resort-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-resort-sand">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          unoptimized={imageUrl.startsWith("http")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 bg-resort-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-resort-cocoa">
          {category}
        </div>
      </div>
      
      <div className="p-5 md:p-8 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl text-resort-cocoa mb-3">{title}</h3>
        <p className="text-resort-cocoa/80 text-sm leading-relaxed mb-6 flex-grow">
          {description}
        </p>
        
        <div className="flex items-center space-x-2 py-4 border-t border-b border-resort-cocoa/10 mb-6 text-xs text-resort-olive font-semibold uppercase tracking-wider">
          <Clock className="w-4 h-4 text-resort-terracotta" />
          <span>{hours}</span>
        </div>
        
        <Link 
          href={href} 
          className="inline-block text-center px-6 py-3 bg-resort-sand text-resort-cocoa hover:bg-resort-terracotta hover:text-resort-white transition-colors text-xs font-bold tracking-widest uppercase rounded w-full sm:w-auto"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
