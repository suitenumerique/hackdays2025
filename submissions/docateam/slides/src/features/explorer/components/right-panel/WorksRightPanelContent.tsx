import { Button } from "@openfun/cunningham-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const WorksRightPanelContent = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="explorer__right-panel">
      <div className="explorer__right-panel__section">
        <Button
          color="primary"
          icon={<span className="material-icons">add</span>}
          onClick={() => router.push("/workspaces/default")}
          className="w-full mb-3"
        >
          {t("explorer.rightPanel.openWorkspace")}
        </Button>

        <Button
          color="secondary"
          icon={<span className="material-icons">auto_awesome</span>}
          onClick={() => {
            // Add your AI creation logic here
            console.log("Create by AI clicked");
          }}
          className="w-full"
        >
          {t("explorer.rightPanel.createByAI")}
        </Button>
      </div>
    </div>
  );
};
