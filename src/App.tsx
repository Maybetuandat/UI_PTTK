import AppView from "./component/appView/AppView";
import { ToastProvider } from "./component/screen/managescreen/FraudLabelScreen/ToastContext";
function App() {
  return (
    <ToastProvider>
      <AppView />;
    </ToastProvider>
  );
}

export default App;
