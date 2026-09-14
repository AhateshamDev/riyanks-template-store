import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TemplatePage from "./pages/TemplatePage";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/template/:slug" element={<TemplatePage />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
