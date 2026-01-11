'use client';

import { Box, Typography } from '@mui/material';
import { FormBuilder, Form } from '@formio/react';
import { useState } from 'react';

export default function FormBuilderTestPage() {
  const [formJson, setFormJson] = useState<any>(null);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Form Builder Packing Test
      </Typography>
      <FormBuilder
        options={{
          builder: {
            data: false,
            premium: false,
          },
        }}
        onChange={(form) => setFormJson(form)}
      />
      <Form src={formJson} />
    </Box>
  );
}
