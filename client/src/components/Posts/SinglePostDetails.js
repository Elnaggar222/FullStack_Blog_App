import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { AuthContext } from "../../Context/AuthContext";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
const SinglePostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMount = useRef(false);
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo,logOut } = useContext(AuthContext);
  const [fetchloading, setFetchloading] = useState(false);
  const [deleteloading, setDeleteloading] = useState(false);

  const fetchSpecificPost = useCallback(async () => {
    try {
      setFetchloading(true);
      const res = await fetch(`http://localhost:4000/post/${id}`);
      const postDoc = await res.json();
      setPostInfo(postDoc);
      setFetchloading(false);
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  }, [id]);

  useEffect(() => {
    if (!isMount.current) {
      fetchSpecificPost();
      isMount.current = true;
    }
  }, [fetchSpecificPost]);

  const deletePost = async () => {
    try {
      setDeleteloading(true);
      const response = await fetch("http://localhost:4000/deletePost", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setDeleteloading(false);
      const responseObject = await response.json();
      if (response.status === 200) {
        navigate("/");
        toast.success("Deleted Succesfully");
      } else if (response.status === 401) {
        toast.error(responseObject.message);
        logOut();
        navigate("/login");
      } else if (response.status === 403) {
        toast.error(responseObject.message);
        navigate("/post/" + id);
      }
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  };

  if (!postInfo && fetchloading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  if (!postInfo && !fetchloading) {
    return <div style={{ textAlign: "center" }}>No Such Post</div>;
  }
  return (
    <div className="post-page">
      <h1> {postInfo.title} </h1>
      <time> {formatISO9075(new Date(postInfo.createdAt))} </time>
      <div className="author">By @{postInfo.author.username} </div>
      {userInfo
        ? userInfo.id === postInfo.author._id && (
            <div className="edit-delete">
              <div className="edit-row">
                <Link className="edit-btn" to={"/edit/" + postInfo._id} >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                  </svg>
                  Edit
                </Link>
              </div>
              <div className="delete-row">
                <Link onClick={deletePost} className={`delete-btn ${deleteloading?'deleting':null}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete
                </Link>
              </div>
            </div>
          )
        : null}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="postImage" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default SinglePostDetails;
