import type { Tool } from '../types/tool';
import { ConnectionBanner } from './ConnectionBanner';
import { CheckoutFlow } from './CheckoutFlow';
import { SuccessView } from './SuccessView';
import { Footer } from './Footer';

export interface CheckoutViewProps {
  selectedTool: Tool | null;
  backendUp: boolean;
  onBack: () => void;
  redirectPaymentId?: string | null;
}

export function CheckoutView({
  selectedTool,
  backendUp,
  onBack,
  redirectPaymentId,
}: CheckoutViewProps) {
  if (redirectPaymentId) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <ConnectionBanner visible={!backendUp} />
        <main className="flex-grow flex items-center justify-center p-4">
          <SuccessView paymentId={redirectPaymentId} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <ConnectionBanner visible={!backendUp} />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-6">
        <div className="bg-white w-full max-w-[420px] rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
          <CheckoutFlow
            amount={selectedTool?.price ?? 0}
            onChangeAmount={onBack}
            toolId={selectedTool?.id}
            toolName={selectedTool?.name}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
