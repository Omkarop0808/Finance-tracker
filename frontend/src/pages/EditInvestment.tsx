import InvestmentForm from '@/components/InvestmentForm';
import { useParams } from 'react-router-dom';

export default function EditInvestmentPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-background p-4 md:p-12">
      <InvestmentForm investmentId={id} />
    </div>
  );
}
