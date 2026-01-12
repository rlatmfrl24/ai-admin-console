'use client';

import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const FormBuilder = dynamic(
  () => import('@formio/react').then((mod) => mod.FormBuilder),
  { ssr: false },
);
const Form = dynamic(() => import('@formio/react').then((mod) => mod.Form), {
  ssr: false,
});

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
