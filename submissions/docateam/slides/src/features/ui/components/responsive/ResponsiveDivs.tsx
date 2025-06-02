export const ResponsiveDivs = () => {
  return (
    <>
      <div id="responsive-tablet"></div>
    </>
  );
};

export const isTablet = () => {
  return (
    getComputedStyle(
      document.querySelector("#responsive-tablet")!
    ).getPropertyValue("display") === "block"
  );
};
