import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SummaryCardsProps {
  summary: {
    totalInvested: number;
    currentValue: number;
    profit: number;
    profitPercentage: number;
  };
}

const NumberCounter = ({ value, isCurrency = true, isPercentage = false, colorClass = "text-foreground" }: { value: number, isCurrency?: boolean, isPercentage?: boolean, colorClass?: string }) => {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numberRef.current) return;
    
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.5,
      ease: "power3.out",
      onUpdate: () => {
        if (numberRef.current) {
          let formatted = obj.val.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          });
          
          if (isCurrency) formatted = `₹${formatted}`;
          if (isPercentage) formatted = `${formatted}%`;
          
          numberRef.current.innerText = formatted;
        }
      }
    });
  }, [value, isCurrency, isPercentage]);

  return <span ref={numberRef} className={`font-display font-medium tracking-tight ${colorClass}`}>₹0.00</span>;
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const isProfit = summary.profit >= 0;

  const cards = [
    {
      title: 'TOTAL INVESTED',
      value: summary.totalInvested,
      isCurrency: true,
      isPercentage: false,
    },
    {
      title: 'CURRENT VALUE',
      value: summary.currentValue,
      isCurrency: true,
      isPercentage: false,
    },
    {
      title: 'NET PROFIT/LOSS',
      value: Math.abs(summary.profit),
      isCurrency: true,
      isPercentage: false,
      colorClass: isProfit ? 'text-accent' : 'text-red-500',
    },
    {
      title: 'RETURN',
      value: summary.profitPercentage,
      isCurrency: false,
      isPercentage: true,
      colorClass: isProfit ? 'text-accent' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border border border-border rounded-lg overflow-hidden shadow-2xl">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface p-6 flex flex-col justify-between"
        >
          <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">{card.title}</p>
          <div className="text-3xl md:text-4xl mt-auto">
            <NumberCounter 
              value={card.value} 
              isCurrency={card.isCurrency} 
              isPercentage={card.isPercentage} 
              colorClass={card.colorClass} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
