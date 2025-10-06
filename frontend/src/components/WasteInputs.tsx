import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { Box, Checkbox, Divider, FormControlLabel, TextField, Typography } from '@mui/material';

import type { Status, WasteData } from '../types';

type Props = {
  people: number;
  recyclesPaper: boolean;
  recyclesPlastic: boolean;
  recyclesMetal: boolean;
  recyclesGlass: boolean;
  status: Status;
  onChange: (key: keyof WasteData, value: boolean | number) => void;
};

export default function WasteInputs({ people, recyclesPaper, recyclesPlastic, recyclesMetal, recyclesGlass, status, onChange }: Props) {
  return (
    <>
      <Box>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Waste <DeleteOutlineIcon color="primary" sx={{ verticalAlign: 'middle' }} />
        </Typography>
        <TextField
          error={status === 'sent' && people < 1}
          helperText={status === 'sent' && people < 1 && 'People cannot be zero.'}
          fullWidth
          label="People in household"
          type="number"
          variant="outlined"
          value={people}
          onChange={(e) => onChange('people', Number(e.target.value))}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary">
          Recycling <RecyclingIcon color="primary" sx={{ verticalAlign: 'middle' }} />
        </Typography>
        <Typography variant="subtitle1" component="p" gutterBottom>
          Which materials do you recycle? ♻️
        </Typography>
        <FormControlLabel control={<Checkbox checked={recyclesPaper} onChange={(e) => onChange('recyclesPaper', e.target.checked)} />} label="Recycles Paper" />
        <FormControlLabel control={<Checkbox checked={recyclesPlastic} onChange={(e) => onChange('recyclesPlastic', e.target.checked)} />} label="Recycles Plastic" />
        <FormControlLabel control={<Checkbox checked={recyclesMetal} onChange={(e) => onChange('recyclesMetal', e.target.checked)} />} label="Recycles Metal" />
        <FormControlLabel control={<Checkbox checked={recyclesGlass} onChange={(e) => onChange('recyclesGlass', e.target.checked)} />} label="Recycles Glass" />
      </Box>
    </>
  );
}


