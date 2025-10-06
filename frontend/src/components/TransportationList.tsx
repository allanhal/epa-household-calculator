import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box, Button, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';

import type { Status, TransportationData } from '../types';

type Props = {
  vehicles: TransportationData[];
  status: Status;
  onChange: (index: number, key: keyof TransportationData, value: number) => void;
  onAdd: () => void;
  onRemove: () => void;
};

export default function TransportationList({ vehicles, status, onChange, onAdd, onRemove }: Props) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
        Transportation <DirectionsCarIcon color="primary" sx={{ verticalAlign: 'middle' }} />
      </Typography>
      {vehicles.map((car, idx) => (
        <Paper key={idx} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
            <Typography variant="h6">Vehicle #{idx + 1}</Typography>
            <Button variant="outlined" onClick={onRemove} startIcon={<DirectionsCarIcon />}> 
              <Typography fontWeight={300} fontSize={10}>- Remove Vehicle</Typography>
            </Button>
          </Box>
          <TextField
            error={status === 'sent' && car.miles < 1}
            helperText={status === 'sent' && car.miles < 1 && 'Miles cannot be zero.'}
            fullWidth
            label="Miles driven per year"
            type="number"
            variant="outlined"
            value={car.miles}
            onChange={(e) => onChange(idx, 'miles', Number(e.target.value))}
            margin="dense"
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.5}>
                    {[100, 500, 5000].map((increment) => (
                      <Button key={increment} variant="outlined" size="small" onClick={() => onChange(idx, 'miles', car.miles + increment)} sx={{ minWidth: 0, px: 0.8 }}>
                        <Typography fontWeight={300} fontSize={10}>+{increment}</Typography>
                      </Button>
                    ))}
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={status === 'sent' && car.mpg < 1}
            helperText={status === 'sent' && car.mpg < 1 && 'MPG cannot be zero.'}
            fullWidth
            label="MPG (Miles Per Gallon)"
            type="number"
            variant="outlined"
            value={car.mpg}
            onChange={(e) => onChange(idx, 'mpg', Number(e.target.value))}
            margin="dense"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Paper>
      ))}
      <Button variant="outlined" onClick={onAdd} startIcon={<DirectionsCarIcon />} sx={{ mt: 1 }}>
        <Typography fontWeight={300} fontSize={10}>+ Add Vehicle</Typography>
      </Button>
    </Box>
  );
}


