import { login, useAuth } from "@/features/auth/Auth";
import { ExplorerTree } from "@/features/explorer/components/tree/ExplorerTree";
import { MainLayout } from "@gouvfr-lasuite/ui-kit";
import logo from "@/assets/logo.svg";
import { HeaderRight } from "../header/Header";
import {
  ExplorerProvider,
  NavigationEvent,
  useExplorer,
} from "@/features/explorer/components/ExplorerContext";
import { useRouter } from "next/router";
import { ExplorerRightPanelContent } from "@/features/explorer/components/right-panel/ExplorerRightPanelContent";
import { GlobalLayout } from "../global/GlobalLayout";
import { useEffect } from "react";
import { WorksRightPanelContent } from "@/features/explorer/components/right-panel/WorksRightPanelContent";

export const getGlobalExplorerLayout = (page: React.ReactElement) => {
  return <GlobalExplorerLayout>{page}</GlobalExplorerLayout>;
};

export const GlobalExplorerLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GlobalLayout>
      <AuthLayout>
        <ExplorerLayout>{children}</ExplorerLayout>
      </AuthLayout>
    </GlobalLayout>
  );
};
export const getGlobalWorksLayout = (page: React.ReactElement) => {
  return <GlobalWorksLayout>{page}</GlobalWorksLayout>;
};
export const GlobalWorksLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GlobalLayout>
      <AuthLayout>
        <WorksPanelsLayout>{children}</WorksPanelsLayout>
      </AuthLayout>
    </GlobalLayout>
  );
};
export const getGlobalDefaultLayout = (page: React.ReactElement) => {
  return <GlobalDefaultLayout>{page}</GlobalDefaultLayout>;
};
export const GlobalDefaultLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GlobalLayout>
      <AuthLayout>
        <MainLayout
          enableResize
          isLeftPanelOpen={false}
          hideLeftPanelOnDesktop={true}
          icon={<img src={logo.src} alt="logo" />}
          rightHeaderContent={<HeaderRight />}
        >
          {children}
        </MainLayout>
      </AuthLayout>
    </GlobalLayout>
  );
};

/**
 * This layout is used for the explorer page.
 * It is used to display the explorer tree and the header.
 */
export const ExplorerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const itemId = router.query.id as string;
  const onNavigate = (e: NavigationEvent) => {
    router.push(`/explorer/items/${e.item.id}`);
  };

  return (
    <ExplorerProvider itemId={itemId} displayMode="app" onNavigate={onNavigate}>
      <ExplorerPanelsLayout>{children}</ExplorerPanelsLayout>
    </ExplorerProvider>
  );
};

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user === null) {
      login();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return children;
};

export const ExplorerPanelsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    rightPanelOpen,
    setRightPanelOpen,
    rightPanelForcedItem: rightPanelItem,
    isLeftPanelOpen,
    setIsLeftPanelOpen,
  } = useExplorer();

  return (
    <MainLayout
      enableResize
      rightPanelContent={<ExplorerRightPanelContent item={rightPanelItem} />}
      rightPanelIsOpen={rightPanelOpen}
      onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
      leftPanelContent={<ExplorerTree />}
      isLeftPanelOpen={isLeftPanelOpen}
      setIsLeftPanelOpen={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
      icon={<img src={logo.src} alt="logo" />}
      rightHeaderContent={<HeaderRight />}
    >
      {children}
    </MainLayout>
  );
};

export const WorksPanelsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MainLayout
      enableResize
      isLeftPanelOpen={false}
      hideLeftPanelOnDesktop={true}
      icon={<img src={logo.src} alt="logo" />}
      rightHeaderContent={<HeaderRight />}
    >
      {children}
    </MainLayout>
  );
};
