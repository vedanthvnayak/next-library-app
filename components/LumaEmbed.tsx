import React from "react";

const LumaEmbed = () => {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
          zIndex: 1,
        }}
      ></div>

      {/* The iframe */}
      <iframe
        src="https://lumalabs.ai/embed/016ff4ce-847a-47b6-a3ba-9017339797f5?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=false&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=true"
        width="100%"
        height="600"
        frameBorder="0"
        title="Luma Embed"
        style={{
          border: "none",
          display: "block",
        }}
      ></iframe>
    </div>
  );
};

export default LumaEmbed;
