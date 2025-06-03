import { Works } from "@/features/explorer/components/Works";
import { getGlobalWorksLayout } from "@/features/layouts/components/explorer/ExplorerLayout";

export default function WorksPage() {
  return (
    <Works />
  );
}



WorksPage.getLayout = getGlobalWorksLayout;