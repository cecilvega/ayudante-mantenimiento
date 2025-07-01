import ATSelector from "./ATSelector";
import MainLayout from "../../components/layout/MainLayout";

export default function ATSelectorPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ATSelector />
      </div>
    </MainLayout>
  );
}
