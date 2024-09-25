import React from "react";

const LumaEmbed = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <iframe
        src="https://lumalabs.ai/embed/189c0f1d-0429-45cb-8cea-3fcf767cd9d6?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=false&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=true"
        width="100%"
        height="500"
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
