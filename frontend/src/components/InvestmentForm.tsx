import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const investmentSchema = z.object({
  investmentName: z.string().min(1, 'Name is required'),
  investmentType: z.enum(['Mutual Fund', 'Stocks', 'Crypto', 'Real Estate', 'Fixed Deposit', 'Other']),
  investedAmount: z.number().min(0, 'Must be positive'),
  currentValue: z.number().min(0, 'Must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

interface Props {
  investmentId?: string;
}

export default function InvestmentForm({ investmentId }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!investmentId);
  const isEdit = !!investmentId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
  });

  useEffect(() => {
    if (investmentId) {
      const fetchInvestment = async () => {
        try {
          const res = await api.get(`/investments/${investmentId}`);
          const inv = res.data;
          reset({
            investmentName: inv.investmentName,
            investmentType: inv.investmentType,
            investedAmount: inv.investedAmount,
            currentValue: inv.currentValue,
            purchaseDate: inv.purchaseDate.split('T')[0],
          });
        } catch (error) {
          toast.error('Failed to fetch investment details');
          navigate('/dashboard');
        } finally {
          setIsFetching(false);
        }
      };
      fetchInvestment();
    }
  }, [investmentId, reset, navigate]);

  const onSubmit = async (data: InvestmentFormValues) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.put(`/investments/${investmentId}`, data);
        toast.success('Investment updated successfully!');
      } else {
        await api.post('/investments', data);
        toast.success('Investment added successfully!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save investment');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  const investmentTypes = ['Mutual Fund', 'Stocks', 'Crypto', 'Real Estate', 'Fixed Deposit', 'Other'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border shadow-2xl max-w-2xl mx-auto overflow-hidden"
    >
      <div className="flex items-center gap-4 p-6 border-b border-border bg-background/50">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted">03</span>
          <div className="w-8 h-px bg-border"></div>
          <h2 className="text-xs font-mono text-muted uppercase tracking-widest">
            {isEdit ? 'Modify Asset' : 'Register New Asset'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Asset Name</label>
            <input
              {...register('investmentName')}
              type="text"
              className="w-full bg-background border border-border px-4 py-3 text-foreground font-sans focus:border-accent focus:outline-none transition-colors"
              placeholder="e.g., Apple Stock"
            />
            {errors.investmentName && <p className="text-xs text-red-500 font-mono mt-1">{errors.investmentName.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Asset Class</label>
            <select
              {...register('investmentType')}
              className="w-full bg-background border border-border px-4 py-3 text-foreground font-sans focus:border-accent focus:outline-none transition-colors appearance-none"
            >
              <option value="">Select a class...</option>
              {investmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.investmentType && <p className="text-xs text-red-500 font-mono mt-1">{errors.investmentType.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Capital Deployed (₹)</label>
            <input
              {...register('investedAmount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full bg-background border border-border px-4 py-3 text-foreground font-display tracking-tight focus:border-accent focus:outline-none transition-colors"
              placeholder="0.00"
            />
            {errors.investedAmount && <p className="text-xs text-red-500 font-mono mt-1">{errors.investedAmount.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Current Valuation (₹)</label>
            <input
              {...register('currentValue', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full bg-background border border-border px-4 py-3 text-foreground font-display tracking-tight focus:border-accent focus:outline-none transition-colors"
              placeholder="0.00"
            />
            {errors.currentValue && <p className="text-xs text-red-500 font-mono mt-1">{errors.currentValue.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest block">Acquisition Date</label>
            <input
              {...register('purchaseDate')}
              type="date"
              className="w-full bg-background border border-border px-4 py-3 text-foreground font-mono text-sm focus:border-accent focus:outline-none transition-colors"
            />
            {errors.purchaseDate && <p className="text-xs text-red-500 font-mono mt-1">{errors.purchaseDate.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-border mt-8">
          <Link
            to="/dashboard"
            className="px-6 py-3 text-[10px] font-mono text-muted uppercase tracking-widest hover:text-foreground transition-colors border border-transparent hover:border-border"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-foreground text-background px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isEdit ? 'Commit Changes' : 'Register Asset')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
