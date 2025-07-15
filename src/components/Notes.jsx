import {
  Container,
  styled,
  Toolbar,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import Grow from "@mui/material/Grow";
import Masonry from "react-masonry-css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuCard from "./MenuCard";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CardModal from "./CardModal";
import axios from "axios";
const NoteContainer = styled(Container)({
  // backgroundColor: "black",
});

const NoteCard = styled(Card)({
  borderRadius: "50px",
  backgroundColor: "rgba(31, 27, 27, 0.4)",
  boxShadow: ` 1px 10px 45px #cabbbb71,
             -10px -10px 46px #201e1ecc`,
});

const Notes = () => {
  const [anchor, SetAnchor] = useState(null);
  const open = Boolean(anchor);
  const navigate = useNavigate();
  const { token } = useParams();

  const [RenderedData, setRenderedData] = useState([{}]); //storing fully rendered data
  const [lists, SetLists] = useState([]); //store fetched data from api
  const [loading, SetLoading] = useState(true); //loading while fetching data
  const [renderData, SetRenderData] = useState(true); //if failed fetching data,
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(null);
  const isRefresh = new URLSearchParams(location.search).has("refresh");
  const handleClick = (id) => (e) => {
    e.stopPropagation();
    SetAnchor(e.currentTarget);
    setSelectedId(id);
  };
  const handleClose = () => {
    SetAnchor(null);
  };

  useEffect(() => {
    try {
      const binId = "6874d8a86063391d31ad4fbb";
      const apiKey =
        "$2a$10$mo16RwyMyrDipfGcb2BSlODX8./MZkBRS/ZbLp0Vg4P7eH/elsrr.";

      const auth = async () => {
        const tokens = localStorage.getItem("token");

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

        // if (response.request.status !== 201) {
        //   return navigate("/");
        // } else if (token !== tokens) {
        //   return navigate("/");
        // }
        SetLoading(false); //loading will  stop if api response is resolve
        SetLists(loggedAccount.userTodo.reverse()); //storing reversed-data in state  from api
      };

      auth();
    } catch (error) {
      SetRenderData(false); //show a text for failed fetchin api
    }
  }, [location.search]);
  useEffect(() => {
    if (!lists.length) return;
    setRenderedData([]);
    lists.forEach(({ id }, index) => {
      setTimeout(() => {
        setRenderedData((prev) => [...prev, id]);
      }, index * 200); // delay each by 1 second
    });
  }, [lists]);
  const breakpoint = {
    default: 4,
    1100: 2,
    700: 2,
    500: 1,
  };
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <NoteContainer>
      <Toolbar />
      <MenuCard
        anchor={anchor}
        open={open}
        handleClose={handleClose}
        selectedId={selectedId}
      />
      {loading ? (
        <Typography variant="h6" color="initial">
          {renderData
            ? "loading..."
            : "unable to fetch data , server is down:("}
        </Typography>
      ) : lists.length !== 0 ? (
        <Masonry
          breakpointCols={breakpoint}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {lists.map(({ id, title, type, description }) =>
            isRefresh ? (
              <Grow in={RenderedData.includes(id)} timeout={1000} key={id}>
                <Grid size={{ xs: 12, md: 2, lg: 5 }} key={id}>
                  <NoteCard
                    onClick={() =>
                      setSelectedCard({ id, title, type, description })
                    }
                  >
                    <CardHeader
                      sx={{ color: "white" }}
                      avatar={
                        <Avatar
                          sx={{
                            background: () => {
                              if (type === "Todos") {
                                return "green";
                              } else if (type === "Reminder") {
                                return "red";
                              } else if (type === "Money") {
                                return "yellow";
                              }
                            },
                          }}
                        >
                          {type[0]}
                        </Avatar>
                      }
                      action={
                        <IconButton onClick={handleClick(id)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={
                        <Typography variant="body1" color="white">
                          {title}
                        </Typography>
                      }
                      subheader={
                        <Typography variant=" subtitle1" color="white">
                          {type}
                        </Typography>
                      }
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-line", // preserves line breaks
                          fontSize: { xs: "14px", sm: "15px", md: "16px" },
                          color: "#f8ffffdc",
                          fontWeight: "200",
                        }}
                      >
                        {description}
                      </Typography>
                    </CardContent>
                  </NoteCard>
                </Grid>
              </Grow>
            ) : (
              <Grow in={RenderedData.includes(id)} timeout={1000} key={id}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <NoteCard
                    onClick={(e) => {
                      setSelectedCard({ id, title, type, description });
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            background: () => {
                              if (type === "Todos") {
                                return "green";
                              } else if (type === "Reminder") {
                                return "red";
                              } else if (type === "Money") {
                                return "yellow";
                              }
                            },
                          }}
                        >
                          {" "}
                          {type[0]}
                        </Avatar>
                      }
                      action={
                        <IconButton onClick={handleClick(id)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "900", color: "#f8ffffff" }}
                        >
                          {title}
                        </Typography>
                      }
                      subheader={
                        <Typography
                          variant=" subtitle1"
                          sx={{ fontWeight: "0", color: "#f8ffff91" }}
                        >
                          {type}
                        </Typography>
                      }
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-line", // preserves line breaks
                          fontSize: { xs: "14px", sm: "15px", md: "16px" },
                          color: "#f8ffffdc",
                          fontWeight: "200",
                        }}
                      >
                        {description}
                      </Typography>
                    </CardContent>
                  </NoteCard>
                </Grid>
              </Grow>
            )
          )}
        </Masonry>
      ) : (
        <Typography variant="h6" color="initial">
          you have no notes
        </Typography>
      )}
      <CardModal
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
      />{" "}
      {/**select 1 card to triggered modal */}
    </NoteContainer>
  );
};

export default Notes;
