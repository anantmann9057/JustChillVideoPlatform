import { createContext, useContext, useState } from "react";
import { BounceLoader } from "react-spinners";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {isLoading ? (
        <div style={overlayStyle}>
          <div>
            <BounceLoader
              className=""
              color={"red"}
              loading={true}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      ) : null}
      {children}
    </LoadingContext.Provider>
  );
};
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
export const useLoading = () => useContext(LoadingContext);
