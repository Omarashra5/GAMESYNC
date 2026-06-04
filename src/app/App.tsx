import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { GamesProvider } from "./context/GamesContext";

function App() {
  return (
      <AuthProvider>
        <GamesProvider>
          <RouterProvider router={router} />
        </GamesProvider>
      </AuthProvider>
  );
}

export default App;