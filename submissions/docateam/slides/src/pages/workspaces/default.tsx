import { getGlobalDefaultLayout } from "@/features/layouts/components/explorer/ExplorerLayout";
import { SelectionArea } from "@viselect/react";
import React from "react";

export default function DefaultPage() {
  return (
    <>
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
        <div>
          <div className="explorer__container">
            <div className="explorer__content" style={{ padding: "0px" }}>
              <React.Suspense fallback={<div>Chargement...</div>}>
                <iframe
                  src="http://localhost:1999/"
                  title="External Content"
                  style={{ width: "100%", height: "800px", border: "none" }}
                  loading="lazy"
                />
              </React.Suspense>
            </div>
          </div>
        </div>
      </SelectionArea>
    </>
  );
}

DefaultPage.getLayout = getGlobalDefaultLayout;
