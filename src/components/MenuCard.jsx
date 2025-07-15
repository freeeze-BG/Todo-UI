import { Menu, MenuItem, Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/Update";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const MenuCard = ({ open, anchor, handleClose, selectedId }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [selectedTodo, SetSelectedTodo] = useState({});

  const handleDelete = async () => {
    Swal.fire({
      title: "deleting...",

      didOpen: () => {
        Swal.showLoading(); // ⏳ Shows the spinner animation
      },
    });
    const binId = "6874d8a86063391d31ad4fbb";
    const apiKey =
      "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";
    const res1 = await axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: {
        "X-Master-Key": apiKey,
      },
    });
    const records = await res1.data.record;

    const deleteList = records.map((user) => {
      if (user.userId == token) {
        const updatedTodo = user.userTodo.filter(
          (todo) => todo.id !== selectedId
        );

        return { ...user, userTodo: updatedTodo };
      }
      return user;
    });

    const response = await axios.put(
      `https://api.jsonbin.io/v3/b/${binId}`,
      deleteList,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
      }
    );

    // if (!response.ok) return alert("failed to delete");
    navigate(`/todo/notes/${token}/?refresh=${Date.now()}`);
    Swal.fire({
      title: "Kasangga",
      text: "deleted Success",
      icon: "success", // ✅ Success check icon appears
    });
  };
  useEffect(() => {
    const auth = async () => {
      const tokens = localStorage.getItem("token");
      const response = await axios.get(
        `https://kasangga-fvst.onrender.com/main`,
        {
          headers: {
            Authorization: `bearer ${tokens}`,
          },
        }
      );
      const data = await response.data;

      SetSelectedTodo(data);
    };
    auth();
  }, []);

  return (
    <Menu
      anchorEl={anchor}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleDelete}>
        <DeleteOutlineIcon /> Delete
      </MenuItem>{" "}
    </Menu>
  );
};

export default MenuCard;
