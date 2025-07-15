import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  styled,
  AppBar,
  Toolbar,
  Button,
  Drawer,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotesIcon from "@mui/icons-material/Notes";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

//start of code
const drawerWidth = 240;
const tokens = localStorage.getItem("token");
const Root = styled("div")({
  display: "flex",
});

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,

  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "black",
  },
}));

const Main = styled("main")(({ theme }) => ({
  width: "100%",
  backgroundColor: "transparent",
  padding: theme.spacing(1),
}));

const ToolbarSpacer = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const NavigationBar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  background: "black",
  height: "100px",
}));

const Title = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const Navigation = styled(AppBar)({
  // width: `calc(100% - ${drawerWidth}px)`,
});
const links = [
  { path: `/todo/notes/${tokens}`, title: "notes", icon: <NotesIcon /> },
  {
    path: `/todo/addnotes/${tokens}`,
    title: "add note",
    icon: <NoteAddIcon />,
  },
];
const Layout = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const [open, SetOpen] = useState(false);
  const theme = useTheme();
  const { token } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerVariant = isMobile ? "temporary" : "permanent";

  // useEffect(() => {
  //   const auth = async () => {
  //     const tokens = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `https://kasanggatodo.onrender.com/main`,
  //       {
  //         headers: {
  //           Authorization: `bearer ${tokens}`,
  //         },
  //       }
  //     );
  //     if (response.request.status !== 201) {
  //       return navigate("/");
  //     } else if (token !== tokens) {
  //       return navigate("/");
  //     }
  //   };
  //   auth();
  // }, []);

  return (
    <Root>
      <Navigation>
        {/* {!isMobile ? (
          <></>
        ) : (
          <NavigationBar>
            <Button
              variant="text"
              onClick={() => {
                SetOpen(!open);
              }}
            >
              <MenuIcon />
            </Button>
            <Typography variant="h5" color="secondary" component="h6">
              Kasangga
            </Typography>
          </NavigationBar>
        )} */}
        <NavigationBar sx={{ display: { xs: "flex", md: "none" } }}>
          <Button
            variant="text"
            onClick={() => {
              SetOpen(!open);
            }}
          >
            <MenuIcon />
          </Button>
          <Typography variant="h5" color="secondary" component="h6">
            Kasangga
          </Typography>
        </NavigationBar>
      </Navigation>
      <StyledDrawer
        variant={drawerVariant}
        anchor="left"
        open={isMobile ? open : true}
        // hideBackdrop={false}
        role="presentation"
        onClose={() => {
          SetOpen(false);
        }}
      >
        {" "}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {" "}
          <Title variant="h6" component="h2" color="secondary">
            {" "}
            Menu
          </Title>{" "}
          <Title variant="h4" component="h2" color="secondary">
            <PowerSettingsNewIcon
              color="secondary"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                SetOpen(false);
                Swal.fire({
                  position: "bottom-end",
                  icon: "success",
                  title: "Kasangga",
                  text: "balik kaa",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: { popup: "my-swal" },
                });
                setTimeout(() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }, 1500);
              }}
            />
          </Title>
        </Stack>
        <List>
          {" "}
          {links.map(({ path, title, icon }) => (
            <ListItem
              button="true"
              key={title}
              onClick={() => {
                navigate(path);
                SetOpen(false);
              }}
            >
              {" "}
              <ListItemIcon sx={{ color: "white" }}> {icon}</ListItemIcon>
              <ListItemText primary={title} sx={{ color: "white" }} />
            </ListItem>
          ))}{" "}
        </List>{" "}
      </StyledDrawer>
      <Main>
        {isMobile ? <Toolbar /> : null}
        <ToolbarSpacer>
          <Outlet />
        </ToolbarSpacer>
      </Main>
    </Root>
  );
};

export default Layout;
