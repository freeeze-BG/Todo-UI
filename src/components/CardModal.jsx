import Backdrop from "@mui/material/Backdrop";
import {
  Grow,
  Box,
  IconButton,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  ButtonGroup,
  styled,
  TextField,
  Stack,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  CardActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  iconColor: "green",
  position: "bottom-end",
  customClass: {
    popup: "colored-toast-delete",
  },
  showConfirmButton: false,
  timer: 1500,
});

const Toastupdate = Swal.mixin({
  toast: true,
  position: "center",
  iconColor: "green",
  position: "bottom-end",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1500,
});
const CardModal = ({ selectedCard, setSelectedCard }) => {
  const [selectedTodo, SetSelectedTodo] = useState({});
  const { token } = useParams();
  const [loggedGmail, SetLoggedGmail] = useState("");
  const [selectedAcc, SetSelectedACc] = useState([]);
  const [updateProgress, SetUpdateProgress] = useState({
    progress: false,
    message: false,
  });
  const [deleteprogress, SetDeleteProgress] = useState({
    progress: false,
    message: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (selectedCard) SetSelectedTodo({ ...selectedCard });
  }, [selectedCard]);

  const handleDelete = async () => {
    try {
      SetDeleteProgress((prev) => ({ ...prev, progress: true }));
      SetDeleteProgress((prev) => ({ ...prev, message: false }));
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
            (todo) => todo.id !== selectedTodo.id
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

      SetDeleteProgress((prev) => ({ ...prev, progress: false }));
      SetDeleteProgress((prev) => ({ ...prev, message: true }));

      navigate(`/todo/notes/${token}/?refresh=${Date.now()}`),
        SetDeleteProgress((prev) => ({ ...prev, message: false }));
      setSelectedCard(null);
      Toast.fire({ icon: "success", title: "deleted" });
    } catch (error) {
      throw new Error(" error : " + error);
    }
  };
  const handleChange = (field) => (e) => {
    SetSelectedTodo({ ...selectedTodo, [field]: e.target.value });
  }; //direct func

  const handleUpdate = async () => {
    SetUpdateProgress((prev) => ({ ...prev, progress: true }));
    SetUpdateProgress((prev) => ({ ...prev, message: false }));

    const binId = "6874d8a86063391d31ad4fbb";
    const apiKey =
      "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";
    const res1 = await axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: {
        "X-Master-Key": apiKey,
      },
    });
    const records = await res1.data.record;
    const updatedRecords = records.map((user) => {
      if (user.userId == token) {
        const updatedTodo = user.userTodo.map((todo) =>
          todo.id === selectedTodo.id ? { ...todo, ...selectedTodo } : todo
        );

        return { ...user, userTodo: updatedTodo };
      }
      return user;
    });

    const response = await axios.put(
      `https://api.jsonbin.io/v3/b/${binId}`,
      updatedRecords,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
      }
    );

    SetUpdateProgress((prev) => ({ ...prev, progress: false }));

    navigate(`/todo/notes/${token}/?refresh=${Date.now()}`);
    setSelectedCard(null);
    Toastupdate.fire({ icon: "success", title: "update successfully" });
    SetUpdateProgress((prev) => ({ ...prev, message: true }));
    SetUpdateProgress((prev) => ({ ...prev, message: false })); //remove check button when submitted

    // setTimeout(() => navigate("/", { replace: true }), 100); // clean URL after refresh
  }; //hold and submit the updated lists
  /* const handleChange =  (field)=(e) => {
    SetSelectedTodo({ ...selectedTodo, [field]: e.target.value });
  }; //curried func*/

  useEffect(() => {
    const auth = async () => {
      const tokens = localStorage.getItem("token");
      const binId = "6874d8a86063391d31ad4fbb";
      const apiKey =
        "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";
      const res = await axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const userData = await res.data;
      SetSelectedACc(userData.record);

      const loggedAccount = userData?.record?.find(
        (acc) => acc.userId.toString() === tokens
      );

      SetLoggedGmail(loggedAccount.gmailAccount);
    };
    auth();
  }, []);
  return (
    <Backdrop
      open={!!selectedCard}
      sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedCard(null);
        }
      }}
    >
      {selectedCard && (
        <Grow in={true} timeout={500}>
          <Box
            sx={{
              width: { xs: "90%", sm: "70%", md: "50%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 4,
              p: 4,
            }}
          >
            <CardHeader
              avatar={<Avatar />}
              title={
                <TextField
                  value={selectedTodo.title || ""}
                  label="title"
                  fullWidth
                  onChange={handleChange("title")}
                />
              }
              subheader={
                // <Typography
                //   variant="body2"
                //   color="textSecondary"
                //   sx={{ cursor: "pointer" }}
                //   onClick={() =>
                // >
                //   {selectedCard.type}
                // </Typography>

                <FormControl sx={{ margin: "10px 0px 0px 0px" }}>
                  <InputLabel> type</InputLabel>
                  <Select
                    value={selectedTodo?.type || ""}
                    label="type"
                    onChange={handleChange("type")}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Reminder">Reminder</MenuItem>
                    <MenuItem value="Money">Money</MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <CardContent>
              <TextField
                multiline
                minRows={6}
                maxRows={20}
                value={selectedTodo.description || ""}
                fullWidth
                variant="outlined"
                onChange={handleChange("description")}
                sx={{
                  width: "100%",
                  resize: "vertical",
                  fontSize: { xs: "14px", sm: "16px" },
                  "& textarea": {
                    overflow: "auto",
                  },
                }}
              />
            </CardContent>
            <CardActions>
              {" "}
              <Stack direction="row" justifyContent="center" flex={1}>
                {" "}
                <CloseIcon
                  sx={{
                    margin: "0px 20px 0px 0px",
                    color: "black",
                    cursor: "pointer",
                  }}
                  onClick={() => [setSelectedCard(null)]}
                />{" "}
                {deleteprogress.progress ? (
                  <CircularProgress sx={{ color: "blue" }} size={24} />
                ) : deleteprogress.message ? (
                  <CheckIcon />
                ) : (
                  <DeleteIcon
                    sx={{
                      margin: "0px 20px 0px 0px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={handleDelete}
                  />
                )}{" "}
                {updateProgress.progress ? (
                  <CircularProgress sx={{ color: "blue" }} size={24} />
                ) : updateProgress.message ? (
                  <CheckIcon />
                ) : (
                  <SendIcon
                    sx={{
                      margin: "0px 20px 0px 0px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={handleUpdate}
                  />
                )}
              </Stack>
            </CardActions>
          </Box>
        </Grow>
      )}
    </Backdrop>
  );
};

export default CardModal;
