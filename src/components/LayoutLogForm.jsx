import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
} from "@mui/material";
import { useState, useEffect, lazy } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
const RegisterUser = lazy(() => import("./RegisterUser"));
const LoginUser = lazy(() => import("./LoginUser"));

//start of code
const LayoutLogForm = () => {
  const navigate = useNavigate();
  const [transitionValue, SetTransitionValue] = useState({
    left: "0%",
    right: "100%",
  });
  const [TransitonCardHeader, SetTransitonCardHeader] = useState("0%");
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [registerKey, setRegisterKey] = useState(0);
  const location = useLocation();

  const handleTransition = () => {
    if (isLoginActive) {
      // Switching to register
      navigate("/register");
      setRegisterKey((prev) => prev + 1);
      SetTransitionValue({ left: "-100%", right: "-100%" });
      SetTransitonCardHeader("-80%");
      setIsLoginActive(false);
    } else {
      // Switching back to login
      navigate("/login");
      SetTransitionValue({ left: "0%", right: "100%" });
      SetTransitonCardHeader("0%");
      setIsLoginActive(true);
    }
  };

  useEffect(() => {
    if (location.pathname === "/register") {
      SetTransitionValue({ left: "-100%", right: "-100%" });
      SetTransitonCardHeader("-80%");
      setIsLoginActive(false);
      setRegisterKey((prev) => prev + 1);
    } else {
      SetTransitionValue({ left: "0%", right: "100%" });
      SetTransitonCardHeader("0%");
      setIsLoginActive(true);
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          margin: {
            xs: 1, // extra-small screens (mobile)
            sm: 4, // small screens
            md: 6, // medium screens
            lg: 2, // large screens
          },

          padding: {
            xs: 1, // extra-small screens (mobile)
            sm: 4, // small screens
            md: 6, // medium screens
            lg: 2, // large screens
          },
          height: "450px",
          width: {
            xs: "90%", // extra-small screens (mobile)
            sm: "90%", // small screens
            md: "80%", // medium screens
            lg: "50%", // large screens
            xl: "40%",
          },
        }}
      >
        <CardHeader
          avatar={
            <Typography variant="overline" color="Secondary">
              KASANGGA
            </Typography>
          }
          action={
            <IconButton
              disableRipple
              onClick={handleTransition}
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                marginLeft: "1rem",
              }}
            >
              {TransitonCardHeader === "0%" ? (
                <>
                  <Typography variant="overline" color="initial">
                    Register
                  </Typography>{" "}
                  <ArrowForwardIcon />
                </>
              ) : (
                <>
                  <ArrowBackIcon />{" "}
                  <Typography variant="overline" color="initial">
                    Login
                  </Typography>{" "}
                </>
              )}
            </IconButton>
          }
          sx={{
            transform: `translate(${TransitonCardHeader}) `,
            transition: "1s",
            paddingRight: "0.5rem",
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "hidden",
            overflowY: "hidden",
            // space between forms
          }}
        >
          {" "}
          <Box
            sx={{
              minWidth: "100%",
              transform: `translate(${transitionValue.left}) `,
              transition: "1s ease-in-out",
              padding: "1.5rem",
            }}
          >
            <LoginUser />
          </Box>
          <Box
            sx={{
              minWidth: "100%",
              transform: `translate(${transitionValue.right}) `,
              transition: "1s ease-in-out",
              padding: "0rem",
            }}
          >
            <RegisterUser key={registerKey} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LayoutLogForm;
