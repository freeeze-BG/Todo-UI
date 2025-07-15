import { TextField, styled, Stack, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//start of code
const InputField = styled(TextField)({ padding: 5, margin: 2 });
const PublishButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "25px",
  padding: theme.spacing(2),
  margin: `${theme.spacing(0)} 0px ${theme.spacing(2)} 0px`,
  color: "white",
}));
const RegisterUser = () => {
  const [OnregisterInfo, SetOnregisterInfo] = useState({
    gmailAccount: "",
    fName: "",
    lName: "",
    password: "",
    userTodo: [],
  });
  const navigate = useNavigate();
  const [verify, SetVerify] = useState(false);
  const [origOtp, SetorigOtp] = useState("");
  const [otpCode, SetOtpCode] = useState(false);
  const [optType, SetOptType] = useState({ otp: "" });
  const [timer, SetTimer] = useState(60);
  const [resendCode, SetResendCode] = useState(false);
  const [isEmailVerified, SetisEmailVerified] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [enableCreateBtn, SetEnableCreateBtn] = useState(true);
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const VerifyHandler = async () => {
    if (resendCode) {
      const response = await fetch(
        `https://otpemail.onrender.com/reqOtp/${OnregisterInfo.gmailAccount}`
      );
      const otp = await response.json();
      SetorigOtp(otp.otp.join(""));
      SetOtpCode(true);
      SetVerify(false);
      if (verify) {
        const id = setInterval(() => {
          SetTimer((prev) => prev - 1);
        }, 1000);
        setIntervalId(id); // store interval ID
      }
      return;
    }
    if (origOtp) {
      const isVerified =
        origOtp === optType.otp ? SetisEmailVerified(true) : alert("wrong otp");

      return;
    }
    const response = await fetch(
      `https://otpemail.onrender.com/reqOtp/${OnregisterInfo.gmailAccount}`
    );
    const otp = await response.json();
    SetorigOtp(otp.otp.join(""));
    SetOtpCode(true);
    SetVerify(false);
    if (verify) {
      const id = setInterval(() => {
        SetTimer((prev) => prev - 1);
      }, 1000);
      setIntervalId(id); // store interval ID
    }
  };

  //submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      OnregisterInfo.fName === "" &&
      OnregisterInfo.gmailAccount === "" &&
      OnregisterInfo.lName === "" &&
      OnregisterInfo.password === ""
    ) {
      return Swal.fire({
        title: "Kasangga",
        text: "wala ka naman nilagay eh ",
        icon: "warning",
      });
    } else if (!isValidGmail(OnregisterInfo.gmailAccount)) {
      return Swal.fire({
        title: "Kasangga",
        text: "hindi naman gmail accout yan eh ,ayusin mo",
        icon: "warning",
      });
    }
    try {
      const binId = "6874d8a86063391d31ad4fbb";
      const apiKey =
        "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";

      const res = await axios.get(`https://api.jsonbin.io/v3/b/${binId}`, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const data = res.data.record;

      const emailExists = data.some(
        (user) => user.gmailAccount === OnregisterInfo.gmailAccount
      );
      if (emailExists) {
        Swal.fire({
          title: "Kasangga",
          text: "That Gmail is already registered!",
          icon: "warning",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/login");
          }
        });
        return;
      }

      const nextId =
        Math.max(...data.map((user) => Number(user.userId))) + 1 || 1;

      const newUser = { userId: nextId, ...OnregisterInfo };

      const updatedUserList = [...data, newUser];

      const putRes = await axios.put(
        `https://api.jsonbin.io/v3/b/${binId}`,
        updatedUserList,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
        }
      );

      if (putRes.status !== 200) return alert("Register failed!");
      Swal.fire({
        title: "Kasangga",
        text: "Registered kana!",
        icon: "success",
      });
      return navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  useEffect(() => {
    if (isEmailVerified) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      SetTimer(60); // reset timer
    }
  }, [isEmailVerified]);
  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalId);
      setIntervalId(null);
      SetVerify(true);
      SetisEmailVerified(false);
      SetOtpCode(false);
      SetResendCode(true); //it show a text that resend code
      SetTimer(60);
    }
  }, [timer]);

  return (
    <form noValidate autoComplete="on">
      <Stack direction="row" spacing={1} p={0.5} alignItems="center">
        <InputField
          label="Gmail"
          fullWidth
          disabled={isEmailVerified}
          onChange={(e) => {
            SetEnableCreateBtn(
              OnregisterInfo.fName !== "" &&
                OnregisterInfo.gmailAccount !== "" &&
                OnregisterInfo.lName !== "" &&
                OnregisterInfo.password !== ""
            );

            const valid = isValidGmail(e.target.value);
            if (!valid) return SetVerify(false);
            SetVerify(true);
            SetOnregisterInfo({
              ...OnregisterInfo,
              gmailAccount: e.target.value,
            });
          }}
        />
        <Button
          variant={verify || optType.otp.length >= 6 ? "outlined" : "disabled"}
          color="primary"
          sx={{
            height: "fit-content",
            marginTop: "auto",
            marginBottom: "auto",
            whiteSpace: "nowrap",
          }}
          onClick={VerifyHandler}
        >
          {otpCode && optType.otp.length < 6 ? (
            <Typography color="#4db6ac">{timer}S</Typography>
          ) : isEmailVerified ? (
            <CheckIcon />
          ) : resendCode ? (
            "resend"
          ) : (
            "verify"
          )}
        </Button>
      </Stack>
      {otpCode ? (
        isEmailVerified ? (
          <></>
        ) : (
          <InputField
            onChange={(e) => {
              SetOptType({ ...optType, otp: e.target.value });

              if (optType.otp.length > 6) {
                SetVerify(true);
              }
            }}
            label="Otp Code"
            fullWidth
            disabled={isEmailVerified}
          />
        )
      ) : (
        <></>
      )}
      <InputField
        label="password"
        fullWidth
        disabled={!isEmailVerified}
        onChange={(e) => {
          SetEnableCreateBtn(
            OnregisterInfo.fName !== "" &&
              OnregisterInfo.gmailAccount !== "" &&
              OnregisterInfo.lName !== "" &&
              OnregisterInfo.password !== ""
          );

          SetOnregisterInfo({
            ...OnregisterInfo,
            password: e.target.value,
          });
        }}
      />{" "}
      {isEmailVerified ? (
        <InputField
          label="First Name"
          fullWidth
          disabled={!isEmailVerified}
          onChange={(e) => {
            SetOnregisterInfo({
              ...OnregisterInfo,
              fName: e.target.value,
            });
          }}
        />
      ) : (
        <></>
      )}
      {isEmailVerified ? (
        <InputField
          label="Last Name"
          fullWidth
          disabled={!isEmailVerified}
          onChange={(e) => {
            SetEnableCreateBtn(
              OnregisterInfo.fName !== "" &&
                OnregisterInfo.gmailAccount !== "" &&
                OnregisterInfo.lName !== "" &&
                OnregisterInfo.password !== ""
            );

            SetOnregisterInfo({
              ...OnregisterInfo,
              lName: e.target.value,
            });
          }}
        />
      ) : (
        <></>
      )}
      <PublishButton
        variant="filled"
        sx={{ backgroundColor: "red" }}
        onClick={submitHandler}
        fullWidth
        disabled={enableCreateBtn}
      >
        create your Account
      </PublishButton>
      {/* <Stack
        flex={5}
        justifyContent="center"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}

      </Stack> */}
    </form>
  );
};

export default RegisterUser;
