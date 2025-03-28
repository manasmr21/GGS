import { useEffect, useContext, useState } from "react";
import { UserContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

function Users() {
  const { fetchUser, deleteUser, token, users, logOut, updateUser } =
    useContext(UserContext);
  const [editingUser, setEditingUser] = useState(null);
  const [response, setResponse] = useState(null);
  const [page, setPage] = useState(1);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const navigate = useNavigate();

  //Fetch the user
  useEffect(() => {
    const getUsers = async () => {
      if (token) {
        const data = await fetchUser(page);
        setResponse(data);

        toast.success("Users fetched successfully", {
          position: "top-center",
        });
      } else {
        navigate("/");
      }
    };

    getUsers();
  }, [token, page]);

  //Initiate editing user data
  const initiateEditing = (user) => {
    setEditingUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const changeFormDetails = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  //Save user updated data
  const saveUserData = async () => {
    try {
      if (editingUser) {
        await updateUser(editForm, editingUser.id);
        toast.success("User Updated successfully", { position: "top-center" });
        setEditingUser(null);
      }
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  if (!users) {
    return (
      <div className="grid place-items-center h-[100dvh]">
        <div className="text-center">
          <Tailspin size="40" stroke="5" speed="0.9" color="black" />
          <h1>Fetching Users...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 px-6 md:px-12 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-10">
        {users?.map((user, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center"
          >
            <img
              src={user.avatar}
              alt={user.first_name}
              className="w-24 h-24 rounded-full mb-4 shadow"
            />
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
              {user.email}
            </p>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.first_name} {user.last_name}
            </h2>
            {user.updatedAt && (
              <p className="text-xs text-gray-400">
                Updated At :{" "}
                {new Date(user.updatedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            )}

            <div>
              <button
                onClick={() => initiateEditing(user)}
                className="mt-4  mx-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                className="mt-4  mx-3 cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Edit User
              </h2>
              <input
                type="text"
                name="first_name"
                value={editForm.first_name}
                onChange={changeFormDetails}
                className="w-full text-white p-2 mb-3 border rounded"
                placeholder="First Name"
              />
              <input
                type="text"
                name="last_name"
                value={editForm.last_name}
                onChange={changeFormDetails}
                className="w-full text-white p-2 mb-3 border rounded"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={changeFormDetails}
                className="w-full text-white p-2 mb-4 border rounded"
                placeholder="Email"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserData}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full grid place-items-center  my-5">
        <div>
          <button
            className="mt-4 m-auto  mx-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!page == response?.total_pages}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Prev
          </button>
          <button
            className="mt-4 m-auto  mx-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={page == response?.total_pages}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </button>
          <p className="text-center mt-5 font-semibold">
            On page {response?.page}
          </p>
        </div>
        <button
          className="mt-4 m-auto  mx-3 cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={logOut}
        >
          Logout
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default Users;
