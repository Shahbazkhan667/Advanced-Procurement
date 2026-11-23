import { RequestBuilder } from "../../../components/dashboard/WorkflowPages";
export default function NewPurchaseRequestPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <RequestBuilder />
      </div>
    </div>
  );
}
