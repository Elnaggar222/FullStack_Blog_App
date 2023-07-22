import SinglePost from "./Posts/SinglePost";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
const Home = () => {
  const [posts, setPosts] = useState(null);
  const isMount = useRef(false);
  const [loading, setLoading] = useState(false);

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/getAllPosts");
      const posts = await res.json();
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  }, []);

  useEffect(() => {
    if (!isMount.current) {
      fetchAllPosts();
      isMount.current = true;
    }
  }, [fetchAllPosts]);

  return (
    <>
      {!posts && loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : null}
      {posts && !loading
        ? posts.map((post) => <SinglePost {...post} key={post._id} />)
        : null}
      {!posts && !loading ? (
        <div style={{ textAlign: "center" }}>No Posts Found</div>
      ) : null}
    </>
  );
};

export default Home;
