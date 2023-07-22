import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "../Layouts/DefaultLayout";
import Home from "../components/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import CreatePost from "../components/Posts/CreatePost";
import SinglePostDetails from "../components/Posts/SinglePostDetails";
import UpdatePost from "../components/Posts/UpdatePost";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import NotFound from "../components/NotFound";

const MainRoutes = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<SinglePostDetails />} />
        <Route path="*" element={<NotFound />} />
        {userInfo && (
          <>
            <Route path="edit/:id" element={<UpdatePost />} />
            <Route path="newPost" element={<CreatePost />} />
            <Route path="login" element={<Navigate to={"/"} />} />
            <Route path="register" element={<Navigate to={"/"} />} />
          </>
        )}
        {!userInfo && (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="edit/:id" element={<Navigate to={"/login"} />} />
            <Route path="newPost" element={<Navigate to={"/login"} />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default MainRoutes;
