import InvestmentForm from '@/components/InvestmentForm';

export default function AddInvestmentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-background p-4 md:p-12">
      <InvestmentForm />
    </div>
  );
}
