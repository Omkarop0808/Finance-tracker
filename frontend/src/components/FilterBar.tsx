import { Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

const CustomSelect = ({ 
  options, 
  value, 
  onChange,
  minWidth = "120px"
}: { 
  options: Option[]; 
  value: string; 
  onChange: (val: string) => void;
  minWidth?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={ref} style={{ minWidth }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-transparent border-b border-border py-1 text-sm text-foreground focus:outline-none transition-colors hover:border-accent"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-3 h-3 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-full min-w-max bg-surface border border-border shadow-2xl z-50 flex flex-col"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`text-left px-4 py-2 text-sm transition-colors ${
                  value === opt.value 
                    ? 'bg-accent/10 text-accent font-medium' 
                    : 'text-muted hover:bg-background/50 hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FilterBarProps {
  investmentType: string;
  setInvestmentType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  order: string;
  setOrder: (order: string) => void;
}

export default function FilterBar({
  investmentType,
  setInvestmentType,
  sortBy,
  setSortBy,
  order,
  setOrder,
}: FilterBarProps) {
  const investmentTypes: Option[] = [
    { value: '', label: 'All Classes' },
    { value: 'Mutual Fund', label: 'Mutual Fund' },
    { value: 'Stocks', label: 'Stocks' },
    { value: 'Crypto', label: 'Crypto' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Fixed Deposit', label: 'Fixed Deposit' },
    { value: 'Other', label: 'Other' }
  ];
  
  const sortOptions: Option[] = [
    { value: 'createdAt', label: 'Added Date' },
    { value: 'investedAmount', label: 'Invested Amount' },
    { value: 'currentValue', label: 'Current Value' },
    { value: 'purchaseDate', label: 'Purchase Date' },
  ];

  const orderOptions: Option[] = [
    { value: 'DESC', label: 'Descending' },
    { value: 'ASC', label: 'Ascending' },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-transparent">
      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Class</label>
          <CustomSelect 
            options={investmentTypes} 
            value={investmentType} 
            onChange={setInvestmentType} 
            minWidth="140px"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Sort By</label>
          <CustomSelect 
            options={sortOptions} 
            value={sortBy} 
            onChange={setSortBy} 
            minWidth="140px"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Order</label>
          <CustomSelect 
            options={orderOptions} 
            value={order} 
            onChange={setOrder} 
            minWidth="120px"
          />
        </div>
      </div>
      <div>
        <Link
          to="/investments/add"
          className="flex items-center gap-2 bg-foreground text-background px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          <Plus className="h-3 w-3" />
          Register Asset
        </Link>
      </div>
    </div>
  );
}
