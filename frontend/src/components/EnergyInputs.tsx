import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import type { Status } from '../types';

type Props = {
  electricity: number;
  naturalGas: number;
  status: Status;
  onChange: (key: 'electricity' | 'naturalGas', value: number) => void;
};

export default function EnergyInputs({ electricity, naturalGas, status, onChange }: Props) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
        Energy <BoltIcon color="primary" sx={{ verticalAlign: 'middle' }} />
      </Typography>
      <TextField
        error={status === 'sent' && electricity < 1}
        helperText={status === 'sent' && electricity < 1 && 'Energy cannot be zero.'}
        fullWidth
        label="Electricity (kWh/year)"
        type="number"
        variant="outlined"
        value={electricity}
        onChange={(e) => onChange('electricity', Number(e.target.value))}
        margin="normal"
        InputProps={{
          inputProps: { min: 0 },
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={0.5}>
                {[5, 10, 50, 100].map((increment) => (
                  <Button
                    key={increment}
                    variant="outlined"
                    size="small"
                    onClick={() => onChange('electricity', electricity + increment)}
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
        error={status === 'sent' && naturalGas < 1}
        helperText={status === 'sent' && naturalGas < 1 && 'Natural gas cannot be zero.'}
        label="Natural Gas (therms/year)"
        type="number"
        variant="outlined"
        value={naturalGas}
        onChange={(e) => onChange('naturalGas', Number(e.target.value))}
        margin="normal"
        InputProps={{
          inputProps: { min: 0 },
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={0.5}>
                {[5, 10, 50, 100].map((increment) => (
                  <Button
                    key={increment}
                    variant="outlined"
                    size="small"
                    onClick={() => onChange('naturalGas', naturalGas + increment)}
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
  );
}


