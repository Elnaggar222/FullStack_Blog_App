import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const UpdatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [fetchLoading, setFetchloading] = useState(false);
  const [editloading, setEditloading] = useState(false);
  const { id } = useParams();
  const isMount = useRef(false);
  const { logOut } = useContext(AuthContext);

  const fetchSpecificPost = useCallback(async () => {
    try {
      setFetchloading(true);
      const res = await fetch("http://localhost:4000/post/" + id);
      const postDoc = await res.json();
      if (res.status === 200) {
        setTitle(postDoc.title);
        setSummary(postDoc.summary);
        setContent(postDoc.content);
      }
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

  async function UpdatePost(ev) {
    try {
      ev.preventDefault();
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("id", id);
      if (files) {
        data.set("file", files[0]);
      }
      setEditloading(true);
      const response = await fetch("http://localhost:4000/UpdatePost", {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      setEditloading(false);
      const responseObject = await response.json();
      if (response.status === 200) {
        navigate("/post/" + id);
        toast.success("Updated Succesfully");
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
  }

  if (fetchLoading && !title) {
    return <div style={{ textAlign: "center" }}>loading...</div>;
  }
  if (!fetchLoading && !title) {
    return <div style={{ textAlign: "center" }}>No Such Post to edit</div>;
  }
  return (
    <form onSubmit={UpdatePost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <ReactQuill modules={modules} value={content} onChange={setContent} />
      <button disabled={editloading} style={{ marginTop: "5px" }}>
        Edit post{editloading ? <>...</> : null}
      </button>
    </form>
  );
};

export default UpdatePost;
