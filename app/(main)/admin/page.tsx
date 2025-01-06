import AdminSelector from "./AdminSelector";
import MainLayout from "../../components/layout/MainLayout";

export default function AdminSelectorPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <AdminSelector />
      </div>
    </MainLayout>
  );
}
