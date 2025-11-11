'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

import InputWithLabel from '@/components/common/Input';
import { useAuthStore } from '@/lib/store/authStore';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(id, password);
      if (success) {
        router.push('/home');
      } else {
        setError('ID 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              gutterBottom
            >
              로그인
            </Typography>
            <Typography variant="body2" color="text.secondary">
              계정에 로그인하여 시작하세요
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <InputWithLabel
              label="ID"
              type="text"
              placeholder="ID를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              fullWidth
              autoComplete="id"
            />

            <InputWithLabel
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading || !id || !password}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
