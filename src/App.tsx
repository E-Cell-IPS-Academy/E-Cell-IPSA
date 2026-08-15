import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./shared/feedback";
import ECellLoader from "./components/core/Loader";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(true);

  if (showLoader) {
    return <ECellLoader onComplete={() => setShowLoader(false)} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
