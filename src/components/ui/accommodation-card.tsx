import Image from "next/image";
import Link from "next/link";
import { formatPHPCurrency } from "@/lib/currency";

interface AccommodationCardProps {
  title: string;
  description: string;
  capacity: string;
  imageUrl: string;
  category?: string;
  discountedPrice?: number;
  regularPrice?: number;
  price?: string;
  href?: string;
}

export function AccommodationCard({
  title,
  description,
  capacity,
  imageUrl,
  category = "Stay",
  discountedPrice,
  regularPrice,
  price,
  href = "/rooms/cabin-villa",
}: AccommodationCardProps) {
  const priceLabel =
    price ??
    (typeof discountedPrice === "number"
      ? `From ${formatPHPCurrency(discountedPrice)} / night`
      : `Good for ${capacity}`);

  return (
    <Link
      href={href}
      className="group bg-resort-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-resort-cocoa/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-resort-sand">
        <Image
          src={imageUrl}
          alt={title}
          fill
          unoptimized={imageUrl.startsWith("http")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <span className="block text-[#c4a47c] text-xs font-bold uppercase tracking-wider mb-2">
            {category}
          </span>
          <h3 className="font-serif text-2xl text-resort-cocoa mb-3 group-hover:text-resort-terracotta transition-colors">
            {title}
          </h3>
          <p className="text-resort-cocoa/70 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
            {description}
          </p>
        </div>

        <div>
          <hr className="border-resort-cocoa/10 my-4" />
          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-col">
              {typeof regularPrice === "number" && (
                <span className="text-xs text-resort-cocoa/40 line-through">
                  {formatPHPCurrency(regularPrice)}
                </span>
              )}
              <span className="text-resort-cocoa font-medium text-sm">{priceLabel}</span>
            </div>
            <span className="text-resort-terracotta font-serif text-2xl transform group-hover:translate-x-1.5 transition-transform duration-300">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
