import { Modal, Box, Typography, Button } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const ModalExemption = ({ open, handleClose, setOpen, SetProgress }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          parang kang 'di nag grade 2 kasangga
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          lagyan mo lahat ,di yung isasubmit mo agad . Arayyyy ko!!!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpen(false);
            SetProgress(false);
          }}
          sx={{ marginTop: "50px" }}
          fullWidth
        >
          klaro kasangga!!
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalExemption;
