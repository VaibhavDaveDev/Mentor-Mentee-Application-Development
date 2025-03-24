import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

export default () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-2">
        <ReactRouter />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};
