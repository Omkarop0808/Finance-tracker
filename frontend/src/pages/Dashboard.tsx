import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import SummaryCards from '@/components/SummaryCards';
import FilterBar from '@/components/FilterBar';
import InvestmentsTable from '@/components/InvestmentsTable';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({ totalInvested: 0, currentValue: 0, profit: 0, profitPercentage: 0 });
  const [investments, setInvestments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [investmentType, setInvestmentType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchInvestments();
    }
  }, [page, investmentType, sortBy, order]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchSummary(), fetchInvestments()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    const res = await api.get('/portfolio/summary');
    setSummary(res.data);
  };

  const fetchInvestments = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      sortBy,
      order,
    });
    if (investmentType) params.append('investmentType', investmentType);

    const res = await api.get(`/investments?${params.toString()}`);
    setInvestments(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      try {
        await api.delete(`/investments/${id}`);
        toast.success('Investment deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete investment');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-background">
      <header className="border-b border-border bg-background px-6 py-5 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              MULTIPLY
            </h1>
            <span className="text-xs font-mono text-accent">/ TERMINAL</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-muted hover:text-foreground transition-colors uppercase tracking-widest"
          >
            [ Sign out ]
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted">01</span>
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-xs font-mono text-muted uppercase tracking-widest">Portfolio Summary</h2>
          </div>
          <SummaryCards summary={summary} />
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted">02</span>
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-xs font-mono text-muted uppercase tracking-widest">Active Assets</h2>
          </div>
          
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-background/50">
              <FilterBar
                investmentType={investmentType}
                setInvestmentType={setInvestmentType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                order={order}
                setOrder={setOrder}
              />
            </div>
            <InvestmentsTable
              investments={investments}
              onDelete={handleDelete}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </motion.section>
      </main>
    </div>
  );
}
