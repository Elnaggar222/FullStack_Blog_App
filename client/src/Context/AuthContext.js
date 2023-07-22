import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      async function checkToken() {
        try {
          const response = await fetch("http://localhost:4000/checkToken", {
            credentials: "include",
          });
          const userInfo = await response.json();
          setUserInfo(userInfo);
        } catch (error) {
          console.error(error);
          toast.error("server Error");
          setUserInfo(null);
        }
      }
      checkToken();
      isMount.current = true;
    }
  }, []);

  async function register(username, password) {
    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const resObject = await res.json();
      if (res.status === 200) {
        setUserInfo(resObject);
        toast.success("Registration successful");
      } else {
        setUserInfo(resObject);
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  }

  async function login(username, password) {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        // headers: { "Content-Type": "application/json" },
        // To save our (cookie) in (react app) or (browser).You can find token in both (1-Request Headers and 2- Response Headers)
        credentials: "include",
      });
      const resObject = await response.json();
      if (response.ok) {
        setUserInfo(resObject);
        toast.success("Logging Successfully");
      } else {
        toast.error(resObject.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  }

  const logOut = async () => {
    try {
      const res = await fetch("http://localhost:4000/logout", {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      const resposeObject = await res.json();
      toast.success(resposeObject.message);
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  };

  // if (redirect) {
  //   navigate("/");
  // }
  return (
    <AuthContext.Provider value={{ userInfo, login, logOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};
