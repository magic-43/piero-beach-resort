import Link from "next/link";
import { Check } from "lucide-react";

interface ReservationProgressProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export function ReservationProgress({ currentStep }: ReservationProgressProps) {
  const steps = [
    { num: 1, label: "DATES", href: "/reserve" },
    { num: 2, label: "ROOM", href: "/reserve/villa" },
    { num: 3, label: "GUEST", href: "/reserve/guest" },
    { num: 4, label: "REVIEW", href: "/reserve/review" },
    { num: 5, label: "PAYMENT", href: "/reserve/payment" },
  ];

  return (
    <div className="bg-resort-white py-4 md:py-6 border-b border-resort-cocoa/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-2 max-w-6xl mx-auto px-4 md:px-0 scroll-smooth">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            
            return (
              <div key={step.num} className="flex items-center shrink-0">
                <Link 
                  href={step.href}
                  className={`flex items-center space-x-1 sm:space-x-2 md:space-x-3 group shrink-0 ${
                    isCompleted || isCurrent ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <div className={`
                    w-5 h-5 sm:w-6 md:w-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold transition-colors shrink-0
                    ${isCompleted ? 'bg-resort-olive text-resort-white' : 
                      isCurrent ? 'bg-resort-terracotta text-resort-white' : 
                      'bg-resort-sand text-resort-cocoa'}
                  `}>
                    {isCompleted ? <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : step.num}
                  </div>
                  <span className={`
                    text-[9px] sm:text-xs md:text-sm tracking-wider md:tracking-widest uppercase font-medium transition-colors shrink-0
                    ${isCurrent ? 'text-resort-terracotta' : 'text-resort-cocoa'}
                    group-hover:text-resort-terracotta
                  `}>
                    {step.label}
                  </span>
                </Link>
                
                {index < steps.length - 1 && (
                  <div className="w-2 sm:w-8 md:w-16 h-[1px] bg-resort-cocoa/20 mx-1 sm:mx-3 md:mx-8 shrink-0"></div>
                )}
              </div>
            );
          })}
          <div className="w-4 md:hidden shrink-0" />
        </div>
      </div>
    </div>
  );
}
