import TensorIDEContainer from "./components/TensorIDEContainer";
import { LatticeProvider } from "./context/LatticeContext";

export default function App() {
  return (
    <LatticeProvider>
      <TensorIDEContainer />
    </LatticeProvider>
  );
}
