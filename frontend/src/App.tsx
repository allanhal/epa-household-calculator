import { useState } from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RecyclingIcon from '@mui/icons-material/Recycling';
import {
    Box, Button, Checkbox, Divider, FormControlLabel, InputAdornment, Paper, Snackbar, Stack,
    TextField, Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SvgLogo from './SvgLogo';

import type { HouseholdData, Status, TransportationData } from "./types";

const API_URL = import.meta.env.VITE_API || "http://localhost:8080";

// State with initial values for easier testing
const initialState = {
  energy: { electricity: 1, naturalGas: 1 },
  transportation: [{ miles: 1, mpg: 1 }],
  waste: {
    people: 1,
    recyclesPaper: false,
    recyclesPlastic: false,
    recyclesMetal: false,
    recyclesGlass: false,
  },
};

// Default state
// const initialState = {
//   energy: { electricity: 0, naturalGas: 0 },
//   transportation: [{ miles: 0, mpg: 0 }],
//   waste: {
//     people: 1,
//     recyclesPaper: false,
//     recyclesPlastic: false,
//     recyclesMetal: false,
//     recyclesGlass: false,
//   },
// };

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<{
    totalEmissionAvg: number;
    householdCount: number;
  } | null>();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<HouseholdData>(initialState);

  const updateEnergy = (key: "electricity" | "naturalGas", value: number) => {
    setData((prev) => ({
      ...prev,
      energy: { ...prev.energy, [key]: value },
    }));
  };

  const updateTransport = (
    index: number,
    key: keyof TransportationData,
    value: number
  ) => {
    const newTransport = [...data.transportation];
    newTransport[index] = { ...newTransport[index], [key]: value };
    setData((prev) => ({ ...prev, transportation: newTransport }));
  };

  const updateWaste = (
    key: keyof typeof data.waste,
    value: boolean | number
  ) => {
    setData((prev) => ({
      ...prev,
      waste: { ...prev.waste, [key]: value },
    }));
  };

  const addVehicle = () => {
    setData((prev) => ({
      ...prev,
      transportation: [...prev.transportation, { miles: 0, mpg: 0 }],
    }));
  };

  const removeVehicle = () => {
    setData((prev) => ({
      ...prev,
      transportation:
        prev.transportation.length === 0
          ? prev.transportation
          : prev.transportation.slice(0, -1),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        data.energy.electricity < 1 ||
        data.energy.naturalGas < 1 ||
        data.waste.people < 1 ||
        data.transportation.some((car) => car.miles < 1 || car.mpg < 1)
      ) {
        setSnackbarMessage(
          "Please correct the errors in the form before submitting."
        );
      } else {
        setStatus("loading");
        const requestResponse = await fetch(`${API_URL}/api/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ household: data }),
        });
        const result = await requestResponse.json();
        console.log(result);
        setSnackbarMessage(
          `Data submitted successfully! Footprint: ${result.totalEmissions} lbs CO₂/year`
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbarMessage("Error submitting data. Please try again.");
    } finally {
      setStatus("sent");
      setSnackbarOpen(true);
    }
  };

  const handleListAverage = async () => {
    try {
      setStatus("loading");
      const requestResponse = await fetch(`${API_URL}/api/listAverage`);
      const result = await requestResponse.json();
      console.log(result);
      setDialogOpen(true);
      setDialogMessage(result);
    } catch (error) {
      console.error("Error submitting data:", error);
      setDialogMessage(null);
    } finally {
      setStatus("sent");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        p: 3,
        mt: 4,
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={(_event?: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
        message={snackbarMessage}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Current Average Emissions
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Total Average Emissions:{" "}
            {dialogMessage
              ? `${dialogMessage.totalEmissionAvg.toFixed(2)} lbs CO₂/year`
              : "N/A"}
            <br />
            Number of Households:{" "}
            {dialogMessage ? dialogMessage.householdCount : "N/A"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <SvgLogo />

      {/* Energy Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Energy <BoltIcon color="primary" sx={{ verticalAlign: "middle" }} />
        </Typography>
        <TextField
          error={status === "sent" && data.energy.electricity < 1}
          helperText={
            status === "sent" &&
            data.energy.electricity < 1 &&
            "Energy cannot be zero."
          }
          fullWidth
          label="Electricity (kWh/year)"
          type="number"
          variant="outlined"
          value={data.energy.electricity}
          onChange={(e) => updateEnergy("electricity", Number(e.target.value))}
          margin="normal"
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: (
              <InputAdornment position="end">
                {/* Stack arranges the buttons horizontally with small spacing */}
                <Stack direction="row" spacing={0.5}>
                  {[5, 10, 50, 100].map((increment) => (
                    <Button
                      key={increment}
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateEnergy(
                          "electricity",
                          data.energy.electricity + increment
                        )
                      }
                      sx={{ minWidth: 0, px: 0.8 }}
                    >
                      <Typography fontWeight={300} fontSize={10}>
                        +{increment}
                      </Typography>
                    </Button>
                  ))}
                </Stack>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          error={status === "sent" && data.energy.naturalGas < 1}
          helperText={
            status === "sent" &&
            data.energy.naturalGas < 1 &&
            "Natural gas cannot be zero."
          }
          label="Natural Gas (therms/year)"
          type="number"
          variant="outlined"
          value={data.energy.naturalGas}
          onChange={(e) => updateEnergy("naturalGas", Number(e.target.value))}
          margin="normal"
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: (
              <InputAdornment position="end">
                {/* Stack arranges the buttons horizontally with small spacing */}
                <Stack direction="row" spacing={0.5}>
                  {[5, 10, 50, 100].map((increment) => (
                    <Button
                      key={increment}
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        updateEnergy(
                          "naturalGas",
                          data.energy.naturalGas + increment
                        )
                      }
                      sx={{ minWidth: 0, px: 0.8 }}
                    >
                      <Typography fontWeight={300} fontSize={10}>
                        +{increment}
                      </Typography>
                    </Button>
                  ))}
                </Stack>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Transportation Section */}
      <Box>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Transportation{" "}
          <DirectionsCarIcon color="primary" sx={{ verticalAlign: "middle" }} />
        </Typography>
        {data.transportation.map((car, idx) => (
          <Paper key={idx} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                gap: 1,
              }}
            >
              <Typography variant="h6">Vehicle #{idx + 1}</Typography>
              <Button
                variant="outlined"
                onClick={removeVehicle}
                startIcon={<DirectionsCarIcon />}
              >
                <Typography fontWeight={300} fontSize={10}>
                  - Remove Vehicle
                </Typography>
              </Button>
            </Box>
            <TextField
              error={status === "sent" && car.miles < 1}
              helperText={
                status === "sent" && car.miles < 1 && "Miles cannot be zero."
              }
              fullWidth
              label="Miles driven per year"
              type="number"
              variant="outlined"
              value={car.miles}
              onChange={(e) =>
                updateTransport(idx, "miles", Number(e.target.value))
              }
              margin="dense"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Stack arranges the buttons horizontally with small spacing */}
                    <Stack direction="row" spacing={0.5}>
                      {[100, 500, 5000].map((increment) => (
                        <Button
                          key={increment}
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            updateTransport(idx, "miles", car.miles + increment)
                          }
                          sx={{ minWidth: 0, px: 0.8 }}
                        >
                          <Typography fontWeight={300} fontSize={10}>
                            +{increment}
                          </Typography>
                        </Button>
                      ))}
                    </Stack>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={status === "sent" && car.mpg < 1}
              helperText={
                status === "sent" && car.mpg < 1 && "MPG cannot be zero."
              }
              fullWidth
              label="MPG (Miles Per Gallon)"
              type="number"
              variant="outlined"
              value={car.mpg}
              onChange={(e) =>
                updateTransport(idx, "mpg", Number(e.target.value))
              }
              margin="dense"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Paper>
        ))}
        <Button
          variant="outlined"
          onClick={addVehicle}
          startIcon={<DirectionsCarIcon />}
          sx={{ mt: 1 }}
        >
          <Typography fontWeight={300} fontSize={10}>
            + Add Vehicle
          </Typography>
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Waste Section */}
      <Box>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Waste{" "}
          <DeleteOutlineIcon color="primary" sx={{ verticalAlign: "middle" }} />
        </Typography>
        <TextField
          error={status === "sent" && data.waste.people < 1}
          helperText={
            status === "sent" &&
            data.waste.people < 1 &&
            "People cannot be zero."
          }
          fullWidth
          label="People in household"
          type="number"
          variant="outlined"
          value={data.waste.people}
          onChange={(e) => updateWaste("people", Number(e.target.value))}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Recycling{" "}
          <RecyclingIcon color="primary" sx={{ verticalAlign: "middle" }} />
        </Typography>
        <Typography variant="subtitle1" component="p" gutterBottom>
          Which materials do you recycle? ♻️
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.waste.recyclesPaper}
              onChange={(e) => updateWaste("recyclesPaper", e.target.checked)}
            />
          }
          label="Recycles Paper"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.waste.recyclesPlastic}
              onChange={(e) => updateWaste("recyclesPlastic", e.target.checked)}
            />
          }
          label="Recycles Plastic"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.waste.recyclesMetal}
              onChange={(e) => updateWaste("recyclesMetal", e.target.checked)}
            />
          }
          label="Recycles Metal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={data.waste.recyclesGlass}
              onChange={(e) => updateWaste("recyclesGlass", e.target.checked)}
            />
          }
          label="Recycles Glass"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        size="large"
        endIcon={<CalculateIcon />}
        loading={status === "loading"}
      >
        Calculate Footprint
      </Button>
      <Button
        variant="text"
        color="info"
        onClick={handleListAverage}
        fullWidth
        size="large"
        loading={status === "loading"}
        sx={{ my: 1 }}
      >
        View Current Average Emissions
      </Button>
    </Box>
  );
}

export default App;
