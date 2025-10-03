import { useState } from 'react';

// Importing Icons for a nice touch, typically from @mui/icons-material
import BoltIcon from '@mui/icons-material/Bolt';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RecyclingIcon from '@mui/icons-material/Recycling';
import {
    Box, Button, Checkbox, Divider, FormControlLabel, InputAdornment, Paper, Snackbar, Stack,
    TextField, Typography
} from '@mui/material';

import type { HouseholdData, Status, TransportationData } from "./types";
function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<HouseholdData>({
    energy: { electricity: 0, naturalGas: 0 },
    transportation: [{ miles: 0, mpg: 0 }],
    waste: {
      people: 1,
      recyclesPaper: false,
      recyclesPlastic: false,
      recyclesMetal: false,
      recyclesGlass: false,
    },
  });

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
    // Ensure value is treated as a number
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

  const handleSubmit = () => {
    setStatus("sent");
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
      // console.log(JSON.stringify(data, null, 2))
      console.log(data);
      setSnackbarMessage("Data submitted successfully!");
    }

    setSnackbarOpen(true);
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
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Household Footprint Input 🏡
      </Typography>

      {/* Energy Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
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
            // Use InputAdornment to add content to the end of the input
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
                      // Use the sx prop to remove horizontal padding for a compact look
                      sx={{ minWidth: 0, px: 0.8 }}
                    >
                      +{increment}
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
            // Use InputAdornment to add content to the end of the input
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
                      // Use the sx prop to remove horizontal padding for a compact look
                      sx={{ minWidth: 0, px: 0.8 }}
                    >
                      +{increment}
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
        <Typography variant="h4" component="h2" gutterBottom color="primary">
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
              }}
            >
              <Typography variant="h6">Vehicle #{idx + 1}</Typography>
              <Button
                variant="outlined"
                onClick={removeVehicle}
                startIcon={<DirectionsCarIcon />}
              >
                - Remove Vehicle
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
                // Use InputAdornment to add content to the end of the input
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
                          // Use the sx prop to remove horizontal padding for a compact look
                          sx={{ minWidth: 0, px: 0.8 }}
                        >
                          +{increment}
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
          + Add Vehicle
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Waste Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
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
        <Typography variant="h4" component="h2" gutterBottom color="primary">
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
      >
        Submit and Calculate Footprint 🌍
      </Button>
    </Box>
  );
}

export default App;
