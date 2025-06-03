import { ResponsiveDivs } from "@/features/ui/components/responsive/ResponsiveDivs";
import { SelectionArea } from "@viselect/react";
import { Button } from "@openfun/cunningham-react";
import React from "react";
import { useRouter } from "next/router";

export const Works = () => {
  const router = useRouter();
  return (
    <>
      {/* Add TopBar */}
      <div className="explorer__topbar">
        <div className="explorer__topbar__left">
          <h1 className="text-xl font-bold">Mes Prez</h1>
        </div>
        <div className="explorer__topbar__right">
          <Button
            color="primary"
            icon={<span className="material-icons">add</span>}
            onClick={() => router.push("/workspaces/default")}
          >
            Créer une nouvelle Prez
          </Button>
        </div>
      </div>

      <SelectionArea
        onBeforeStart={() => true}
        onStart={() => true}
        onMove={() => {}}
        selectables=".selectable"
        className="selection-area__container"
        features={{
          range: true,
          touch: true,
          singleTap: {
            // We do not want to allow singleTap to select items, otherwise it overrides the onClick event of the TR
            // element, and also blocks the click on the action dropdown menu. We rather implement it by ourselves.
            allow: false,
            intersect: "native",
          },
        }}
      >
        <div className="explorer__container p-6">
          <div  style={{ padding: "0px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {/* Presentation Cards */}
            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Slides Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité à l'instant</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
                <span className="badge-cc">CC</span>
              </div>
            </div>

            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Présentation CE Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité il y a 2 jours</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
              </div>
            </div>

            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Présentation CE Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité il y a 2 jours</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
              </div>
            </div>

            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Présentation CE Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité il y a 2 jours</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
              </div>
            </div>
            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Slides Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité à l'instant</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
                <span className="badge-cc">CC</span>
              </div>
            </div>
            <div className="presentation-card">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3"></div>
              <h3 className="font-medium">Slides Docaposte</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Créé par Charlotte</span>
                <span>•</span>
                <span>Édité à l'instant</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="badge-ai">AI</span>
                <span className="badge-cc">CC</span>
              </div>
            </div>

          </div>
        </div>
      </SelectionArea>
      <ResponsiveDivs />
    </>
  );
};
