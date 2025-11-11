'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

import { useAuthStore } from '@/lib/store/authStore';
import LoginLogo from '@/assets/logo-login.svg';
import { COLORS } from '@/lib/theme';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // 로그인 상태 확인 후 자동 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F6FF',
        backgroundImage:
          'url(/img-login-background.png), linear-gradient(180deg, #FFF 0%, #F7F6FF 100%)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <LoginLogo />
      <Typography
        fontSize={24}
        fontWeight={400}
        color={COLORS.grey[700]}
        gutterBottom
        sx={{
          paddingTop: 4,
          paddingBottom: 7,
        }}
      >
        Always by your side, Your reliable partner
      </Typography>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              variant="outlined"
              placeholder="ID를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              fullWidth
              autoComplete="id"
            />
            <TextField
              variant="outlined"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              autoComplete="current-password"
              sx={{}}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 1 }}>
                      <IconButton
                        aria-label="Show/Hide Password"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading || !id || !password}
              sx={{
                mt: 1,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 96,
              }}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
