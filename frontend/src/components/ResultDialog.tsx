import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ResultDialog({ open, onClose, children }: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Data submitted successfully!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}


