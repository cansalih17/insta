import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import PostShare from "./pages/PostShare";
import UserFollowers from "./pages/UserFollowers";
import useAuth from "./custom-hooks/useAuth.js";
import ProfileUpdate from "./pages/ProfileUpdate";

function App() {
  const { currentUser } = useAuth();

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header /> <Home />
            </>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <>
              <Header /> <ProfilePage />
            </>
          }
        />
        <Route
          path="/detail/:postId"
          element={
            <>
              <Header /> <PostDetail />
            </>
          }
        />
        <Route
          path="/post-share"
          element={
            <>
              <Header /> <PostShare />
            </>
          }
        />
        <Route
          path="/followers/:username"
          element={
            <>
              <Header /> <UserFollowers />
            </>
          }
        />
        <Route
          path="/update/:username"
          element={
            currentUser ? (
              <>
                <Header /> <ProfileUpdate />
              </>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <>
                <Header /> <Home />
              </>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? (
              <>
                <Header /> <Home />
              </>
            ) : (
              <Register />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
