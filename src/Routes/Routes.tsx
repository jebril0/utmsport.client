import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import BookingPage from "../Pages/BookingPage/BookingPage";
import PaymentPage from "../Pages/PaymentPage/PaymentPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import Registration from "../Components/Registration/Registration";
import StudentDashboardPage from "../Pages/StudentDashboardPage/StudentDashboardPage";
import BookingVenuList from "../Components/BookingVenuList/BookingVenuList";
import Payment from "../Components/Payment/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> }, // Default route for the homepage
      { path: "payment", element: <PaymentPage /> }, // Payment page
      { path: "reg", element: <Registration /> }, // Registration page
      { path: "login", element: <LoginPage /> }, // Login page
      { path: "booking", element: <BookingPage /> }, // Booking page
      { path: "StudentDashboard", element: <StudentDashboardPage /> }, // Student dashboard
      { path: "venues", element: <BookingVenuList /> }, // Venue list page
      { path: "payment-confirmation", element: <Payment /> }, // Payment confirmation page
      //{ path: "staff", element: <StaffPage /> }, // Staff page
    ],
  },
]);