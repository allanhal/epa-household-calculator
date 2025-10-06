import { useState } from 'react';

import CalculateIcon from '@mui/icons-material/Calculate';
import { Box, Button, Divider, Snackbar } from '@mui/material';

import EnergyInputs from './components/EnergyInputs';
import ResultDialog from './components/ResultDialog';
import TransportationList from './components/TransportationList';
import WasteInputs from './components/WasteInputs';
import { calculateFootprint, fetchAverage } from './services/api';
import SvgLogo from './SvgLogo';

import type { HouseholdData, Status, TransportationData } from './types';

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<React.ReactNode | null>();
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>('');
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<HouseholdData>(initialState);

  const updateEnergy = (key: 'electricity' | 'naturalGas', value: number) => {
    setData((prev) => ({
      ...prev,
      energy: { ...prev.energy, [key]: value },
    }));
  };

  const updateTransport = (index: number, key: keyof TransportationData, value: number) => {
    const newTransport = [...data.transportation];
    newTransport[index] = { ...newTransport[index], [key]: value };
    setData((prev) => ({ ...prev, transportation: newTransport }));
  };

  const updateWaste = (key: keyof typeof data.waste, value: boolean | number) => {
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
        prev.transportation.length === 0 ? prev.transportation : prev.transportation.slice(0, -1),
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
        setSnackbarMessage('Please correct the errors in the form before submitting.');
      } else {
        setStatus('loading');
        const result = await calculateFootprint(data);
        setDialogOpen(true);
        setDialogMessage(
          <>
            Your Footprint: <strong>{result.totalEmissions} lbs CO₂/year</strong>
          </>,
        );
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setSnackbarMessage('Error submitting data. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setStatus('sent');
    }
  };

  const handleListAverage = async () => {
    try {
      setStatus('loading');
      const result = await fetchAverage();
      setDialogOpen(true);
      setDialogMessage(
        <>
          Total Average Emissions:{' '}
          <strong>{result ? `${result.totalEmissionAvg.toFixed(2)} lbs CO₂/year` : 'N/A'}</strong>
          <br />
          Number of Households: <strong>{result ? result.householdCount : 'N/A'}</strong>
        </>,
      );
    } catch (error) {
      console.error('Error submitting data:', error);
      setSnackbarMessage('Error submitting data. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setStatus('sent');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        p: 3,
        mt: 4,
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={(_event?: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === 'clickaway') return;
          setSnackbarOpen(false);
        }}
        message={snackbarMessage}
      />
      <ResultDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {dialogMessage}
      </ResultDialog>
      <SvgLogo />

      <EnergyInputs
        electricity={data.energy.electricity}
        naturalGas={data.energy.naturalGas}
        status={status}
        onChange={updateEnergy}
      />

      <Divider sx={{ my: 4 }} />

      <TransportationList
        vehicles={data.transportation}
        status={status}
        onChange={updateTransport}
        onAdd={addVehicle}
        onRemove={removeVehicle}
      />

      <Divider sx={{ my: 4 }} />

      <WasteInputs
        people={data.waste.people}
        recyclesPaper={data.waste.recyclesPaper}
        recyclesPlastic={data.waste.recyclesPlastic}
        recyclesMetal={data.waste.recyclesMetal}
        recyclesGlass={data.waste.recyclesGlass}
        status={status}
        onChange={updateWaste}
      />

      <Divider sx={{ my: 4 }} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        size="large"
        endIcon={<CalculateIcon />}
        loading={status === 'loading'}
      >
        Calculate Footprint
      </Button>
      <Button
        variant="text"
        color="info"
        onClick={handleListAverage}
        fullWidth
        size="large"
        loading={status === 'loading'}
        sx={{ my: 1 }}
      >
        View Average Emissions
      </Button>
    </Box>
  );
}

export default App;
