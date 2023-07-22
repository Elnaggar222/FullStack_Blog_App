import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const { logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/createPost", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      setLoading(false);
      const responseObject = await response.json();
      if (response.ok) {
        navigate("/");
        toast.success("Created Succesfully");
      } else {
        toast.error(responseObject.message);
        logOut();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("server Error");
    }
  }

  return (
    <form onSubmit={createNewPost}>
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
      <button disabled={loading} style={{ marginTop: "5px" }}>
        Create post{loading ? <>...</> : null}
      </button>
    </form>
  );
}
