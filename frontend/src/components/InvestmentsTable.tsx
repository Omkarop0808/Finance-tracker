import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Investment {
  id: string;
  investmentName: string;
  investmentType: string;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
}

interface InvestmentsTableProps {
  investments: Investment[];
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function InvestmentsTable({
  investments,
  onDelete,
  page,
  totalPages,
  setPage,
}: InvestmentsTableProps) {
  const formatCurrency = (amount: number | string) => {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted font-sans border-collapse">
          <thead className="bg-background text-[10px] uppercase tracking-widest border-b border-border">
            <tr>
              <th className="px-6 py-4 font-normal">Asset Name</th>
              <th className="px-6 py-4 font-normal">Class</th>
              <th className="px-6 py-4 font-normal text-right">Invested</th>
              <th className="px-6 py-4 font-normal text-right">Current Value</th>
              <th className="px-6 py-4 font-normal text-right">P/L</th>
              <th className="px-6 py-4 font-normal text-right">Date Acquired</th>
              <th className="px-6 py-4 font-normal text-center">Manage</th>
            </tr>
          </thead>
          <motion.tbody 
            initial="hidden" 
            animate="visible" 
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {investments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted border-b border-border font-mono text-xs uppercase tracking-widest">
                  No assets found.
                </td>
              </tr>
            ) : (
              investments.map((inv) => {
                const invested = Number(inv.investedAmount);
                const current = Number(inv.currentValue);
                const profit = current - invested;
                const isProfit = profit >= 0;

                return (
                  <motion.tr 
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    key={inv.id} 
                    className="border-b border-border hover:bg-background/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{inv.investmentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="rounded-none border border-border px-2 py-1 text-[10px] font-mono text-muted uppercase">
                        {inv.investmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-display text-right tracking-tight whitespace-nowrap">{formatCurrency(invested)}</td>
                    <td className="px-6 py-4 font-display text-right tracking-tight whitespace-nowrap">{formatCurrency(current)}</td>
                    <td className={`px-6 py-4 font-display text-right tracking-tight whitespace-nowrap ${isProfit ? 'text-accent' : 'text-red-500'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(profit)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-muted whitespace-nowrap">{format(new Date(inv.purchaseDate), 'dd.MM.yy')}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/investments/edit/${inv.id}`}
                          className="text-muted hover:text-foreground transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(inv.id)}
                          className="text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </table>
      </div>
      
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-border bg-background/50 px-6 py-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-[10px] font-mono text-muted uppercase tracking-widest hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            &larr; Prev
          </button>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="text-[10px] font-mono text-muted uppercase tracking-widest hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
