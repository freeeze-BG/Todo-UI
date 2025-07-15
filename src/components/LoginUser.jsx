import {
  IconButton,
  Typography,
  TextField,
  styled,
  Stack,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

//start of code
const LabelOption = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const NoHoverIcon = styled(IconButton)({
  boxShadow: "none",
  width: "30px",
  "&:hover": {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
});

const SocialIcon = styled("img")({
  width: 32,
  height: 32,
  objectFit: "contain",
});

const InputField = styled(TextField)({ padding: 5, margin: 2 });
const PublishButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "25px",
  padding: theme.spacing(2),
  margin: `${theme.spacing(2)} 0px ${theme.spacing(2)} 0px`,
  color: "white",
}));
const LoginUser = () => {
  const navigate = useNavigate();
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };
  const [logUserInfo, SetLogUserInfo] = useState({
    gmailAccount: "",
    password: "",
  });
  const butinga = () => {
    return Swal.fire({
      title: "manigas ka!",

      imageUrl:
        "https://i.pinimg.com/236x/4d/13/13/4d13135ef1d77ed91ce80334ceab6ef5.jpg?nii=t",
      imageWidth: 150,
      imageHeight: 150,
    });
  };
  const handeLogin = async (e) => {
    e.preventDefault();

    const binId = "6874d8a86063391d31ad4fbb";
    const apiKey =
      "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";

    try {
      if (!logUserInfo.gmailAccount || !logUserInfo.password) {
        return Swal.fire({
          title: "Kasangga",
          text: "may nilagay kaba?!",
          icon: "error",
        });
      } else if (!isValidGmail(logUserInfo.gmailAccount)) {
        return Swal.fire({
          title: "Kassanga",
          text: "ulitin moo,malii!",
          icon: "error",
        });
      }
      // const LogInResponse = await axios.post(
      //   "https://kasangga-fvst.onrender.com/logAuth",
      //   logUserInfo
      // );

      const res = await axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });

      const userData = await res.data;

      //checking if user exist
      const verifiedAccount = userData.record.find(
        (account) =>
          logUserInfo.gmailAccount === account.gmailAccount &&
          logUserInfo.password === account.password
      );

      if (verifiedAccount === undefined)
        return Swal.fire({
          title: "Kassanga",
          text: "bilis mo naman makalimot sa account mo.",
          icon: "error",
        });
      //if success show a modal

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "kasangga",
        text: "log in success",
        showConfirmButton: false,
        timer: 1500,
      });
      localStorage.setItem("token", verifiedAccount.userId.toString());
      setTimeout(() => {
        navigate(`/todo/notes/${verifiedAccount.userId.toString()}`);
      }, 1500);
    } catch (error) {}
  };
  return (
    <form noValidate autoComplete="true">
      <InputField
        label="Gmail"
        fullWidth
        value={logUserInfo.gmailAccount}
        onChange={(e) => {
          isValidGmail(e.target.value);
          SetLogUserInfo({ ...logUserInfo, gmailAccount: e.target.value });
        }}
      />
      <InputField
        label="password"
        fullWidth
        value={logUserInfo.password}
        onChange={(e) => {
          SetLogUserInfo({ ...logUserInfo, password: e.target.value });
        }}
      />
      <PublishButton
        variant="filled"
        sx={{ backgroundColor: "red" }}
        onClick={handeLogin}
        fullWidth
      >
        Login
      </PublishButton>
      <LabelOption variant="body2" color="initial" textAlign="center">
        {" "}
        nakalimutan mo password mo?{" "}
        <Typography
          onClick={butinga}
          sx={{ cursor: "pointer", color: "blue" }}
          variant="body2"
        >
          tara ayusin natin
        </Typography>
      </LabelOption>{" "}
    </form>
  );
};

export default LoginUser;
