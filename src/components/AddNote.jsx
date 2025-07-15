import {
  Stack,
  Box,
  TextField,
  styled,
  Button,
  Toolbar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalExemption from "./ModalExemption";
import axios from "axios";
import Swal from "sweetalert2";
const InputField = styled(TextField)({
  padding: 5,
  margin: 2,
});

const BoxNote = styled(Box)({
  borderRadius: "50px",
  backgroundColor: "rgba(236, 236, 236, 0.3)",
  boxShadow: ` 1px 10px 45px #cabbbb71,
             -10px -10px 46px #201e1ecc`,
});
const PublishButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "25px",
  padding: theme.spacing(2),
  color: "white",
}));
const AddNote = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { token } = useParams();
  const [progress, SetProgress] = useState(false);
  const [currentID, SetcurrentID] = useState([]);
  const [loggedEmail, SetLoggedEmail] = useState("");
  const [selectedAcc, SetSelectedACc] = useState([]);
  const [todo, SetTodo] = useState({
    id: "",
    title: "",
    type: "",
    description: "",
  });
  //modal params
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const addData = await fetch(
  //       "https://witty-powerful-chokeberry.glitch.me/todos",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json", // fixed typo here
  //         },

  //         body: JSON.stringify(todo),
  //       }
  //     );

  //     if (!addData.ok) {
  //       throw new Error(`Server responded with status: ${addData.status}`);
  //     }

  //     if (!addData.ok) return SetProgress(true);
  //     SetProgress(false);
  //     alert("added successfully");
  //     navigate("/");
  //   } catch (error) {
  //     alert("error : " + error);
  //   } finally {
  //     SetProgress(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetProgress(true); // disable immediately on click
    setIsSubmitted(false);
    if (
      todo.id === "" ||
      todo.title === "" ||
      todo.type === "" ||
      todo.description === ""
    )
      return Swal.fire({
        icon: "error",
        title: "Kasangga",
        text: "parang kang 'di nag grade 2 kasangga, lagyan mo lahat ,di yung isasubmit mo agad . Arayyyy ko!!!",
        showConfirmButton: true,
      }).then((res) => {
        SetProgress(false);
      });
    try {
      const binId = "6874d8a86063391d31ad4fbb";
      const apiKey =
        "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";

      const updatedRecords = selectedAcc.map((user) => {
        console.log(user.userId.toString() === token);
        if (user.userId.toString() == token) {
          return {
            ...user,
            userTodo: [...user.userTodo, todo], // 🛠️ Spread the array, add new item
          };
        }
        return user;
      });

      const res = await axios.put(
        `https://api.jsonbin.io/v3/b/${binId}`,
        updatedRecords,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
        }
      );

      const userData = await res.data;

      // // if (!addData.ok) {
      // //   throw new Error(`Server responded with status: ${addData.status}`);
      // // }
      setIsSubmitted(true); //show subbmitted success!

      setTimeout(() => navigate(`/todo/notes/${token}`), 1000); // small delay before redirect
    } catch (error) {
      alert("error : " + error.message);
    } finally {
      SetProgress(false); // re-enable the button
    }
  };
  // useEffect(() => {
  //   const fetcData = async () => {
  //     const response = await fetch(
  //       "https://witty-powerful-chokeberry.glitch.me/todos"
  //     );
  //     const data = await response.json();
  //     data.reverse();
  //     SetTodo((prev) => ({ ...prev, id: String(Number(data[0].id) + 1) }));
  //   };
  //   fetcData();
  // }, []);

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
      const loggedAccount = userData?.record?.find(
        (acc) => acc.userId.toString() === tokens
      );
      if (token === tokens) {
      } else {
        return navigate("/");
      }
      SetSelectedACc(userData.record);
      SetLoggedEmail(loggedAccount.gmailAccount);
      // if (response.request.status !== 201) {
      //   return navigate("/");
      // } else if (token !== tokens) {
      //   return navigate("/");
      // }
      // console.log(
      //   loggedAccount.userTodo[loggedAccount.userTodo.length - 1].id + 1
      // );
      if (loggedAccount.userTodo.length <= 0) {
        SetTodo((prev) => ({
          ...prev,
          id: String(1),
        }));
      } else {
        SetTodo((prev) => ({
          ...prev,
          id: String(
            Number(
              loggedAccount.userTodo[loggedAccount.userTodo.length - 1].id
            ) + 1
          ),
        }));
      }
    };
    auth();
  }, []);
  return (
    <>
      <Toolbar />
      <Stack direction="row" spacing={2} justifyContent="center" mr={5} ml={5}>
        <BoxNote flex={5} p={5}>
          <form autoComplete="true" noValidate>
            <InputField
              label="note"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                SetTodo({ ...todo, title: e.target.value });
              }}
            />{" "}
            <InputField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              onChange={(e) => {
                SetTodo({ ...todo, description: e.target.value });
              }}
            />{" "}
            <FormControl>
              <FormLabel>Type</FormLabel>
              <FormControl component="fieldset">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  aria-label=""
                  onChange={(e) => {
                    SetTodo({ ...todo, type: e.target.value });
                  }}
                >
                  {" "}
                  <FormControlLabel
                    value="Reminder"
                    control={<Radio />}
                    label="Reminder"
                  />
                  <FormControlLabel
                    value="Todos"
                    control={<Radio />}
                    label="Todos"
                  />
                  <FormControlLabel
                    value="Work"
                    control={<Radio />}
                    label="Work"
                  />
                </RadioGroup>
              </FormControl>
            </FormControl>
            <PublishButton
              fullWidth
              onClick={handleSubmit}
              disabled={progress || isSubmitted}
            >
              {progress ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : isSubmitted ? (
                <Typography sx={{ color: "white" }}>Submitted ✔️</Typography>
              ) : (
                "Submit"
              )}
            </PublishButton>
          </form>
        </BoxNote>
        <ModalExemption
          open={open}
          handleClose={handleClose}
          setOpen={setOpen}
          SetProgress={SetProgress}
        />
      </Stack>
    </>
  );
};

export default AddNote;
